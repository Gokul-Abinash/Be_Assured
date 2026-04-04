import hashlib


def hash_aadhaar(aadhaar: str) -> str:
    return hashlib.sha256(aadhaar.encode()).hexdigest()

def hash_pan(pan: str) -> str:
    return hashlib.sha256(pan.encode()).hexdigest()
