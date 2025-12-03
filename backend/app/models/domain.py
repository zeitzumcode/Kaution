from pydantic import BaseModel, EmailStr
from typing import List, Optional
from .enums import UserRole, OrderStatus, ProgressStageType


# Embedded models (not separate tables)
class ProgressStage(BaseModel):
    stage: ProgressStageType
    title: str
    completed: bool = False
    date: Optional[str] = None  # ISO format string
    completed_by: Optional[str] = None


class ChatParticipant(BaseModel):
    email: EmailStr
    role: UserRole
    name: Optional[str] = None


class ChatMessage(BaseModel):
    sender_email: EmailStr
    sender_role: UserRole
    sender_name: str
    text: str
    timestamp: str  # ISO format string


class ChatRoom(BaseModel):
    order_id: str
    participants: List[ChatParticipant] = []
    messages: List[ChatMessage] = []
    created_at: str  # ISO format string
    updated_at: str  # ISO format string


# Main domain models
class User(BaseModel):
    email: EmailStr
    role: UserRole
    name: str
    created_at: str  # ISO format string
    updated_at: str  # ISO format string


class Order(BaseModel):
    id: str
    title: str
    renter_email: EmailStr
    landlord_email: EmailStr
    property_address: str
    deposit_amount: float
    description: Optional[str] = None
    status: OrderStatus = OrderStatus.PENDING
    created_by: EmailStr
    progress_stages: List[ProgressStage] = []
    chat_room: Optional[ChatRoom] = None
    created_at: str  # ISO format string
    updated_at: str  # ISO format string

