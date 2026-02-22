from typing import List, Optional

from pydantic import BaseModel

from .song import SongResponse


class SetlistSongCreate(BaseModel):
    song_id: str
    position: int
    notes: Optional[str] = None


class SetlistSongResponse(BaseModel):
    id: str
    setlist_id: str
    song_id: str
    position: int
    notes: Optional[str] = None
    song: Optional[SongResponse] = None


class ReorderItem(BaseModel):
    id: str
    position: int


class ReorderRequest(BaseModel):
    items: List[ReorderItem]
