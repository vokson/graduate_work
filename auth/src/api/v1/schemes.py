from datetime import datetime
from typing import Optional, Union
from uuid import UUID

from pydantic import BaseModel


class RegisterUserRequest(BaseModel):
    username: str
    password: str
