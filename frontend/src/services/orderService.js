// Order Service - handles order data operations
import { createDemoOrders } from './demoData';

export const loadOrders = () => {
    const stored = localStorage.getItem('depositOrders');
    if (stored) {
        try {
            const orders = JSON.parse(stored);
            // Convert date strings back to Date objects
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
            return initializeDemoData();
        }
    }
    // Initialize with demo data if no orders exist
    return initializeDemoData();
};

const initializeDemoData = () => {
    // Check if demo data has been initialized before
    const demoInitialized = localStorage.getItem('demoDataInitialized');
    if (!demoInitialized) {
        const demoOrders = createDemoOrders();
        localStorage.setItem('depositOrders', JSON.stringify(demoOrders));
        localStorage.setItem('demoDataInitialized', 'true');
        return demoOrders;
    }
    return [];
};

// Utility function to reset and load demo data
export const loadDemoData = () => {
    localStorage.removeItem('depositOrders');
    localStorage.removeItem('demoDataInitialized');
    const demoOrders = createDemoOrders();
    localStorage.setItem('depositOrders', JSON.stringify(demoOrders));
    localStorage.setItem('demoDataInitialized', 'true');
    return demoOrders;
};

export const saveOrders = (orders) => {
    localStorage.setItem('depositOrders', JSON.stringify(orders));
};

export const getOrderProgress = (order) => {
    const completed = order.progress.filter(p => p.completed).length;
    return Math.round((completed / order.progress.length) * 100);
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

