"""Модуль для работы с Redis."""
from abc import ABC, abstractmethod
from contextlib import asynccontextmanager

import redis.asyncio as redis  # type: ignore
from src.tools.decorators import backoff


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


async def get_cache_conn(**dsl):
    cache = AsyncRedisStorage()
    await cache.startup(**dsl)
    yield cache
    await cache.shutdown()
