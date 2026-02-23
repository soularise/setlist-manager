from typing import List, Optional

from pydantic import BaseModel

from .song import SongResponse


class SetlistSongCreate(BaseModel):
    song_id: str
    position: int
    notes: Optional[str] = None


class BreakCreate(BaseModel):
    position: int
    break_label: str = "Break"


class BreakLabelUpdate(BaseModel):
    break_label: str


class SetlistSongResponse(BaseModel):
    id: str
    setlist_id: str
    song_id: Optional[str] = None
    position: int
    notes: Optional[str] = None
    break_label: Optional[str] = None
    song: Optional[SongResponse] = None


class ReorderItem(BaseModel):
    id: str
    position: int


class ReorderRequest(BaseModel):
    items: List[ReorderItem]
