import OrderCard from '../OrderCard';

const AgentDashboard = ({ orders, allOrders, onCreateClick, onOrderClick, onLoadDemoData, currentUser, onOpenChat, role }) => {
    const getUserFirstName = (email) => {
        const name = email.split('@')[0];
        return name.charAt(0).toUpperCase() + name.slice(1);
    };

    const getRoleLabel = () => {
        switch (role) {
            case 'agent':
                return 'Housing Agent';
            case 'renter':
                return 'Renter';
            case 'landlord':
                return 'Landlord';
            default:
                return '';
        }
    };

    // Sort orders: in_progress first, then pending, then completed
    const sortedOrders = [...orders].sort((a, b) => {
        const statusOrder = { 'in_progress': 0, 'pending': 1, 'completed': 2 };
        return statusOrder[a.status] - statusOrder[b.status];
    });

    return (
        <div className="dashboard">
            <div className="dashboard-greeting">
                <h1>Hi {getUserFirstName(currentUser?.email || 'User')}</h1>
                <p className="dashboard-role-label">{getRoleLabel()}</p>
            </div>

            <div className="orders-list">
                {orders.length === 0 ? (
                    <div className="empty-state">
                        {role === 'agent' && onLoadDemoData && (
                            <button className="btn-load-demo" onClick={onLoadDemoData}>
                                Load Demo Data
                            </button>
                        )}
                        <p>No deposit orders yet</p>
                        {role === 'renter' && (
                            <p className="empty-hint">Orders will appear here once an agent creates one for you.</p>
                        )}
                        {role === 'landlord' && (
                            <p className="empty-hint">Orders will appear here once an agent creates one for your properties.</p>
                        )}
                    </div>
                ) : (
                    sortedOrders.map(order => (
                        <OrderCard 
                            key={order.id} 
                            order={order} 
                            onClick={onOrderClick}
                            onOpenChat={onOpenChat}
                            showChatIcon={true}
                        />
                    ))
                )}
            </div>

            {orders.length > 0 && role === 'agent' && (
                <div className="create-order-button-container">
                    <button className="btn-create-order" onClick={onCreateClick}>
                        Create a new order
                    </button>
                </div>
            )}
        </div>
    );
};

export default AgentDashboard;

