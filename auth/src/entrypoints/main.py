import os
import sys

from fastapi import FastAPI, status
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import ORJSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException

from src.adapters.cache import close_cache
from src.adapters.db import close_db

BASE_DIR = os.path.dirname(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
)
sys.path.append(BASE_DIR)


from src.api.v1 import auth, users
from src.core.config import settings

app = FastAPI(
    title="Auth API",
    docs_url="/users/api/openapi",
    openapi_url="/users/api/openapi.json",
    default_response_class=ORJSONResponse,
)

if settings.debug:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )


@app.on_event("shutdown")
async def shutdown_event():
    await close_db()
    await close_cache()


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
    auth.router,
    prefix="/users/api/v1/auth",
    tags=["Authentication"],
)
app.include_router(users.router, prefix="/users/api/v1/users", tags=["Users"])
