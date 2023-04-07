from abc import ABC, abstractmethod

from src.adapters.cache import close_cache, init_cache
from src.adapters.db import get_db_conn, release_db_conn
from src.adapters.repositories.user import UserRepository
from src.core.config import cache_dsl, db_dsl, settings


def get_db_connection():
    return get_db_conn(**db_dsl)


def get_cache_connection():
    return init_cache(**cache_dsl)


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
    ):
        super().__init__()
        self._bootstrap = bootstrap
        self._get_db_conn = get_db_conn
        self._release_db_conn = release_db_conn
        self._get_cache_conn = get_cache

    async def startup(self):
        if "cache" in self._bootstrap:
            self.cache = await self._get_cache_conn()

    async def __aenter__(self):
        if "db" in self._bootstrap:
            self._is_done = False
            self._conn = await self._get_db_conn()
            self._transaction = self._conn.transaction()
            await self._transaction.start()

            self.users = UserRepository(self._conn)

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
