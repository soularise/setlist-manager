from typing import List, Optional

from pydantic import BaseModel, Field

from .song import SongResponse


class SetlistSongCreate(BaseModel):
    song_id: str = Field(min_length=1, max_length=100)
    position: int = Field(ge=0, le=10000)
    notes: Optional[str] = Field(None, max_length=2000)


class BreakCreate(BaseModel):
    position: int = Field(ge=0, le=10000)
    break_label: str = Field(default="Break", min_length=1, max_length=200)


class BreakLabelUpdate(BaseModel):
    break_label: str = Field(min_length=1, max_length=200)


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
