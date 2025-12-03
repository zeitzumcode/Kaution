import { useState, useEffect, useRef } from 'react';
import { formatMessageTime } from '../services/chatService';

const ChatRoom = ({ chatRoom, currentUser, onSendMessage }) => {
    const [message, setMessage] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [chatRoom?.messages]);

    if (!chatRoom) {
        return (
            <div className="chat-room">
                <div className="chat-empty">
                    <p>Chat room not available</p>
                </div>
            </div>
        );
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (message.trim()) {
            onSendMessage(message.trim());
            setMessage('');
        }
    };

    const getParticipantName = (email) => {
        const participant = chatRoom.participants.find(p => p.email === email);
        if (!participant) return email.split('@')[0];
        
        // Use name if available, otherwise fallback to email
        return participant.name || participant.email?.split('@')[0] || email.split('@')[0];
    };

    return (
        <div className="chat-room">
            {chatRoom.participants.length > 0 && (
                <div className="chat-participants-info">
                    <span className="chat-participants-label">Chatting with: </span>
                    {chatRoom.participants
                        .filter(p => p.email !== currentUser.email)
                        .map((p, idx) => (
                            <span key={idx} className="chat-participant-name">
                                {p.name || p.email?.split('@')[0] || 'User'}
                                {idx < chatRoom.participants.filter(p => p.email !== currentUser.email).length - 1 && ', '}
                            </span>
                        ))}
                </div>
            )}
            
            <div className="chat-messages">
                {chatRoom.messages.length === 0 ? (
                    <div className="chat-empty">
                        <p>No messages yet. Start the conversation!</p>
                    </div>
                ) : (
                    chatRoom.messages.map((msg) => {
                        const isOwn = msg.senderEmail === currentUser.email;
                        return (
                            <div key={msg.id} className={`chat-message ${isOwn ? 'own' : ''}`}>
                                {!isOwn && (
                                    <div className="chat-message-header">
                                        <span className="chat-message-sender">{msg.senderName || getParticipantName(msg.senderEmail)}</span>
                                        <span className="chat-message-time">{formatMessageTime(msg.timestamp)}</span>
                                    </div>
                                )}
                                <div className="chat-message-text">{msg.text}</div>
                                {isOwn && (
                                    <div className="chat-message-time-own">{formatMessageTime(msg.timestamp)}</div>
                                )}
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>
            
            <form className="chat-input-form" onSubmit={handleSubmit}>
                <input
                    type="text"
                    className="chat-input"
                    placeholder="Type a message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <button type="submit" className="btn btn-primary chat-send-btn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </button>
            </form>
        </div>
    );
};

export default ChatRoom;

