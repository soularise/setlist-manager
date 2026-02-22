from fastapi import APIRouter, Depends

from ..dependencies import AuthContext, get_auth
from ..models.profile import ProfileResponse, ProfileUpdate
from ..services import profile_service

router = APIRouter(prefix="/api/profile", tags=["profile"])


@router.get("", response_model=ProfileResponse)
def read_profile(auth: AuthContext = Depends(get_auth)):
    return profile_service.get_profile(auth.user_id, auth.client)


@router.put("", response_model=ProfileResponse)
def update_profile(body: ProfileUpdate, auth: AuthContext = Depends(get_auth)):
    return profile_service.update_profile(auth.user_id, body, auth.client)
