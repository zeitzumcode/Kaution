// Auth Service - handles authentication with backend API
import apiClient from './apiClient';
import { API_ENDPOINTS } from '../config/api';

// Keep localStorage as fallback for demo mode
const USE_BACKEND = import.meta.env.VITE_USE_BACKEND !== 'false';

export const loadUsers = async () => {
    if (!USE_BACKEND) {
        // Fallback to localStorage
        const stored = localStorage.getItem('platformUsers');
        if (stored) {
            return JSON.parse(stored);
        }
        const demoUsers = [
            { email: 'agent@kaution.com', role: 'agent', name: 'John Agent' },
            { email: 'renter@kaution.com', role: 'renter', name: 'Jane Renter' },
            { email: 'landlord@kaution.com', role: 'landlord', name: 'Bob Landlord' }
        ];
        localStorage.setItem('platformUsers', JSON.stringify(demoUsers));
        return demoUsers;
    }

    try {
        const users = await apiClient.get(API_ENDPOINTS.USERS);
        return users.map(user => ({
            email: user.email,
            role: user.role,
            name: user.name
        }));
    } catch (error) {
        console.error('Error loading users from backend:', error);
        return [];
    }
};

export const login = async (email, role = null) => {
    if (!USE_BACKEND) {
        // Fallback to localStorage
        const users = loadUsers();
        let user;
        
        if (role) {
            user = users.find(u => u.email === email && u.role === role);
        } else {
            user = users.find(u => u.email === email);
        }

        if (!user) {
            if (role) {
                const name = email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                user = { email, role, name };
                const allUsers = [...users, user];
                localStorage.setItem('platformUsers', JSON.stringify(allUsers));
            } else {
                throw new Error('User not found. Please sign up first.');
            }
        }

        const currentUser = { email: user.email, role: user.role, name: user.name };
        sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
        return currentUser;
    }

    try {
        // Validate inputs
        if (!email) {
            throw new Error('Email is required');
        }
        
        // Ensure email is a string
        const loginData = {
            email: String(email).trim()
        };
        
        // Add role only if provided (for backward compatibility)
        if (role) {
            loginData.role = String(role).trim().toLowerCase();
        }
        
        if (!loginData.email) {
            throw new Error('Email cannot be empty');
        }
        
        const response = await apiClient.post(API_ENDPOINTS.LOGIN, loginData);
        const user = response.user || response;
        
        // Ensure role is a string (might be enum value from backend)
        let roleValue = user.role;
        if (roleValue && typeof roleValue === 'object' && roleValue.value) {
            roleValue = roleValue.value;
        }
        roleValue = String(roleValue || '').toLowerCase();
        
        const currentUser = {
            email: String(user.email || ''),
            role: roleValue,
            name: String(user.name || user.email?.split('@')[0] || 'User')
        };

        // Store in sessionStorage for tab-specific sessions (allows multiple users in different tabs)
        sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        return currentUser;
    } catch (error) {
        console.error('Login error:', error);
        // Provide more detailed error messages
        if (error.message.includes('JSON decode error') || error.message.includes('json_invalid')) {
            throw new Error('Invalid request format. Please try again.');
        }
        throw new Error(error.message || 'Login failed. Please check if the backend is running.');
    }
};

export const getCurrentUser = () => {
    // Use sessionStorage for tab-specific sessions (allows multiple users in different tabs)
    const stored = sessionStorage.getItem('currentUser');
    return stored ? JSON.parse(stored) : null;
};

export const register = async (email, name, role) => {
    if (!USE_BACKEND) {
        // Fallback to localStorage
        const users = await loadUsers();
        const existingUser = users.find(u => u.email === email && u.role === role);
        
        if (existingUser) {
            throw new Error('User already exists with this email and role');
        }

        const newUser = { email, role, name };
        const allUsers = [...users, newUser];
        localStorage.setItem('platformUsers', JSON.stringify(allUsers));

        const currentUser = { email: newUser.email, role: newUser.role, name: newUser.name };
        sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
        return currentUser;
    }

    try {
        // Validate inputs
        if (!email || !name || !role) {
            throw new Error('Email, name, and role are required');
        }
        
        // Ensure email and role are strings
        const registerData = {
            email: String(email).trim(),
            name: String(name).trim(),
            role: String(role).trim().toLowerCase()
        };
        
        if (!registerData.email || !registerData.name || !registerData.role) {
            throw new Error('Email, name, and role cannot be empty');
        }
        
        const response = await apiClient.post(API_ENDPOINTS.USERS, registerData);
        
        // Ensure role is a string (might be enum value from backend)
        let roleValue = response.role;
        if (roleValue && typeof roleValue === 'object' && roleValue.value) {
            roleValue = roleValue.value;
        }
        roleValue = String(roleValue || '').toLowerCase();
        
        const currentUser = {
            email: String(response.email || ''),
            role: roleValue,
            name: String(response.name || '')
        };

        // Store in sessionStorage for tab-specific sessions (allows multiple users in different tabs)
        sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        return currentUser;
    } catch (error) {
        console.error('Registration error:', error);
        // Provide more detailed error messages
        if (error.message.includes('already exists') || error.message.includes('User already exists')) {
            throw new Error('An account with this email and role already exists. Please log in instead.');
        }
        if (error.message.includes('JSON decode error') || error.message.includes('json_invalid')) {
            throw new Error('Invalid request format. Please try again.');
        }
        throw new Error(error.message || 'Registration failed. Please check if the backend is running.');
    }
};

export const logout = () => {
    sessionStorage.removeItem('currentUser');
};
