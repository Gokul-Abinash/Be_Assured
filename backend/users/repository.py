"""
Handles all the database operations
"""
from sqlalchemy.orm import Session
from users.models.worker import Worker
from users.models.worker_zone import WorkerZone
import uuid
from users.models.worker import Worker
from utils.security import hash_aadhaar


class UserRepository:

    def create_worker(self, db: Session, data):
        worker = Worker(
            worker_id=uuid.uuid4(),
            mobile_number=data.phone,
            full_name=f"{data.first_name} {data.last_name}",
            aadhaar_hash="a"
        )
        db.add(worker)
        db.commit()
        db.refresh(worker)
        return worker
        

    def assign_zones(self, db: Session, worker_id, primary, secondary):
        # Primary
        db.add(WorkerZone(
            worker_id=worker_id,
            zone_id=primary,
            zone_type="PRIMARY"
        ))

        # Secondary
        for z in secondary:
            db.add(WorkerZone(
                worker_id=worker_id,
                zone_id=z,
                zone_type="SECONDARY"
            ))

        db.commit()
    
    def update_kyc(self, db, worker_id, aadhaar, pan):
        worker = db.query(Worker).filter(Worker.worker_id == worker_id).first()

        if not worker:
            raise Exception("Worker not found")

        worker.aadhaar_hash = hash_aadhaar(aadhaar)
        worker.pan_number = pan

        db.commit()
        db.refresh(worker)

        return worker
    