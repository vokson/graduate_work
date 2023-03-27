from datetime import datetime
from typing import Optional, Union
from uuid import UUID

from pydantic import BaseModel


class Event(BaseModel):
    event: str
    content: Optional[Union[dict, list, UUID]]
    updated_at: datetime