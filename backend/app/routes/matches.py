from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.match import Match
from app.models.item import Item
from app.models.user import User
from app.schemas.match import MatchResponse
from app.schemas.item import ItemResponse
from app.utils.security import get_current_user

router = APIRouter(prefix="/matches", tags=["Matches"])

@router.get("/my-matches", response_model=List[MatchResponse])
def get_my_matches(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # Find all items owned by current user
    my_items = db.query(Item).filter(Item.user_id == current_user.id).all()
    my_item_ids = [item.id for item in my_items]

    if not my_item_ids:
        return []

    # Find matches involving any of the user's items
    matches = db.query(Match).filter(
        (Match.lost_item_id.in_(my_item_ids)) | (Match.found_item_id.in_(my_item_ids))
    ).order_by(Match.confidence_score.desc()).all()

    result = []
    for match in matches:
        lost_item = db.query(Item).filter(Item.id == match.lost_item_id).first()
        found_item = db.query(Item).filter(Item.id == match.found_item_id).first()

        match_res = MatchResponse(
            id=match.id,
            lost_item_id=match.lost_item_id,
            found_item_id=match.found_item_id,
            text_similarity=match.text_similarity,
            image_similarity=match.image_similarity,
            confidence_score=match.confidence_score,
            status=match.status,
            created_at=match.created_at,
            lost_item=ItemResponse.from_orm(lost_item) if lost_item else None,
            found_item=ItemResponse.from_orm(found_item) if found_item else None
        )
        result.append(match_res)

    return result
