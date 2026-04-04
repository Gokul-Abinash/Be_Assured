from uuid import uuid4
from users.models import User

"""
Handling all the business logic
"""


class UserService:
    def __init__(self, repository):
        self.repository = repository

    def get_or_create_user(self, db, kinde_user):

        kinde_id = kinde_user.get("id")
        email = kinde_user.get("email")

        user = db.query(User).filter(User.kinde_id == kinde_id).first()

        if user:
            return user

        new_user = User(
            kinde_id=kinde_id,
            user_id=uuid4(),
            email=email,
            role="WORKER",
        )

        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        return new_user

    def create_worker(self, db, request):
        worker = self.repository.create_worker(db, request)

        return {
            "status": "OK",
            "message": "Worker created",
            "worker_id": str(worker.worker_id),
        }

    def assign_zones(self, db, request):
        self.repository.assign_zones(
            db, request.worker_id, request.primary, request.secondary
        )

        return {"status": "OK", "message": "Zones assigned"}

    def upload_kyc(self, db, request):
        worker = self.repository.update_kyc(
            db, request.worker_id, request.aadhaar_number, request.pan_number
        )

        return {"status": "OK", "message": "KYC details uploaded successfully"}
