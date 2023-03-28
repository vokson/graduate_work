from src.api.transformers import transform_command_result
from src.api.v1.schemes import RegisterUserRequest
from src.domain import commands
# from src.api.decorators import auth, trace
from src.domain.models.user import User
from src.service.messagebus import get_message_bus

from fastapi import APIRouter, Response, status


router = APIRouter()
bus = get_message_bus()


@router.post(
    "/register",
    response_model=User,
    status_code=status.HTTP_201_CREATED,
    summary="Регистрация пользователя",
)
# @rate_limit()
async def register(
    credentials: RegisterUserRequest,
)-> User:

    results = await bus.handle(
        commands.CreateUser(
            username=credentials.username, password=credentials.password,
            email=credentials.email, first_name=credentials.first_name, last_name=credentials.last_name
        )
    )

    return transform_command_result(results)
