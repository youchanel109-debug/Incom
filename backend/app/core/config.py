from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    database_url: str = "mysql+pymysql://budget_user:change_me@localhost:3306/my_custom_budget"
    reports_directory: Path = Path("/var/budget_reports")
    cors_origins: str = "http://localhost:5173,http://localhost:5175"
    scheduler_timezone: str = "UTC"
    admin_username: str = "seanghai168@gmail.com"
    admin_password: str = "769853"
    auth_secret_key: str = "change-me"
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    @property
    def cors_origin_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


settings = Settings()
