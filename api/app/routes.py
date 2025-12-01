from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
from datetime import datetime, timedelta
from typing import Optional
from pathlib import Path
import os
import uuid
from .db import get_db
from .models import User, Exercise, Workout, Set, Meal, BodyWeight, WorkoutTemplate, Friendship, WorkoutShare, WorkoutComment, ProgressPhoto, BodyMeasurement, FollowStatus
from .schemas import (
    UserCreate, UserLogin, UserResponse, UserUpdate, Token,
    ExerciseCreate, ExerciseResponse,
    WorkoutCreate, WorkoutResponse,
    SetCreate, SetResponse,
    MealCreate, MealResponse,
    BodyWeightCreate, BodyWeightResponse,
    PersonalRecordResponse,
    WorkoutTemplateCreate, WorkoutTemplateUpdate, WorkoutTemplateResponse, TemplateExercise,
    FriendshipCreate, FriendshipResponse, FriendWithUser,
    WorkoutShareCreate, WorkoutShareResponse,
    WorkoutCommentCreate, WorkoutCommentResponse,
    ProgressPhotoResponse, ProgressPhotoBase,
    BodyMeasurementCreate, BodyMeasurementResponse
)
from .config import get_settings
from .auth import (
    get_password_hash, authenticate_user,
    create_access_token, create_refresh_token,
    get_current_user
)

router = APIRouter()


# Auth Routes
@router.post("/auth/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register(user: UserCreate, db: Session = Depends(get_db)):
    """Register a new user"""
    # Check if user exists
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # Create new user
    hashed_password = get_password_hash(user.password)
    db_user = User(
        email=user.email,
        name=user.name,
        password_hash=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


@router.post("/auth/login", response_model=Token)
def login(user_credentials: UserLogin, db: Session = Depends(get_db)):
    """Login and get access token"""
    user = authenticate_user(db, user_credentials.email, user_credentials.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = create_access_token(data={"sub": str(user.id)})
    refresh_token = create_refresh_token(data={"sub": str(user.id)})

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }


@router.get("/auth/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_user)):
    """Get current user"""
    return current_user


@router.patch("/auth/profile", response_model=UserResponse)
async def update_profile(
    profile_update: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update user profile"""
    update_data = profile_update.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(current_user, field, value)

    db.commit()
    db.refresh(current_user)
    return current_user


# Exercise Routes
@router.get("/exercises", response_model=List[ExerciseResponse])
def get_exercises(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all exercises"""
    exercises = db.query(Exercise).filter(
        (Exercise.is_user_defined == False) | (Exercise.user_id == current_user.id)
    ).offset(skip).limit(limit).all()
    return exercises


@router.post("/exercises", response_model=ExerciseResponse, status_code=status.HTTP_201_CREATED)
def create_exercise(
    exercise: ExerciseCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a custom exercise"""
    db_exercise = Exercise(
        **exercise.model_dump(),
        is_user_defined=True,
        user_id=current_user.id
    )
    db.add(db_exercise)
    db.commit()
    db.refresh(db_exercise)
    return db_exercise


# Workout Routes
@router.get("/workouts", response_model=List[WorkoutResponse])
def get_workouts(
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get user's workouts"""
    workouts = db.query(Workout).filter(
        Workout.user_id == current_user.id
    ).order_by(Workout.date.desc()).offset(skip).limit(limit).all()
    return workouts


@router.post("/workouts", response_model=WorkoutResponse, status_code=status.HTTP_201_CREATED)
def create_workout(
    workout: WorkoutCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new workout with sets"""
    db_workout = Workout(
        user_id=current_user.id,
        name=workout.name,
        notes=workout.notes
    )
    db.add(db_workout)
    db.commit()
    db.refresh(db_workout)

    # Add sets
    for set_data in workout.sets:
        db_set = Set(
            workout_id=db_workout.id,
            **set_data.model_dump()
        )
        db.add(db_set)

    db.commit()
    db.refresh(db_workout)
    return db_workout


@router.post("/workouts/{workout_id}/sets", response_model=SetResponse, status_code=status.HTTP_201_CREATED)
def add_set_to_workout(
    workout_id: int,
    set_data: SetCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Add a single set to an existing workout"""
    # Verify workout exists and belongs to user
    workout = db.query(Workout).filter(
        Workout.id == workout_id,
        Workout.user_id == current_user.id
    ).first()

    if not workout:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Workout not found"
        )

    # Create the set
    db_set = Set(
        workout_id=workout_id,
        **set_data.model_dump()
    )
    db.add(db_set)
    db.commit()
    db.refresh(db_set)
    return db_set


@router.delete("/workouts/{workout_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_workout(
    workout_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete a workout"""
    # Verify workout exists and belongs to user
    workout = db.query(Workout).filter(
        Workout.id == workout_id,
        Workout.user_id == current_user.id
    ).first()

    if not workout:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Workout not found"
        )

    # Delete the workout (sets will be cascade deleted)
    db.delete(workout)
    db.commit()
    return None


# Meal totals endpoint - daily totals for calories/macros
@router.get("/meals/totals")
def get_meal_totals(
    date: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Return aggregated nutrition totals for a single day (UTC). Date format: YYYY-MM-DD"""
    # parse date or use today (UTC)
    if date:
        try:
            start = datetime.fromisoformat(date)
            start = start.replace(hour=0, minute=0, second=0, microsecond=0)
        except Exception:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid date format, use YYYY-MM-DD")
    else:
        start = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)

    end = start + timedelta(days=1)

    # Aggregate sums, coalesce to 0 when null
    totals = db.query(
        func.coalesce(func.sum(Meal.calories), 0),
        func.coalesce(func.sum(Meal.protein_g), 0),
        func.coalesce(func.sum(Meal.carbs_g), 0),
        func.coalesce(func.sum(Meal.fat_g), 0),
    ).filter(
        Meal.user_id == current_user.id,
        Meal.date >= start,
        Meal.date < end
    ).one()

    calories, protein, carbs, fat = totals

    return {
        "date": start.date().isoformat(),
        "calories": float(calories),
        "protein_g": float(protein),
        "carbs_g": float(carbs),
        "fat_g": float(fat),
    }

# Workout Template Routes
@router.get("/workout-templates", response_model=List[WorkoutTemplateResponse])
def get_workout_templates(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get user's workout templates"""
    templates = (
        db.query(WorkoutTemplate)
        .filter(WorkoutTemplate.user_id == current_user.id)
        .order_by(WorkoutTemplate.created_at.desc())
        .all()
    )

    responses: List[WorkoutTemplateResponse] = []
    for t in templates:
        exercises_raw = t.exercises_json or []
        exercises = [TemplateExercise(**e) for e in exercises_raw]

        responses.append(
            WorkoutTemplateResponse(
                id=t.id,
                name=t.name,
                notes=t.notes,
                created_at=t.created_at,
                exercises=exercises,
            )
        )
    return responses


@router.post(
    "/workout-templates",
    response_model=WorkoutTemplateResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_workout_template(
    template_in: WorkoutTemplateCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Create a new workout template"""
    db_template = WorkoutTemplate(
        user_id=current_user.id,
        name=template_in.name,
        notes=template_in.notes,
        exercises_json=[e.model_dump() for e in template_in.exercises],
    )

    db.add(db_template)
    db.commit()
    db.refresh(db_template)

    return WorkoutTemplateResponse(
        id=db_template.id,
        name=db_template.name,
        notes=db_template.notes,
        created_at=db_template.created_at,
        exercises=template_in.exercises,
    )


@router.get(
    "/workout-templates/{template_id}",
    response_model=WorkoutTemplateResponse,
)
def get_workout_template(
    template_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get a single workout template"""
    template = (
        db.query(WorkoutTemplate)
        .filter(
            WorkoutTemplate.id == template_id,
            WorkoutTemplate.user_id == current_user.id,
        )
        .first()
    )

    if not template:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Template not found",
        )

    exercises_raw = template.exercises_json or []
    exercises = [TemplateExercise(**e) for e in exercises_raw]

    return WorkoutTemplateResponse(
        id=template.id,
        name=template.name,
        notes=template.notes,
        created_at=template.created_at,
        exercises=exercises,
    )


@router.put(
    "/workout-templates/{template_id}",
    response_model=WorkoutTemplateResponse,
)
def update_workout_template(
    template_id: int,
    template_in: WorkoutTemplateUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Update an existing workout template"""
    template = (
        db.query(WorkoutTemplate)
        .filter(
            WorkoutTemplate.id == template_id,
            WorkoutTemplate.user_id == current_user.id,
        )
        .first()
    )

    if not template:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Template not found",
        )

    template.name = template_in.name
    template.notes = template_in.notes
    template.exercises_json = [e.model_dump() for e in template_in.exercises]

    db.commit()
    db.refresh(template)

    exercises_raw = template.exercises_json or []
    exercises = [TemplateExercise(**e) for e in exercises_raw]

    return WorkoutTemplateResponse(
        id=template.id,
        name=template.name,
        notes=template.notes,
        created_at=template.created_at,
        exercises=exercises,
    )


@router.delete(
    "/workout-templates/{template_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_workout_template(
    template_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Delete a workout template"""
    template = (
        db.query(WorkoutTemplate)
        .filter(
            WorkoutTemplate.id == template_id,
            WorkoutTemplate.user_id == current_user.id,
        )
        .first()
    )

    if not template:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Template not found",
        )

    db.delete(template)
    db.commit()
    return None

# Meal Routes
@router.get("/meals", response_model=List[MealResponse])
def get_meals(
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get user's meals"""
    meals = db.query(Meal).filter(
        Meal.user_id == current_user.id
    ).order_by(Meal.date.desc()).offset(skip).limit(limit).all()
    return meals


@router.post("/meals", response_model=MealResponse, status_code=status.HTTP_201_CREATED)
def create_meal(
    meal: MealCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Log a new meal"""
    db_meal = Meal(
        user_id=current_user.id,
        **meal.model_dump()
    )
    db.add(db_meal)
    db.commit()
    db.refresh(db_meal)
    return db_meal


@router.delete("/meals/{meal_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_meal(
    meal_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete a meal"""
    # Verify meal exists and belongs to user
    meal = db.query(Meal).filter(
        Meal.id == meal_id,
        Meal.user_id == current_user.id
    ).first()

    if not meal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Meal not found"
        )

    db.delete(meal)
    db.commit()
    return None


# Body Weight Routes
@router.get("/body-weight", response_model=List[BodyWeightResponse])
def get_body_weights(
    skip: int = 0,
    limit: int = 90,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get user's body weight entries"""
    body_weights = db.query(BodyWeight).filter(
        BodyWeight.user_id == current_user.id
    ).order_by(BodyWeight.date.desc()).offset(skip).limit(limit).all()
    return body_weights


@router.post("/body-weight", response_model=BodyWeightResponse, status_code=status.HTTP_201_CREATED)
def create_body_weight(
    body_weight: BodyWeightCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Log a new body weight entry"""
    db_body_weight = BodyWeight(
        user_id=current_user.id,
        **body_weight.model_dump()
    )
    db.add(db_body_weight)
    db.commit()
    db.refresh(db_body_weight)
    return db_body_weight


@router.delete("/body-weight/{body_weight_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_body_weight(
    body_weight_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete a body weight entry"""
    # Verify entry exists and belongs to user
    body_weight = db.query(BodyWeight).filter(
        BodyWeight.id == body_weight_id,
        BodyWeight.user_id == current_user.id
    ).first()

    if not body_weight:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Body weight entry not found"
        )

    db.delete(body_weight)
    db.commit()
    return None


# Dashboard Stats
@router.get("/stats/dashboard")
def get_dashboard_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get dashboard statistics"""
    now = datetime.utcnow()
    week_ago = now - timedelta(days=7)

    # Get all workouts sorted by date descending
    all_workouts = db.query(Workout).filter(
        Workout.user_id == current_user.id
    ).order_by(Workout.date.desc()).all()

    # Calculate current streak (consecutive days with workouts)
    streak = 0
    if all_workouts:
        workout_dates = set()
        for workout in all_workouts:
            workout_date = workout.date.date() if isinstance(workout.date, datetime) else workout.date
            workout_dates.add(workout_date)

        # Check backwards from today
        current_date = now.date()
        while current_date in workout_dates:
            streak += 1
            current_date -= timedelta(days=1)

    # Workouts this week
    workouts_this_week = db.query(Workout).filter(
        Workout.user_id == current_user.id,
        Workout.date >= week_ago
    ).count()

    # Total volume this week (sum of weight × reps)
    volume_result = db.query(
        func.sum(Set.weight * Set.reps)
    ).join(Workout).filter(
        Workout.user_id == current_user.id,
        Workout.date >= week_ago
    ).scalar()

    total_volume = float(volume_result) if volume_result else 0.0

    return {
        "current_streak": streak,
        "workouts_this_week": workouts_this_week,
        "total_volume": round(total_volume, 1),
        "weekly_goal": 5  # Default goal
    }


@router.get("/stats/analytics")
def get_analytics_data(
    days: int = 30,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get analytics data for charts (volume over time, workout frequency)"""
    now = datetime.utcnow()
    start_date = now - timedelta(days=days)

    # Get all workouts in the time range
    workouts = db.query(Workout).filter(
        Workout.user_id == current_user.id,
        Workout.date >= start_date
    ).order_by(Workout.date.asc()).all()

    # Calculate daily volume and workout count
    daily_data = {}
    for workout in workouts:
        workout_date = workout.date.date() if isinstance(workout.date, datetime) else workout.date
        date_str = workout_date.strftime("%Y-%m-%d")

        if date_str not in daily_data:
            daily_data[date_str] = {
                "date": date_str,
                "volume": 0.0,
                "workouts": 0
            }

        # Calculate volume for this workout
        sets = db.query(Set).filter(Set.workout_id == workout.id).all()
        workout_volume = sum(s.weight * s.reps for s in sets)

        daily_data[date_str]["volume"] += workout_volume
        daily_data[date_str]["workouts"] += 1

    # Convert to list sorted by date
    analytics_data = sorted(daily_data.values(), key=lambda x: x["date"])

    return {
        "data": analytics_data,
        "total_workouts": len(workouts),
        "total_volume": sum(d["volume"] for d in analytics_data)
    }


@router.get("/stats/prs", response_model=List[PersonalRecordResponse])
def get_personal_records(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get personal records (PRs) for each exercise"""
    # Get all exercises user has logged
    exercises_with_sets = db.query(Exercise).join(Set).join(Workout).filter(
        Workout.user_id == current_user.id
    ).distinct().all()

    prs = []
    for exercise in exercises_with_sets:
        # Get all sets for this exercise
        sets = db.query(Set).join(Workout).filter(
            Workout.user_id == current_user.id,
            Set.exercise_id == exercise.id
        ).all()

        if not sets:
            continue

        # Calculate PRs
        max_weight_set = max(sets, key=lambda s: s.weight)
        max_reps_set = max(sets, key=lambda s: s.reps)
        max_volume_set = max(sets, key=lambda s: s.weight * s.reps)

        prs.append({
            "exercise_id": exercise.id,
            "exercise_name": exercise.name,
            "max_weight": max_weight_set.weight,
            "max_reps": max_reps_set.reps,
            "max_volume": max_volume_set.weight * max_volume_set.reps,
            "date_achieved": max_weight_set.created_at
        })

    return prs


# Social Features Routes
# Friendship Routes
@router.post("/friends", response_model=FriendshipResponse, status_code=status.HTTP_201_CREATED)
def send_friend_request(
    friendship: FriendshipCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Send a friend request"""
    # Check if friendship already exists
    existing = db.query(Friendship).filter(
        ((Friendship.follower_id == current_user.id) & (Friendship.following_id == friendship.following_id)) |
        ((Friendship.follower_id == friendship.following_id) & (Friendship.following_id == current_user.id))
    ).first()

    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Friendship request already exists"
        )

    # Check if user exists
    target_user = db.query(User).filter(User.id == friendship.following_id).first()
    if not target_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    db_friendship = Friendship(
        follower_id=current_user.id,
        following_id=friendship.following_id,
        status=FollowStatus.PENDING
    )
    db.add(db_friendship)
    db.commit()
    db.refresh(db_friendship)
    return db_friendship


@router.get("/friends", response_model=List[FriendWithUser])
def get_friends(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all accepted friendships for current user"""
    friendships = db.query(Friendship).filter(
        ((Friendship.follower_id == current_user.id) | (Friendship.following_id == current_user.id)) &
        (Friendship.status == FollowStatus.ACCEPTED)
    ).all()

    # Format response with the other user's details
    result = []
    for friendship in friendships:
        other_user_id = friendship.following_id if friendship.follower_id == current_user.id else friendship.follower_id
        other_user = db.query(User).filter(User.id == other_user_id).first()

        result.append(FriendWithUser(
            id=friendship.id,
            follower_id=friendship.follower_id,
            following_id=friendship.following_id,
            status=friendship.status,
            user=other_user
        ))

    return result


@router.get("/friends/requests", response_model=List[FriendWithUser])
def get_friend_requests(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get pending friend requests sent to current user"""
    requests = db.query(Friendship).filter(
        Friendship.following_id == current_user.id,
        Friendship.status == FollowStatus.PENDING
    ).all()

    result = []
    for req in requests:
        requester = db.query(User).filter(User.id == req.follower_id).first()
        result.append(FriendWithUser(
            id=req.id,
            follower_id=req.follower_id,
            following_id=req.following_id,
            status=req.status,
            user=requester
        ))

    return result


@router.patch("/friends/{friendship_id}/accept", response_model=FriendshipResponse)
def accept_friend_request(
    friendship_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Accept a friend request"""
    friendship = db.query(Friendship).filter(
        Friendship.id == friendship_id,
        Friendship.following_id == current_user.id,
        Friendship.status == FollowStatus.PENDING
    ).first()

    if not friendship:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Friend request not found"
        )

    friendship.status = FollowStatus.ACCEPTED
    db.commit()
    db.refresh(friendship)
    return friendship


@router.delete("/friends/{friendship_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_friend(
    friendship_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Remove a friend or reject a request"""
    friendship = db.query(Friendship).filter(
        Friendship.id == friendship_id,
        ((Friendship.follower_id == current_user.id) | (Friendship.following_id == current_user.id))
    ).first()

    if not friendship:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Friendship not found"
        )

    db.delete(friendship)
    db.commit()
    return None


@router.get("/users/search")
def search_users(
    query: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Search for users by name or email"""
    users = db.query(User).filter(
        (User.name.ilike(f"%{query}%")) | (User.email.ilike(f"%{query}%")),
        User.id != current_user.id
    ).limit(10).all()

    return [UserResponse.model_validate(u) for u in users]


# Workout Sharing Routes
@router.post("/workouts/{workout_id}/share", response_model=WorkoutShareResponse, status_code=status.HTTP_201_CREATED)
def share_workout(
    workout_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Share a workout publicly"""
    # Verify workout exists and belongs to user
    workout = db.query(Workout).filter(
        Workout.id == workout_id,
        Workout.user_id == current_user.id
    ).first()

    if not workout:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Workout not found"
        )

    # Check if already shared
    existing_share = db.query(WorkoutShare).filter(
        WorkoutShare.workout_id == workout_id
    ).first()

    if existing_share:
        return existing_share

    db_share = WorkoutShare(workout_id=workout_id, is_public=True)
    db.add(db_share)
    db.commit()
    db.refresh(db_share)
    return db_share


@router.delete("/workouts/{workout_id}/share", status_code=status.HTTP_204_NO_CONTENT)
def unshare_workout(
    workout_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Remove workout from public feed"""
    workout = db.query(Workout).filter(
        Workout.id == workout_id,
        Workout.user_id == current_user.id
    ).first()

    if not workout:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Workout not found"
        )

    share = db.query(WorkoutShare).filter(WorkoutShare.workout_id == workout_id).first()
    if share:
        db.delete(share)
        db.commit()

    return None


@router.get("/feed")
def get_social_feed(
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get social feed of friends' shared workouts"""
    # Get friend IDs
    friendships = db.query(Friendship).filter(
        ((Friendship.follower_id == current_user.id) | (Friendship.following_id == current_user.id)) &
        (Friendship.status == FollowStatus.ACCEPTED)
    ).all()

    friend_ids = []
    for f in friendships:
        friend_id = f.following_id if f.follower_id == current_user.id else f.follower_id
        friend_ids.append(friend_id)

    # Get shared workouts from friends
    if not friend_ids:
        return []

    shared_workouts = db.query(Workout).join(WorkoutShare).filter(
        Workout.user_id.in_(friend_ids),
        WorkoutShare.is_public == True
    ).order_by(Workout.date.desc()).offset(skip).limit(limit).all()

    # Build response with user and share data
    result = []
    for workout in shared_workouts:
        user = db.query(User).filter(User.id == workout.user_id).first()
        share = db.query(WorkoutShare).filter(WorkoutShare.workout_id == workout.id).first()
        comments = db.query(WorkoutComment).filter(WorkoutComment.workout_id == workout.id).all()

        result.append({
            **WorkoutResponse.model_validate(workout).model_dump(),
            "user": UserResponse.model_validate(user).model_dump(),
            "share": WorkoutShareResponse.model_validate(share).model_dump(),
            "comments": [WorkoutCommentResponse.model_validate(c).model_dump() for c in comments]
        })

    return result


@router.post("/workouts/{workout_id}/comments", response_model=WorkoutCommentResponse, status_code=status.HTTP_201_CREATED)
def add_workout_comment(
    workout_id: int,
    comment: WorkoutCommentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Add a comment to a shared workout"""
    # Verify workout exists and is shared
    workout = db.query(Workout).filter(Workout.id == workout_id).first()
    if not workout:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Workout not found"
        )

    share = db.query(WorkoutShare).filter(
        WorkoutShare.workout_id == workout_id,
        WorkoutShare.is_public == True
    ).first()

    if not share:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Workout is not shared"
        )

    db_comment = WorkoutComment(
        workout_id=workout_id,
        user_id=current_user.id,
        comment_text=comment.comment_text
    )
    db.add(db_comment)
    db.commit()
    db.refresh(db_comment)

    return WorkoutCommentResponse(
        id=db_comment.id,
        workout_id=db_comment.workout_id,
        user_id=db_comment.user_id,
        comment_text=db_comment.comment_text,
        created_at=db_comment.created_at,
        user=UserResponse.model_validate(current_user)
    )


# Progress Photos Routes
@router.post("/progress-photos", response_model=ProgressPhotoResponse, status_code=status.HTTP_201_CREATED)
async def upload_progress_photo(
    file: UploadFile = File(...),
    photo_type: Optional[str] = None,
    notes: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Upload a progress photo"""
    settings = get_settings()

    # Validate file extension
    file_ext = Path(file.filename).suffix.lower()
    if file_ext not in settings.ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid file type. Allowed: {', '.join(settings.ALLOWED_EXTENSIONS)}"
        )

    # Create upload directory if it doesn't exist
    upload_dir = Path(settings.UPLOAD_DIR)
    upload_dir.mkdir(parents=True, exist_ok=True)

    # Generate unique filename
    unique_filename = f"{current_user.id}_{uuid.uuid4()}{file_ext}"
    file_path = upload_dir / unique_filename

    # Save file
    try:
        contents = await file.read()
        if len(contents) > settings.MAX_UPLOAD_SIZE:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"File too large. Max size: {settings.MAX_UPLOAD_SIZE / 1024 / 1024}MB"
            )

        with open(file_path, "wb") as f:
            f.write(contents)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to upload file: {str(e)}"
        )

    # Create database record
    db_photo = ProgressPhoto(
        user_id=current_user.id,
        photo_url=f"/{settings.UPLOAD_DIR}/{unique_filename}",
        photo_type=photo_type,
        notes=notes
    )
    db.add(db_photo)
    db.commit()
    db.refresh(db_photo)

    return db_photo


@router.get("/progress-photos", response_model=List[ProgressPhotoResponse])
def get_progress_photos(
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get user's progress photos"""
    photos = db.query(ProgressPhoto).filter(
        ProgressPhoto.user_id == current_user.id
    ).order_by(ProgressPhoto.date.desc()).offset(skip).limit(limit).all()
    return photos


@router.delete("/progress-photos/{photo_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_progress_photo(
    photo_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete a progress photo"""
    photo = db.query(ProgressPhoto).filter(
        ProgressPhoto.id == photo_id,
        ProgressPhoto.user_id == current_user.id
    ).first()

    if not photo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Photo not found"
        )

    # Delete file from disk
    try:
        file_path = Path(photo.photo_url.lstrip('/'))
        if file_path.exists():
            file_path.unlink()
    except Exception as e:
        print(f"Warning: Failed to delete file: {e}")

    db.delete(photo)
    db.commit()
    return None


# Body Measurements Routes
@router.get("/body-measurements", response_model=List[BodyMeasurementResponse])
def get_body_measurements(
    skip: int = 0,
    limit: int = 90,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get user's body measurements"""
    measurements = db.query(BodyMeasurement).filter(
        BodyMeasurement.user_id == current_user.id
    ).order_by(BodyMeasurement.date.desc()).offset(skip).limit(limit).all()
    return measurements


@router.post("/body-measurements", response_model=BodyMeasurementResponse, status_code=status.HTTP_201_CREATED)
def create_body_measurement(
    measurement: BodyMeasurementCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Log new body measurements"""
    db_measurement = BodyMeasurement(
        user_id=current_user.id,
        **measurement.model_dump()
    )
    db.add(db_measurement)
    db.commit()
    db.refresh(db_measurement)
    return db_measurement


@router.delete("/body-measurements/{measurement_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_body_measurement(
    measurement_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete a body measurement entry"""
    measurement = db.query(BodyMeasurement).filter(
        BodyMeasurement.id == measurement_id,
        BodyMeasurement.user_id == current_user.id
    ).first()

    if not measurement:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Measurement not found"
        )

    db.delete(measurement)
    db.commit()
    return None
