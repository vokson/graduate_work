from abc import ABC, abstractmethod
from contextlib import asynccontextmanager

import asyncpg

from tools.decorators import backoff


class AsyncDBStorage(ABC):
    @abstractmethod
    async def startup(self, *args, **kwargs):
        pass

    @abstractmethod
    async def fetch(self, query, *args):
        pass

    @abstractmethod
    async def execute(self, query, *args, **kwargs):
        pass

    @abstractmethod
    async def executemany(self, query, arr: list[tuple]):
        pass

    @abstractmethod
    async def shutdown(self):
        pass


class AsyncPostgresStorage(AsyncDBStorage):
    @backoff()
    async def startup(self, *args, **kwargs):
        self._pool = await asyncpg.create_pool(**kwargs)

    async def fetch(self, query, *args):
        async with self._pool.acquire() as connection:
            async with connection.transaction():
                return await connection.fetch(query, *args)

    async def execute(self, query, *args, **kwargs):
        async with self._pool.acquire() as connection:
            async with connection.transaction():
                return await connection.fetchval(query, *args, **kwargs)

    async def executemany(self, query, arr: list[tuple]):
        async with self._pool.acquire() as connection:
            async with connection.transaction():
                return await connection.executemany(query, arr)

    async def shutdown(self):
        await self._pool.close()


@asynccontextmanager
async def get_db(**dsl):
    db = AsyncPostgresStorage()
    await db.startup(**dsl)
    yield db
    await db.shutdown()