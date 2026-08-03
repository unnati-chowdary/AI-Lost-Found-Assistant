from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from app.database import get_db
from app.models.item import Item
from app.models.match import Match
from app.models.user import User
from app.schemas.item import ItemResponse, ItemStatusUpdate
from app.schemas.match import MatchResponse, MatchStatusUpdate
from app.utils.security import get_current_admin

router = APIRouter(prefix="/admin", tags=["Admin"])

@router.get("/stats")
def get_admin_stats(db: Session = Depends(get_db), current_admin: User = Depends(get_current_admin)) -> Dict[str, Any]:
    total_users = db.query(User).count()
    total_lost = db.query(Item).filter(Item.type == "LOST").count()
    total_found = db.query(Item).filter(Item.type == "FOUND").count()
    active_items = db.query(Item).filter(Item.status == "ACTIVE").count()
    resolved_items = db.query(Item).filter(Item.status == "RESOLVED").count()
    total_matches = db.query(Match).count()
    high_matches = db.query(Match).filter(Match.confidence_score >= 75.0).count()

    return {
        "total_users": total_users,
        "total_lost": total_lost,
        "total_found": total_found,
        "active_items": active_items,
        "resolved_items": resolved_items,
        "total_matches": total_matches,
        "high_confidence_matches": high_matches
    }

@router.get("/items", response_model=List[ItemResponse])
def get_all_items(db: Session = Depends(get_db), current_admin: User = Depends(get_current_admin)):
    return db.query(Item).order_by(Item.created_at.desc()).all()

@router.get("/matches", response_model=List[MatchResponse])
def get_all_matches(db: Session = Depends(get_db), current_admin: User = Depends(get_current_admin)):
    matches = db.query(Match).order_by(Match.confidence_score.desc()).all()
    result = []
    for match in matches:
        lost_item = db.query(Item).filter(Item.id == match.lost_item_id).first()
        found_item = db.query(Item).filter(Item.id == match.found_item_id).first()
        result.append(MatchResponse(
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
        ))
    return result

@router.put("/matches/{match_id}/status", response_model=MatchResponse)
def update_match_status(match_id: int, status_update: MatchStatusUpdate, db: Session = Depends(get_db), current_admin: User = Depends(get_current_admin)):
    match = db.query(Match).filter(Match.id == match_id).first()
    if not match:
        raise HTTPException(status_code=404, detail="Match record not found.")

    match.status = status_update.status

    # If verified or resolved, update item statuses
    if status_update.status in ["VERIFIED", "RESOLVED"]:
        lost_item = db.query(Item).filter(Item.id == match.lost_item_id).first()
        found_item = db.query(Item).filter(Item.id == match.found_item_id).first()
        if lost_item:
            lost_item.status = status_update.status
        if found_item:
            found_item.status = status_update.status

    db.commit()
    db.refresh(match)

    lost_item = db.query(Item).filter(Item.id == match.lost_item_id).first()
    found_item = db.query(Item).filter(Item.id == match.found_item_id).first()

    return MatchResponse(
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
