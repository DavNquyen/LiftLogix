from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from .config import get_settings
import logging

logger = logging.getLogger(__name__)
settings = get_settings()

# Create engine with connection pooling for production performance
engine = create_engine(
    settings.DATABASE_URL,
    pool_size=settings.DB_POOL_SIZE,  # Number of connections to keep open
    max_overflow=settings.DB_MAX_OVERFLOW,  # Max connections above pool_size
    pool_pre_ping=True,  # Verify connections before using (prevents stale connections)
    pool_recycle=settings.DB_POOL_RECYCLE,  # Recycle connections after 1 hour
    echo=settings.DEBUG,  # Log SQL queries in development
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

logger.info(f"Database engine configured with pool_size={settings.DB_POOL_SIZE}, max_overflow={settings.DB_MAX_OVERFLOW}")


def get_db():
    """
    Database dependency for FastAPI routes
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
