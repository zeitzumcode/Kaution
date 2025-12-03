import { getOrderProgress, formatDate } from '../../services/orderService';

const OrderDetailModal = ({ order, currentUser, onClose, onApprove, onDelete }) => {
    if (!order) return null;

    const progress = getOrderProgress(order);

    const canUserApprove = () => {
        if (currentUser.role === 'renter') {
            return order.renterEmail === currentUser.email && 
                   !order.progress.find(p => p.stage === 'renter_review')?.completed;
        } else if (currentUser.role === 'landlord') {
            const renterReview = order.progress.find(p => p.stage === 'renter_review');
            return order.landlordEmail === currentUser.email && 
                   renterReview?.completed &&
                   !order.progress.find(p => p.stage === 'landlord_review')?.completed;
        }
        return false;
    };

    const getApprovalStage = () => {
        if (currentUser.role === 'renter') return 'renter_review';
        if (currentUser.role === 'landlord') return 'landlord_review';
        return null;
    };

    const handleApprove = () => {
        const stage = getApprovalStage();
        if (stage) {
            onApprove(order.id, stage);
        }
    };

    return (
        <div className="modal active" onClick={(e) => e.target.classList.contains('modal') && onClose()}>
            <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{order.title}</h2>
                    <span className="close" onClick={onClose}>&times;</span>
                </div>
                
                <div className="order-detail-view">
                    <div className="detail-section">
                        <div className="detail-section-title">Order Information</div>
                        <div className="detail-grid">
                            <div className="detail-item">
                                <div className="order-detail-label">Order ID</div>
                                <div className="order-detail-value">#{order.id}</div>
                            </div>
                            <div className="detail-item">
                                <div className="order-detail-label">Status</div>
                                <div className="order-detail-value">
                                    <span className={`order-status ${order.status}`}>
                                        {order.status.replace('_', ' ')}
                                    </span>
                                </div>
                            </div>
                            <div className="detail-item">
                                <div className="order-detail-label">Deposit Amount</div>
                                <div className="order-detail-value">
                                    €{order.depositAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </div>
                            </div>
                            <div className="detail-item">
                                <div className="order-detail-label">Created Date</div>
                                <div className="order-detail-value">{formatDate(order.createdAt)}</div>
                            </div>
                            <div className="detail-item">
                                <div className="order-detail-label">Last Updated</div>
                                <div className="order-detail-value">{formatDate(order.updatedAt)}</div>
                            </div>
                        </div>
                    </div>

                    <div className="detail-section">
                        <div className="detail-section-title">Property Details</div>
                        <div className="detail-grid">
                            <div className="detail-item">
                                <div className="order-detail-label">Address</div>
                                <div className="order-detail-value">{order.propertyAddress}</div>
                            </div>
                            <div className="detail-item">
                                <div className="order-detail-label">Renter</div>
                                <div className="order-detail-value">{order.renterEmail}</div>
                            </div>
                            <div className="detail-item">
                                <div className="order-detail-label">Landlord</div>
                                <div className="order-detail-value">{order.landlordEmail}</div>
                            </div>
                        </div>
                        {order.description && (
                            <div className="detail-item" style={{ marginTop: '15px' }}>
                                <div className="order-detail-label">Description</div>
                                <div className="order-detail-value">{order.description}</div>
                            </div>
                        )}
                    </div>

                    <div className="detail-section">
                        <div className="detail-section-title">Progress Timeline</div>
                        <div className="progress-label" style={{ marginBottom: '15px' }}>
                            <span>Overall Progress</span>
                            <span>{progress}%</span>
                        </div>
                        <div className="progress-bar">
                            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                        </div>
                        <div className="timeline">
                            {order.progress.map((item, index) => (
                                <div key={index} className={`timeline-item ${item.completed ? 'completed' : 'pending'}`}>
                                    <div className="timeline-icon"></div>
                                    <div className="timeline-content">
                                        <div className="timeline-title">{item.title}</div>
                                        {item.completed ? (
                                            <div className="timeline-date">
                                                Completed on {formatDate(item.date)} by {item.completedBy}
                                            </div>
                                        ) : (
                                            <div className="timeline-date">Pending</div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="order-actions">
                        {canUserApprove() && (
                            <button className="btn btn-success" onClick={handleApprove}>
                                Approve Order
                            </button>
                        )}
                        {currentUser.role === 'agent' && order.createdBy === currentUser.email && onDelete && (
                            <button 
                                className="btn btn-danger" 
                                onClick={() => {
                                    if (window.confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
                                        onDelete(order.id);
                                    }
                                }}
                                style={{ marginLeft: '10px' }}
                            >
                                Delete Order
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailModal;

