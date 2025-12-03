import { useState, useEffect } from 'react';
import AgentDashboard from './dashboards/AgentDashboard';
import CreateOrderModal from './modals/CreateOrderModal';
import OrderDetailModal from './modals/OrderDetailModal';
import FloatingChatWidget from './FloatingChatWidget';

const Dashboard = ({ currentUser, orders, allOrders, onCreateOrder, onUpdateOrder, onApproveOrder, onAddChatMessage, onDeleteOrder, onShowNotification, onLogout, enableChatPolling }) => {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [chatOrderId, setChatOrderId] = useState(null);

    const handleOrderClick = (orderId) => {
        const order = allOrders.find(o => o.id === orderId);
        setSelectedOrder(order);
    };

    // Sync selected order when allOrders changes
    useEffect(() => {
        if (selectedOrder) {
            const updatedOrder = allOrders.find(o => o.id === selectedOrder.id);
            if (updatedOrder) {
                setSelectedOrder(updatedOrder);
            }
        }
    }, [allOrders]);

    const handleCloseDetail = () => {
        setSelectedOrder(null);
    };

    const handleCreateOrder = async (orderData) => {
        try {
            await onCreateOrder({
                ...orderData,
                createdBy: currentUser.email
            });
            setShowCreateModal(false);
            if (onShowNotification) {
                onShowNotification('Order Created', 'Deposit order created successfully. A chat room has been created for this order.', 'success');
            } else {
                alert('Order created successfully!');
            }
        } catch (error) {
            console.error('Error creating order:', error);
            if (onShowNotification) {
                onShowNotification('Error', 'Failed to create order. Please try again.', 'error');
            } else {
                alert('Failed to create order. Please try again.');
            }
        }
    };

    const handleApproveOrder = async (orderId, stage) => {
        try {
            await onApproveOrder(orderId, stage, currentUser.email);
            // Refresh the selected order from allOrders
            const updatedOrder = allOrders.find(o => o.id === orderId);
            if (updatedOrder) {
                setSelectedOrder(updatedOrder);
            }
            if (onShowNotification) {
                onShowNotification('Order Approved', 'Order stage has been approved successfully.', 'success');
            } else {
                alert('Order approved successfully!');
            }
        } catch (error) {
            console.error('Error approving order:', error);
            if (onShowNotification) {
                onShowNotification('Error', 'Failed to approve order. Please try again.', 'error');
            } else {
                alert('Failed to approve order. Please try again.');
            }
        }
    };

    const handleSendMessage = async (orderId, senderEmail, senderRole, senderName, text) => {
        try {
            await onAddChatMessage(orderId, senderEmail, senderRole, senderName, text);
            // The order will be automatically refreshed via useEffect in useOrders
        } catch (error) {
            console.error('Error sending message:', error);
            if (onShowNotification) {
                onShowNotification('Error', 'Failed to send message. Please try again.', 'error');
            }
        }
    };

    const handleDeleteOrder = async (orderId) => {
        try {
            await onDeleteOrder(orderId, currentUser.email);
            setSelectedOrder(null);
            if (onShowNotification) {
                onShowNotification('Order Deleted', 'The order has been deleted successfully.', 'success');
            }
        } catch (error) {
            console.error('Error deleting order:', error);
            if (onShowNotification) {
                onShowNotification('Error', error.message || 'Failed to delete order. Please try again.', 'error');
            }
        }
    };

    return (
        <div>
            <header className="app-header">
                <div className="header-content">
                    <div className="logo">
                        <h2>Kaution</h2>
                    </div>
                    <button className="menu-button" onClick={onLogout}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3 12H21M3 6H21M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                        <span>Menu</span>
                    </button>
                </div>
            </header>

            <div className="app-container">
                <AgentDashboard
                    orders={orders}
                    allOrders={allOrders}
                    onCreateClick={() => currentUser.role === 'agent' && setShowCreateModal(true)}
                    onOrderClick={handleOrderClick}
                    currentUser={currentUser}
                    onOpenChat={(orderId) => setChatOrderId(orderId)}
                    role={currentUser.role}
                />
            </div>

            {showCreateModal && currentUser.role === 'agent' && (
                <CreateOrderModal
                    onClose={() => setShowCreateModal(false)}
                    onSubmit={handleCreateOrder}
                />
            )}

            {selectedOrder && (
                <OrderDetailModal
                    order={selectedOrder}
                    currentUser={currentUser}
                    onClose={handleCloseDetail}
                    onApprove={handleApproveOrder}
                    onDelete={handleDeleteOrder}
                />
            )}

            <FloatingChatWidget
                orders={allOrders}
                currentUser={currentUser}
                onSendMessage={handleSendMessage}
                chatOrderId={chatOrderId}
                onChatOrderSelected={() => setChatOrderId(null)}
                onChatOpenChange={enableChatPolling}
            />
        </div>
    );
};

export default Dashboard;

