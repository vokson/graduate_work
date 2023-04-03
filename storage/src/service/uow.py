from abc import ABC, abstractmethod

from src.adapters.cache import get_cache_conn
from src.adapters.s3 import get_s3_conn
from src.adapters.db import get_conn_pool
from src.adapters.repositories.cdn_server import CdnServerRepository
from src.adapters.repositories.file import FileRepository
from src.core.config import cache_dsl, db_dsl, s3_dsl, settings


db_conn_pool = None
cache_conn = None
s3_conn = None


async def db_pool_factory():
    global db_conn_pool

    if not db_conn_pool:
        db_conn_pool = await anext(get_conn_pool(**db_dsl))

    return db_conn_pool


async def init_db_conn_func():
    pool = await db_pool_factory()
    return await pool.acquire()


async def release_db_conn_func(conn):
    pool = await db_pool_factory()
    return await pool.release(conn)


async def get_cache():
    global cache_conn

    if not cache_conn:
        cache_conn = await anext(get_cache_conn(**cache_dsl))

    return cache_conn

async def get_s3():
    global s3_conn

    if not s3_conn:
        s3_conn = await anext(get_s3_conn(settings.s3.bucket, **s3_dsl))

    return s3_conn


class AbstractUnitOfWork(ABC):
    def __init__(self):
        self._messages = []

    async def __aenter__(self):
        return self

    async def __aexit__(self, *args):
        await self.rollback()

    @abstractmethod
    async def commit(self):
        raise NotImplementedError

    @abstractmethod
    async def rollback(self):
        raise NotImplementedError

    def push_message(self, message):
        self._messages.append(message)

    def collect_new_messages(self):
        messages = self._messages[:]
        self._messages = []
        return messages


class UnitOfWork(AbstractUnitOfWork):
    def __init__(
        self,
        init_db_conn=init_db_conn_func,
        release_db_conn=release_db_conn_func,
        get_cache=get_cache,
        get_s3=get_s3,
    ):
        super().__init__()
        self._init_db_conn = init_db_conn_func
        self._release_db_conn = release_db_conn_func
        self._get_cache_conn = get_cache
        self._get_s3_conn = get_s3

    async def __aenter__(self):
        self._is_done = False
        self._conn = await self._init_db_conn()
        self._transaction = self._conn.transaction()
        await self._transaction.start()

        self.cache = await self._get_cache_conn()
        self.s3 = await self._get_s3_conn()
        self.cdn_servers = CdnServerRepository(self._conn)
        self.files = FileRepository(self._conn)

        return self

    async def __aexit__(self, *args):
        if not self._is_done:
            await super().__aexit__()
        await self._release_db_conn(self._conn)

    async def commit(self):
        self._is_done = True
        await self._transaction.commit()

    async def rollback(self):
        self._is_done = True
        await self._transaction.rollback()
