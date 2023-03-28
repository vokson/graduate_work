from src.api.transformers import transform_command_result
from src.api.v1 import schemes
from src.domain import commands
# from src.api.decorators import auth, trace
from src.domain.models import User
from src.service.messagebus import get_message_bus

from fastapi import APIRouter, Response, status


router = APIRouter()
bus = get_message_bus()


@router.post(
    "/register",
    response_model=schemes.RegisterUserResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Регистрация пользователя",
)
# @rate_limit()
async def register(
    credentials: schemes.RegisterUserRequest,
) -> schemes.RegisterUserResponse:
    results = await bus.handle(
        commands.CreateUser(
            username=credentials.username,
            password=credentials.password,
            email=credentials.email,
            first_name=credentials.first_name,
            last_name=credentials.last_name,
        )
    )

    return transform_command_result(results)


@router.post(
    "/login",
    response_model=schemes.LoginByCredentialsResponse,
    status_code=status.HTTP_200_OK,
    summary="Авторизация пользователя",
)
# @rate_limit()
async def login(
    credentials: schemes.LoginByCredentialsRequest,
) -> schemes.LoginByCredentialsResponse:
    results = await bus.handle(
        commands.LoginByCredentials(
            username=credentials.username,
            password=credentials.password,
        )
    )

    return transform_command_result(results)
