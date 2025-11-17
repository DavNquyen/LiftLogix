from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
from datetime import datetime, timedelta
from .db import get_db
from .models import User, Exercise, Workout, Set, Meal, BodyWeight
from .schemas import (
    UserCreate, UserLogin, UserResponse, UserUpdate, Token,
    ExerciseCreate, ExerciseResponse,
    WorkoutCreate, WorkoutResponse,
    SetCreate, SetResponse,
    MealCreate, MealResponse,
    BodyWeightCreate, BodyWeightResponse,
    PersonalRecordResponse
)
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
