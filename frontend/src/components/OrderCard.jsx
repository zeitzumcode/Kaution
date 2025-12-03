import { formatDate } from '../services/orderService';

const OrderCard = ({ order, onClick, onOpenChat }) => {
    const getStatusLabel = (status) => {
        switch (status) {
            case 'in_progress':
                return 'IN PROGRESS';
            case 'pending':
                return 'PENDING';
            case 'completed':
                return 'COMPLETE';
            default:
                return status.toUpperCase().replace('_', ' ');
        }
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'in_progress':
                return 'status-in-progress';
            case 'pending':
                return 'status-pending';
            case 'completed':
                return 'status-complete';
            default:
                return '';
        }
    };

    const formatDateShort = (date) => {
        if (!date) return '';
        const d = new Date(date);
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const day = d.getDate();
        const month = months[d.getMonth()];
        const year = d.getFullYear();
        return `${day} ${month} ${year}`;
    };

    const getDateText = (order) => {
        if (order.status === 'completed') {
            return `Completed on ${formatDateShort(order.updatedAt)}`;
        }
        return `Started on ${formatDateShort(order.createdAt)}`;
    };

    return (
        <div className="order-card-modern" onClick={() => onClick(order.id)}>
            <div className="order-card-address">{order.propertyAddress}</div>
            <div className="order-card-divider"></div>
            <div className="order-card-info">
                <div className="order-card-text">
                    <div>Your deposit order</div>
                    <div className="order-card-date">{getDateText(order)}</div>
                </div>
                <div className="order-card-actions">
                    {order.chatRoom && onOpenChat && (
                        <button
                            className="order-chat-icon-btn"
                            onClick={(e) => {
                                e.stopPropagation();
                                onOpenChat(order.id);
                            }}
                            title="Open chat"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>
                    )}
                    <span className={`status-badge ${getStatusClass(order.status)}`}>
                        {getStatusLabel(order.status)}
                    </span>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </div>
            </div>
        </div>
    );
};

export default OrderCard;

