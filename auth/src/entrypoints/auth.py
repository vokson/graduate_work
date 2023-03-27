import os
import sys

from fastapi import FastAPI
from fastapi.responses import ORJSONResponse


BASE_DIR = os.path.dirname(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
)
sys.path.append(BASE_DIR)


from src.api.v1 import auth
from src.core.config import settings
from src.service.messagebus import MessageBus
from src.service.uow import UnitOfWork


app = FastAPI(
    title="Auth API",
    docs_url="/api/openapi",
    openapi_url="/api/openapi.json",
    default_response_class=ORJSONResponse,
)

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
