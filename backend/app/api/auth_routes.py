from fastapi import APIRouter, HTTPException, Request, Response, status
from app.core.config import settings

router = APIRouter(prefix="/api/auth", tags=["auth"])

LOGIN_SESSION_KEY = "admin_authenticated"


def validate_admin(username: str, password: str) -> bool:
    return username == settings.admin_username and password == settings.admin_password


def require_auth(request: Request):
    if request.session.get(LOGIN_SESSION_KEY) != True:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")
    return True


@router.post("/login")
def login(request: Request, response: Response, payload: dict):
    username = payload.get("username")
    password = payload.get("password")

    if not username or not password or not validate_admin(username, password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    request.session[LOGIN_SESSION_KEY] = True
    return {"status": "ok"}


@router.post("/logout")
def logout(request: Request, response: Response):
    request.session.clear()
    response.delete_cookie("session")
    return {"status": "ok"}


@router.get("/me")
def me(request: Request):
    require_auth(request)
    return {"username": settings.admin_username}
