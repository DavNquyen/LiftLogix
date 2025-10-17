#!/usr/bin/env python3
"""
Seed script for LiftLogix database
Populates the database with initial exercise catalog
"""

from app.db import SessionLocal, engine, Base
from app.models import Exercise

# Create tables
Base.metadata.create_all(bind=engine)

# Sample exercises organized by muscle group
EXERCISES = [
    # Chest
    {"name": "Barbell Bench Press", "muscle_group": "chest"},
    {"name": "Dumbbell Bench Press", "muscle_group": "chest"},
    {"name": "Incline Bench Press", "muscle_group": "chest"},
    {"name": "Decline Bench Press", "muscle_group": "chest"},
    {"name": "Cable Flyes", "muscle_group": "chest"},
    {"name": "Push-ups", "muscle_group": "chest"},

    # Back
    {"name": "Deadlift", "muscle_group": "back"},
    {"name": "Barbell Row", "muscle_group": "back"},
    {"name": "Lat Pulldown", "muscle_group": "back"},
    {"name": "Pull-ups", "muscle_group": "back"},
    {"name": "Seated Cable Row", "muscle_group": "back"},
    {"name": "T-Bar Row", "muscle_group": "back"},
    {"name": "Face Pulls", "muscle_group": "back"},

    # Shoulders
    {"name": "Overhead Press", "muscle_group": "shoulders"},
    {"name": "Dumbbell Shoulder Press", "muscle_group": "shoulders"},
    {"name": "Lateral Raises", "muscle_group": "shoulders"},
    {"name": "Front Raises", "muscle_group": "shoulders"},
    {"name": "Rear Delt Flyes", "muscle_group": "shoulders"},

    # Arms
    {"name": "Barbell Curl", "muscle_group": "biceps"},
    {"name": "Dumbbell Curl", "muscle_group": "biceps"},
    {"name": "Hammer Curl", "muscle_group": "biceps"},
    {"name": "Tricep Pushdown", "muscle_group": "triceps"},
    {"name": "Tricep Dips", "muscle_group": "triceps"},
    {"name": "Overhead Tricep Extension", "muscle_group": "triceps"},
    {"name": "Close-grip Bench Press", "muscle_group": "triceps"},

    # Legs
    {"name": "Squat", "muscle_group": "legs"},
    {"name": "Front Squat", "muscle_group": "legs"},
    {"name": "Leg Press", "muscle_group": "legs"},
    {"name": "Romanian Deadlift", "muscle_group": "legs"},
    {"name": "Leg Curl", "muscle_group": "legs"},
    {"name": "Leg Extension", "muscle_group": "legs"},
    {"name": "Lunges", "muscle_group": "legs"},
    {"name": "Bulgarian Split Squat", "muscle_group": "legs"},
    {"name": "Calf Raises", "muscle_group": "legs"},

    # Core
    {"name": "Plank", "muscle_group": "core"},
    {"name": "Crunches", "muscle_group": "core"},
    {"name": "Russian Twists", "muscle_group": "core"},
    {"name": "Hanging Leg Raises", "muscle_group": "core"},
]


def seed_exercises():
    """Seed the exercise catalog"""
    db = SessionLocal()
    try:
        # Check if exercises already exist
        existing_count = db.query(Exercise).count()
        if existing_count > 0:
            print(f"Database already contains {existing_count} exercises. Skipping seed.")
            return

        # Insert exercises
        for exercise_data in EXERCISES:
            exercise = Exercise(**exercise_data, is_user_defined=False)
            db.add(exercise)

        db.commit()
        print(f"Successfully seeded {len(EXERCISES)} exercises!")

    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    print("Seeding LiftLogix database...")
    seed_exercises()
