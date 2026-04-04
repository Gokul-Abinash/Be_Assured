from fastapi import APIRouter
from .modules import user_service

app = APIRouter()


"""
API Endpoints
"""




@app.get("/user")
def get_user():
    try:
        response = user_service.get_user(None)
        return response
    except Exception as e:
        return {"error": str(e)}
