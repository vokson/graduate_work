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
    def shutdown(self):
        pass

    # @abstractmethod
    # def make_bucket(self, name: str):
    #     pass

    # @abstractmethod
    # def bucket_exists(self, name: str) -> bool:
    #     pass

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

    def shutdown(self):
        pass

    # def make_bucket(self, name: str):
    #     self._conn.make_bucket(name)

    # def bucket_exists(self, name: str) -> bool:
    #     return self._conn.bucket_exists(name)

    def get_upload_url(self, object_name: str) -> str:
        return self._get_presigned_url('PUT', object_name)

    def _get_presigned_url(self, method: str, object_name: str) -> str:
        return self._conn.get_presigned_url(method, self._bucket, object_name, response_headers={"response-content-type": "application/json"},)


async def get_s3_conn(bucket, **dsl):
    s3 = MinioS3Storage()
    await s3.startup(bucket, **dsl)
    yield s3
    s3.shutdown()
