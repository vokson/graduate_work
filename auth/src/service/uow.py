# from __future__ import annotations
from abc import ABC, abstractmethod

# from sqlalchemy import create_engine
from src.adapters import repository
from src.adapters.db import get_conn_pool
from src.core.config import db_dsl


conn_pool = None

async def pool_factory():
    print('HERE 1')
    global conn_pool

    if not conn_pool:
        conn_pool = await anext(get_conn_pool(**db_dsl))
        print('------------------------')

    print('HERE 2')
    return conn_pool



async def init_conn_func():
    pool = await pool_factory()
    print('*******************')
    print(pool)
    return await pool.acquire()


async def release_conn_func(conn):
    pool = await pool_factory()
    return await pool.release(conn)


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
        self, init_conn=init_conn_func, release_conn=release_conn_func
    ):
        super().__init__()
        self._init_conn = init_conn_func
        self._release_conn = release_conn_func

    async def __aenter__(self):
        print(self._init_conn)
        self._conn = await self._init_conn()
        self._transaction = self._conn.transaction()
        await self._transaction.start()

        self.users = repository.UserRepository(self._conn)

        return self

    async def __aexit__(self, *args):
        super().__aexit__()
        await self._release_conn(self._conn)

    async def commit(self):
        await self._transaction.commit()

    async def rollback(self):
        await self._transaction.rollback()
