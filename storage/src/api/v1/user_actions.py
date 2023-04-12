from uuid import UUID

from fastapi import APIRouter, Depends, Query, status

from src.api.decorators import auth
from src.api.dependables import extract_user_id, get_bus
from src.api.transformers import transform_command_result
from src.api.v1 import schemes
from src.api.v1.codes import collect_reponses
from src.domain import commands
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
    page_num: int = Query(1, gt=0),
    page_size: int = Query(20, gt=0, le=1000),
    user_id: UUID = Depends(extract_user_id()),
    bus: MessageBus = Depends(get_bus()),
) -> schemes.UserActionResponse:
    return transform_command_result(
        await bus.handle(
            commands.GetUserActions(
                user_id=user_id,
                limit=page_size,
                offset=(page_num - 1) * page_size,
            ),
        ),
    )
