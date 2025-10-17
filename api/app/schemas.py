from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime
from .models import MealType


# User Schemas
class UserBase(BaseModel):
    email: EmailStr
    name: str


class UserCreate(UserBase):
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(UserBase):
    id: int
    height_cm: Optional[float] = None
    weight_kg: Optional[float] = None
    units: str = "metric"
    created_at: datetime

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    user_id: Optional[int] = None


# Exercise Schemas
class ExerciseBase(BaseModel):
    name: str
    muscle_group: Optional[str] = None


class ExerciseCreate(ExerciseBase):
    pass


class ExerciseResponse(ExerciseBase):
    id: int
    is_user_defined: bool = False

    class Config:
        from_attributes = True


# Set Schemas
class SetBase(BaseModel):
    exercise_id: int
    weight: float
    reps: int
    rpe: Optional[float] = None


class SetCreate(SetBase):
    pass


class SetResponse(SetBase):
    id: int
    workout_id: int
    created_at: datetime

    class Config:
        from_attributes = True


# Workout Schemas
class WorkoutBase(BaseModel):
    notes: Optional[str] = None


class WorkoutCreate(WorkoutBase):
    sets: List[SetCreate] = []


class WorkoutResponse(WorkoutBase):
    id: int
    user_id: int
    date: datetime
    sets: List[SetResponse] = []

    class Config:
        from_attributes = True


# Meal Schemas
class MealBase(BaseModel):
    type: MealType
    calories: float
    protein_g: float
    carbs_g: float
    fat_g: float
    description: Optional[str] = None


class MealCreate(MealBase):
    pass


class MealResponse(MealBase):
    id: int
    user_id: int
    date: datetime

    class Config:
        from_attributes = True


# Plan Schemas
class PlanBase(BaseModel):
    name: str
    level: Optional[str] = None
    split: Optional[str] = None


class PlanCreate(PlanBase):
    template_key: Optional[str] = None


class PlanResponse(PlanBase):
    id: int
    user_id: Optional[int] = None
    template_key: Optional[str] = None

    class Config:
        from_attributes = True
