from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    # API Settings
    APP_NAME: str = "MeetingGPT"
    VERSION: str = "1.0.0"
    DEBUG: bool = False
    API_PREFIX: str = "/api/v1"
    
    # LLM Settings
    ANTHROPIC_API_KEY: str
    LLM_MODEL: str = "claude-sonnet-4-20250514"
    
    # OpenAI Settings
    OPENAI_API_KEY: str
    
    # Database (Supabase)
    DATABASE_URL: str = "postgresql://user:password@localhost:5432/meetinggpt"
    SUPABASE_URL: str
    SUPABASE_SERVICE_KEY: str
    
    # Redis
    REDIS_URL: str = "redis://localhost:6379"
    CACHE_TTL: int = 3600
    
    # Stripe
    STRIPE_SECRET_KEY: str
    STRIPE_PRICE_ID: str
    FRONTEND_URL: str = "http://localhost:3000"
    
    # GitHub Auth
    GITHUB_CLIENT_ID: str
    GITHUB_CLIENT_SECRET: str
    JWT_SECRET: str
    
    # Performance
    MAX_CONCURRENT_REQUESTS: int = 100
    TIMEOUT_SECONDS: int = 30
    MAX_FILE_SIZE_MB: int = 100
    
    # Monitoring
    PROMETHEUS_PORT: int = 9090
    LOG_LEVEL: str = "INFO"
    
    # CORS
    ALLOWED_ORIGINS: list[str] = ["http://localhost:3000", "https://*.vercel.app"]
    
    # Processing Settings
    ASYNC_WORKER_COUNT: int = 3
    TRANSCRIPTION_TIMEOUT: int = 300  # 5 minutes
    ANALYSIS_TIMEOUT: int = 120  # 2 minutes
    
    # Freemium Limits
    FREE_MEETINGS_PER_MONTH: int = 5
    PRO_PRICE: float = 15.0  # USD per month
    
    class Config:
        env_file = ".env"
        case_sensitive = True

@lru_cache
def get_settings() -> Settings:
    return Settings()
