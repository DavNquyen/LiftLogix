from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text, Boolean, Enum as SQLEnum, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from .db import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    name = Column(String, nullable=False)
    height_cm = Column(Float, nullable=True)
    weight_kg = Column(Float, nullable=True)
    units = Column(String, default="metric")  # metric or imperial
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    workouts = relationship("Workout", back_populates="user")
    meals = relationship("Meal", back_populates="user")
    plans = relationship("Plan", back_populates="user")


class Exercise(Base):
    __tablename__ = "exercises"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, index=True)
    muscle_group = Column(String, nullable=True)
    is_user_defined = Column(Boolean, default=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)

    # Relationships
    sets = relationship("Set", back_populates="exercise")


class Workout(Base):
    __tablename__ = "workouts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    plan_id = Column(Integer, ForeignKey("plans.id"), nullable=True)
    date = Column(DateTime, default=datetime.utcnow)
    notes = Column(Text, nullable=True)

    # Relationships
    user = relationship("User", back_populates="workouts")
    plan = relationship("Plan", back_populates="workouts")
    sets = relationship("Set", back_populates="workout", cascade="all, delete-orphan")


class Set(Base):
    __tablename__ = "sets"

    id = Column(Integer, primary_key=True, index=True)
    workout_id = Column(Integer, ForeignKey("workouts.id"), nullable=False)
    exercise_id = Column(Integer, ForeignKey("exercises.id"), nullable=False)
    weight = Column(Float, nullable=False)
    reps = Column(Integer, nullable=False)
    rpe = Column(Float, nullable=True)  # Rate of Perceived Exertion
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    workout = relationship("Workout", back_populates="sets")
    exercise = relationship("Exercise", back_populates="sets")


class MealType(str, enum.Enum):
    BREAKFAST = "breakfast"
    LUNCH = "lunch"
    DINNER = "dinner"
    SNACK = "snack"


class Meal(Base):
    __tablename__ = "meals"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    date = Column(DateTime, default=datetime.utcnow)
    type = Column(SQLEnum(MealType), nullable=False)
    calories = Column(Float, nullable=False)
    protein_g = Column(Float, nullable=False)
    carbs_g = Column(Float, nullable=False)
    fat_g = Column(Float, nullable=False)
    description = Column(Text, nullable=True)

    # Relationships
    user = relationship("User", back_populates="meals")


class Plan(Base):
    __tablename__ = "plans"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    template_key = Column(String, nullable=True)  # e.g., "ppl_beginner", "upper_lower"
    name = Column(String, nullable=False)
    level = Column(String, nullable=True)  # beginner, intermediate, advanced
    split = Column(String, nullable=True)  # PPL, Upper/Lower, etc.
    progression_rules_json = Column(JSON, nullable=True)

    # Relationships
    user = relationship("User", back_populates="plans")
    workouts = relationship("Workout", back_populates="plan")


class FoodFavorite(Base):
    __tablename__ = "food_favorites"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String, nullable=False)
    brand = Column(String, nullable=True)
    upc = Column(String, nullable=True)
    macros_json = Column(JSON, nullable=False)
