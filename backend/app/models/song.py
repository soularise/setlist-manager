from typing import Optional

from pydantic import BaseModel, Field


class SongCreate(BaseModel):
    title: str = Field(min_length=1, max_length=500)
    artist: Optional[str] = Field(None, max_length=300)
    bpm: Optional[int] = Field(None, ge=20, le=400)
    duration_seconds: Optional[int] = Field(None, ge=0, le=7200)


class SongUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=500)
    artist: Optional[str] = Field(None, max_length=300)
    bpm: Optional[int] = Field(None, ge=20, le=400)
    duration_seconds: Optional[int] = Field(None, ge=0, le=7200)


class SongResponse(BaseModel):
    id: str
    title: str
    artist: Optional[str] = None
    bpm: Optional[int] = None
    duration_seconds: Optional[int] = None
    created_at: str
