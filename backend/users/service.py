"""
Handling all the business logic
"""


class UserService:
    def __init__(self, repository):
        self.repository = repository

    def get_user(self, request):

        user_id = request.user_id
        user = self.repository.get_user(user_id)

        if not user:
            raise Exception("User not found")

        return user
