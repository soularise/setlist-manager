from typing import Optional

from pydantic import BaseModel, Field, HttpUrl


class ProfileUpdate(BaseModel):
    display_name: Optional[str] = Field(None, min_length=1, max_length=100)
    bio: Optional[str] = Field(None, max_length=500)
    avatar_url: Optional[HttpUrl] = None


class ProfileResponse(BaseModel):
    id: str
    display_name: Optional[str] = None
    bio: Optional[str] = None
    avatar_url: Optional[str] = None
    updated_at: Optional[str] = None
