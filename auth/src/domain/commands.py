from pydantic import BaseModel


class Command(BaseModel):
    pass


class CreateUser(Command):
    username: str
    password: str
