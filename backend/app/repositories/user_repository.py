from app.core.database import get_dynamodb_resource
from app.models.domain import User
from app.models.enums import UserRole
from app.utils.dynamodb import to_dynamodb_dict
from typing import List, Optional


class UserRepository:
    """Repository for user data access"""
    
    @staticmethod
    def get_table():
        return get_dynamodb_resource().Table('users')
    
    @staticmethod
    def find_by_email_and_role(email: str, role: UserRole) -> Optional[User]:
        """Find user by email and role"""
        table = UserRepository.get_table()
        # Get the role value - handle both enum and string
        if isinstance(role, UserRole):
            role_value = role.value
        elif isinstance(role, str):
            role_value = role.lower()
        else:
            role_value = str(role)
        
        response = table.get_item(
            Key={
                'email': email,
                'role': role_value
            }
        )
        if 'Item' in response:
            return User(**response['Item'])
        return None
    
    @staticmethod
    def find_by_email(email: str) -> List[User]:
        """Find all users with this email (any role)"""
        table = UserRepository.get_table()
        response = table.query(
            KeyConditionExpression='email = :email',
            ExpressionAttributeValues={
                ':email': email
            }
        )
        return [User(**item) for item in response.get('Items', [])]
    
    @staticmethod
    def find_all(skip: int = 0, limit: int = 100) -> List[User]:
        """Get all users"""
        table = UserRepository.get_table()
        response = table.scan()
        users = [User(**item) for item in response.get('Items', [])]
        return users[skip:skip+limit]
    
    @staticmethod
    def create(user: User) -> User:
        """Create a new user"""
        table = UserRepository.get_table()
        table.put_item(Item=to_dynamodb_dict(user))
        return user
    
    @staticmethod
    def exists(email: str, role: UserRole) -> bool:
        """Check if user exists"""
        return UserRepository.find_by_email_and_role(email, role) is not None

