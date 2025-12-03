// Auth Service - handles authentication (simplified - no password)
export const loadUsers = () => {
    const stored = localStorage.getItem('platformUsers');
    if (stored) {
        return JSON.parse(stored);
    }
    // Initialize with demo users
    const demoUsers = [
        { email: 'agent@kaution.com', role: 'agent', name: 'John Agent' },
        { email: 'renter@kaution.com', role: 'renter', name: 'Jane Renter' },
        { email: 'landlord@kaution.com', role: 'landlord', name: 'Bob Landlord' }
    ];
    localStorage.setItem('platformUsers', JSON.stringify(demoUsers));
    return demoUsers;
};

export const login = (email, role) => {
    const users = loadUsers();
    let user = users.find(u => u.email === email && u.role === role);

    // If user doesn't exist with this role, create them
    if (!user) {
        const name = email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        user = { email, role, name };
        const allUsers = [...users, user];
        localStorage.setItem('platformUsers', JSON.stringify(allUsers));
    }

    const currentUser = { email: user.email, role: user.role, name: user.name };
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    return currentUser;
};

export const getCurrentUser = () => {
    const stored = localStorage.getItem('currentUser');
    return stored ? JSON.parse(stored) : null;
};

export const logout = () => {
    localStorage.removeItem('currentUser');
};

