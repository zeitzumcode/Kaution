// Chat Service - handles chat messages with backend API
import apiClient from './apiClient';
import { API_ENDPOINTS } from '../config/api';

const USE_BACKEND = import.meta.env.VITE_USE_BACKEND !== 'false';

export const createChatRoom = (orderId, participants) => {
    return {
        orderId,
        participants,
        messages: [],
        createdAt: new Date(),
        updatedAt: new Date()
    };
};

export const getChatRoom = async (orderId) => {
    if (!USE_BACKEND) {
        // Fallback - this would need to get order from context
        return null;
    }

    try {
        const chatRoom = await apiClient.get(API_ENDPOINTS.CHAT_ROOM(orderId));
        
        return {
            orderId: chatRoom.order_id,
            participants: chatRoom.participants || [],
            messages: chatRoom.messages?.map(msg => ({
                id: msg.timestamp || Date.now().toString(),
                senderEmail: msg.sender_email,
                senderRole: msg.sender_role,
                senderName: msg.sender_name,
                text: msg.text,
                timestamp: new Date(msg.timestamp)
            })) || [],
            createdAt: new Date(chatRoom.created_at),
            updatedAt: new Date(chatRoom.updated_at)
        };
    } catch (error) {
        console.error('Error fetching chat room:', error);
        throw error;
    }
};

export const getMessages = async (orderId) => {
    if (!USE_BACKEND) {
        return [];
    }

    try {
        const messages = await apiClient.get(API_ENDPOINTS.CHAT_MESSAGES(orderId));
        return messages.map(msg => ({
            id: msg.timestamp || Date.now().toString(),
            senderEmail: msg.sender_email,
            senderRole: msg.sender_role,
            senderName: msg.sender_name,
            text: msg.text,
            timestamp: new Date(msg.timestamp)
        }));
    } catch (error) {
        console.error('Error fetching messages:', error);
        throw error;
    }
};

export const sendMessage = async (orderId, senderEmail, senderRole, senderName, text) => {
    if (!USE_BACKEND) {
        // Fallback to localStorage
        const message = {
            id: Date.now().toString(),
            senderEmail,
            senderRole,
            senderName,
            text,
            timestamp: new Date()
        };
        return message;
    }

    try {
        const queryParams = {
            sender_email: senderEmail,
            sender_role: senderRole,
            sender_name: senderName
        };
        
        const message = await apiClient.post(
            API_ENDPOINTS.CREATE_MESSAGE(orderId),
            { text },
            queryParams
        );
        
        return {
            id: message.timestamp || Date.now().toString(),
            senderEmail: message.sender_email,
            senderRole: message.sender_role,
            senderName: message.sender_name,
            text: message.text,
            timestamp: new Date(message.timestamp)
        };
    } catch (error) {
        console.error('Error sending message:', error);
        throw error;
    }
};

export const addMessage = (chatRoom, senderEmail, senderRole, senderName, text) => {
    const message = {
        id: Date.now().toString(),
        senderEmail,
        senderRole,
        senderName,
        text,
        timestamp: new Date()
    };
    
    chatRoom.messages.push(message);
    chatRoom.updatedAt = new Date();
    return chatRoom;
};

export const formatMessageTime = (date) => {
    if (!date) return '';
    const messageDate = new Date(date);
    const now = new Date();
    const diff = now - messageDate;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    
    return messageDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: messageDate.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
};
