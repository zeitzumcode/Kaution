from enum import Enum


class UserRole(str, Enum):
    AGENT = "agent"
    RENTER = "renter"
    LANDLORD = "landlord"


class OrderStatus(str, Enum):
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"


class ProgressStageType(str, Enum):
    ORDER_CREATED = "order_created"
    RENTER_REVIEW = "renter_review"
    LANDLORD_REVIEW = "landlord_review"
    DEPOSIT_HELD = "deposit_held"
    COMPLETED = "completed"

