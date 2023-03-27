from datetime import datetime
from uuid import UUID

from src.models.base import AbstractIdCreatedMofidifiedModel


class User(AbstractIdCreatedMofidifiedModel):
    username: str
    password: str