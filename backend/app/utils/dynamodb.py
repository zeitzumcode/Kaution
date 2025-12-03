"""
Utility functions for DynamoDB operations
Convert between Pydantic models and DynamoDB format
"""
from typing import Any, Dict
from decimal import Decimal
import json
from datetime import datetime


def decimal_default(obj):
    """JSON encoder for Decimal types"""
    if isinstance(obj, Decimal):
        return float(obj)
    raise TypeError(f"Object of type {type(obj)} is not JSON serializable")


def to_dynamodb_dict(model: Any) -> Dict[str, Any]:
    """Convert Pydantic model to DynamoDB format"""
    data = model.model_dump(mode='json', exclude_none=True)
    # Convert floats to Decimals for DynamoDB compatibility
    return _convert_floats_to_decimal(data)


def _convert_floats_to_decimal(obj: Any) -> Any:
    """Recursively convert float values to Decimal for DynamoDB"""
    if isinstance(obj, float):
        return Decimal(str(obj))
    elif isinstance(obj, dict):
        return {k: _convert_floats_to_decimal(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [_convert_floats_to_decimal(item) for item in obj]
    else:
        return obj


def format_datetime(dt: datetime) -> str:
    """Format datetime to ISO string"""
    if isinstance(dt, str):
        return dt
    return dt.isoformat()


def parse_datetime(dt_str: str) -> datetime:
    """Parse ISO string to datetime"""
    if isinstance(dt_str, datetime):
        return dt_str
    return datetime.fromisoformat(dt_str.replace('Z', '+00:00'))

