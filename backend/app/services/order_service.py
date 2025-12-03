from app.repositories.order_repository import OrderRepository
from app.repositories.user_repository import UserRepository
from app.repositories.chat_repository import ChatRepository
from app.models.domain import Order, ProgressStage, ChatRoom, ChatParticipant
from app.models.enums import ProgressStageType, OrderStatus, UserRole
from app.utils.dynamodb import format_datetime
from datetime import datetime
import uuid
from typing import List, Optional


class OrderService:
    """Business logic for order operations"""
    
    @staticmethod
    def generate_order_id() -> str:
        """Generate a unique order ID"""
        return str(uuid.uuid4().int)[:6]
    
    @staticmethod
    def create_default_progress_stages() -> List[ProgressStage]:
        """Create default progress stages for a new order"""
        stages = [
            (ProgressStageType.ORDER_CREATED, "Order Created"),
            (ProgressStageType.RENTER_REVIEW, "Renter Review"),
            (ProgressStageType.LANDLORD_REVIEW, "Landlord Review"),
            (ProgressStageType.DEPOSIT_HELD, "Deposit Held"),
            (ProgressStageType.COMPLETED, "Completed"),
        ]
        
        now = format_datetime(datetime.utcnow())
        
        progress_stages = []
        for stage, title in stages:
            progress_stage = ProgressStage(
                stage=stage,
                title=title,
                completed=(stage == ProgressStageType.ORDER_CREATED),
                date=now if stage == ProgressStageType.ORDER_CREATED else None,
            )
            progress_stages.append(progress_stage)
        
        return progress_stages
    
    @staticmethod
    def create_order(
        title: str,
        renter_email: str,
        landlord_email: str,
        property_address: str,
        deposit_amount: float,
        description: Optional[str],
        created_by: str
    ) -> Order:
        """Create a new order"""
        # Verify creator is an agent
        users = UserRepository.find_by_email(created_by)
        creator = next((u for u in users if u.role == UserRole.AGENT), None)
        
        if not creator:
            raise ValueError("Only agents can create orders")
        
        # Generate order ID
        order_id = OrderService.generate_order_id()
        
        # Create progress stages
        progress_stages = OrderService.create_default_progress_stages()
        
        # Create order
        now = format_datetime(datetime.utcnow())
        order = Order(
            id=order_id,
            title=title,
            renter_email=renter_email,
            landlord_email=landlord_email,
            property_address=property_address,
            deposit_amount=deposit_amount,
            description=description,
            created_by=created_by,
            status=OrderStatus.PENDING,
            progress_stages=progress_stages,
            created_at=now,
            updated_at=now
        )
        
        OrderRepository.create(order)
        
        # Create chat room for the order
        now = format_datetime(datetime.utcnow())
        
        # Fetch user names for participants
        def get_user_name(email, role):
            users = UserRepository.find_by_email(email)
            user = next((u for u in users if u.role == role), None)
            return user.name if user else email.split('@')[0].replace('.', ' ').replace('_', ' ').title()
        
        participants = [
            ChatParticipant(
                email=created_by, 
                role=UserRole.AGENT,
                name=get_user_name(created_by, UserRole.AGENT)
            ),
            ChatParticipant(
                email=renter_email, 
                role=UserRole.RENTER,
                name=get_user_name(renter_email, UserRole.RENTER)
            ),
            ChatParticipant(
                email=landlord_email, 
                role=UserRole.LANDLORD,
                name=get_user_name(landlord_email, UserRole.LANDLORD)
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
        
        # Update order with chat room reference
        order.chat_room = chat_room
        OrderRepository.update(order)
        
        return order
    
    @staticmethod
    def get_orders_for_user(user_email: str, user_role: UserRole) -> List[Order]:
        """Get orders filtered by user role"""
        if user_role == UserRole.AGENT:
            orders = OrderRepository.find_by_created_by(user_email)
        elif user_role == UserRole.RENTER:
            orders = OrderRepository.find_by_renter_email(user_email)
        elif user_role == UserRole.LANDLORD:
            orders = OrderRepository.find_by_landlord_email(user_email)
        else:
            orders = []
        
        # Sort by created_at descending
        orders.sort(key=lambda x: x.created_at, reverse=True)
        return orders

