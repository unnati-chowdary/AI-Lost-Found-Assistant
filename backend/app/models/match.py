from sqlalchemy import Column, Integer, Float, String, DateTime, ForeignKey
from datetime import datetime
from app.database import Base

class Match(Base):
    __tablename__ = "matches"

    id = Column(Integer, primary_key=True, index=True)
    lost_item_id = Column(Integer, ForeignKey("items.id"), nullable=False, index=True)
    found_item_id = Column(Integer, ForeignKey("items.id"), nullable=False, index=True)
    text_similarity = Column(Float, default=0.0)
    image_similarity = Column(Float, default=0.0)
    confidence_score = Column(Float, nullable=False)  # 0 to 100
    status = Column(String(30), default="POTENTIAL", nullable=False)  # POTENTIAL, VERIFIED, RESOLVED, REJECTED
    created_at = Column(DateTime, default=datetime.utcnow)
