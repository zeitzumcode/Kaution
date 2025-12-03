from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import init_tables
from app.api.routes import auth, orders, chat
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize DynamoDB tables and static data (non-blocking)
import threading
def init_data_async():
    try:
        init_tables()
        logger.info("DynamoDB tables initialized")
        
        # Initialize static data after tables are ready
        from app.scripts.init_static_data import init_static_data
        init_static_data()
    except Exception as e:
        logger.warning(f"Error initializing data (they may already exist): {e}")

# Start data initialization in background
threading.Thread(target=init_data_async, daemon=True).start()

# Create FastAPI app
app = FastAPI(
    title="Kaution API",
    description="Deposit Management Platform API",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(orders.router)
app.include_router(chat.router)


@app.get("/")
def root():
    return {
        "message": "Kaution API",
        "version": "1.0.0",
        "docs": "/docs"
    }


@app.get("/health")
def health_check():
    return {"status": "healthy"}

