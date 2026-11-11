from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    app_name: str = "SetuAI"
    cors_origins: list[str] = []
    cors_origin_regex: str = r"http://(localhost|127\.0\.0\.1):\d+"

    mongodb_url: str = ""
    mongodb_db: str = "setuai"

    jwt_secret: str = ""
    jwt_expire_minutes: int = 60 * 24 * 7
    cookie_name: str = "setuai_token"
    cookie_secure: bool = False

    admin_email: str = ""
    admin_password: str = ""

    anthropic_api_key: str = ""


settings = Settings()
