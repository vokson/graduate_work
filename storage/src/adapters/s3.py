"""Модуль для работы с S3 Storage."""
from abc import ABC, abstractmethod
from contextlib import asynccontextmanager

from minio import Minio
from src.tools.decorators import backoff


class AbstractS3Storage(ABC):
    @abstractmethod
    async def startup(self, *args, **kwargs):
        pass

    @abstractmethod
    async def shutdown(self):
        pass

    @abstractmethod
    def get_upload_url(self, bucket_name: str, object_name: str) -> str:
        pass


class MinioS3Storage(AbstractS3Storage):
    @backoff()
    async def startup(self, bucket, *args, **kwargs):
        self._bucket = bucket
        self._conn = Minio(*args, **kwargs)

        if not self._conn.bucket_exists(bucket):
            self._conn.make_bucket(bucket)

    async def shutdown(self):
        pass

    def get_upload_url(self, object_name: str) -> str:
        return self._get_presigned_url("PUT", object_name)

    def _get_presigned_url(self, method: str, object_name: str) -> str:
        return self._conn.get_presigned_url(
            method,
            self._bucket,
            object_name,
            response_headers={"response-content-type": "application/json"},
        )


async def get_s3_conn(bucket, **dsl):
    s3 = MinioS3Storage()
    await s3.startup(bucket, **dsl)
    yield s3
    await s3.shutdown()
