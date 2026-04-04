from pydantic import BaseModel

class UploadKYCRequest(BaseModel):
    worker_id: str
    aadhaar_number: str
    pan_number: str