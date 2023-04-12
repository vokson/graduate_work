from datetime import datetime, timedelta
from uuid import UUID

from fastapi import APIRouter, Depends, Header, Request, Response, status
from src.api.decorators import auth
from src.api.dependables import extract_user_id, get_bus, get_ip
from src.api.transformers import transform_command_result
from src.api.v1 import schemes
from src.api.v1.codes import collect_reponses
from src.core.config import tz_now
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
    summary="Получение ссылки для загрузки файла",
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


@router.put(
    "/{file_id}/",
    responses=collect_reponses(),
    status_code=status.HTTP_200_OK,
    summary="Переименование файла",
)
@auth(permissions=["can_rename_file"])
async def rename_file(
    file_id: UUID,
    body: schemes.RenameFileRequest,
    user_id: UUID = Depends(extract_user_id()),
    bus: MessageBus = Depends(get_bus()),
) -> schemes.FileResponse:
    return transform_command_result(
        await bus.handle(
            commands.RenameFile(id=file_id, user_id=user_id, name=body.name)
        )
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


@router.post(
    "/{file_id}/links/",
    responses=collect_reponses(),
    status_code=status.HTTP_201_CREATED,
    summary="Добавление общедоступной ссылки на файл",
)
@auth(permissions=["can_add_filesharelink"])
async def create_file_share_link(
    file_id: UUID,
    body: schemes.AddFileShareLinkRequest,
    user_id: UUID = Depends(extract_user_id()),
    bus: MessageBus = Depends(get_bus()),
) -> schemes.FileShareLinkResponse:
    return transform_command_result(
        await bus.handle(
            commands.CreateFileShareLink(
                file_id=file_id,
                user_id=user_id,
                expire_at=timedelta(seconds=body.lifetime) + tz_now()
                if body.lifetime
                else None,
                password=body.password,
            )
        )
    )


@router.get(
    "/{file_id}/links/",
    responses=collect_reponses(),
    status_code=status.HTTP_200_OK,
    summary="Получение общедоступных ссылок на файл",
)
@auth(permissions=["can_view_filesharelink"])
async def get_file_share_links(
    file_id: UUID,
    user_id: UUID = Depends(extract_user_id()),
    bus: MessageBus = Depends(get_bus()),
) -> list[schemes.FileShareLinkResponse]:
    return transform_command_result(
        await bus.handle(
            commands.GetFileShareLinks(
                user_id=user_id,
                file_id=file_id,
            )
        )
    )


@router.delete(
    "/{file_id}/links/{link_id}/",
    responses=collect_reponses(),
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Удаление общедоступной ссылки на файл",
)
@auth(permissions=["can_delete_filesharelink"])
async def delete_file_share_link(
    file_id: UUID,
    link_id: UUID,
    user_id: UUID = Depends(extract_user_id()),
    bus: MessageBus = Depends(get_bus()),
):
    return transform_command_result(
        await bus.handle(
            commands.DeleteFileShareLink(
                user_id=user_id, file_id=file_id, link_id=link_id
            )
        )
    )


@router.get(
    "/{file_id}/links/{link_id}/",
    responses=collect_reponses(),
    status_code=status.HTTP_200_OK,
    summary="Получение общедоступной ссылки на файл",
)
@auth(permissions=[])
async def get_file_share_link(
    file_id: UUID,
    link_id: UUID,
    bus: MessageBus = Depends(get_bus()),
) -> schemes.FileShareLinkResponse:
    return transform_command_result(
        await bus.handle(
            commands.GetFileShareLink(
                file_id=file_id,
                link_id=link_id,
            )
        )
    )


@router.post(
    "/{file_id}/links/{link_id}/",
    responses=collect_reponses(),
    status_code=status.HTTP_200_OK,
    summary="Получение ссылки для скачивания общедоступной ссылке",
)
@auth(permissions=[])
async def get_download_link_by_file_share_link(
    file_id: UUID,
    link_id: UUID,
    body: schemes.DownloadByShareLinkRequest,
    ip: str = Depends(get_ip()),
    bus: MessageBus = Depends(get_bus()),
) -> schemes.LinkResponse:
    results = await bus.handle(
        commands.ValidateFileShareLink(
            file_id=file_id, link_id=link_id, password=body.password
        )
    )

    if results.is_first_result_negative:
        return transform_command_result(results)

    return transform_command_result(
        await bus.handle(commands.GetDownloadLink(file_id=file_id, ip=ip))
    )
