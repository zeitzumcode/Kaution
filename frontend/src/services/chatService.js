// Chat Service - handles chat messages for orders
export const createChatRoom = (orderId, participants) => {
    return {
        orderId,
        participants,
        messages: [],
        createdAt: new Date(),
        updatedAt: new Date()
    };
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

export const getChatRoom = (orderId, orders) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return null;
    
    // Initialize chat room if it doesn't exist
    if (!order.chatRoom) {
        order.chatRoom = createChatRoom(orderId, [
            { email: order.createdBy, role: 'agent' },
            { email: order.renterEmail, role: 'renter' },
            { email: order.landlordEmail, role: 'landlord' }
        ]);
    }
    
    return order.chatRoom;
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

