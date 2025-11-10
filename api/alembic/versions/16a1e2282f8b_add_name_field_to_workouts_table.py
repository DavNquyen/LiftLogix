"""Add name field to workouts table

Revision ID: 16a1e2282f8b
Revises: a328b16f1705
Create Date: 2025-11-05 22:57:59.218159

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '16a1e2282f8b'
down_revision: Union[str, None] = 'a328b16f1705'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('workouts', sa.Column('name', sa.String(), nullable=True))


def downgrade() -> None:
    op.drop_column('workouts', 'name')
