from typing import Any, Callable, Coroutine

import jwt
from faker import Faker
from fastapi import Header, Request

from src.core.config import settings
from src.service.messagebus import get_message_bus

fake = Faker()


def extract_user_id():
    async def inner(
        authorization: str = Header(),
    ):
        #  Здесь не может быть исключений, потому что токен на данный момент
        #  уже проверен через сервис Auth
        encoded_token = authorization.split()[1]
        payload = jwt.decode(
            encoded_token,
            options={"verify_signature": False},
        )
        return payload["user_id"]

    return inner


def get_ip() -> Callable[[Request], Coroutine[Any, Any, str]]:
    async def inner(request: Request) -> str:
        host = None

        if settings.geo.use_real_ip and request.client:
            host = request.client.host

        return host if host else fake.ipv4()

    return inner


def get_bus():
    async def inner():
        return await get_message_bus(["db", "geoip", "s3", "publisher"])

    return inner
