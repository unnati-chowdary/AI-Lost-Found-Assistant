from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ItemCreate(BaseModel):
    type: str  # LOST or FOUND
    name: str
    category: str
    description: str
    date: str
    location: str

class ItemResponse(BaseModel):
    id: int
    user_id: int
    type: str
    name: str
    category: str
    description: str
    date: str
    location: str
    image_path: Optional[str] = None
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

class ItemStatusUpdate(BaseModel):
    status: str
