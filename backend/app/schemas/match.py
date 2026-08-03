from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from app.schemas.item import ItemResponse

class MatchResponse(BaseModel):
    id: int
    lost_item_id: int
    found_item_id: int
    text_similarity: float
    image_similarity: float
    confidence_score: float
    status: str
    created_at: datetime
    lost_item: Optional[ItemResponse] = None
    found_item: Optional[ItemResponse] = None

    class Config:
        from_attributes = True

class MatchStatusUpdate(BaseModel):
    status: str
