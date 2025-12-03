import { useState, useEffect, useCallback } from 'react';
import { loadOrders, getOrdersForUser, createOrder as createOrderService, updateOrder as updateOrderService, getOrder, deleteOrder as deleteOrderService } from '../services/orderService';
import { sendMessage } from '../services/chatService';

export const useOrders = (currentUser, enablePolling = false) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadUserOrders = useCallback(async (silent = false) => {
        if (!currentUser) return;
        
        if (!silent) {
            setLoading(true);
        }
        setError(null);
        try {
            const loadedOrders = await loadOrders(currentUser.email, currentUser.role);
            setOrders(loadedOrders);
        } catch (err) {
            console.error('Error loading orders:', err);
            setError(err.message);
        } finally {
            if (!silent) {
                setLoading(false);
            }
        }
    }, [currentUser]);

    // Load orders when user changes
    useEffect(() => {
        if (currentUser) {
            loadUserOrders();
        }
    }, [currentUser, loadUserOrders]);

    // Polling for real-time updates (when chat is open)
    useEffect(() => {
        if (!enablePolling || !currentUser) return;

        const POLL_INTERVAL = 3000; // Poll every 3 seconds

        const intervalId = setInterval(() => {
            // Silently refresh orders without showing loading state
            loadUserOrders(true);
        }, POLL_INTERVAL);

        return () => clearInterval(intervalId);
    }, [enablePolling, currentUser, loadUserOrders]);

    const userOrders = getOrdersForUser(orders, currentUser);

    const createOrder = async (orderData) => {
        try {
            const newOrder = await createOrderService(orderData, currentUser.email);
            // Reload orders to get the latest from backend
            await loadUserOrders();
            return newOrder;
        } catch (err) {
            console.error('Error creating order:', err);
            setError(err.message);
            throw err;
        }
    };

    const updateOrder = async (orderId, updates) => {
        try {
            const updatedOrder = await updateOrderService(orderId, updates);
            // Update local state
            setOrders(prev => prev.map(order => 
                order.id === orderId ? updatedOrder : order
            ));
            return updatedOrder;
        } catch (err) {
            console.error('Error updating order:', err);
            setError(err.message);
            throw err;
        }
    };

    const approveOrderStage = async (orderId, stage, userEmail) => {
        try {
            // Get current order
            const currentOrder = orders.find(o => o.id === orderId);
            if (!currentOrder) return;

            // Update progress stage
            const updatedProgress = currentOrder.progress.map(p => 
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

            const allCompleted = updatedProgress.every(p => p.completed);
            const status = allCompleted ? 'completed' : 'in_progress';

            // Update order via backend
            await updateOrder(orderId, {
                status,
                progress: updatedProgress
            });

            // Reload to get latest from backend
            await loadUserOrders();
        } catch (err) {
            console.error('Error approving order stage:', err);
            setError(err.message);
            throw err;
        }
    };

    const addChatMessage = async (orderId, senderEmail, senderRole, senderName, text) => {
        try {
            // Send message via backend API
            await sendMessage(orderId, senderEmail, senderRole, senderName, text);
            
            // Reload order to get updated chat room
            const updatedOrder = await getOrder(orderId);
            setOrders(prev => prev.map(order => 
                order.id === orderId ? updatedOrder : order
            ));
        } catch (err) {
            console.error('Error sending message:', err);
            setError(err.message);
            throw err;
        }
    };

    const deleteOrder = async (orderId, createdBy) => {
        try {
            await deleteOrderService(orderId, createdBy);
            // Remove order from local state
            setOrders(prev => prev.filter(order => order.id !== orderId));
            // Reload orders to ensure consistency
            await loadUserOrders();
        } catch (err) {
            console.error('Error deleting order:', err);
            setError(err.message);
            throw err;
        }
    };

    return {
        orders,
        userOrders,
        loading,
        error,
        createOrder,
        updateOrder,
        approveOrderStage,
        addChatMessage,
        deleteOrder,
        refreshOrders: loadUserOrders
    };
};
