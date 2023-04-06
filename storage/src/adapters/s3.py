"""Модуль для работы с S3 Storage."""
import asyncio
import logging
from abc import ABC, abstractmethod
from contextlib import asynccontextmanager
from typing import Callable

from miniopy_async import Minio
from miniopy_async.notificationconfig import NotificationConfig, QueueConfig
from src.tools.decorators import backoff


logger = logging.getLogger(__name__)


class AbstractS3Storage(ABC):
    @abstractmethod
    async def startup(self, *args, **kwargs):
        pass

    @abstractmethod
    async def shutdown(self):
        pass

    @abstractmethod
    async def get_upload_url(self, object_name: str) -> str:
        pass

    # @abstractmethod
    # async def get_created_events(self):
    #     pass


class MinioS3Storage(AbstractS3Storage):
    def __init__(self, bucket: str, name: str):
        super().__init__()
        self.name = name
        self._bucket = bucket

    @backoff(max_attempt_count=3)
    async def startup(self, *args, **kwargs):
        self._conn = Minio(*args, **kwargs)

        if not await self._conn.bucket_exists(self._bucket):
            await self._conn.make_bucket(self._bucket)

        config = NotificationConfig(
            queue_config_list=[
                QueueConfig(
                    "arn:minio:sqs::RABBIT:amqp",
                    ["s3:ObjectCreated:*", "s3:ObjectRemoved:*"],
                ),
            ],
        )

        await self._conn.set_bucket_notification(self._bucket, config)

    async def shutdown(self):
        pass

    async def get_upload_url(self, object_name: str) -> str:
        return await self._get_presigned_url("PUT", object_name)

    async def _get_presigned_url(self, method: str, object_name: str) -> str:
        return await self._conn.get_presigned_url(
            method,
            self._bucket,
            object_name,
            response_headers={"response-content-type": "application/json"},
        )

    # async def get_created_events(self):
    #     logger.info('Start to listen events..')
    #     async def agen():
    #         for x in range(5):
    #             yield x
    #             await asyncio.sleep(1)

    #     async for x in agen():
    #         yield x

    #     logger.info('Finish to listen events.')

    # async def get_created_events(self):
    #     logger.info('Start to listen events..')
    #     events = await self._conn.listen_bucket_notification(
    #         self._bucket, events=["s3:ObjectCreated:*"]
    #     )

    #     async for event in events:
    #         for f in event['Records']:
    #             yield f['s3']['object']['key']
    #     logger.info('Finish to listen events.')


def get_s3_conn(bucket: str, name: str) -> AbstractS3Storage:
    return MinioS3Storage(bucket, name)


class StoragePool:
    def __init__(self, bucket: str, get_dsl: Callable[[str, int], dict]):
        self._bucket = bucket
        self._get_dsl = get_dsl
        self._storages = {}

    async def shutdown(self):
        for storage in self._storages.values():
            await storage.shutdown()

    async def get(self, name: str, host: str, port: int) -> AbstractS3Storage:
        if name not in self._storages:
            storage = get_s3_conn(self._bucket, name)
            dsl = self._get_dsl(host, port)
            await storage.startup(**dsl)
            self._storages[name] = storage

        return self._storages[name]


pool: StoragePool | None = None


async def init_s3_pool(
    bucket: str, get_dsl_func: Callable[[str, int], dict]
) -> StoragePool:
    global pool

    if not pool:
        logger.info(f"Initialization of S3 connection pool ..")
        pool = StoragePool(bucket, get_dsl_func)
        logger.info(f"S3 connection pool has been initialized.")

    return pool


async def close_s3_pool():
    global pool
    if pool:
        logger.info(f"Closing S3 connection pool ..")
        await pool.shutdown()
        logger.info(f"S3 connection pool has been closed.")
