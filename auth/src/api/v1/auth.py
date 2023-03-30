from uuid import UUID

from src.api.dependables import required_permissions_dependable
from src.api.transformers import transform_command_result
from src.api.v1 import schemes
from src.api.v1.codes import collect_reponses
from src.domain import commands
from src.domain.models import User
from src.service.messagebus import get_message_bus

from fastapi import APIRouter, Depends, Header, Request, Response, status


router = APIRouter()
bus = get_message_bus()


@router.post(
    "/register",
    response_model=schemes.UserResponse,
    responses=collect_reponses(),
    status_code=status.HTTP_201_CREATED,
    summary="Регистрация пользователя",
)
# @rate_limit()
async def register(
    credentials: schemes.RegisterUserRequest,
) -> schemes.UserResponse:
    return transform_command_result(
        await bus.handle(
            commands.CreateUser(
                username=credentials.username,
                password=credentials.password,
                email=credentials.email,
                first_name=credentials.first_name,
                last_name=credentials.last_name,
            )
        )
    )


@router.post(
    "/login/credentials",
    response_model=schemes.LoginByCredentialsResponse,
    responses=collect_reponses(),
    status_code=status.HTTP_200_OK,
    summary="Авторизация пользователя",
)
# @rate_limit()
async def login(
    credentials: schemes.LoginByCredentialsRequest,
) -> schemes.LoginByCredentialsResponse:
    return transform_command_result(
        await bus.handle(
            commands.LoginByCredentials(
                username=credentials.username,
                password=credentials.password,
            )
        )
    )


@router.post(
    "/token/refresh",
    response_model=schemes.LoginByCredentialsResponse,
    responses=collect_reponses(),
    status_code=status.HTTP_200_OK,
    summary="Обновление токена",
)
# @rate_limit()
async def refresh_tokens(
    commons: dict = Depends(required_permissions_dependable([], False))
) -> schemes.RefreshTokensResponse:
    return transform_command_result(
        await bus.handle(commands.RefreshTokens(user_id=commons["user_id"]))
    )


@router.post(
    "/token/verify",
    response_model=schemes.EmptyResponse,
    responses=collect_reponses(),
    status_code=status.HTTP_200_OK,
    summary="Проверка токена",
)
# @rate_limit()
async def verify_token(
    body: schemes.VerifyTokenRequest,
    commons: dict = Depends(required_permissions_dependable([])),
) -> schemes.EmptyResponse:
    return transform_command_result(
        await bus.handle(
            commands.VerifyToken(
                is_superuser=commons["is_superuser"],
                required_permissions=body.permissions,
                existing_permissions=commons["permissions"],
            )
        )
    )
