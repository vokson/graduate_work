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

class AuthServiceSettings(BaseSettings):
    host: str
    port: int


class CacheSettings(BaseSettings):
    host: str
    port: int

class LinkExpireTimeSettings(BaseSettings):
    upload: str
    download: str

class S3Settings(BaseSettings):
    host: str
    port: int
    user: str
    password: str
    bucket: str
    link_expire_time: LinkExpireTimeSettings


class Settings(BaseSettings):
    auth: AuthServiceSettings
    storage_db: DatabaseSettings
    cache: CacheSettings
    s3: S3Settings

    class Config:
        #  Для локальной разработки вне docker
        env_file = (
            os.path.join(ENV_DIR, ".env"),
            os.path.join(ENV_DIR, ".env.dev"),
        )
        env_nested_delimiter = "__"


settings = Settings()

db_dsl = {
    "host": settings.storage_db.host,
    "port": settings.storage_db.port,
    "user": settings.storage_db.user,
    "database": settings.storage_db.dbname,
    "password": settings.storage_db.password,
}

cache_dsl = {
    "host": settings.cache.host,
    "port": settings.cache.port,
}

s3_dsl = {
    "endpoint": f"{settings.s3.host}:{settings.s3.port}",
    "access_key": settings.s3.user,
    "secret_key": settings.s3.password,
    "secure": False
}
