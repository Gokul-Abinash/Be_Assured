from sqlalchemy import Column, String
from sqlalchemy.dialects.postgresql import UUID
import uuid
from config.base import Base


class User(Base):
    __tablename__ = "users"

    user_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    kinde_id = Column(String, unique=True, nullable=True)
    email = Column(String, unique=True)
    password_hash = Column(String)
    role = Column(String)
