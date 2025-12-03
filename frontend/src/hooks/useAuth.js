import { useState, useEffect } from 'react';
import { getCurrentUser, logout as authLogout } from '../services/authService';

export const useAuth = () => {
    const [currentUser, setCurrentUser] = useState(getCurrentUser());
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(false);
    }, []);

    const login = (user) => {
        setCurrentUser(user);
    };

    const logout = () => {
        authLogout();
        setCurrentUser(null);
    };

    return {
        currentUser,
        isLoading,
        login,
        logout,
        isAuthenticated: !!currentUser
    };
};

