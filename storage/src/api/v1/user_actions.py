from uuid import UUID

from fastapi import APIRouter, Depends, Header, Request, Response, status
from src.api.decorators import auth
from src.api.dependables import get_bus, extract_user_id
from src.api.transformers import transform_command_result
from src.api.v1 import schemes
from src.api.v1.codes import collect_reponses
from src.domain import commands
from src.domain.models import CdnServer
from src.service.messagebus import MessageBus


router = APIRouter()


@router.get(
    "/",
    responses=collect_reponses(),
    status_code=status.HTTP_200_OK,
    summary="Получение действий пользователя",
)
@auth(permissions=[])
async def get_many(
    user_id: UUID = Depends(extract_user_id()),
    bus: MessageBus = Depends(get_bus()),
) -> list[schemes.UserActionResponse]:
    return transform_command_result(
        await bus.handle(commands.GetUserActions(user_id=user_id))
    )
