"""
API Endpoints
"""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from config.database import SessionLocal
from users.modules import user_service
from users.schema.worker import CreateWorkerRequest, ZoneAssignRequest
from users.schema.kyc import UploadKYCRequest

app = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.post("/create-worker")
def create_worker(request: CreateWorkerRequest, db: Session = Depends(get_db)):
    return user_service.create_worker(db, request)


@app.post("/register-zone")
def register_zone(request: ZoneAssignRequest, db: Session = Depends(get_db)):
    return user_service.assign_zones(db, request)


@app.post("/upload-kyc")
def upload_kyc(request: UploadKYCRequest, db: Session = Depends(get_db)):
    return user_service.upload_kyc(db, request)
