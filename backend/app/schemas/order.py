from pydantic import BaseModel, EmailStr
from typing import List, Optional
from app.models.enums import OrderStatus
from .chat import ProgressStageResponse, ChatRoomResponse


class OrderBase(BaseModel):
    title: str
    renter_email: EmailStr
    landlord_email: EmailStr
    property_address: str
    deposit_amount: float
    description: Optional[str] = None


class OrderCreate(OrderBase):
    pass


class OrderUpdate(BaseModel):
    title: Optional[str] = None
    renter_email: Optional[EmailStr] = None
    landlord_email: Optional[EmailStr] = None
    property_address: Optional[str] = None
    deposit_amount: Optional[float] = None
    description: Optional[str] = None
    status: Optional[OrderStatus] = None
    progress_stages: Optional[List[ProgressStageResponse]] = None


class OrderResponse(BaseModel):
    id: str
    title: str
    renter_email: str
    landlord_email: str
    property_address: str
    deposit_amount: float
    description: Optional[str]
    status: OrderStatus
    created_by: str
    created_at: str
    updated_at: str
    progress_stages: List[ProgressStageResponse] = []
    chat_room: Optional[ChatRoomResponse] = None

    class Config:
        from_attributes = True

