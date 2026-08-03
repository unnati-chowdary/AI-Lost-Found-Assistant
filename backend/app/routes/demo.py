from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.models.item import Item
from app.models.match import Match
from app.utils.security import hash_password
from app.services.matching_service import run_matching_pipeline_for_item

router = APIRouter(prefix="/demo", tags=["Demo Data"])

@router.post("/seed")
def seed_demo_data(db: Session = Depends(get_db)):
    """
    Populates realistic demo dataset of users, lost items, and found items.
    """
    # 1. Create Demo Users
    user_student = db.query(User).filter(User.email == "student@college.edu").first()
    if not user_student:
        user_student = User(
            name="Alex Student",
            email="student@college.edu",
            password_hash=hash_password("student123"),
            role="USER"
        )
        db.add(user_student)

    user_admin = db.query(User).filter(User.email == "admin@college.edu").first()
    if not user_admin:
        user_admin = User(
            name="Office Administrator",
            email="admin@college.edu",
            password_hash=hash_password("admin123"),
            role="ADMIN"
        )
        db.add(user_admin)

    db.commit()
    db.refresh(user_student)
    db.refresh(user_admin)

    # Clean existing items and matches for clean demo seed if needed
    db.query(Match).delete()
    db.query(Item).delete()
    db.commit()

    demo_lost_items = [
        {
            "name": "Black Leather Bi-Fold Wallet",
            "category": "Wallets & Cards",
            "description": "Lost my black leather wallet containing Student ID, Driver's License, and debit card near Science Hall.",
            "date": "2026-08-01",
            "location": "Science Hall Complex"
        },
        {
            "name": "Sony WH-1000XM4 Noise Canceling Headphones",
            "category": "Electronics",
            "description": "Matte black over-ear wireless headphones left in a black protective hard case on table 4.",
            "date": "2026-08-02",
            "location": "Central Campus Library - 2nd Floor"
        },
        {
            "name": "Silver MacBook Pro 14-inch",
            "category": "Electronics",
            "description": "MacBook Pro in a gray felt sleeve with stickers on the top shell (GitHub and Python logos).",
            "date": "2026-08-02",
            "location": "Student Union Cafeteria"
        },
        {
            "name": "Toyota Car Key Fob & Keychain",
            "category": "Keys",
            "description": "Single black electronic key fob with blue lanyard attached.",
            "date": "2026-08-01",
            "location": "North Campus Parking Lot B"
        },
        {
            "name": "University Student Photo ID Card",
            "category": "IDs & Documents",
            "description": "Student identity card under the name Unnati S with barcode on back.",
            "date": "2026-08-03",
            "location": "Engineering Building Auditorium"
        }
    ]

    demo_found_items = [
        {
            "name": "Dark Leather Wallet with Cards",
            "category": "Wallets & Cards",
            "description": "Found a dark leather bifold wallet with campus card and license inside near the Science Building bench.",
            "date": "2026-08-01",
            "location": "Science Hall Complex"
        },
        {
            "name": "Black Over-Ear Wireless Headphones",
            "category": "Electronics",
            "description": "Found Sony black noise canceling headphones inside a zipper case left at Library 2nd floor study area.",
            "date": "2026-08-02",
            "location": "Central Campus Library"
        },
        {
            "name": "Apple Laptop in Sleeve",
            "category": "Electronics",
            "description": "Silver laptop inside gray protective case turned in at cafeteria main desk.",
            "date": "2026-08-02",
            "location": "Student Union Cafeteria"
        },
        {
            "name": "Key Chain with Car Remote",
            "category": "Keys",
            "description": "Found Toyota car remote with blue cloth strap near Parking Lot B entrance.",
            "date": "2026-08-01",
            "location": "North Campus Parking Lot B"
        },
        {
            "name": "Campus Student ID Badge",
            "category": "IDs & Documents",
            "description": "Found student ID card near Auditorium Row 5 seat.",
            "date": "2026-08-03",
            "location": "Engineering Building"
        }
    ]

    created_items = []

    for d in demo_lost_items:
        item = Item(
            user_id=user_student.id,
            type="LOST",
            name=d["name"],
            category=d["category"],
            description=d["description"],
            date=d["date"],
            location=d["location"],
            status="ACTIVE"
        )
        db.add(item)
        db.commit()
        db.refresh(item)
        created_items.append(item)

    for d in demo_found_items:
        item = Item(
            user_id=user_admin.id,
            type="FOUND",
            name=d["name"],
            category=d["category"],
            description=d["description"],
            date=d["date"],
            location=d["location"],
            status="ACTIVE"
        )
        db.add(item)
        db.commit()
        db.refresh(item)
        created_items.append(item)

    # Run AI matching pipeline for all created items
    all_matches = []
    for item in created_items:
        matches = run_matching_pipeline_for_item(item, db)
        all_matches.extend(matches)

    return {
        "message": "Demo data successfully seeded!",
        "users": [user_student.email, user_admin.email],
        "total_items_created": len(created_items),
        "total_matches_generated": len(all_matches)
    }
