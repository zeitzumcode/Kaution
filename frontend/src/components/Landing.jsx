import { useState } from 'react';
import Login from './Login';
import Register from './Register';

const Landing = ({ onLogin }) => {
    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);

    const handleLoginSuccess = async (user) => {
        setShowLogin(false);
        if (user && user.email && user.role) {
            try {
                await onLogin(user.email, user.role);
            } catch (error) {
                console.error('Landing - onLogin error:', error);
            }
        }
    };

    const handleRegisterSuccess = async (user) => {
        setShowRegister(false);
        if (user && user.email && user.role) {
            try {
                await onLogin(user.email, user.role);
            } catch (error) {
                console.error('Landing - onLogin error:', error);
            }
        }
    };

    const switchToRegister = () => {
        setShowLogin(false);
        setShowRegister(true);
    };

    const switchToLogin = () => {
        setShowRegister(false);
        setShowLogin(true);
    };

    return (
        <>
            <div className="landing-page">
                <header className="landing-header">
                    <div className="landing-header-content">
                        <div className="logo">
                            <h2>Kaution</h2>
                        </div>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button className="btn btn-secondary" onClick={() => setShowLogin(true)}>
                                Log in
                            </button>
                            <button className="btn btn-primary" onClick={() => setShowRegister(true)}>
                                Sign up
                            </button>
                        </div>
                    </div>
                </header>

                <main className="landing-main">
                    <div className="landing-content">
                        <h1 className="landing-title">Deposit management made simpler</h1>
                        <p className="landing-subtitle">
                            Your deposit orders, tracking, and approvals - all in one, secure place.
                        </p>
                        
                        <div className="landing-features">
                            <div className="feature-card">
                                <div className="feature-icon">📋</div>
                                <h3>Order Management</h3>
                                <p>Create deposit orders with property details, renter and landlord information.</p>
                            </div>
                            <div className="feature-card">
                                <div className="feature-icon">💬</div>
                                <h3>Chat Rooms</h3>
                                <p>Automatically create chat rooms for each order to communicate with all parties.</p>
                            </div>
                            <div className="feature-card">
                                <div className="feature-icon">📊</div>
                                <h3>Track Progress</h3>
                                <p>Monitor deposit orders through every stage with real-time progress updates.</p>
                            </div>
                        </div>

                        <div className="landing-cta">
                            <button className="btn btn-primary btn-large" onClick={() => setShowRegister(true)}>
                                Get Started
                            </button>
                        </div>

                        <div className="landing-info">
                            <div className="info-section">
                                <h3>How it works</h3>
                                <div className="steps">
                                    <div className="step">
                                        <div className="step-number">1</div>
                                        <div className="step-content">
                                            <h4>Create Order</h4>
                                            <p>Agents create deposit orders with property and payment details</p>
                                        </div>
                                    </div>
                                    <div className="step">
                                        <div className="step-number">2</div>
                                        <div className="step-content">
                                            <h4>Review & Approve</h4>
                                            <p>Invite renters and landlords to review and approve the deposit order</p>
                                        </div>
                                    </div>
                                    <div className="step">
                                        <div className="step-number">3</div>
                                        <div className="step-content">
                                            <h4>Track Progress</h4>
                                            <p>Monitor your deposit through every stage with real-time updates</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            {showLogin && (
                <div className="login-overlay" onClick={() => setShowLogin(false)}>
                    <div className="login-overlay-content" onClick={(e) => e.stopPropagation()}>
                        <Login onLogin={handleLoginSuccess} onSwitchToRegister={switchToRegister} />
                    </div>
                </div>
            )}

            {showRegister && (
                <div className="login-overlay" onClick={() => setShowRegister(false)}>
                    <div className="login-overlay-content" onClick={(e) => e.stopPropagation()}>
                        <Register onRegister={handleRegisterSuccess} onSwitchToLogin={switchToLogin} />
                    </div>
                </div>
            )}
        </>
    );
};

export default Landing;
