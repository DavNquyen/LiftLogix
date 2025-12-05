from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime, date
from .models import MealType, FollowStatus


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
    calories: float = Field(..., ge=0, le=10000, description="Calories (0-10000)")
    protein_g: float = Field(..., ge=0, le=500, description="Protein in grams (0-500)")
    carbs_g: float = Field(..., ge=0, le=500, description="Carbohydrates in grams (0-500)")
    fat_g: float = Field(..., ge=0, le=300, description="Fat in grams (0-300)")
    description: Optional[str] = Field(None, max_length=500)


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


# Social Features Schemas
# Friendship Schemas
class FriendshipBase(BaseModel):
    following_id: int


class FriendshipCreate(FriendshipBase):
    pass


class FriendshipResponse(BaseModel):
    id: int
    follower_id: int
    following_id: int
    status: FollowStatus
    created_at: datetime

    class Config:
        from_attributes = True


class FriendWithUser(BaseModel):
    id: int
    follower_id: int
    following_id: int
    status: FollowStatus
    user: UserResponse

    class Config:
        from_attributes = True


# Workout Share Schemas
class WorkoutShareCreate(BaseModel):
    workout_id: int
    is_public: bool = True


class WorkoutShareResponse(BaseModel):
    id: int
    workout_id: int
    is_public: bool
    created_at: datetime

    class Config:
        from_attributes = True


# Workout Comment Schemas
class WorkoutCommentCreate(BaseModel):
    comment_text: str


class WorkoutCommentResponse(BaseModel):
    id: int
    workout_id: int
    user_id: int
    comment_text: str
    created_at: datetime
    user: UserResponse

    class Config:
        from_attributes = True


# Progress Tracking Schemas
# Progress Photo Schemas
class ProgressPhotoBase(BaseModel):
    photo_type: Optional[str] = None
    notes: Optional[str] = None


class ProgressPhotoResponse(ProgressPhotoBase):
    id: int
    user_id: int
    photo_url: str
    date: datetime

    class Config:
        from_attributes = True


# Body Measurement Schemas
class BodyMeasurementBase(BaseModel):
    chest_cm: Optional[float] = None
    waist_cm: Optional[float] = None
    hips_cm: Optional[float] = None
    left_bicep_cm: Optional[float] = None
    right_bicep_cm: Optional[float] = None
    left_thigh_cm: Optional[float] = None
    right_thigh_cm: Optional[float] = None
    left_calf_cm: Optional[float] = None
    right_calf_cm: Optional[float] = None
    neck_cm: Optional[float] = None
    shoulders_cm: Optional[float] = None
    notes: Optional[str] = None


class BodyMeasurementCreate(BodyMeasurementBase):
    pass


class BodyMeasurementResponse(BodyMeasurementBase):
    id: int
    user_id: int
    date: datetime

    class Config:
        from_attributes = True
