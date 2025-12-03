from pydantic import BaseModel, EmailStr
from typing import List, Optional
from app.models.enums import UserRole, ProgressStageType


class ProgressStageResponse(BaseModel):
    stage: ProgressStageType
    title: str
    completed: bool
    date: Optional[str] = None
    completed_by: Optional[str] = None

    class Config:
        from_attributes = True


class ChatParticipantResponse(BaseModel):
    email: EmailStr
    role: UserRole
    name: Optional[str] = None

    class Config:
        from_attributes = True


class ChatMessageCreate(BaseModel):
    text: str


class ChatMessageResponse(BaseModel):
    sender_email: str
    sender_role: UserRole
    sender_name: str
    text: str
    timestamp: str

    class Config:
        from_attributes = True


class ChatRoomResponse(BaseModel):
    order_id: str
    participants: List[ChatParticipantResponse]
    messages: List[ChatMessageResponse]
    created_at: str
    updated_at: str

    class Config:
        from_attributes = True

