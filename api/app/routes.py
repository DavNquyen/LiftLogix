from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from .db import get_db
from .models import User, Exercise, Workout, Set, Meal
from .schemas import (
    UserCreate, UserLogin, UserResponse, Token,
    ExerciseCreate, ExerciseResponse,
    WorkoutCreate, WorkoutResponse,
    MealCreate, MealResponse
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
