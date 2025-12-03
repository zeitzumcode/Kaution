import { useState, useEffect } from 'react';
import Landing from './components/Landing';
import Dashboard from './components/Dashboard';
import NotificationContainer from './components/NotificationContainer';
import { useAuth } from './hooks/useAuth';
import { useOrders } from './hooks/useOrders';
import { useNotifications } from './hooks/useNotifications';

function App() {
    const { currentUser, login, logout, isAuthenticated } = useAuth();
    const { orders, userOrders, createOrder, updateOrder, approveOrderStage, addChatMessage, loadDemoOrders } = useOrders(currentUser);
    const { notifications, showNotification, removeNotification, requestPermission } = useNotifications();

    useEffect(() => {
        // Request notification permission when user logs in
        if (isAuthenticated) {
            requestPermission();
        }
    }, [isAuthenticated, requestPermission]);

    const handleLogin = (user) => {
        login(user);
        showNotification('Welcome!', `Logged in as ${user.role}`, 'success');
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
            onLoadDemoData={loadDemoOrders}
            onShowNotification={showNotification}
            onLogout={logout}
        />
            <NotificationContainer 
                notifications={notifications} 
                onRemove={removeNotification}
            />
        </>
    );
}

export default App;

