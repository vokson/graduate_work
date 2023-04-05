from uuid import UUID

from fastapi import APIRouter, Depends, Header, Request, Response, status
from src.api.decorators import auth
from src.api.dependables import extract_user_id, get_ip, get_bus
from src.api.transformers import transform_command_result
from src.api.v1 import schemes
from src.api.v1.codes import collect_reponses
from src.domain import commands
from src.domain.models import CdnServer
from src.service.messagebus import MessageBus


router = APIRouter()


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
    bus: MessageBus = Depends(get_bus()) 
) -> schemes.LinkResponse:
    return transform_command_result(
        await bus.handle(
            commands.GetUploadLink(
                name=body.name, size=body.size, user_id=user_id, ip=ip
            )
        )
    )
