import { useState } from 'react';

const CreateOrderModal = ({ onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        title: '',
        renterEmail: '',
        landlordEmail: '',
        propertyAddress: '',
        depositAmount: '',
        description: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({
            ...formData,
            depositAmount: parseFloat(formData.depositAmount)
        });
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="modal active" onClick={(e) => e.target.classList.contains('modal') && onClose()}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Create Deposit Order</h2>
                    <span className="close" onClick={onClose}>&times;</span>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="order-title">Order Title</label>
                        <input
                            type="text"
                            id="order-title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="e.g., Deposit for Apartment 3B"
                            required
                        />
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="renter-email">Renter Email</label>
                            <input
                                type="email"
                                id="renter-email"
                                name="renterEmail"
                                value={formData.renterEmail}
                                onChange={handleChange}
                                placeholder="renter@example.com"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="landlord-email">Landlord Email</label>
                            <input
                                type="email"
                                id="landlord-email"
                                name="landlordEmail"
                                value={formData.landlordEmail}
                                onChange={handleChange}
                                placeholder="landlord@example.com"
                                required
                            />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="property-address">Property Address</label>
                            <input
                                type="text"
                                id="property-address"
                                name="propertyAddress"
                                value={formData.propertyAddress}
                                onChange={handleChange}
                                placeholder="123 Main Street, City"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="deposit-amount">Deposit Amount (€)</label>
                            <input
                                type="number"
                                id="deposit-amount"
                                name="depositAmount"
                                value={formData.depositAmount}
                                onChange={handleChange}
                                placeholder="0.00"
                                step="0.01"
                                min="0"
                                required
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="order-description">Description</label>
                        <textarea
                            id="order-description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="4"
                            placeholder="Additional details about the deposit order..."
                        />
                    </div>
                    <div className="form-actions">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary">
                            Create Order
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateOrderModal;

