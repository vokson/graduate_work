import uvicorn
from fastapi import FastAPI
from fastapi.responses import ORJSONResponse

from src.api.v1 import auth
from src.core.config import settings
from src.db.storages import psql
from src.service.messagebus import MessageBus
from src.service.uow import UnitOfWork

app = FastAPI(
    title="Notification API",
    docs_url="/api/openapi",
    openapi_url="/api/openapi.json",
    default_response_class=ORJSONResponse,
)

bus = MessageBus(UnitOfWork())


# @app.on_event("startup")
# async def startup():
#     await psql.startup(
#         host=settings.db.host,
#         port=settings.db.port,
#         user=settings.db.user,
#         database=settings.db.dbname,
#         password=settings.db.password,
#     )


# @app.on_event("shutdown")
# async def shutdown():
#     await psql.shutdown()


app.include_router(auth.router, prefix="/api/v1/auth", tags=["Authentication"])

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",  # noqa: S104
        port=8000,
    )