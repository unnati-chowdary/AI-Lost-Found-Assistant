from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from datetime import datetime
from app.database import Base

class Item(Base):
    __tablename__ = "items"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    type = Column(String(10), nullable=False, index=True)  # LOST or FOUND
    name = Column(String(150), nullable=False)
    category = Column(String(50), nullable=False, index=True)
    description = Column(Text, nullable=False)
    date = Column(String(20), nullable=False)  # ISO Date YYYY-MM-DD
    location = Column(String(150), nullable=False)
    image_path = Column(String(255), nullable=True)
    status = Column(String(20), default="ACTIVE", nullable=False)  # ACTIVE, MATCHED, RESOLVED
    created_at = Column(DateTime, default=datetime.utcnow)
