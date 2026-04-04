"""
Handling all the business logic
"""

class UserService:
    def __init__(self, repository):
        self.repository = repository

    def create_worker(self, db, request):
        worker = self.repository.create_worker(db, request)

        return {
            "status": "OK",
            "message": "Worker created",
            "worker_id": str(worker.worker_id)
        }

    def assign_zones(self, db, request):
        self.repository.assign_zones(
            db,
            request.worker_id,
            request.primary,
            request.secondary
        )

        return {
            "status": "OK",
            "message": "Zones assigned"
        }
    
    def upload_kyc(self, db, request):
        worker = self.repository.update_kyc(
            db,
            request.worker_id,
            request.aadhaar_number,
            request.pan_number
        )

        return {
            "status": "OK",
            "message": "KYC details uploaded successfully"
        }