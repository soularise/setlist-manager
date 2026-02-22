from fastapi import APIRouter, Depends, status

from ..dependencies import AuthContext, get_auth
from ..models.setlist import SetlistCreate, SetlistResponse, SetlistUpdate
from ..models.setlist_song import ReorderRequest, SetlistSongCreate, SetlistSongResponse
from ..services import setlist_service

router = APIRouter(prefix="/api/setlists", tags=["setlists"])


@router.get("", response_model=list[SetlistResponse])
def list_setlists(auth: AuthContext = Depends(get_auth)):
    return setlist_service.get_setlists(auth.user_id, auth.client)


@router.post("", response_model=SetlistResponse, status_code=status.HTTP_201_CREATED)
def create_setlist(body: SetlistCreate, auth: AuthContext = Depends(get_auth)):
    return setlist_service.create_setlist(auth.user_id, body, auth.client)


@router.get("/{setlist_id}", response_model=SetlistResponse)
def get_setlist(setlist_id: str, auth: AuthContext = Depends(get_auth)):
    return setlist_service.get_setlist(setlist_id, auth.client)


@router.put("/{setlist_id}", response_model=SetlistResponse)
def update_setlist(setlist_id: str, body: SetlistUpdate, auth: AuthContext = Depends(get_auth)):
    return setlist_service.update_setlist(setlist_id, body, auth.client)


@router.delete("/{setlist_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_setlist(setlist_id: str, auth: AuthContext = Depends(get_auth)):
    setlist_service.delete_setlist(setlist_id, auth.client)


@router.get("/{setlist_id}/songs", response_model=list[SetlistSongResponse])
def list_setlist_songs(setlist_id: str, auth: AuthContext = Depends(get_auth)):
    return setlist_service.get_setlist_songs(setlist_id, auth.client)


@router.post(
    "/{setlist_id}/songs",
    response_model=SetlistSongResponse,
    status_code=status.HTTP_201_CREATED,
)
def add_song(setlist_id: str, body: SetlistSongCreate, auth: AuthContext = Depends(get_auth)):
    return setlist_service.add_song_to_setlist(setlist_id, body, auth.client)


@router.delete("/{setlist_id}/songs/{setlist_song_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_song(setlist_id: str, setlist_song_id: str, auth: AuthContext = Depends(get_auth)):
    setlist_service.remove_song_from_setlist(setlist_song_id, auth.client)


@router.put("/{setlist_id}/songs/reorder", status_code=status.HTTP_204_NO_CONTENT)
def reorder_songs(setlist_id: str, body: ReorderRequest, auth: AuthContext = Depends(get_auth)):
    setlist_service.reorder_songs(setlist_id, body, auth.client)
