import jwt
from faker import Faker
from fastapi import Header, Request
from src.api.transformers import transform_command_result
from src.core.config import settings
from src.domain import commands
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
            encoded_token, options={"verify_signature": False}
        )
        return payload["user_id"]

    return inner


def get_ip():
    async def inner(request: Request):
        return request.client.host if settings.geo.use_real_ip else fake.ipv4()

    return inner


def get_bus():
    async def inner():
        return await get_message_bus(["db", "geoip", "s3"])

    return inner
