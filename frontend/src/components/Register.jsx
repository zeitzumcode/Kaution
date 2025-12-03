import { useState } from 'react';
import { register } from '../services/authService';

const Register = ({ onRegister, onSwitchToLogin }) => {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [role, setRole] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (email && name && role) {
            setLoading(true);
            setError('');
            try {
                const user = await register(email, name, role);
                if (user && user.email && user.role) {
                    onRegister(user);
                } else {
                    setError('Invalid user data received. Please try again.');
                }
            } catch (err) {
                console.error('Register component - error:', err);
                setError(err.message || 'Registration failed. Please check if the backend is running.');
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="login-modal">
            <div className="login-container">
                <div className="login-card">
                    <div className="login-header">
                        <h1>Kaution</h1>
                        <p className="subtitle">Create your account</p>
                    </div>
                    {error && (
                        <div className="error-message" style={{ color: 'red', marginBottom: '1rem', padding: '0.5rem', background: '#ffe6e6', borderRadius: '4px' }}>
                            {error}
                        </div>
                    )}
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="register-name">Full Name</label>
                            <input
                                type="text"
                                id="register-name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="John Doe"
                                required
                                disabled={loading}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="register-email">Email</label>
                            <input
                                type="email"
                                id="register-email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="your.email@example.com"
                                required
                                disabled={loading}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="register-role">I am a</label>
                            <select
                                id="register-role"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                required
                                disabled={loading}
                            >
                                <option value="">Select your role</option>
                                <option value="agent">Housing Agent</option>
                                <option value="renter">Renter</option>
                                <option value="landlord">Landlord</option>
                            </select>
                        </div>
                        <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                            {loading ? 'Creating account...' : 'Create Account'}
                        </button>
                    </form>
                    <div style={{ marginTop: '24px', textAlign: 'center' }}>
                        <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                            Already have an account?{' '}
                            <button
                                type="button"
                                onClick={onSwitchToLogin}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: 'var(--primary-blue)',
                                    cursor: 'pointer',
                                    textDecoration: 'underline',
                                    fontSize: '14px',
                                    padding: 0
                                }}
                            >
                                Log in
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;

