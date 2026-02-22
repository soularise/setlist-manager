from fastapi import APIRouter, Depends, status

from ..dependencies import AuthContext, get_auth
from ..models.song import SongCreate, SongResponse, SongUpdate
from ..services import song_service

router = APIRouter(prefix="/api/songs", tags=["songs"])


@router.get("", response_model=list[SongResponse])
def list_songs(auth: AuthContext = Depends(get_auth)):
    return song_service.get_songs(auth.user_id, auth.client)


@router.post("", response_model=SongResponse, status_code=status.HTTP_201_CREATED)
def create_song(body: SongCreate, auth: AuthContext = Depends(get_auth)):
    return song_service.create_song(auth.user_id, body, auth.client)


@router.put("/{song_id}", response_model=SongResponse)
def update_song(song_id: str, body: SongUpdate, auth: AuthContext = Depends(get_auth)):
    return song_service.update_song(song_id, body, auth.client)


@router.delete("/{song_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_song(song_id: str, auth: AuthContext = Depends(get_auth)):
    song_service.delete_song(song_id, auth.client)
