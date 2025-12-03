import { useState, useEffect } from 'react';
import Landing from './components/Landing';
import Dashboard from './components/Dashboard';
import NotificationContainer from './components/NotificationContainer';
import { useAuth } from './hooks/useAuth';
import { useOrders } from './hooks/useOrders';
import { useNotifications } from './hooks/useNotifications';

function App() {
    const { currentUser, login: authLogin, logout, isAuthenticated } = useAuth();
    const [isChatOpen, setIsChatOpen] = useState(false);
    const { orders, userOrders, createOrder, updateOrder, approveOrderStage, addChatMessage, deleteOrder, loading: ordersLoading } = useOrders(currentUser, isChatOpen);
    const { notifications, showNotification, removeNotification, requestPermission } = useNotifications();


    useEffect(() => {
        // Request notification permission when user logs in
        if (isAuthenticated) {
            requestPermission();
        }
    }, [isAuthenticated, requestPermission]);

    const handleLogin = async (email, role = null) => {
        try {
            const user = await authLogin(email, role);
            showNotification('Welcome!', `Logged in as ${user.role}`, 'success');
            return user;
        } catch (error) {
            console.error('App - handleLogin error:', error);
            showNotification('Login Failed', error.message || 'Please check if the backend is running', 'error');
            throw error;
        }
    };

    if (!isAuthenticated) {
        return <Landing onLogin={handleLogin} />;
    }

    return (
        <>
            <Dashboard
                currentUser={currentUser}
                orders={userOrders}
                allOrders={orders}
                onCreateOrder={createOrder}
                onUpdateOrder={updateOrder}
                onApproveOrder={approveOrderStage}
                onAddChatMessage={addChatMessage}
                onDeleteOrder={deleteOrder}
                onShowNotification={showNotification}
                onLogout={logout}
                loading={ordersLoading}
                enableChatPolling={setIsChatOpen}
            />
            <NotificationContainer 
                notifications={notifications} 
                onRemove={removeNotification}
            />
        </>
    );
}

export default App;
