from fastapi import APIRouter, Response, status

from src.api.decorators import auth, trace
from src.models.user import User
from src.domain import commands
from src.entrypoints.auth_app import bus

router = APIRouter()


@router.post(
    "/register",
    response_model=Event,
    status_code=status.HTTP_201_CREATED,
    summary="Регистрация пользователя",
)
# @exception_wrapper("user")
# @rate_limit()
async def register(
    username: str,
    password: str,
    service: AuthService = Depends(get_auth_service),
) -> User:
    return bus(comm.CreateUser(username=username, password=password))
