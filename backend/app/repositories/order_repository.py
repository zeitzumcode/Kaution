from app.core.database import get_dynamodb_resource, init_tables
from app.models.domain import Order
from app.utils.dynamodb import to_dynamodb_dict
from botocore.exceptions import ClientError
from typing import List, Optional
import logging

logger = logging.getLogger(__name__)


class OrderRepository:
    """Repository for order data access"""
    
    @staticmethod
    def get_table():
        """Get orders table, ensuring it exists"""
        table = get_dynamodb_resource().Table('orders')
        # Check if table exists, if not try to initialize
        try:
            table.meta.client.describe_table(TableName='orders')
        except ClientError as e:
            if e.response['Error']['Code'] == 'ResourceNotFoundException':
                logger.warning("Orders table not found, attempting to initialize...")
                init_tables()
                # Wait a moment for table creation
                import time
                time.sleep(1)
            else:
                raise
        return table
    
    @staticmethod
    def find_by_id(order_id: str) -> Optional[Order]:
        """Find order by ID"""
        table = OrderRepository.get_table()
        response = table.get_item(Key={'id': order_id})
        if 'Item' in response:
            return Order(**response['Item'])
        return None
    
    @staticmethod
    def find_by_created_by(email: str) -> List[Order]:
        """Find orders created by user"""
        try:
            table = OrderRepository.get_table()
            response = table.query(
                IndexName='created-by-index',
                KeyConditionExpression='created_by = :email',
                ExpressionAttributeValues={
                    ':email': email
                }
            )
            return [Order(**item) for item in response.get('Items', [])]
        except ClientError as e:
            if e.response['Error']['Code'] == 'ResourceNotFoundException':
                logger.error("Orders table or index not found. Please ensure tables are initialized.")
                return []
            raise
    
    @staticmethod
    def find_by_renter_email(email: str) -> List[Order]:
        """Find orders for renter"""
        try:
            table = OrderRepository.get_table()
            response = table.query(
                IndexName='renter-email-index',
                KeyConditionExpression='renter_email = :email',
                ExpressionAttributeValues={
                    ':email': email
                }
            )
            return [Order(**item) for item in response.get('Items', [])]
        except ClientError as e:
            if e.response['Error']['Code'] == 'ResourceNotFoundException':
                logger.error("Orders table or index not found. Please ensure tables are initialized.")
                return []
            raise
    
    @staticmethod
    def find_by_landlord_email(email: str) -> List[Order]:
        """Find orders for landlord"""
        try:
            table = OrderRepository.get_table()
            response = table.query(
                IndexName='landlord-email-index',
                KeyConditionExpression='landlord_email = :email',
                ExpressionAttributeValues={
                    ':email': email
                }
            )
            return [Order(**item) for item in response.get('Items', [])]
        except ClientError as e:
            if e.response['Error']['Code'] == 'ResourceNotFoundException':
                logger.error("Orders table or index not found. Please ensure tables are initialized.")
                return []
            raise
    
    @staticmethod
    def find_all() -> List[Order]:
        """Get all orders"""
        try:
            table = OrderRepository.get_table()
            response = table.scan()
            return [Order(**item) for item in response.get('Items', [])]
        except ClientError as e:
            if e.response['Error']['Code'] == 'ResourceNotFoundException':
                logger.error("Orders table not found. Please ensure tables are initialized.")
                return []
            raise
    
    @staticmethod
    def create(order: Order) -> Order:
        """Create a new order"""
        table = OrderRepository.get_table()
        table.put_item(Item=to_dynamodb_dict(order))
        return order
    
    @staticmethod
    def update(order: Order) -> Order:
        """Update an order"""
        table = OrderRepository.get_table()
        table.put_item(Item=to_dynamodb_dict(order))
        return order
    
    @staticmethod
    def delete(order_id: str):
        """Delete an order"""
        table = OrderRepository.get_table()
        table.delete_item(Key={'id': order_id})

