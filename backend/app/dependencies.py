from dataclasses import dataclass

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError, jwt
from supabase import Client

from .config import Settings, get_settings
from .db.supabase import get_user_client

security = HTTPBearer()


@dataclass
class AuthContext:
    user_id: str
    token: str
    client: Client


def get_auth(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    settings: Settings = Depends(get_settings),
) -> AuthContext:
    """Verifies JWT, returns user_id + a Supabase client scoped to that user (for RLS)."""
    token = credentials.credentials
    try:
        payload = jwt.decode(
            token,
            settings.supabase_jwt_secret,
            algorithms=["HS256"],
            audience="authenticated",
        )
        user_id: str | None = payload.get("sub")
        if not user_id:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        )
    client = get_user_client(token, settings)
    return AuthContext(user_id=user_id, token=token, client=client)


def get_current_user(auth: AuthContext = Depends(get_auth)) -> str:
    return auth.user_id
