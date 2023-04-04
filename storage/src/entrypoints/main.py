import os
import sys

from fastapi import FastAPI, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import ORJSONResponse
from src.api.middlewares import CustomRequestMiddleware
from starlette.exceptions import HTTPException as StarletteHTTPException


BASE_DIR = os.path.dirname(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
)
sys.path.append(BASE_DIR)


from src.api.v1 import files, links, servers
from src.core.config import settings
from src.service.messagebus import MessageBus
from src.service.uow import UnitOfWork


app = FastAPI(
    title="Auth API",
    docs_url="/storage/api/openapi",
    openapi_url="/storage/api/openapi.json",
    default_response_class=ORJSONResponse,
)

# For DEV
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
        status_code=exc.status_code, content={"error": exc.detail}
    )


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc):
    return ORJSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content={"error": "Request.Error.Validation", "detail": str(exc)},
    )


app.include_router(
    servers.router, prefix="/storage/api/v1/servers", tags=["CDN Servers"]
)
app.include_router(
    files.router, prefix="/storage/api/v1/files", tags=["Files"]
)
app.include_router(
    links.router, prefix="/storage/api/v1/links", tags=["Links"]
)
