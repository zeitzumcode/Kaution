from pydantic import BaseModel, EmailStr, field_validator
from typing import Optional
from app.models.enums import UserRole


class UserBase(BaseModel):
    email: EmailStr
    role: UserRole
    name: str

    @field_validator('role', mode='before')
    @classmethod
    def validate_role(cls, v):
        if isinstance(v, str):
            v = v.lower()
            # Convert string to enum
            try:
                return UserRole(v)
            except ValueError:
                raise ValueError(f"Invalid role: {v}. Must be one of: agent, renter, landlord")
        return v

    class Config:
        use_enum_values = False  # Keep as enum, not string value


class UserCreate(UserBase):
    pass


class UserResponse(UserBase):
    created_at: str
    updated_at: str

    class Config:
        from_attributes = True
        use_enum_values = False  # Keep as enum for proper handling


class LoginRequest(BaseModel):
    email: EmailStr
    role: Optional[UserRole] = None

    @field_validator('role', mode='before')
    @classmethod
    def validate_role(cls, v):
        if v is None:
            return None
        if isinstance(v, str):
            v = v.lower()
            # Convert string to enum
            try:
                return UserRole(v)
            except ValueError:
                raise ValueError(f"Invalid role: {v}. Must be one of: agent, renter, landlord")
        return v

    class Config:
        use_enum_values = False  # Keep as enum, not string value


class LoginResponse(BaseModel):
    user: UserResponse
    access_token: Optional[str] = None

