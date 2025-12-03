// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8001';

export const API_ENDPOINTS = {
    // Auth endpoints
    LOGIN: `${API_BASE_URL}/api/auth/login`,
    USERS: `${API_BASE_URL}/api/auth/users`,
    USER_BY_EMAIL: (email) => `${API_BASE_URL}/api/auth/users/${email}`,
    
    // Order endpoints
    ORDERS: `${API_BASE_URL}/api/orders`,
    ORDER_BY_ID: (id) => `${API_BASE_URL}/api/orders/${id}`,
    
    // Chat endpoints
    CHAT_ROOM: (orderId) => `${API_BASE_URL}/api/chat/rooms/${orderId}`,
    CHAT_ROOMS: `${API_BASE_URL}/api/chat/rooms`,
    CHAT_MESSAGES: (orderId) => `${API_BASE_URL}/api/chat/rooms/${orderId}/messages`,
    CREATE_MESSAGE: (orderId) => `${API_BASE_URL}/api/chat/rooms/${orderId}/messages`,
};

export default API_BASE_URL;

