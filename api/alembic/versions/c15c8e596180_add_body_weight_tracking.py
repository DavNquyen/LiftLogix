"""Add body weight tracking

Revision ID: c15c8e596180
Revises: 16a1e2282f8b
Create Date: 2025-11-14 22:58:49.935758

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'c15c8e596180'
down_revision: Union[str, None] = '16a1e2282f8b'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'body_weights',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('weight_kg', sa.Float(), nullable=False),
        sa.Column('date', sa.DateTime(), nullable=True),
        sa.Column('notes', sa.Text(), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_body_weights_id'), 'body_weights', ['id'], unique=False)


def downgrade() -> None:
    op.drop_index(op.f('ix_body_weights_id'), table_name='body_weights')
    op.drop_table('body_weights')
