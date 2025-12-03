from app.core.database import get_dynamodb_resource
from app.models.domain import ChatRoom
from app.utils.dynamodb import to_dynamodb_dict
from typing import List, Optional


class ChatRepository:
    """Repository for chat room data access"""
    
    @staticmethod
    def get_table():
        return get_dynamodb_resource().Table('chat_rooms')
    
    @staticmethod
    def find_by_order_id(order_id: str) -> Optional[ChatRoom]:
        """Find chat room by order ID"""
        table = ChatRepository.get_table()
        response = table.get_item(Key={'order_id': order_id})
        if 'Item' in response:
            return ChatRoom(**response['Item'])
        return None
    
    @staticmethod
    def create(chat_room: ChatRoom) -> ChatRoom:
        """Create a new chat room"""
        table = ChatRepository.get_table()
        table.put_item(Item=to_dynamodb_dict(chat_room))
        return chat_room
    
    @staticmethod
    def update(chat_room: ChatRoom) -> ChatRoom:
        """Update a chat room"""
        table = ChatRepository.get_table()
        table.put_item(Item=to_dynamodb_dict(chat_room))
        return chat_room
    
    @staticmethod
    def delete(order_id: str):
        """Delete a chat room"""
        table = ChatRepository.get_table()
        table.delete_item(Key={'order_id': order_id})

