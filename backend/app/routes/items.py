from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models.item import Item
from app.models.user import User
from app.schemas.item import ItemResponse, ItemStatusUpdate
from app.utils.security import get_current_user
from app.utils.file_utils import save_upload_file
from app.services.matching_service import run_matching_pipeline_for_item

router = APIRouter(prefix="/items", tags=["Items"])

@router.post("", response_model=ItemResponse, status_code=status.HTTP_201_CREATED)
def create_item(
    type: str = Form(...),  # LOST or FOUND
    name: str = Form(...),
    category: str = Form(...),
    description: str = Form(...),
    date: str = Form(...),
    location: str = Form(...),
    image: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    type_upper = type.upper().strip()
    if type_upper not in ["LOST", "FOUND"]:
        raise HTTPException(status_code=400, detail="Item type must be either 'LOST' or 'FOUND'.")

    image_path = None
    if image and image.filename:
        image_path = save_upload_file(image)

    new_item = Item(
        user_id=current_user.id,
        type=type_upper,
        name=name.strip(),
        category=category.strip(),
        description=description.strip(),
        date=date.strip(),
        location=location.strip(),
        image_path=image_path,
        status="ACTIVE"
    )

    db.add(new_item)
    db.commit()
    db.refresh(new_item)

    # Trigger AI Matching Pipeline
    try:
        run_matching_pipeline_for_item(db, new_item)
    except Exception as e:
        print(f"[AI MATCHING ERROR]: {e}")

    return new_item

@router.get("/my-reports", response_model=List[ItemResponse])
def get_my_reports(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(Item).filter(Item.user_id == current_user.id).order_by(Item.created_at.desc()).all()

@router.get("/{item_id}", response_model=ItemResponse)
def get_item_by_id(item_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    item = db.query(Item).filter(Item.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found.")
    return item

@router.put("/{item_id}/status", response_model=ItemResponse)
def update_item_status(item_id: int, update_data: ItemStatusUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    item = db.query(Item).filter(Item.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found.")

    if item.user_id != current_user.id and current_user.role != "ADMIN":
        raise HTTPException(status_code=403, detail="Not authorized to modify this item.")

    item.status = update_data.status
    db.commit()
    db.refresh(item)
    return item
