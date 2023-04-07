from uuid import UUID

from fastapi import APIRouter, Depends, Header, Request, Response, status
from src.api.decorators import auth
from src.api.dependables import extract_user_id, get_bus, get_ip
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
    summary="Получение данных файлов",
)
@auth(permissions=["can_view_file"])
async def get_many(
    user_id: UUID = Depends(extract_user_id()),
    bus: MessageBus = Depends(get_bus()),
) -> list[schemes.FileResponse]:
    return transform_command_result(
        await bus.handle(commands.GetManyFiles(user_id=user_id))
    )


@router.post(
    "/upload/",
    responses=collect_reponses(),
    status_code=status.HTTP_200_OK,
    summary="Получение ссылки для загрузки файлв",
)
@auth(permissions=["can_upload_file"])
async def get_upload_link(
    body: schemes.UploadLinkRequest,
    user_id: UUID = Depends(extract_user_id()),
    ip: str = Depends(get_ip()),
    bus: MessageBus = Depends(get_bus()),
) -> schemes.LinkResponse:
    return transform_command_result(
        await bus.handle(
            commands.GetUploadLink(
                name=body.name, size=body.size, user_id=user_id, ip=ip
            )
        )
    )


@router.delete(
    "/{file_id}/",
    responses=collect_reponses(),
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Удаление файла",
)
@auth(permissions=["can_delete_file"])
async def delete(
    file_id: UUID,
    user_id: UUID = Depends(extract_user_id()),
    bus: MessageBus = Depends(get_bus()),
):
    return transform_command_result(
        await bus.handle(commands.DeleteFile(id=file_id, user_id=user_id))
    )


@router.get(
    "/{file_id}/",
    responses=collect_reponses(),
    status_code=status.HTTP_200_OK,
    summary="Получение ссылки для скачивания",
)
@auth(permissions=["can_view_file"])
async def get_download_link(
    file_id: UUID,
    ip: str = Depends(get_ip()),
    bus: MessageBus = Depends(get_bus()),
) -> schemes.LinkResponse:
    return transform_command_result(
        await bus.handle(commands.GetDownloadLink(file_id=file_id, ip=ip))
    )


@router.get(
    "/{file_id}/servers/",
    responses=collect_reponses(),
    status_code=status.HTTP_200_OK,
    summary="Получение серверов, на которых расположен файл",
)
@auth(permissions=["can_view_cdnserver"])
async def get_servers(
    file_id: UUID, bus: MessageBus = Depends(get_bus())
) -> list[schemes.CdnServerResponse]:
    return transform_command_result(
        await bus.handle(commands.GetFileServers(id=file_id))
    )
