from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.budget_routes import router as budget_router
from app.api.report_routes import router as report_router
from app.core.config import settings
from app.core.database import Base, engine
from app.services.scheduler import start_scheduler, stop_scheduler
import app.models  # registers ORM models


from app.api.auth_routes import router as auth_router
from starlette.middleware.sessions import SessionMiddleware

@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    start_scheduler()
    yield
    stop_scheduler()


app = FastAPI(title="My Custom Budget API", version="1.0.0", lifespan=lifespan)
app.add_middleware(SessionMiddleware, secret_key=settings.auth_secret_key)
app.add_middleware(CORSMiddleware, allow_origins=settings.cors_origin_list, allow_credentials=True, allow_methods=["*"], allow_headers=["*"])
app.include_router(auth_router)
app.include_router(budget_router)
app.include_router(report_router)


@app.get("/health")
def health():
    return {"status": "ok"}
