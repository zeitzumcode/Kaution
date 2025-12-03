// Order Service - handles order data operations with backend API
import apiClient from './apiClient';
import { API_ENDPOINTS } from '../config/api';

const USE_BACKEND = import.meta.env.VITE_USE_BACKEND !== 'false';

// Transform backend order format to frontend format
const transformOrder = (order) => ({
    id: order.id,
    title: order.title,
    renterEmail: order.renter_email,
    landlordEmail: order.landlord_email,
    propertyAddress: order.property_address,
    depositAmount: order.deposit_amount,
    description: order.description,
    status: order.status,
    createdBy: order.created_by,
    createdAt: new Date(order.created_at),
    updatedAt: new Date(order.updated_at),
    progress: order.progress_stages?.map(stage => ({
        stage: stage.stage,
        title: stage.title,
        completed: stage.completed,
        date: stage.date ? new Date(stage.date) : null,
        completedBy: stage.completed_by || null
    })) || [],
    chatRoom: order.chat_room ? {
        orderId: order.chat_room.order_id,
        participants: order.chat_room.participants || [],
        messages: order.chat_room.messages?.map(msg => ({
            id: msg.timestamp || Date.now().toString(),
            senderEmail: msg.sender_email,
            senderRole: msg.sender_role,
            senderName: msg.sender_name,
            text: msg.text,
            timestamp: new Date(msg.timestamp)
        })) || [],
        createdAt: new Date(order.chat_room.created_at),
        updatedAt: new Date(order.chat_room.updated_at)
    } : null
});

// Transform frontend order format to backend format
const transformOrderForBackend = (order) => ({
    title: order.title,
    renter_email: order.renterEmail,
    landlord_email: order.landlordEmail,
    property_address: order.propertyAddress,
    deposit_amount: order.depositAmount,
    description: order.description
});

export const loadOrders = async (userEmail, userRole) => {
    if (!USE_BACKEND) {
        // Fallback to localStorage
        const stored = localStorage.getItem('depositOrders');
        if (stored) {
            try {
                const orders = JSON.parse(stored);
                return orders.map(order => ({
                    ...order,
                    createdAt: new Date(order.createdAt),
                    updatedAt: new Date(order.updatedAt),
                    progress: order.progress.map(p => ({
                        ...p,
                        date: p.date ? new Date(p.date) : null
                    })),
                    chatRoom: order.chatRoom ? {
                        ...order.chatRoom,
                        createdAt: new Date(order.chatRoom.createdAt),
                        updatedAt: new Date(order.chatRoom.updatedAt),
                        messages: order.chatRoom.messages.map(msg => ({
                            ...msg,
                            timestamp: new Date(msg.timestamp)
                        }))
                    } : null
                }));
            } catch (e) {
                console.error('Error loading orders:', e);
                return [];
            }
        }
        return [];
    }

    try {
        const params = {};
        if (userEmail && userRole) {
            params.user_email = userEmail;
            params.user_role = userRole;
        }
        
        const orders = await apiClient.get(API_ENDPOINTS.ORDERS, params);
        return orders.map(transformOrder);
    } catch (error) {
        console.error('Error loading orders from backend:', error);
        throw error;
    }
};

export const createOrder = async (orderData, createdBy) => {
    if (!USE_BACKEND) {
        // Fallback to localStorage
        const newOrder = {
            id: Date.now().toString(),
            ...orderData,
            status: 'pending',
            createdAt: new Date(),
            updatedAt: new Date(),
            progress: [
                {
                    stage: 'order_created',
                    title: 'Order Created',
                    completed: true,
                    date: new Date(),
                    completedBy: createdBy
                },
                {
                    stage: 'renter_review',
                    title: 'Renter Review',
                    completed: false,
                    date: null,
                    completedBy: null
                },
                {
                    stage: 'landlord_review',
                    title: 'Landlord Review',
                    completed: false,
                    date: null,
                    completedBy: null
                },
                {
                    stage: 'deposit_held',
                    title: 'Deposit Held',
                    completed: false,
                    date: null,
                    completedBy: null
                },
                {
                    stage: 'completed',
                    title: 'Completed',
                    completed: false,
                    date: null,
                    completedBy: null
                }
            ]
        };
        
        const orders = loadOrders();
        orders.push(newOrder);
        saveOrders(orders);
        return newOrder;
    }

    try {
        const orderPayload = transformOrderForBackend(orderData);
        const order = await apiClient.post(
            API_ENDPOINTS.ORDERS,
            orderPayload,
            { created_by: createdBy }
        );
        return transformOrder(order);
    } catch (error) {
        console.error('Error creating order:', error);
        throw error;
    }
};

export const updateOrder = async (orderId, updates) => {
    if (!USE_BACKEND) {
        // Fallback to localStorage
        const orders = loadOrders();
        const updatedOrders = orders.map(order => 
            order.id === orderId 
                ? { ...order, ...updates, updatedAt: new Date() }
                : order
        );
        saveOrders(updatedOrders);
        return updatedOrders.find(o => o.id === orderId);
    }

    try {
        // Transform updates to backend format
        const backendUpdates = {};
        if (updates.title) backendUpdates.title = updates.title;
        if (updates.renterEmail) backendUpdates.renter_email = updates.renterEmail;
        if (updates.landlordEmail) backendUpdates.landlord_email = updates.landlordEmail;
        if (updates.propertyAddress) backendUpdates.property_address = updates.propertyAddress;
        if (updates.depositAmount !== undefined) backendUpdates.deposit_amount = updates.depositAmount;
        if (updates.description) backendUpdates.description = updates.description;
        if (updates.status) backendUpdates.status = updates.status;
        
        // Transform progress to progress_stages
        if (updates.progress) {
            backendUpdates.progress_stages = updates.progress.map(stage => ({
                stage: stage.stage,
                title: stage.title,
                completed: stage.completed,
                date: stage.date ? (typeof stage.date === 'string' ? stage.date : stage.date.toISOString()) : null,
                completed_by: stage.completedBy || null
            }));
        }

        const order = await apiClient.put(API_ENDPOINTS.ORDER_BY_ID(orderId), backendUpdates);
        return transformOrder(order);
    } catch (error) {
        console.error('Error updating order:', error);
        throw error;
    }
};

export const getOrder = async (orderId) => {
    if (!USE_BACKEND) {
        const orders = loadOrders();
        return orders.find(o => o.id === orderId);
    }

    try {
        const order = await apiClient.get(API_ENDPOINTS.ORDER_BY_ID(orderId));
        return transformOrder(order);
    } catch (error) {
        console.error('Error fetching order:', error);
        throw error;
    }
};

export const deleteOrder = async (orderId, createdBy) => {
    if (!USE_BACKEND) {
        // Fallback to localStorage
        const orders = loadOrders();
        const filteredOrders = orders.filter(o => o.id !== orderId);
        saveOrders(filteredOrders);
        return;
    }

    try {
        await apiClient.delete(API_ENDPOINTS.ORDER_BY_ID(orderId), null, { created_by: createdBy });
    } catch (error) {
        console.error('Error deleting order:', error);
        throw error;
    }
};

export const saveOrders = (orders) => {
    if (!USE_BACKEND) {
        localStorage.setItem('depositOrders', JSON.stringify(orders));
    }
    // Backend operations don't need manual saving
};

export const getOrderProgress = (order) => {
    const completed = order.progress?.filter(p => p.completed).length || 0;
    const total = order.progress?.length || 1;
    return Math.round((completed / total) * 100);
};

export const getOrdersForUser = (orders, user) => {
    if (!user) return [];

    const { role, email } = user;

    switch (role) {
        case 'agent':
            return orders.filter(o => o.createdBy === email);
        case 'renter':
            return orders.filter(o => o.renterEmail === email);
        case 'landlord':
            return orders.filter(o => o.landlordEmail === email);
        default:
            return [];
    }
};

export const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};
