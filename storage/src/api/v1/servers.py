from uuid import UUID

from fastapi import APIRouter, Depends, Header, Request, Response, status
from src.api.decorators import auth
from src.api.dependables import get_bus
from src.api.transformers import transform_command_result
from src.api.v1 import schemes
from src.api.v1.codes import collect_reponses
from src.domain import commands
from src.domain.models import CdnServer
from src.service.messagebus import MessageBus


router = APIRouter()
# bus = get_message_bus()


@router.get(
    "/",
    responses=collect_reponses(),
    status_code=status.HTTP_200_OK,
    summary="Получение данных CDN серверов",
)
@auth(permissions=["can_view_cdnserver"])
async def get_many(
    bus: MessageBus = Depends(get_bus()),
) -> list[schemes.CdnServerResponse]:
    return transform_command_result(
        await bus.handle(commands.GetManyCdnServers())
    )
