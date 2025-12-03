import { useState, useEffect } from 'react';
import { getCurrentUser, logout as authLogout, login as authLogin } from '../services/authService';

export const useAuth = () => {
    const [currentUser, setCurrentUser] = useState(getCurrentUser());
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(false);
    }, []);

    const login = async (email, role = null) => {
        try {
            const user = await authLogin(email, role);
            setCurrentUser(user);
            return user;
        } catch (error) {
            console.error('Login error in useAuth:', error);
            throw error;
        }
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
