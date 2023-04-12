import os
import sys

from fastapi import FastAPI, status
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import ORJSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException

from src.adapters.cache import close_cache
from src.adapters.db import close_db
from src.adapters.s3 import close_s3_pool
from src.api.middlewares import CustomRequestMiddleware

BASE_DIR = os.path.dirname(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
)
sys.path.append(BASE_DIR)


from src.api.v1 import files, servers, user_actions
from src.core.config import settings

app = FastAPI(
    title="Auth API",
    docs_url="/storage/api/openapi",
    openapi_url="/storage/api/openapi.json",
    default_response_class=ORJSONResponse,
)


@app.on_event("shutdown")
async def shutdown_event():
    await close_db()
    await close_cache()
    await close_s3_pool()


if settings.debug:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

app.add_middleware(CustomRequestMiddleware)


@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request, exc):
    return ORJSONResponse(
        status_code=exc.status_code,
        content={"error": exc.detail},
    )


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc):
    return ORJSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content={"error": "Request.Error.Validation", "detail": str(exc)},
    )


app.include_router(
    servers.router,
    prefix="/storage/api/v1/servers",
    tags=["CDN Servers"],
)
app.include_router(
    files.router,
    prefix="/storage/api/v1/files",
    tags=["Files"],
)
app.include_router(
    user_actions.router,
    prefix="/storage/api/v1/actions",
    tags=["User Actions"],
)
