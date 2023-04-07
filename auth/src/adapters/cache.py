"""Модуль для работы с Redis."""
import logging
from abc import ABC, abstractmethod
from contextlib import asynccontextmanager

import redis.asyncio as redis  # type: ignore
from src.tools.decorators import backoff


logger = logging.getLogger(__name__)


class AsyncCacheStorage(ABC):
    @abstractmethod
    async def startup(self, *args, **kwargs):
        pass

    @abstractmethod
    async def shutdown(self):
        pass

    @abstractmethod
    async def get(self, key: str):
        pass

    @abstractmethod
    async def set(self, key: str, value: str, expire: int | None):
        pass


class AsyncRedisStorage(AsyncCacheStorage):
    @backoff()
    async def startup(self, *args, **kwargs):
        self._redis = redis.Redis(*args, **kwargs)

    async def shutdown(self):
        await self._redis.close()

    async def get(self, key: str) -> str:
        return await self._redis.get(key)

    async def set(self, key: str, value: str, expire_at: int | None = None):
        await self._redis.set(key, value, ex=expire_at)


cache: AsyncCacheStorage | None = None


async def init_cache(**dsl):
    global cache

    if not cache:
        logger.info(f"Initialization of cache ..")
        cache = AsyncRedisStorage()
        await cache.startup(**dsl)
        logger.info(f"Cache has been initialized.")

    return cache


async def close_cache():
    global cache
    if cache:
        logger.info(f"Closing cache ..")
        await cache.shutdown()
        logger.info(f"Cache has been closed.")
