from pydantic_settings import BaseSettings
from pydantic import Field, validator
from functools import lru_cache
from enum import Enum
import os


class Environment(str, Enum):
    DEVELOPMENT = "development"
    STAGING = "staging"
    PRODUCTION = "production"


class Settings(BaseSettings):
    # Environment
    ENVIRONMENT: Environment = Environment.DEVELOPMENT
    DEBUG: bool = Field(default=True)

    # Database
    DATABASE_URL: str = Field(
        default="postgresql://lift:lift@localhost:5432/liftlogix",
        description="PostgreSQL database URL"
    )

    # JWT - CRITICAL: Must be set via environment variable in production
    SECRET_KEY: str = Field(
        default="",
        min_length=32,
        description="Secret key for JWT tokens - MUST be set in production"
    )
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # Redis
    REDIS_URL: str = "redis://localhost:6379"

    # API
    API_V1_PREFIX: str = "/api/v1"
    PROJECT_NAME: str = "LiftLogix API"

    # CORS - Restricted for security
    CORS_ORIGINS: list[str] = ["http://localhost:3000", "http://127.0.0.1:3000"]

    # File Upload
    UPLOAD_DIR: str = "uploads/progress_photos"
    MAX_UPLOAD_SIZE: int = 10 * 1024 * 1024  # 10MB
    ALLOWED_EXTENSIONS: list[str] = [".jpg", ".jpeg", ".png", ".webp"]
    ALLOWED_MIME_TYPES: list[str] = ["image/jpeg", "image/png", "image/webp"]

    # Database Connection Pool
    DB_POOL_SIZE: int = 20
    DB_MAX_OVERFLOW: int = 40
    DB_POOL_RECYCLE: int = 3600  # 1 hour

    @validator("SECRET_KEY")
    def validate_secret_key(cls, v, values):
        """Validate SECRET_KEY is set properly"""
        if not v:
            # Try to get from environment
            v = os.getenv("SECRET_KEY", "")

        # In production, SECRET_KEY must be strong
        env = values.get("ENVIRONMENT", Environment.DEVELOPMENT)
        if env == Environment.PRODUCTION:
            if not v or len(v) < 32:
                raise ValueError(
                    "SECRET_KEY must be at least 32 characters in production. "
                    "Generate one with: python -c 'import secrets; print(secrets.token_urlsafe(32))'"
                )
            if v == "your-secret-key-change-in-production":
                raise ValueError("SECRET_KEY cannot use default value in production")
        elif env == Environment.DEVELOPMENT and not v:
            # Auto-generate for development if not set
            import secrets
            v = secrets.token_urlsafe(32)
            print(f"⚠️  Generated temporary SECRET_KEY for development: {v}")
            print("⚠️  Set SECRET_KEY environment variable for persistent sessions")

        return v

    @validator("DEBUG", pre=True, always=True)
    def set_debug(cls, v, values):
        """Set DEBUG based on environment"""
        env = values.get("ENVIRONMENT", Environment.DEVELOPMENT)
        return env == Environment.DEVELOPMENT

    @property
    def is_production(self) -> bool:
        return self.ENVIRONMENT == Environment.PRODUCTION

    @property
    def is_development(self) -> bool:
        return self.ENVIRONMENT == Environment.DEVELOPMENT

    class Config:
        env_file = ".env"
        case_sensitive = True


@lru_cache()
def get_settings() -> Settings:
    return Settings()
