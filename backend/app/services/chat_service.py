from app.repositories.chat_repository import ChatRepository
from app.repositories.order_repository import OrderRepository
from app.repositories.user_repository import UserRepository
from app.models.domain import ChatRoom, ChatParticipant, ChatMessage
from app.models.enums import UserRole
from app.utils.dynamodb import format_datetime
from datetime import datetime
from typing import List


class ChatService:
    """Business logic for chat operations"""
    
    @staticmethod
    def create_chat_room_for_order(
        order_id: str,
        created_by: str,
        renter_email: str,
        landlord_email: str
    ) -> ChatRoom:
        """Create a chat room for an order"""
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
        
        return ChatRepository.create(chat_room)
    
    @staticmethod
    def add_message(
        order_id: str,
        sender_email: str,
        sender_role: UserRole,
        sender_name: str,
        text: str
    ) -> ChatMessage:
        """Add a message to a chat room"""
        chat_room = ChatRepository.find_by_order_id(order_id)
        if not chat_room:
            raise ValueError("Chat room not found")
        
        # Verify sender is a participant
        participant = next(
            (p for p in chat_room.participants if p.email == sender_email),
            None
        )
        if not participant:
            raise ValueError("User is not a participant in this chat room")
        
        # Create message
        new_message = ChatMessage(
            sender_email=sender_email,
            sender_role=sender_role,
            sender_name=sender_name,
            text=text,
            timestamp=format_datetime(datetime.utcnow())
        )
        
        # Add message to chat room
        chat_room.messages.append(new_message)
        chat_room.updated_at = format_datetime(datetime.utcnow())
        ChatRepository.update(chat_room)
        
        return new_message
    
    @staticmethod
    def get_user_chat_rooms(user_email: str) -> List[ChatRoom]:
        """Get all chat rooms for a user"""
        # Find all orders where user is involved
        order_ids = set()
        
        # Check created_by
        orders = OrderRepository.find_by_created_by(user_email)
        order_ids.update([order.id for order in orders])
        
        # Check renter_email
        orders = OrderRepository.find_by_renter_email(user_email)
        order_ids.update([order.id for order in orders])
        
        # Check landlord_email
        orders = OrderRepository.find_by_landlord_email(user_email)
        order_ids.update([order.id for order in orders])
        
        # Get chat rooms for these orders
        chat_rooms = []
        for order_id in order_ids:
            chat_room = ChatRepository.find_by_order_id(order_id)
            if chat_room:
                chat_rooms.append(chat_room)
        
        return chat_rooms

