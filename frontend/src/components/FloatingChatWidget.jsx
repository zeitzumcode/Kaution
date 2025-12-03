import { useState, useEffect, useRef } from 'react';
import ChatRoom from './ChatRoom';

const FloatingChatWidget = ({ orders, currentUser, onSendMessage, chatOrderId, onChatOrderSelected, onChatOpenChange }) => {
    const [isMinimized, setIsMinimized] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showOrderList, setShowOrderList] = useState(false);
    const widgetRef = useRef(null);

    // Notify parent when chat opens/closes for polling control
    useEffect(() => {
        if (onChatOpenChange) {
            onChatOpenChange(!isMinimized);
        }
    }, [isMinimized, onChatOpenChange]);

    const getUserFirstName = (email) => {
        if (!email) return 'User';
        const name = email.split('@')[0];
        return name.charAt(0).toUpperCase() + name.slice(1);
    };

    // Get orders with chat rooms that the user has access to
    const ordersWithChat = orders.filter(o => {
        if (!o.chatRoom) return false;
        
        // Check if current user is a participant in this chat room
        const isParticipant = o.chatRoom.participants.some(
            p => p.email === currentUser?.email
        );
        
        // Also check if user matches order roles (for renter/landlord)
        const isRenter = currentUser?.email === o.renterEmail;
        const isLandlord = currentUser?.email === o.landlordEmail;
        const isCreator = currentUser?.email === o.createdBy;
        
        return isParticipant || isRenter || isLandlord || isCreator;
    });

    // Auto-select first order with chat when widget opens
    useEffect(() => {
        if (!isMinimized && !selectedOrder && ordersWithChat.length > 0) {
            setSelectedOrder(ordersWithChat[0]);
            setShowOrderList(ordersWithChat.length > 1);
        }
    }, [isMinimized, selectedOrder, ordersWithChat]);

    // Sync selected order when orders update
    useEffect(() => {
        if (selectedOrder) {
            const updatedOrder = orders.find(o => o.id === selectedOrder.id);
            if (updatedOrder) {
                setSelectedOrder(updatedOrder);
            }
        }
    }, [orders, selectedOrder]);

    // Open chat for specific order when chatOrderId is set
    useEffect(() => {
        if (chatOrderId) {
            const orderToOpen = ordersWithChat.find(o => o.id === chatOrderId);
            if (orderToOpen) {
                setSelectedOrder(orderToOpen);
                setShowOrderList(false);
                setIsMinimized(false);
                // Notify parent that we've opened the chat
                if (onChatOrderSelected) {
                    onChatOrderSelected();
                }
            }
        }
    }, [chatOrderId, ordersWithChat, onChatOrderSelected]);

    // Count unread messages (for future implementation)
    const getUnreadCount = (order) => {
        // For now, return 0. Can be enhanced later with read/unread tracking
        return 0;
    };

    const handleSendMessage = (text) => {
        if (selectedOrder && onSendMessage) {
            onSendMessage(
                selectedOrder.id,
                currentUser.email,
                currentUser.role,
                currentUser.name,
                text
            );
        }
    };

    const handleOrderSelect = (order) => {
        setSelectedOrder(order);
        setIsMinimized(false);
    };

    // Always show the widget if user has orders with chat
    if (ordersWithChat.length === 0) {
        return null;
    }

    return (
        <div className="floating-chat-widget" ref={widgetRef}>
            {isMinimized ? (
                <button
                    className="floating-chat-button"
                    onClick={() => {
                        setIsMinimized(false);
                        setShowOrderList(ordersWithChat.length > 1);
                        if (!selectedOrder && ordersWithChat.length > 0) {
                            setSelectedOrder(ordersWithChat[0]);
                        }
                    }}
                    title="Open Chat"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    {ordersWithChat.length > 0 && (
                        <span className="chat-badge-count">{ordersWithChat.length}</span>
                    )}
                </button>
            ) : (
                <div className="floating-chat-container">
                    {/* Pink Header */}
                    <div className="chat-widget-header">
                        <div className="chat-widget-header-left">
                            <div className="chat-widget-logo">Kaution</div>
                        </div>
                        <button
                            className="chat-widget-close-btn"
                            onClick={() => setIsMinimized(true)}
                            title="Close"
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M18 6L6 18M6 6L18 18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>
                    </div>

                    {/* Greeting Section */}
                    <div className="chat-widget-greeting-section">
                        <h2 className="chat-widget-greeting">
                            Hi {getUserFirstName(currentUser?.email)} 👋
                        </h2>
                        <p className="chat-widget-help-text">How can we help?</p>
                    </div>

                    {/* Content Area */}
                    <div className="chat-widget-content">
                        {ordersWithChat.length === 0 ? (
                            <div className="chat-widget-empty">
                                <p>No chat rooms available yet.</p>
                                {currentUser?.role === 'agent' && (
                                    <p style={{ fontSize: '13px', marginTop: '8px', color: '#999' }}>
                                        Create an order to start a chat room.
                                    </p>
                                )}
                                {currentUser?.role !== 'agent' && (
                                    <p style={{ fontSize: '13px', marginTop: '8px', color: '#999' }}>
                                        Chat rooms will appear here when an agent creates an order for you.
                                    </p>
                                )}
                            </div>
                        ) : showOrderList && ordersWithChat.length > 1 ? (
                            <div className="chat-order-selector">
                                <div className="chat-section-title">Select an order to chat</div>
                                {ordersWithChat.map(order => (
                                    <button
                                        key={order.id}
                                        className={`chat-order-select-btn ${selectedOrder?.id === order.id ? 'active' : ''}`}
                                        onClick={() => {
                                            setSelectedOrder(order);
                                            setShowOrderList(false);
                                        }}
                                    >
                                        <div className="chat-order-select-info">
                                            <div className="chat-order-select-title">{order.title}</div>
                                            <div className="chat-order-select-meta">
                                                {order.chatRoom?.messages?.length || 0} messages
                                            </div>
                                        </div>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </button>
                                ))}
                                <button
                                    className="chat-back-btn"
                                    onClick={() => setShowOrderList(false)}
                                >
                                    Back to chat
                                </button>
                            </div>
                        ) : selectedOrder ? (
                            <div className="chat-messages-wrapper">
                                <ChatRoom
                                    chatRoom={selectedOrder.chatRoom}
                                    currentUser={currentUser}
                                    onSendMessage={handleSendMessage}
                                />
                                {ordersWithChat.length > 1 && (
                                    <button
                                        className="chat-switch-order-btn"
                                        onClick={() => setShowOrderList(true)}
                                    >
                                        Switch order
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className="chat-widget-empty">
                                <p>Select an order to start chatting</p>
                                {ordersWithChat.length > 1 && (
                                    <button
                                        className="chat-select-order-btn"
                                        onClick={() => setShowOrderList(true)}
                                    >
                                        Select an order
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default FloatingChatWidget;

