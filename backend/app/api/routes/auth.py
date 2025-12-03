from fastapi import APIRouter, HTTPException
from app.schemas.user import LoginRequest, LoginResponse, UserResponse, UserCreate
from app.services.user_service import UserService
from app.repositories.user_repository import UserRepository
from typing import List

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/login", response_model=LoginResponse)
def login(request: LoginRequest):
    """Login with email only (role is optional for backward compatibility)"""
    try:
        from app.models.enums import UserRole
        
        # If role is provided, use the old login_or_create method
        if request.role:
            role = request.role
            if not isinstance(role, UserRole):
                role = UserRole(role.lower())
            user = UserService.login_or_create(request.email, role)
        else:
            # Login by email only
            user = UserService.login_by_email(request.email)
        
        return LoginResponse(
            user=UserResponse.model_validate(user),
            access_token=None
        )
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error during login: {str(e)}")


@router.get("/users", response_model=List[UserResponse])
def get_users(skip: int = 0, limit: int = 100):
    """Get all users"""
    try:
        users = UserRepository.find_all(skip=skip, limit=limit)
        return users
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching users: {str(e)}")


@router.get("/users/{email}", response_model=UserResponse)
def get_user(email: str, role: str = None):
    """Get user by email (and optionally role)"""
    try:
        from app.models.enums import UserRole
        
        if role:
            user = UserRepository.find_by_email_and_role(email, UserRole[role.upper()])
            if not user:
                raise HTTPException(status_code=404, detail="User not found")
            return user
        else:
            users = UserRepository.find_by_email(email)
            if not users:
                raise HTTPException(status_code=404, detail="User not found")
            return users[0]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching user: {str(e)}")


@router.post("/users", response_model=UserResponse)
def create_user(user: UserCreate):
    """Create a new user"""
    try:
        if UserRepository.exists(user.email, user.role):
            raise HTTPException(status_code=400, detail="User already exists")
        
        new_user = UserService.create_user(user.email, user.role, user.name)
        return new_user
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating user: {str(e)}")

