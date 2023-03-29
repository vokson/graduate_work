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


@router.get(
    "/me",
    response_model=schemes.UserResponse,
    responses=collect_reponses(),
    status_code=status.HTTP_200_OK,
    summary="Получение собственных данных пользователя",
)
async def get_user_by_id(
    commons: dict = Depends(required_permissions_dependable([])),
) -> schemes.UserResponse:
    return transform_command_result(
        await bus.handle(
            commands.GetUserById(
                user_id=commons["user_id"],
            )
        )
    )
