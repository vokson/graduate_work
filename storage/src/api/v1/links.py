from uuid import UUID

from src.api.transformers import transform_command_result
from src.api.v1 import schemes
from src.api.v1.codes import collect_reponses
from src.domain import commands
from src.domain.models import CdnServer
from src.service.messagebus import get_message_bus
from src.api.decorators import auth

from fastapi import APIRouter, Depends, Header, Request, Response, status


router = APIRouter()
bus = get_message_bus()


@router.post(
    "/upload/",
    responses=collect_reponses(),
    status_code=status.HTTP_200_OK,
    summary="Получение ссылки для загрузки файлв",
)
@auth(permissions=["can_upload_file"])
async def get_upload_link(
    body: schemes.UploadLinkRequest,
) -> schemes.LinkResponse:
    return transform_command_result(
        await bus.handle(
            commands.GetUploadLink(
                id=body.id,
                name=body.name,
                size=body.size
            )
        )
    )

