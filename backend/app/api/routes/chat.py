from fastapi import APIRouter, HTTPException
from app.schemas.chat import ChatRoomResponse, ChatMessageCreate, ChatMessageResponse
from app.services.chat_service import ChatService
from app.repositories.chat_repository import ChatRepository
from app.repositories.order_repository import OrderRepository
from app.models.enums import UserRole
from typing import List

router = APIRouter(prefix="/api/chat", tags=["chat"])


@router.get("/rooms/{order_id}", response_model=ChatRoomResponse)
def get_chat_room(order_id: str):
    """Get chat room for an order"""
    try:
        # Verify order exists
        order = OrderRepository.find_by_id(order_id)
        if not order:
            raise HTTPException(status_code=404, detail="Order not found")
        
        chat_room = ChatRepository.find_by_order_id(order_id)
        if not chat_room:
            raise HTTPException(status_code=404, detail="Chat room not found for this order")
        
        return ChatRoomResponse.model_validate(chat_room)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching chat room: {str(e)}")


@router.get("/rooms", response_model=List[ChatRoomResponse])
def get_user_chat_rooms(
    user_email: str,
    skip: int = 0,
    limit: int = 100
):
    """Get all chat rooms for a user"""
    try:
        chat_rooms = ChatService.get_user_chat_rooms(user_email)
        return [ChatRoomResponse.model_validate(room) for room in chat_rooms[skip:skip+limit]]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching chat rooms: {str(e)}")


@router.post("/rooms/{order_id}/messages", response_model=ChatMessageResponse, status_code=201)
def create_message(
    order_id: str,
    message: ChatMessageCreate,
    sender_email: str,
    sender_role: str,
    sender_name: str
):
    """Create a new message in a chat room"""
    try:
        # Verify order exists
        order = OrderRepository.find_by_id(order_id)
        if not order:
            raise HTTPException(status_code=404, detail="Order not found")
        
        new_message = ChatService.add_message(
            order_id=order_id,
            sender_email=sender_email,
            sender_role=UserRole[sender_role.upper()],
            sender_name=sender_name,
            text=message.text
        )
        
        return ChatMessageResponse.model_validate(new_message)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating message: {str(e)}")


@router.get("/rooms/{order_id}/messages", response_model=List[ChatMessageResponse])
def get_messages(order_id: str):
    """Get all messages for a chat room"""
    try:
        chat_room = ChatRepository.find_by_order_id(order_id)
        if not chat_room:
            raise HTTPException(status_code=404, detail="Chat room not found")
        
        return [ChatMessageResponse.model_validate(msg) for msg in chat_room.messages]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching messages: {str(e)}")

