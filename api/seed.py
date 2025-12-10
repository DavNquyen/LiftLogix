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


def seed_demo_user():
    """Seed a demo user with sample workouts, meals, and body weight data"""
    from datetime import datetime, timedelta
    from app.models import User, Workout, Set, Meal, BodyWeight
    from app.auth import get_password_hash

    db = SessionLocal()

    try:
        # Check if demo user already exists
        existing_user = db.query(User).filter(User.email == "demo@liftlogix.com").first()
        if existing_user:
            print("Demo user already exists. Skipping demo data seed.")
            return

        # Create demo user
        demo_user = User(
            email="demo@liftlogix.com",
            password_hash=get_password_hash("DemoPass123!"),
            name="Demo User",
            height_cm=175,
            weight_kg=75,
            units="metric"
        )
        db.add(demo_user)
        db.flush()

        # Get exercise IDs
        exercises = db.query(Exercise).all()
        exercise_map = {e.name: e.id for e in exercises}

        # Create workouts for the past 14 days
        workout_data = [
            {"days_ago": 1, "name": "Push Day", "exercises": [
                ("Barbell Bench Press", [(100, 8), (100, 8), (95, 10)]),
                ("Incline Bench Press", [(70, 10), (70, 10), (65, 12)]),
                ("Overhead Press", [(50, 8), (50, 8), (45, 10)]),
                ("Tricep Pushdown", [(30, 12), (30, 12), (30, 12)]),
            ]},
            {"days_ago": 3, "name": "Pull Day", "exercises": [
                ("Deadlift", [(140, 5), (140, 5), (130, 6)]),
                ("Barbell Row", [(80, 8), (80, 8), (75, 10)]),
                ("Lat Pulldown", [(60, 10), (60, 10), (55, 12)]),
                ("Barbell Curl", [(30, 10), (30, 10), (30, 10)]),
            ]},
            {"days_ago": 5, "name": "Leg Day", "exercises": [
                ("Squat", [(120, 6), (120, 6), (110, 8)]),
                ("Romanian Deadlift", [(100, 8), (100, 8), (90, 10)]),
                ("Leg Press", [(180, 10), (180, 10), (180, 10)]),
                ("Calf Raises", [(80, 15), (80, 15), (80, 15)]),
            ]},
            {"days_ago": 7, "name": "Push Day", "exercises": [
                ("Barbell Bench Press", [(95, 8), (95, 8), (90, 10)]),
                ("Dumbbell Shoulder Press", [(25, 10), (25, 10), (22, 12)]),
                ("Cable Flyes", [(15, 12), (15, 12), (15, 12)]),
            ]},
            {"days_ago": 9, "name": "Pull Day", "exercises": [
                ("Deadlift", [(135, 5), (135, 5), (125, 6)]),
                ("Pull-ups", [(0, 8), (0, 7), (0, 6)]),
                ("Seated Cable Row", [(55, 10), (55, 10), (50, 12)]),
            ]},
            {"days_ago": 11, "name": "Leg Day", "exercises": [
                ("Squat", [(115, 6), (115, 6), (105, 8)]),
                ("Leg Curl", [(40, 12), (40, 12), (40, 12)]),
                ("Leg Extension", [(45, 12), (45, 12), (45, 12)]),
            ]},
        ]

        for workout_info in workout_data:
            workout_date = datetime.now() - timedelta(days=workout_info["days_ago"])
            workout = Workout(
                user_id=demo_user.id,
                name=workout_info["name"],
                date=workout_date.date(),
                notes=f"Great {workout_info['name'].lower()} session!"
            )
            db.add(workout)
            db.flush()

            for exercise_name, sets in workout_info["exercises"]:
                if exercise_name in exercise_map:
                    for weight, reps in sets:
                        db_set = Set(
                            workout_id=workout.id,
                            exercise_id=exercise_map[exercise_name],
                            weight=weight,
                            reps=reps,
                            rpe=8
                        )
                        db.add(db_set)

        # Create meals for the past 7 days
        meal_types = ["breakfast", "lunch", "dinner", "snack"]
        meal_data = [
            ("breakfast", 450, 35, 45, 15),
            ("lunch", 650, 45, 60, 22),
            ("dinner", 700, 50, 55, 28),
            ("snack", 200, 20, 15, 8),
        ]

        for days_ago in range(7):
            meal_date = datetime.now() - timedelta(days=days_ago)
            for meal_type, calories, protein, carbs, fat in meal_data:
                meal = Meal(
                    user_id=demo_user.id,
                    date=meal_date.date(),
                    type=meal_type,
                    calories=calories + (days_ago * 10),  # Slight variation
                    protein_g=protein,
                    carbs_g=carbs,
                    fat_g=fat,
                    description=f"Demo {meal_type}"
                )
                db.add(meal)

        # Create body weight entries for the past 14 days
        for days_ago in range(14):
            weight_date = datetime.now() - timedelta(days=days_ago)
            body_weight = BodyWeight(
                user_id=demo_user.id,
                date=weight_date.date(),
                weight_kg=75.0 - (days_ago * 0.1),  # Slight downward trend
                notes="Morning weigh-in" if days_ago % 3 == 0 else None
            )
            db.add(body_weight)

        db.commit()
        print("Successfully seeded demo user with sample data!")
        print("  - Email: demo@liftlogix.com")
        print("  - Password: DemoPass123!")
        print("  - 6 workouts, 28 meals, 14 body weight entries")

    except Exception as e:
        print(f"Error seeding demo data: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    print("Seeding LiftLogix database...")
    seed_exercises()
    print("\nSeeding demo user data...")
    seed_demo_user()
