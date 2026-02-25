from typing import Optional

from pydantic import BaseModel, Field


class SetlistCreate(BaseModel):
    name: str = Field(min_length=1, max_length=200)
    description: Optional[str] = Field(None, max_length=1000)


class SetlistUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = Field(None, max_length=1000)


class SetlistResponse(BaseModel):
    id: str
    name: str
    description: Optional[str] = None
    created_at: str
