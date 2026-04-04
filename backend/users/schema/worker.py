from pydantic import BaseModel
from typing import List

class CreateWorkerRequest(BaseModel):
    first_name: str
    last_name: str
    dob: str
    phone: str


class ZoneAssignRequest(BaseModel):
    worker_id: str
    primary: int
    secondary: List[int]