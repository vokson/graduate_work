import logging
from abc import ABC, abstractmethod

from src.domain.models.base import AbstractModel
from src.domain.models.user import User


logger = logging.getLogger(__name__)


class AbstractRepository(ABC):
    @abstractmethod
    async def add(self, obj: AbstractModel):
        raise NotImplementedError

    # @abstractmethod
    # async def get_by_username(self, reference) -> AbstractModel:
    #     raise NotImplementedError


class UserRepository(AbstractRepository):
    def __init__(self, conn):
        self._conn = conn

    async def add(self, obj: User):
        logger.info(f"Add user: {obj.dict()}")
        # print()
        # self.session.add(batch)

    async def get_by_username(self, username):
        logger.info(f"Get user with username {username}")
        # return self.session.query(model.Batch).filter_by(reference=reference).one()

    # def list(self):
    #     return self.session.query(model.Batch).all()
