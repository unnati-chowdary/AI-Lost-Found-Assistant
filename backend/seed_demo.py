import sys
import os

# Add backend directory to sys.path
sys.path.append(os.path.abspath(os.path.dirname(__file__)))

from app.database import SessionLocal, engine, Base
from app.routes.demo import seed_demo_data

if __name__ == "__main__":
    print("Initializing Database...")
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        res = seed_demo_data(db)
        print("Demo Seeding Result:")
        print(res)
    finally:
        db.close()
