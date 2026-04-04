from sqlalchemy import Column, Integer, String, ForeignKey, Date
from sqlalchemy.dialects.postgresql import UUID
from config.base import Base
from datetime import date, timedelta


class WorkerZone(Base):
    __tablename__ = "worker_zones"

    worker_id = Column(
        UUID(as_uuid=True), ForeignKey("workers.worker_id"), primary_key=True
    )
    zone_id = Column(Integer, primary_key=True)
    zone_type = Column(String)
    activation_date = Column(Date, default=date.today() + timedelta(days=7))
