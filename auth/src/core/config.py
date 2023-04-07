"""Настройки"""

import os
from logging import config as logging_config

from pydantic import BaseModel, BaseSettings
from src.core.logger import LOGGING


logging_config.dictConfig(LOGGING)


BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ENV_DIR = os.path.join(BASE_DIR, "..", "..")


class DatabaseSettings(BaseModel):
    host: str
    port: int
    user: str
    password: str
    dbname: str


class CacheSettings(BaseSettings):
    host: str
    port: int


class TokenSettings(BaseModel):
    secret_key: str
    algo: str
    access_lifetime: int
    refresh_lifetime: int


class Settings(BaseSettings):
    auth_db: DatabaseSettings
    cache: CacheSettings
    token: TokenSettings

    class Config:
        #  Для локальной разработки вне docker
        env_file = (
            os.path.join(ENV_DIR, ".env"),
            os.path.join(ENV_DIR, ".env.dev"),
        )
        env_nested_delimiter = "__"


settings = Settings()

db_dsl = {
    "host": settings.auth_db.host,
    "port": settings.auth_db.port,
    "user": settings.auth_db.user,
    "database": settings.auth_db.dbname,
    "password": settings.auth_db.password,
}

cache_dsl = {
    "host": settings.cache.host,
    "port": settings.cache.port,
}
