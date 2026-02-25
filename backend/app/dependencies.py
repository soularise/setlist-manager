import time
from dataclasses import dataclass

import httpx
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError, jwt
from supabase import Client

from .config import Settings, get_settings
from .db.supabase import get_user_client

security = HTTPBearer()

# JWKS cache with 1-hour TTL so key rotations are picked up promptly
_jwks_state: dict = {"cache": None, "time": 0.0}
_JWKS_TTL = 3600.0


def _get_jwks(supabase_url: str) -> dict:
    now = time.monotonic()
    if _jwks_state["cache"] is None or now - _jwks_state["time"] > _JWKS_TTL:
        resp = httpx.get(f"{supabase_url}/auth/v1/.well-known/jwks.json", timeout=5.0)
        resp.raise_for_status()
        _jwks_state["cache"] = resp.json()
        _jwks_state["time"] = now
    return _jwks_state["cache"]


def _decode_token(token: str, settings: Settings) -> dict:
    """Decode a Supabase JWT, supporting both legacy HS256 and newer ES256 signing."""
    header = jwt.get_unverified_header(token)
    alg = header.get("alg", "HS256")

    if alg == "HS256":
        return jwt.decode(
            token,
            settings.supabase_jwt_secret,
            algorithms=["HS256"],
            audience="authenticated",
        )

    # ES256 / RS256 — verify using Supabase's public JWKS
    kid = header.get("kid")
    jwks = _get_jwks(settings.supabase_url)
    key = next(
        (k for k in jwks.get("keys", []) if kid is None or k.get("kid") == kid),
        None,
    )
    if key is None:
        raise JWTError("No matching key found in JWKS")
    return jwt.decode(token, key, algorithms=[alg], audience="authenticated")


@dataclass
class AuthContext:
    user_id: str
    token: str
    client: Client


def get_auth(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    settings: Settings = Depends(get_settings),
) -> AuthContext:
    """Verifies JWT (HS256 or ES256), returns user_id + a Supabase client scoped to that user."""
    token = credentials.credentials
    try:
        payload = _decode_token(token, settings)
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
