const NotificationContainer = ({ notifications, onRemove }) => {
    if (notifications.length === 0) return null;

    const getIcon = (type) => {
        switch (type) {
            case 'success':
                return '✅';
            case 'warning':
                return '⚠️';
            case 'error':
                return '❌';
            default:
                return 'ℹ️';
        }
    };

    return (
        <div className="notification-container">
            {notifications.map(notification => (
                <div key={notification.id} className={`notification ${notification.type}`}>
                    <div className="notification-icon">{getIcon(notification.type)}</div>
                    <div className="notification-content">
                        <div className="notification-title">{notification.title}</div>
                        <div className="notification-message">{notification.message}</div>
                    </div>
                    <button 
                        className="notification-close"
                        onClick={() => onRemove(notification.id)}
                    >
                        ×
                    </button>
                </div>
            ))}
        </div>
    );
};

export default NotificationContainer;

