from .service import UserService
from .repository import UserRepository


user_repository = UserRepository()
user_service = UserService(user_repository)
