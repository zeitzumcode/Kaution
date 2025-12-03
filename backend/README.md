# Kaution Backend API

FastAPI backend service using AWS DynamoDB with Docker for local development.

## 🏗️ Architecture

The backend is organized in a layered architecture for better maintainability:

- **Core**: Configuration and database setup
- **Models**: Domain models and enums
- **Schemas**: API request/response validation
- **Repositories**: Data access layer
- **Services**: Business logic layer
- **API**: HTTP route handlers

See [STRUCTURE.md](./STRUCTURE.md) for detailed architecture documentation.

## Features

- ✅ **RESTful API** built with FastAPI
- ✅ **DynamoDB** database with Docker Local setup
- ✅ **Layered Architecture** for maintainability
- ✅ **CORS** enabled for frontend integration
- ✅ **Auto-generated API documentation** at `/docs`

## Technology Stack

- **FastAPI** 0.104.1 - Modern Python web framework
- **DynamoDB** - AWS NoSQL database (local with Docker)
- **boto3** - AWS SDK for Python
- **Pydantic** 2.5.0 - Data validation
- **Uvicorn** - ASGI server
- **Docker Compose** - Local DynamoDB setup

## Prerequisites

- Python 3.9 or higher
- Docker and Docker Compose installed
- pip (Python package manager)

## Setup

### 1. Create Virtual Environment

```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Start DynamoDB Local

```bash
docker-compose up -d
```

This starts DynamoDB Local on port 8000.

### 4. Environment Configuration

Create a `.env` file in the `backend/` directory:

```env
# DynamoDB Configuration (Local)
DYNAMODB_ENDPOINT_URL=http://localhost:8000
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=dummy
AWS_SECRET_ACCESS_KEY=dummy

# Application Settings
SECRET_KEY=your-secret-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS Settings
CORS_ORIGINS=http://localhost:8088,http://localhost:5173
```

### 5. Start the Server

**Note:** Make sure your virtual environment is activated before running:

```bash
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8001
```

**Note:** Using port 8001 to avoid conflict with DynamoDB Local on port 8000.

The API will be available at:
- **API**: http://localhost:8001
- **Documentation**: http://localhost:8001/docs
- **Alternative Docs**: http://localhost:8001/redoc

## Quick Start Commands

Here are the essential commands to get started:

```bash
# 1. Navigate to backend directory
cd backend

# 2. Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Start DynamoDB (in a separate terminal)
docker-compose up -d

# 5. Start the backend server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8001
```

That's it! Your backend API is now running at http://localhost:8001

## Docker Commands

```bash
# Start DynamoDB Local
docker-compose up -d

# Stop DynamoDB
docker-compose down

# View logs
docker-compose logs -f dynamodb-local

# Restart services
docker-compose restart

# Start both DynamoDB and Backend (if using Docker)
docker-compose up
```

## API Endpoints

### Authentication

- `POST /api/auth/login` - Login or create a user
- `GET /api/auth/users` - Get all users
- `GET /api/auth/users/{email}` - Get user by email
- `POST /api/auth/users` - Create a new user

### Orders

- `GET /api/orders` - Get orders (filtered by user_email and user_role)
- `GET /api/orders/{order_id}` - Get a single order
- `POST /api/orders` - Create a new order
- `PUT /api/orders/{order_id}` - Update an order
- `DELETE /api/orders/{order_id}` - Delete an order

### Chat

- `GET /api/chat/rooms/{order_id}` - Get chat room for an order
- `GET /api/chat/rooms` - Get all chat rooms for a user
- `GET /api/chat/rooms/{order_id}/messages` - Get messages for a chat room
- `POST /api/chat/rooms/{order_id}/messages` - Create a new message

### Health Check

- `GET /` - Root endpoint
- `GET /health` - Health check endpoint

## API Documentation

Once the server is running, visit:
- **Swagger UI**: http://localhost:8001/docs
- **ReDoc**: http://localhost:8001/redoc

## Project Structure

```
backend/
├── app/                  # Main application package
│   ├── core/            # Configuration & database
│   ├── models/          # Domain models
│   ├── schemas/         # API schemas
│   ├── repositories/    # Data access layer
│   ├── services/        # Business logic
│   ├── api/            # API routes
│   ├── utils/          # Utilities
│   └── scripts/        # Utility scripts
├── docker-compose.yml
└── requirements.txt
```

For detailed structure documentation, see [STRUCTURE.md](./STRUCTURE.md).

## Database Tables

Tables are automatically created when the server starts:

- **users** - User accounts (key: email + role)
- **orders** - Deposit orders (key: id, with GSIs for filtering)
- **chat_rooms** - Chat rooms (key: order_id)

## Using AWS DynamoDB (Production)

To use real AWS DynamoDB instead of local:

1. Update `.env` file:
```env
# Remove or comment out DYNAMODB_ENDPOINT_URL for AWS
# DYNAMODB_ENDPOINT_URL=http://localhost:8000
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-actual-aws-key
AWS_SECRET_ACCESS_KEY=your-actual-aws-secret
```

2. Create tables in AWS Console (or they'll be created automatically on first run)

## Troubleshooting

### DynamoDB Not Starting

```bash
# Check if port 8000 is available
lsof -i :8000

# Kill process if needed
kill -9 <PID>
```

### Connection Errors

Make sure DynamoDB is running:
```bash
docker-compose ps
curl http://localhost:8000
```

### Port Already in Use

If port 8001 is already in use, use a different port:
```bash
uvicorn app.main:app --port 8002
```

## Development

The codebase follows a clean architecture pattern:

1. **Routes** handle HTTP requests
2. **Services** contain business logic
3. **Repositories** handle data access
4. **Models** define domain entities

This separation makes the code:
- Easy to test
- Easy to maintain
- Easy to extend

## License

This project is open source and available for educational and commercial use.
