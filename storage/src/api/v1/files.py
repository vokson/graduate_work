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


@router.get(
    "/",
    responses=collect_reponses(),
    status_code=status.HTTP_200_OK,
    summary="Получение данных файлов",
)
@auth(permissions=["can_view_file"])
async def get_many() -> list[schemes.FileResponse]:
    return transform_command_result(
        await bus.handle(
            commands.GetManyFiles()
        )
    )

