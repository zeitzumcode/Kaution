from fastapi import APIRouter, HTTPException
from app.schemas.order import OrderCreate, OrderResponse, OrderUpdate
from app.services.order_service import OrderService
from app.repositories.order_repository import OrderRepository
from app.utils.dynamodb import format_datetime
from datetime import datetime
from typing import List, Optional

router = APIRouter(prefix="/api/orders", tags=["orders"])


@router.post("", response_model=OrderResponse, status_code=201)
def create_order(order: OrderCreate, created_by: str = None):
    """Create a new order"""
    if not created_by:
        raise HTTPException(status_code=400, detail="created_by parameter is required")
    
    try:
        new_order = OrderService.create_order(
            title=order.title,
            renter_email=order.renter_email,
            landlord_email=order.landlord_email,
            property_address=order.property_address,
            deposit_amount=order.deposit_amount,
            description=order.description,
            created_by=created_by
        )
        return new_order
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating order: {str(e)}")


@router.get("", response_model=List[OrderResponse])
def get_orders(
    user_email: Optional[str] = None,
    user_role: Optional[str] = None,
    skip: int = 0,
    limit: int = 100
):
    """Get orders filtered by user email and role"""
    try:
        if user_email and user_role:
            from app.models.enums import UserRole
            orders = OrderService.get_orders_for_user(
                user_email,
                UserRole[user_role.upper()]
            )
        else:
            orders = OrderRepository.find_all()
        
        # Load chat rooms for all orders
        from app.repositories.chat_repository import ChatRepository
        for order in orders:
            chat_room = ChatRepository.find_by_order_id(order.id)
            if chat_room:
                order.chat_room = chat_room
        
        # Apply skip and limit
        return orders[skip:skip+limit]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching orders: {str(e)}")


@router.get("/{order_id}", response_model=OrderResponse)
def get_order(order_id: str):
    """Get a single order by ID"""
    try:
        order = OrderRepository.find_by_id(order_id)
        if not order:
            raise HTTPException(status_code=404, detail="Order not found")
        
        # Load chat room if it exists
        from app.repositories.chat_repository import ChatRepository
        chat_room = ChatRepository.find_by_order_id(order_id)
        if chat_room:
            order.chat_room = chat_room
        
        return order
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching order: {str(e)}")


@router.put("/{order_id}", response_model=OrderResponse)
def update_order(order_id: str, order_update: OrderUpdate):
    """Update an order"""
    try:
        order = OrderRepository.find_by_id(order_id)
        if not order:
            raise HTTPException(status_code=404, detail="Order not found")
        
        # Update fields
        update_data = order_update.model_dump(exclude_unset=True)
        
        # Handle progress_stages separately - convert response models to domain models
        if 'progress_stages' in update_data:
            from app.models.domain import ProgressStage
            progress_stages = [
                ProgressStage(
                    stage=ps['stage'],
                    title=ps['title'],
                    completed=ps['completed'],
                    date=ps.get('date'),
                    completed_by=ps.get('completed_by')
                )
                for ps in update_data['progress_stages']
            ]
            order.progress_stages = progress_stages
            del update_data['progress_stages']
        
        # Update other fields
        for field, value in update_data.items():
            setattr(order, field, value)
        
        order.updated_at = format_datetime(datetime.utcnow())
        OrderRepository.update(order)
        
        return order
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating order: {str(e)}")


@router.delete("/{order_id}", status_code=204)
def delete_order(order_id: str, created_by: str = None):
    """Delete an order - only agents who created it can delete"""
    try:
        order = OrderRepository.find_by_id(order_id)
        if not order:
            raise HTTPException(status_code=404, detail="Order not found")
        
        # Check authorization: only agents who created the order can delete it
        if not created_by:
            raise HTTPException(status_code=400, detail="created_by parameter is required")
        
        from app.models.enums import UserRole
        from app.repositories.user_repository import UserRepository
        
        # Verify user is an agent
        users = UserRepository.find_by_email(created_by)
        user = next((u for u in users if u.role == UserRole.AGENT), None)
        if not user:
            raise HTTPException(status_code=403, detail="Only agents can delete orders")
        
        # Verify the agent created this order
        if order.created_by != created_by:
            raise HTTPException(status_code=403, detail="You can only delete orders you created")
        
        # Delete order
        OrderRepository.delete(order_id)
        
        # Delete associated chat room
        from app.repositories.chat_repository import ChatRepository
        try:
            ChatRepository.delete(order_id)
        except:
            pass  # Chat room might not exist
        
        return None
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting order: {str(e)}")

