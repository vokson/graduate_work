import os
import sys

from starlette.exceptions import HTTPException as StarletteHTTPException

from fastapi import FastAPI, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import ORJSONResponse
from fastapi.middleware.cors import CORSMiddleware
from src.api.middlewares import CustomRequestMiddleware


BASE_DIR = os.path.dirname(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
)
sys.path.append(BASE_DIR)


from src.api.v1 import servers, files
from src.core.config import settings
from src.service.messagebus import MessageBus
from src.service.uow import UnitOfWork


app = FastAPI(
    title="Auth API",
    docs_url="/storage/api/openapi",
    openapi_url="/storage/api/openapi.json",
    default_response_class=ORJSONResponse,
)

origins = [
    "http://localhost",
    "http://localhost:8080",
    "http://10.95.27.163",
    "http://10.95.27.163:8080",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
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


app.include_router(servers.router, prefix="/storage/api/v1/servers", tags=["CDN Servers"])
app.include_router(files.router, prefix="/storage/api/v1/files", tags=["Files"])
