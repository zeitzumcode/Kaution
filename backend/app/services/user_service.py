from app.repositories.user_repository import UserRepository
from app.models.domain import User
from app.models.enums import UserRole
from app.utils.dynamodb import format_datetime
from datetime import datetime


class UserService:
    """Business logic for user operations"""
    
    @staticmethod
    def login_or_create(email: str, role: UserRole) -> User:
        """Login or create a user"""
        # Try to find existing user
        user = UserRepository.find_by_email_and_role(email, role)
        
        if not user:
            # Create new user
            now = format_datetime(datetime.utcnow())
            name = email.split('@')[0].replace('.', ' ').replace('_', ' ').title()
            
            user = User(
                email=email,
                role=role,
                name=name,
                created_at=now,
                updated_at=now
            )
            UserRepository.create(user)
        
        return user
    
    @staticmethod
    def login_by_email(email: str) -> User:
        """Login by email only - finds user by email"""
        users = UserRepository.find_by_email(email)
        if not users:
            raise ValueError("User not found. Please sign up first.")
        if len(users) > 1:
            # If multiple roles exist, use the first one
            # In future, could return list and let user choose
            return users[0]
        return users[0]
    
    @staticmethod
    def create_user(email: str, role: UserRole, name: str) -> User:
        """Create a new user"""
        if UserRepository.exists(email, role):
            raise ValueError("User already exists")
        
        now = format_datetime(datetime.utcnow())
        user = User(
            email=email,
            role=role,
            name=name,
            created_at=now,
            updated_at=now
        )
        return UserRepository.create(user)

