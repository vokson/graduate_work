from uuid import UUID

from fastapi import APIRouter, Depends, status
from src.api.decorators import auth
from src.api.dependables import get_bus
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
    summary="Получение данных CDN серверов",
)
@auth(permissions=["can_view_cdnserver"])
async def get_servers(
    bus: MessageBus = Depends(get_bus()),
) -> list[schemes.CdnServerResponse]:
    return transform_command_result(
        await bus.handle(commands.GetManyCdnServers())
    )


@router.post(
    "/",
    responses=collect_reponses(),
    status_code=status.HTTP_201_CREATED,
    summary="Добавление CDN сервера",
)
@auth(permissions=["can_add_cdnserver"])
async def add_server(
    body: schemes.CdnServerRequest,
    bus: MessageBus = Depends(get_bus()),
) -> schemes.CdnServerResponse:
    return transform_command_result(
        await bus.handle(commands.CreateCdnServer(**body.dict()))
    )


@router.put(
    "/{server_id}/",
    responses=collect_reponses(),
    status_code=status.HTTP_200_OK,
    summary="Изменение CDN сервера",
)
@auth(permissions=["can_update_cdnserver"])
async def update_server(
    server_id: UUID,
    body: schemes.CdnServerRequest,
    bus: MessageBus = Depends(get_bus()),
) -> schemes.CdnServerResponse:
    return transform_command_result(
        await bus.handle(commands.UpdateCdnServer(id=server_id, **body.dict()))
    )


@router.delete(
    "/{server_id}/",
    responses=collect_reponses(),
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Удаление CDN сервера",
)
@auth(permissions=["can_delete_cdnserver"])
async def delete_server(
    server_id: UUID,
    bus: MessageBus = Depends(get_bus()),
):
    return transform_command_result(
        await bus.handle(commands.DeleteCdnServer(id=server_id))
    )
