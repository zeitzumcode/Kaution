"""
Script to initialize static user data and order in DynamoDB
"""
from datetime import datetime
from app.models.domain import (
    User, Order, ProgressStage, ChatRoom, ChatParticipant
)
from app.models.enums import UserRole, OrderStatus, ProgressStageType
from app.utils.dynamodb import format_datetime
from app.repositories.user_repository import UserRepository
from app.repositories.order_repository import OrderRepository
from app.repositories.chat_repository import ChatRepository
from app.services.order_service import OrderService
import logging

logger = logging.getLogger(__name__)


def init_static_data():
    """Initialize static user data and order"""
    try:
        now = format_datetime(datetime.utcnow())
        
        # Create users
        users = [
            User(
                email="Alice@gmail.com",
                role=UserRole.AGENT,
                name="Alice",
                created_at=now,
                updated_at=now
            ),
            User(
                email="Bob@gmail.com",
                role=UserRole.RENTER,
                name="Bob",
                created_at=now,
                updated_at=now
            ),
            User(
                email="Charlie@gmail.com",
                role=UserRole.LANDLORD,
                name="Charlie",
                created_at=now,
                updated_at=now
            ),
        ]
        
        logger.info("Creating static users...")
        for user in users:
            if not UserRepository.exists(user.email, user.role):
                UserRepository.create(user)
                logger.info(f"Created user: {user.email} ({user.role.value})")
            else:
                logger.debug(f"User already exists: {user.email} ({user.role.value})")
        
        # Create order
        logger.info("Creating static order...")
        
        # Check if order already exists
        existing_order = OrderRepository.find_by_id("STATIC001")
        if existing_order:
            logger.info("Order STATIC001 already exists. Skipping order creation.")
            return
        
        # Generate order ID
        order_id = "STATIC001"
        
        # Create progress stages
        progress_stages = OrderService.create_default_progress_stages()
        
        # Create order
        order = Order(
            id=order_id,
            title="Deposit for Apartment 2A - Main Street",
            renter_email="Bob@gmail.com",
            landlord_email="Charlie@gmail.com",
            property_address="456 Main Street, Apartment 2A, Berlin 10115",
            deposit_amount=3000.0,
            description="Security deposit for 3-bedroom apartment. Lease period: 24 months.",
            created_by="Alice@gmail.com",
            status=OrderStatus.PENDING,
            progress_stages=progress_stages,
            created_at=now,
            updated_at=now
        )
        
        OrderRepository.create(order)
        logger.info(f"Created order: {order_id}")
        
        # Create chat room for the order
        # Get user names for participants
        def get_user_name(email, role):
            users = UserRepository.find_by_email(email)
            user = next((u for u in users if u.role == role), None)
            return user.name if user else email.split('@')[0].replace('.', ' ').replace('_', ' ').title()
        
        participants = [
            ChatParticipant(
                email="Alice@gmail.com", 
                role=UserRole.AGENT,
                name=get_user_name("Alice@gmail.com", UserRole.AGENT)
            ),
            ChatParticipant(
                email="Bob@gmail.com", 
                role=UserRole.RENTER,
                name=get_user_name("Bob@gmail.com", UserRole.RENTER)
            ),
            ChatParticipant(
                email="Charlie@gmail.com", 
                role=UserRole.LANDLORD,
                name=get_user_name("Charlie@gmail.com", UserRole.LANDLORD)
            ),
        ]
        
        chat_room = ChatRoom(
            order_id=order_id,
            participants=participants,
            messages=[],
            created_at=now,
            updated_at=now
        )
        ChatRepository.create(chat_room)
        logger.info(f"Created chat room for order: {order_id}")
        
        # Update order with chat room reference
        order.chat_room = chat_room
        OrderRepository.update(order)
        
        logger.info("Static data initialized successfully")
        logger.info("Users: Alice@gmail.com (Agent), Bob@gmail.com (Renter), Charlie@gmail.com (Landlord)")
        logger.info(f"Order: {order_id} - {order.title}")
        
    except Exception as e:
        logger.warning(f"Error initializing static data (data may already exist): {e}")


if __name__ == "__main__":
    import sys
    import os
    # Add parent directory to path when running as script
    sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(__file__))))
    from app.core.database import init_tables
    
    # Initialize tables first
    print("Initializing DynamoDB tables...")
    init_tables()
    
    init_static_data()
    print("\nStatic data initialization complete!")

