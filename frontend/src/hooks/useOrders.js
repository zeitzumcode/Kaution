import { useState, useEffect } from 'react';
import { loadOrders, saveOrders, getOrdersForUser, loadDemoData } from '../services/orderService';
import { createChatRoom, addMessage } from '../services/chatService';

export const useOrders = (currentUser) => {
    const [orders, setOrders] = useState(loadOrders());

    useEffect(() => {
        saveOrders(orders);
    }, [orders]);

    const userOrders = getOrdersForUser(orders, currentUser);

    const createOrder = (orderData) => {
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
                    completedBy: currentUser.email
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
            ],
            // Create chat room automatically when order is created
            chatRoom: createChatRoom(newOrder.id, [
                { email: currentUser.email, role: 'agent' },
                { email: orderData.renterEmail, role: 'renter' },
                { email: orderData.landlordEmail, role: 'landlord' }
            ])
        };
        setOrders(prev => [...prev, newOrder]);
        return newOrder;
    };

    const updateOrder = (orderId, updates) => {
        setOrders(prev => prev.map(order => 
            order.id === orderId 
                ? { ...order, ...updates, updatedAt: new Date() }
                : order
        ));
    };

    const approveOrderStage = (orderId, stage, userEmail) => {
        setOrders(prev => prev.map(order => {
            if (order.id !== orderId) return order;

            const updatedProgress = order.progress.map(p => 
                p.stage === stage 
                    ? { ...p, completed: true, date: new Date(), completedBy: userEmail }
                    : p
            );

            // If both reviews are done, auto-complete deposit_held
            const renterReview = updatedProgress.find(p => p.stage === 'renter_review');
            const landlordReview = updatedProgress.find(p => p.stage === 'landlord_review');
            
            if (renterReview?.completed && landlordReview?.completed) {
                const depositHeld = updatedProgress.find(p => p.stage === 'deposit_held');
                if (depositHeld && !depositHeld.completed) {
                    depositHeld.completed = true;
                    depositHeld.date = new Date();
                    depositHeld.completedBy = 'System';
                }
            }

            const status = updatedProgress.every(p => p.completed) ? 'completed' : 'in_progress';

            return {
                ...order,
                progress: updatedProgress,
                status,
                updatedAt: new Date()
            };
        }));
    };

    const addChatMessage = (orderId, senderEmail, senderRole, senderName, text) => {
        setOrders(prev => prev.map(order => {
            if (order.id !== orderId) return order;
            
            // Initialize chat room if it doesn't exist
            let chatRoom = order.chatRoom;
            if (!chatRoom) {
                chatRoom = createChatRoom(orderId, [
                    { email: order.createdBy, role: 'agent' },
                    { email: order.renterEmail, role: 'renter' },
                    { email: order.landlordEmail, role: 'landlord' }
                ]);
            }
            
            // Create a new chat room object with the new message
            const updatedChatRoom = addMessage(
                JSON.parse(JSON.stringify(chatRoom)), 
                senderEmail, 
                senderRole, 
                senderName, 
                text
            );
            
            return {
                ...order,
                chatRoom: updatedChatRoom,
                updatedAt: new Date()
            };
        }));
    };

    const loadDemoOrders = () => {
        const demoOrders = loadDemoData();
        // Convert dates properly
        const convertedOrders = demoOrders.map(order => ({
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
        setOrders(convertedOrders);
        return convertedOrders;
    };

    return {
        orders,
        userOrders,
        createOrder,
        updateOrder,
        approveOrderStage,
        addChatMessage,
        loadDemoOrders
    };
};

