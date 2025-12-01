"""add social and progress tracking features

Revision ID: a1b2c3d4e5f6
Revises: c15c8e596180
Create Date: 2025-11-19 12:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'a1b2c3d4e5f6'
down_revision: Union[str, None] = 'c15c8e596180'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Create friendships table
    op.create_table(
        'friendships',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('follower_id', sa.Integer(), nullable=False),
        sa.Column('following_id', sa.Integer(), nullable=False),
        sa.Column('status', sa.Enum('pending', 'accepted', 'rejected', name='followstatus'), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['follower_id'], ['users.id'], ),
        sa.ForeignKeyConstraint(['following_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_friendships_id'), 'friendships', ['id'], unique=False)

    # Create workout_shares table
    op.create_table(
        'workout_shares',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('workout_id', sa.Integer(), nullable=False),
        sa.Column('is_public', sa.Boolean(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['workout_id'], ['workouts.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_workout_shares_id'), 'workout_shares', ['id'], unique=False)

    # Create workout_comments table
    op.create_table(
        'workout_comments',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('workout_id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('comment_text', sa.Text(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['workout_id'], ['workouts.id'], ),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_workout_comments_id'), 'workout_comments', ['id'], unique=False)

    # Create progress_photos table
    op.create_table(
        'progress_photos',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('photo_url', sa.String(), nullable=False),
        sa.Column('photo_type', sa.String(), nullable=True),
        sa.Column('notes', sa.Text(), nullable=True),
        sa.Column('date', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_progress_photos_id'), 'progress_photos', ['id'], unique=False)

    # Create body_measurements table
    op.create_table(
        'body_measurements',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('date', sa.DateTime(), nullable=True),
        sa.Column('chest_cm', sa.Float(), nullable=True),
        sa.Column('waist_cm', sa.Float(), nullable=True),
        sa.Column('hips_cm', sa.Float(), nullable=True),
        sa.Column('left_bicep_cm', sa.Float(), nullable=True),
        sa.Column('right_bicep_cm', sa.Float(), nullable=True),
        sa.Column('left_thigh_cm', sa.Float(), nullable=True),
        sa.Column('right_thigh_cm', sa.Float(), nullable=True),
        sa.Column('left_calf_cm', sa.Float(), nullable=True),
        sa.Column('right_calf_cm', sa.Float(), nullable=True),
        sa.Column('neck_cm', sa.Float(), nullable=True),
        sa.Column('shoulders_cm', sa.Float(), nullable=True),
        sa.Column('notes', sa.Text(), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_body_measurements_id'), 'body_measurements', ['id'], unique=False)


def downgrade() -> None:
    op.drop_index(op.f('ix_body_measurements_id'), table_name='body_measurements')
    op.drop_table('body_measurements')
    op.drop_index(op.f('ix_progress_photos_id'), table_name='progress_photos')
    op.drop_table('progress_photos')
    op.drop_index(op.f('ix_workout_comments_id'), table_name='workout_comments')
    op.drop_table('workout_comments')
    op.drop_index(op.f('ix_workout_shares_id'), table_name='workout_shares')
    op.drop_table('workout_shares')
    op.drop_index(op.f('ix_friendships_id'), table_name='friendships')
    op.drop_table('friendships')
    op.execute('DROP TYPE IF EXISTS followstatus')
