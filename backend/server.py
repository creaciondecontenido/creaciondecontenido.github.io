from fastapi import FastAPI, APIRouter, Request
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware
from slowapi.util import get_remote_address
import os
import logging
import re
import time
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, field_validator
from collections import defaultdict, deque
from typing import List
import uuid
from datetime import datetime, timezone
import uvicorn


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'test_database')]

SQLI_PATTERN = re.compile(r"(\b(select|insert|update|delete|drop|alter|truncate|union|exec)\b|--|;)", re.IGNORECASE)
SCRIPT_PATTERN = re.compile(r"<\s*script\b", re.IGNORECASE)
HTML_TAG_PATTERN = re.compile(r"<[^>]+>")
ALLOWED_TEXT_PATTERN = re.compile(r"^[a-zA-Z0-9\s\-_.@]{1,120}$")
SENSITIVE_ENDPOINT_LIMIT = 10
RATE_WINDOW_SECONDS = 60
sensitive_request_log = defaultdict(deque)


def validate_and_sanitize_text(value: str) -> str:
    cleaned = value.strip()
    if not cleaned:
        raise ValueError("Input cannot be empty")
    if SQLI_PATTERN.search(cleaned):
        raise ValueError("Potentially unsafe SQL-like input detected")
    if SCRIPT_PATTERN.search(cleaned) or HTML_TAG_PATTERN.search(cleaned):
        raise ValueError("HTML or script content is not allowed")
    if not ALLOWED_TEXT_PATTERN.fullmatch(cleaned):
        raise ValueError("Input contains unsupported characters")
    return cleaned

app = FastAPI()
api_router = APIRouter(prefix="/api")
limiter = Limiter(key_func=get_remote_address, default_limits=["100/minute"])
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.add_middleware(SlowAPIMiddleware)


class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class StatusCheckCreate(BaseModel):
    client_name: str

    @field_validator("client_name")
    @classmethod
    def validate_client_name(cls, value: str) -> str:
        return validate_and_sanitize_text(value)


@api_router.get("/")
async def root():
    return {"message": "Hello World"}


@api_router.post("/status", response_model=StatusCheck)
@limiter.limit("10/minute")
async def create_status_check(request: Request, input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)

    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()

    _ = await db.status_checks.insert_one(doc)
    return status_obj


@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks(request: Request):
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)

    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])

    return status_checks


app.include_router(api_router)


@app.middleware("http")
async def enforce_sensitive_rate_limit(request: Request, call_next):
    if request.url.path == "/api/status" and request.method.upper() == "POST":
        client_ip = request.client.host if request.client else "unknown"
        now = time.time()
        attempts = sensitive_request_log[client_ip]

        while attempts and now - attempts[0] > RATE_WINDOW_SECONDS:
            attempts.popleft()

        if len(attempts) >= SENSITIVE_ENDPOINT_LIMIT:
            return JSONResponse(status_code=429, content={"detail": "Rate limit exceeded: 10 requests per minute"})

        attempts.append(now)

    return await call_next(request)


@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Content-Security-Policy"] = "default-src 'self'"
    return response


@app.exception_handler(ValueError)
async def value_error_handler(_: Request, exc: ValueError):
    return JSONResponse(status_code=400, content={"detail": str(exc)})


cors_origins_env = os.environ.get('CORS_ORIGINS', 'http://localhost:3001')
allow_origins = [origin.strip() for origin in cors_origins_env.split(',') if origin.strip() and origin.strip() != '*']
if not allow_origins:
    allow_origins = ['http://localhost:3001']

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=allow_origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()


if __name__ == "__main__":
    port = int(os.environ.get("PORT", os.environ.get("BACKEND_PORT", "8000")))
    uvicorn.run("server:app", host="0.0.0.0", port=port, reload=False)
