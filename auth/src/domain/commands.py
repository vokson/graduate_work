from pydantic import BaseModel


class Command(BaseModel):
    pass


class CreateUser(Command):
    username: str
    password: str
    email: str
    first_name: str
    last_name: str


class LoginByCredentials(Command):
    username: str
    password: str
