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
# @exception_wrapper("user")
# @rate_limit()
async def register(
    credentials: RegisterUserRequest,
) -> User:
    return await bus.handle(
        commands.CreateUser(
            username=credentials.username, password=credentials.password
        )
    )
