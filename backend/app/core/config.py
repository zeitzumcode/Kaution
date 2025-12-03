from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    # DynamoDB Configuration
    DYNAMODB_ENDPOINT_URL: str = "http://localhost:8000"  # Local DynamoDB
    AWS_REGION: str = "us-east-1"
    AWS_ACCESS_KEY_ID: str = "dummy"  # Not needed for local
    AWS_SECRET_ACCESS_KEY: str = "dummy"  # Not needed for local
    
    # For AWS DynamoDB (production), set:
    # DYNAMODB_ENDPOINT_URL = None (uses AWS)
    # AWS_ACCESS_KEY_ID = your-key
    # AWS_SECRET_ACCESS_KEY = your-secret
    # AWS_REGION = your-region
    
    # Application Settings
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # CORS (comma-separated string in env, converted to list)
    CORS_ORIGINS: str = "http://localhost:8088,http://localhost:5173"
    
    @property
    def cors_origins_list(self) -> List[str]:
        """Convert CORS_ORIGINS string to list"""
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",")]
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()

