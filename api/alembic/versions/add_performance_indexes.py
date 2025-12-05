"""Add performance indexes to frequently queried columns

Revision ID: perf_indexes_001
Revises: a1b2c3d4e5f6
Create Date: 2025-12-05

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'perf_indexes_001'
down_revision = 'a1b2c3d4e5f6'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Add indexes to workouts table
    op.create_index('idx_workouts_user_id', 'workouts', ['user_id'], unique=False)
    op.create_index('idx_workouts_date', 'workouts', ['date'], unique=False)
    op.create_index('idx_workouts_user_date', 'workouts', ['user_id', 'date'], unique=False)

    # Add indexes to meals table
    op.create_index('idx_meals_user_id', 'meals', ['user_id'], unique=False)
    op.create_index('idx_meals_date', 'meals', ['date'], unique=False)
    op.create_index('idx_meals_user_date', 'meals', ['user_id', 'date'], unique=False)

    # Add indexes to sets table
    op.create_index('idx_sets_workout_id', 'sets', ['workout_id'], unique=False)
    op.create_index('idx_sets_exercise_id', 'sets', ['exercise_id'], unique=False)

    # Add indexes to friendships table
    op.create_index('idx_friendships_follower', 'friendships', ['follower_id'], unique=False)
    op.create_index('idx_friendships_following', 'friendships', ['following_id'], unique=False)
    op.create_index('idx_friendships_status', 'friendships', ['status'], unique=False)

    # Add indexes to workout_shares table
    op.create_index('idx_workout_shares_workout', 'workout_shares', ['workout_id'], unique=False)
    op.create_index('idx_workout_shares_public', 'workout_shares', ['is_public'], unique=False)

    # Add indexes to workout_comments table
    op.create_index('idx_workout_comments_workout', 'workout_comments', ['workout_id'], unique=False)
    op.create_index('idx_workout_comments_user', 'workout_comments', ['user_id'], unique=False)

    # Add indexes to progress_photos table
    op.create_index('idx_progress_photos_user', 'progress_photos', ['user_id'], unique=False)
    op.create_index('idx_progress_photos_date', 'progress_photos', ['date'], unique=False)

    # Add indexes to body_measurements table
    op.create_index('idx_body_measurements_user', 'body_measurements', ['user_id'], unique=False)
    op.create_index('idx_body_measurements_date', 'body_measurements', ['date'], unique=False)


def downgrade() -> None:
    # Drop all indexes
    op.drop_index('idx_workouts_user_id', table_name='workouts')
    op.drop_index('idx_workouts_date', table_name='workouts')
    op.drop_index('idx_workouts_user_date', table_name='workouts')

    op.drop_index('idx_meals_user_id', table_name='meals')
    op.drop_index('idx_meals_date', table_name='meals')
    op.drop_index('idx_meals_user_date', table_name='meals')

    op.drop_index('idx_sets_workout_id', table_name='sets')
    op.drop_index('idx_sets_exercise_id', table_name='sets')

    op.drop_index('idx_friendships_follower', table_name='friendships')
    op.drop_index('idx_friendships_following', table_name='friendships')
    op.drop_index('idx_friendships_status', table_name='friendships')

    op.drop_index('idx_workout_shares_workout', table_name='workout_shares')
    op.drop_index('idx_workout_shares_public', table_name='workout_shares')

    op.drop_index('idx_workout_comments_workout', table_name='workout_comments')
    op.drop_index('idx_workout_comments_user', table_name='workout_comments')

    op.drop_index('idx_progress_photos_user', table_name='progress_photos')
    op.drop_index('idx_progress_photos_date', table_name='progress_photos')

    op.drop_index('idx_body_measurements_user', table_name='body_measurements')
    op.drop_index('idx_body_measurements_date', table_name='body_measurements')
