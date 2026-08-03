from sqlalchemy.orm import Session
from app.models.item import Item
from app.models.match import Match
from app.models.user import User
from app.ai.scorer import calculate_confidence_score
from app.services.email_service import send_match_notification_email

def run_matching_pipeline_for_item(db: Session, target_item: Item):
    if target_item.status != "ACTIVE":
        return []

    target_is_lost = target_item.type == "LOST"
    candidate_type = "FOUND" if target_is_lost else "LOST"

    candidates = db.query(Item).filter(
        Item.type == candidate_type,
        Item.status == "ACTIVE",
        Item.user_id != target_item.user_id
    ).all()

    new_matches = []

    for candidate in candidates:
        if target_is_lost:
            lost_item, found_item = target_item, candidate
        else:
            lost_item, found_item = candidate, target_item

        existing = db.query(Match).filter(
            Match.lost_item_id == lost_item.id,
            Match.found_item_id == found_item.id
        ).first()

        if existing:
            continue

        text_score, img_score, overall_score = calculate_confidence_score(lost_item, found_item)

        if overall_score >= 30.0:
            match_obj = Match(
                lost_item_id=lost_item.id,
                found_item_id=found_item.id,
                text_similarity=round(text_score, 2),
                image_similarity=round(img_score, 2),
                confidence_score=round(overall_score, 2),
                status="PENDING"
            )
            db.add(match_obj)
            db.commit()
            db.refresh(match_obj)
            new_matches.append(match_obj)

            if overall_score >= 75.0:
                owner = db.query(User).filter(User.id == lost_item.user_id).first()
                if owner and owner.email:
                    send_match_notification_email(
                        to_email=owner.email,
                        user_name=owner.name,
                        lost_item_name=lost_item.name,
                        found_item_name=found_item.name,
                        confidence_score=round(overall_score, 1)
                    )

    return new_matches
