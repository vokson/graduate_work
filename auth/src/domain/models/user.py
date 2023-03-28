from datetime import datetime
from uuid import UUID

from src.domain.models.base import AbstractIdCreatedUpdatedModel


class User(AbstractIdCreatedUpdatedModel):
    username: str
    password: str
    email: str
    first_name: str
    last_name: str
    is_superuser: bool
