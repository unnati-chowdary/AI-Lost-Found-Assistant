import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "AI Lost & Found Assistant"
    API_V1_STR: str = "/api"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "super-secret-key-change-in-production-1234567890")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days

    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./lost_and_found.db")

    # Storage
    UPLOAD_DIR: str = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "uploads")

    # SMTP Email Notification Settings
    SMTP_HOST: str = os.getenv("SMTP_HOST", "")
    SMTP_PORT: int = int(os.getenv("SMTP_PORT", "587"))
    SMTP_USERNAME: str = os.getenv("SMTP_USERNAME", "")
    SMTP_PASSWORD: str = os.getenv("SMTP_PASSWORD", "")
    EMAIL_FROM: str = os.getenv("EMAIL_FROM", "noreply@college-lostandfound.edu")

    # AI Scoring Weights (Total = 1.0)
    WEIGHT_TEXT: float = 0.40
    WEIGHT_IMAGE: float = 0.30
    WEIGHT_CATEGORY: float = 0.15
    WEIGHT_LOCATION: float = 0.10
    WEIGHT_DATE: float = 0.05

    # Thresholds
    HIGH_CONFIDENCE_THRESHOLD: float = 75.0
    MEDIUM_CONFIDENCE_THRESHOLD: float = 50.0
    MIN_MATCH_THRESHOLD: float = 30.0

    class Config:
        case_sensitive = True

settings = Settings()
