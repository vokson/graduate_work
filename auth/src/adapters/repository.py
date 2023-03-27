import abc
from src.domain.models.base import AbstractModel
from src.domain.models.user import User


class AbstractRepository(abc.ABC):
    @abc.abstractmethod
    def add(self, batch: AbstractModel):
        raise NotImplementedError

    @abc.abstractmethod
    def get(self, reference) -> AbstractModel:
        raise NotImplementedError


class UserRepository(AbstractRepository):
    def __init__(self, conn):
        self._conn = conn

    def add(self, obj: User):
        logger.info(f'Add user: {obj.dict()}')
        # print()
        # self.session.add(batch)

    def get_by_username(self, username):
        logger.info(f'Get user with username {username}')
        # return self.session.query(model.Batch).filter_by(reference=reference).one()

    # def list(self):
    #     return self.session.query(model.Batch).all()