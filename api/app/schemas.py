from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime, date
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


class UserUpdate(BaseModel):
    name: Optional[str] = None
    height_cm: Optional[float] = None
    weight_kg: Optional[float] = None
    units: Optional[str] = None


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
    name: Optional[str] = None
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


# Meal totals response
class MealTotalsResponse(BaseModel):
    date: date
    calories: float
    protein_g: float
    carbs_g: float
    fat_g: float


# Body Weight Schemas
class BodyWeightBase(BaseModel):
    weight_kg: float
    notes: Optional[str] = None


class BodyWeightCreate(BodyWeightBase):
    pass


class BodyWeightResponse(BodyWeightBase):
    id: int
    user_id: int
    date: datetime

    class Config:
        from_attributes = True


# Personal Record Schema
class PersonalRecordResponse(BaseModel):
    exercise_id: int
    exercise_name: str
    max_weight: float
    max_reps: int
    max_volume: float
    date_achieved: datetime


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
        
# Workout Template Schemas

class TemplateExercise(BaseModel):
    exercise_id: int
    sets: int
    reps: int

class WorkoutTemplateBase(BaseModel):
    name: str
    notes: Optional[str] = None


class WorkoutTemplateCreate(WorkoutTemplateBase):
    # list of { exercise_id, sets, reps }
    exercises: List[TemplateExercise] = []


class WorkoutTemplateUpdate(WorkoutTemplateBase):
    exercises: List[TemplateExercise] = []


class WorkoutTemplateResponse(WorkoutTemplateBase):
    id: int
    exercises: List[TemplateExercise] = []
    created_at: datetime

    class Config:
        from_attributes = True
