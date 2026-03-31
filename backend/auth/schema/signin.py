from pydantic import BaseModel, Field, StringConstraints, field_validator
from typing import Annotated
import re


class SignInRequest(BaseModel):
    first_name: str = Field(..., description="First name")
    last_name: str = Field(..., description="Last name")
    email: str = Field(..., description="Email")
    password: Annotated[str, StringConstraints(min_length=8)] = Field(
        ..., description="Password"
    )

    @field_validator("password")
    @classmethod
    def validate_password(cls, v: str) -> str:
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters long")

        if not re.search(r"[A-Z]", v):
            raise ValueError("Must contain at least one uppercase letter")

        if not re.search(r"[a-z]", v):
            raise ValueError("Must contain at least one lowercase letter")

        if not re.search(r"\d", v):
            raise ValueError("Must contain at least one digit")

        if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", v):
            raise ValueError("Must contain at least one special character")

        return v
