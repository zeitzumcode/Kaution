import { useState } from 'react';
import { login } from '../services/authService';

const Login = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (email && role) {
            const user = login(email, role);
            if (user) {
                onLogin(user);
            }
        }
    };

    return (
        <div className="login-modal">
            <div className="login-container">
                <div className="login-card">
                    <div className="login-header">
                        <h1>Kaution</h1>
                        <p className="subtitle">Deposit Management Platform</p>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="login-email">Email</label>
                            <input
                                type="email"
                                id="login-email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="your.email@example.com"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="login-role">I am a</label>
                            <select
                                id="login-role"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                required
                            >
                                <option value="">Select your role</option>
                                <option value="agent">Housing Agent</option>
                                <option value="renter">Renter</option>
                                <option value="landlord">Landlord</option>
                            </select>
                        </div>
                        <button type="submit" className="btn btn-primary btn-full">
                            Continue
                        </button>
                    </form>
                    <div className="demo-accounts">
                        <p className="demo-label">Quick login:</p>
                        <div className="demo-buttons">
                            <button
                                type="button"
                                className="demo-btn"
                                onClick={() => {
                                    setEmail('agent@kaution.com');
                                    setRole('agent');
                                }}
                            >
                                Agent
                            </button>
                            <button
                                type="button"
                                className="demo-btn"
                                onClick={() => {
                                    setEmail('renter@kaution.com');
                                    setRole('renter');
                                }}
                            >
                                Renter
                            </button>
                            <button
                                type="button"
                                className="demo-btn"
                                onClick={() => {
                                    setEmail('landlord@kaution.com');
                                    setRole('landlord');
                                }}
                            >
                                Landlord
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;

