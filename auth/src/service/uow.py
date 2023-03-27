# from __future__ import annotations
# import abc
# from sqlalchemy import create_engine
from src.adapters.db import get_conn_pool
from src.core.config import db_dsl
from src.adapters import repository


conn_pool = get_conn_pool(**db_dsl)

async def init_conn_func():
    return await pool.acquire()

async def release_conn_func(conn):
    return await pool.release(conn)


class AbstractUnitOfWork(abc.ABC):
    def __init__(self):
        self._messages = []

    def __enter__(self):
        return self

    def __exit__(self, *args):
        await self.rollback()

    @abc.abstractmethod
    def commit(self):
        raise NotImplementedError

    @abc.abstractmethod
    def rollback(self):
        raise NotImplementedError

    def push_message(self, message):
        self._messages.append(message)

    def collect_new_messages(self):
        messages = self._messages[:]
        self._messages = []
        return messages


class UnitOfWork():
    def __init__(self, init_conn=init_conn_func, release_conn=release_conn_func):
        super().__init__()
        self._init_conn = init_conn_func
        self._release_conn = release_conn_func

    def __enter__(self):
        self._conn = self._init_conn()
        self._transaction = connection.transaction()
        await self._transaction.start()

        self.products = repository.UserRepository()

        return self

    def __exit__(self, *args):
        super().__exit__()
        await self._release_conn(self._conn)

    def commit(self):
        await self._transaction.commit()

    def rollback(self):
        await self._transaction.rollback()
