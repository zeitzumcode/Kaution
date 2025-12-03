import boto3
from botocore.exceptions import ClientError
from botocore.config import Config
from app.core.config import settings
from typing import Optional
import time


# Configure boto3 with longer timeouts for local DynamoDB
boto_config = Config(
    connect_timeout=10,
    read_timeout=30,
    retries={'max_attempts': 3, 'mode': 'standard'}
)


def get_dynamodb_client():
    """Get or create DynamoDB client"""
    if settings.DYNAMODB_ENDPOINT_URL:
        # Local DynamoDB
        return boto3.client(
            'dynamodb',
            endpoint_url=settings.DYNAMODB_ENDPOINT_URL,
            region_name=settings.AWS_REGION,
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
            config=boto_config
        )
    else:
        # AWS DynamoDB
        return boto3.client(
            'dynamodb',
            region_name=settings.AWS_REGION,
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
            config=boto_config
        )


def get_dynamodb_resource():
    """Get or create DynamoDB resource"""
    if settings.DYNAMODB_ENDPOINT_URL:
        # Local DynamoDB
        return boto3.resource(
            'dynamodb',
            endpoint_url=settings.DYNAMODB_ENDPOINT_URL,
            region_name=settings.AWS_REGION,
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
            config=boto_config
        )
    else:
        # AWS DynamoDB
        return boto3.resource(
            'dynamodb',
            region_name=settings.AWS_REGION,
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
            config=boto_config
        )


def init_tables():
    """Initialize DynamoDB tables if they don't exist"""
    # Wait for DynamoDB to be ready (with retries)
    max_retries = 5
    retry_delay = 2
    
    for attempt in range(max_retries):
        try:
            client = get_dynamodb_client()
            # Test connection by listing tables
            client.list_tables()
            break
        except Exception as e:
            if attempt < max_retries - 1:
                print(f"DynamoDB not ready, retrying in {retry_delay} seconds... (attempt {attempt + 1}/{max_retries})")
                time.sleep(retry_delay)
            else:
                raise Exception(f"Failed to connect to DynamoDB after {max_retries} attempts: {e}")
    
    tables = {
        'users': {
            'KeySchema': [
                {'AttributeName': 'email', 'KeyType': 'HASH'},
                {'AttributeName': 'role', 'KeyType': 'RANGE'}
            ],
            'AttributeDefinitions': [
                {'AttributeName': 'email', 'AttributeType': 'S'},
                {'AttributeName': 'role', 'AttributeType': 'S'}
            ],
            'BillingMode': 'PAY_PER_REQUEST'
        },
        'orders': {
            'KeySchema': [
                {'AttributeName': 'id', 'KeyType': 'HASH'}
            ],
            'AttributeDefinitions': [
                {'AttributeName': 'id', 'AttributeType': 'S'},
                {'AttributeName': 'created_by', 'AttributeType': 'S'},
                {'AttributeName': 'renter_email', 'AttributeType': 'S'},
                {'AttributeName': 'landlord_email', 'AttributeType': 'S'}
            ],
            'BillingMode': 'PAY_PER_REQUEST',
            'GlobalSecondaryIndexes': [
                {
                    'IndexName': 'created-by-index',
                    'KeySchema': [
                        {'AttributeName': 'created_by', 'KeyType': 'HASH'}
                    ],
                    'Projection': {'ProjectionType': 'ALL'}
                },
                {
                    'IndexName': 'renter-email-index',
                    'KeySchema': [
                        {'AttributeName': 'renter_email', 'KeyType': 'HASH'}
                    ],
                    'Projection': {'ProjectionType': 'ALL'}
                },
                {
                    'IndexName': 'landlord-email-index',
                    'KeySchema': [
                        {'AttributeName': 'landlord_email', 'KeyType': 'HASH'}
                    ],
                    'Projection': {'ProjectionType': 'ALL'}
                }
            ]
        },
        'chat_rooms': {
            'KeySchema': [
                {'AttributeName': 'order_id', 'KeyType': 'HASH'}
            ],
            'AttributeDefinitions': [
                {'AttributeName': 'order_id', 'AttributeType': 'S'}
            ],
            'BillingMode': 'PAY_PER_REQUEST'
        }
    }
    
    for table_name, table_config in tables.items():
        try:
            client.describe_table(TableName=table_name)
            print(f"Table {table_name} already exists")
        except ClientError as e:
            if e.response['Error']['Code'] == 'ResourceNotFoundException':
                try:
                    client.create_table(TableName=table_name, **table_config)
                    print(f"Created table {table_name}")
                except Exception as create_error:
                    print(f"Error creating table {table_name}: {create_error}")
            else:
                print(f"Error checking table {table_name}: {e}")

