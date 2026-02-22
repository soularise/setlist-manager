from typing import Optional

from pydantic import BaseModel


class SetlistCreate(BaseModel):
    name: str
    description: Optional[str] = None


class SetlistUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None


class SetlistResponse(BaseModel):
    id: str
    name: str
    description: Optional[str] = None
    created_at: str
