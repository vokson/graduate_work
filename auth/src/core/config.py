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


class Settings(BaseSettings):
    db: DatabaseSettings


    class Config:
        #  Для локальной разработки вне docker
        env_file = (
            os.path.join(ENV_DIR, ".env"),
            os.path.join(ENV_DIR, ".env.dev"),
        )
        env_nested_delimiter = "__"


settings = Settings()

db_dsl = {
    "host": settings.db.host,
    "port": settings.db.port,
    "user": settings.db.user,
    "database": settings.db.dbname,
    "password": settings.db.password,
}
