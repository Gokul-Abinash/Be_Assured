from sqlalchemy import Column, String, Text, Boolean, TIMESTAMP, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
import uuid
from config.base import Base


class Worker(Base):
    __tablename__ = "workers"

    worker_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.user_id"))

    mobile_number = Column(String(15), unique=True, nullable=False)
    full_name = Column(Text, nullable=False)
    aadhaar_hash = Column(Text, default="")
    pan_number = Column(Text, unique=True, nullable=True)

    is_active = Column(Boolean, default=True)
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())
