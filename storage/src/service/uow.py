from abc import ABC, abstractmethod

from src.adapters.broker import init_publisher
from src.adapters.cache import close_cache, init_cache
from src.adapters.db import get_db_conn, release_db_conn
from src.adapters.geoip import init_geo_ip
from src.adapters.repositories.cdn_server import CdnServerRepository
from src.adapters.repositories.file import FileRepository
from src.adapters.s3 import init_s3_pool
from src.core.config import (cache_dsl, db_dsl, get_s3_dsl, rabbit_args,
                             settings)


def get_db_connection():
    return get_db_conn(**db_dsl)


def get_cache_connection():
    return init_cache(**cache_dsl)


def get_s3_pool():
    return init_s3_pool(settings.s3.bucket, get_s3_dsl)


def get_publisher():
    return init_publisher(*rabbit_args)


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
        bootstrap: list[str],
        get_db_conn=get_db_connection,
        release_db_conn=release_db_conn,
        get_cache=get_cache_connection,
        get_geo_ip=init_geo_ip,
        get_s3_pool=get_s3_pool,
        get_publisher=get_publisher,
    ):
        super().__init__()
        self._bootstrap = bootstrap
        self._get_db_conn = get_db_conn
        self._release_db_conn = release_db_conn
        self._get_cache_conn = get_cache
        self._get_s3_pool = get_s3_pool
        self._get_geo_ip = get_geo_ip
        self._get_publisher = get_publisher

    async def __aenter__(self):
        if "cache" in self._bootstrap:
            self.cache = await self._get_cache_conn()

        if "s3" in self._bootstrap:
            self.s3_pool = await self._get_s3_pool()

        if "geoip" in self._bootstrap:
            self.geoip = await self._get_geo_ip()

        if "publisher" in self._bootstrap:
            self._publisher = await self._get_publisher()

        if "db" in self._bootstrap:
            self._is_done = False
            self._conn = await self._get_db_conn()
            self._transaction = self._conn.transaction()
            await self._transaction.start()

            self.cdn_servers = CdnServerRepository(self._conn)
            self.files = FileRepository(self._conn)

        return self

    async def __aexit__(self, *args):
        if "db" in self._bootstrap:
            if not self._is_done:
                await super().__aexit__()

            await self._release_db_conn(self._conn)

    async def commit(self):
        if "db" in self._bootstrap:
            self._is_done = True
            await self._transaction.commit()

    async def rollback(self):
        if "db" in self._bootstrap:
            self._is_done = True
            await self._transaction.rollback()
