from pydantic_settings import BaseSettings
from pydantic import Field


class Settings(BaseSettings):
    database_url: str = Field(alias="DATABASE_URL")
    supabase_url: str = Field(alias="SUPABASE_URL")
    supabase_anon_key: str = Field(alias="SUPABASE_ANON_KEY")
    app_port: int = Field(default=8000, alias="APP_PORT")

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

settings = Settings()  # load at import time