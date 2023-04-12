from fastapi import APIRouter, Depends, status

from src.api.dependables import get_bus, required_permissions_dependable
from src.api.transformers import transform_command_result
from src.api.v1 import schemes
from src.api.v1.codes import collect_reponses
from src.domain import commands
from src.service.messagebus import MessageBus

router = APIRouter()


@router.get(
    "/me/",
    response_model=schemes.UserResponse,
    responses=collect_reponses(),
    status_code=status.HTTP_200_OK,
    summary="Получение собственных данных пользователя",
)
async def get_user_by_id(
    commons: dict = Depends(required_permissions_dependable([])),
    bus: MessageBus = Depends(get_bus()),
) -> schemes.UserResponse:
    return transform_command_result(
        await bus.handle(
            commands.GetUserById(
                user_id=commons["user_id"],
            ),
        ),
    )
