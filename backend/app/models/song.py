from typing import Optional

from pydantic import BaseModel


class SongCreate(BaseModel):
    title: str
    artist: Optional[str] = None
    bpm: Optional[int] = None
    duration_seconds: Optional[int] = None


class SongUpdate(BaseModel):
    title: Optional[str] = None
    artist: Optional[str] = None
    bpm: Optional[int] = None
    duration_seconds: Optional[int] = None


class SongResponse(BaseModel):
    id: str
    title: str
    artist: Optional[str] = None
    bpm: Optional[int] = None
    duration_seconds: Optional[int] = None
    created_at: str
