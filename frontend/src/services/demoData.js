// Demo data for showcasing the platform

export const createDemoOrders = () => {
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const twoDaysAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000);

    return [
        {
            id: '1001',
            title: 'Deposit for Apartment 3B - Main Street',
            renterEmail: 'renter@kaution.com',
            landlordEmail: 'landlord@kaution.com',
            propertyAddress: '123 Main Street, Apartment 3B, Berlin 10115',
            depositAmount: 2500.00,
            description: 'Security deposit for 2-bedroom apartment. Lease period: 12 months.',
            status: 'in_progress',
            createdBy: 'agent@kaution.com',
            createdAt: twoDaysAgo,
            updatedAt: yesterday,
            progress: [
                {
                    stage: 'order_created',
                    title: 'Order Created',
                    completed: true,
                    date: twoDaysAgo,
                    completedBy: 'agent@kaution.com'
                },
                {
                    stage: 'renter_review',
                    title: 'Renter Review',
                    completed: true,
                    date: yesterday,
                    completedBy: 'renter@kaution.com'
                },
                {
                    stage: 'landlord_review',
                    title: 'Landlord Review',
                    completed: false,
                    date: null,
                    completedBy: null
                },
                {
                    stage: 'deposit_held',
                    title: 'Deposit Held',
                    completed: false,
                    date: null,
                    completedBy: null
                },
                {
                    stage: 'completed',
                    title: 'Completed',
                    completed: false,
                    date: null,
                    completedBy: null
                }
            ],
            chatRoom: {
                orderId: '1001',
                participants: [
                    { email: 'agent@kaution.com', role: 'agent' },
                    { email: 'renter@kaution.com', role: 'renter' },
                    { email: 'landlord@kaution.com', role: 'landlord' }
                ],
                messages: [
                    {
                        id: 'msg1',
                        senderEmail: 'agent@kaution.com',
                        senderRole: 'agent',
                        senderName: 'John Agent',
                        text: 'Hello! I\'ve created the deposit order for your apartment. Please review the details and let me know if you have any questions.',
                        timestamp: twoDaysAgo
                    },
                    {
                        id: 'msg2',
                        senderEmail: 'renter@kaution.com',
                        senderRole: 'renter',
                        senderName: 'Jane Renter',
                        text: 'Thanks! The details look correct. I\'ll approve it now.',
                        timestamp: new Date(yesterday.getTime() + 2 * 60 * 60 * 1000)
                    },
                    {
                        id: 'msg3',
                        senderEmail: 'agent@kaution.com',
                        senderRole: 'agent',
                        senderName: 'John Agent',
                        text: 'Great! Once the landlord approves, the deposit will be held securely.',
                        timestamp: new Date(yesterday.getTime() + 3 * 60 * 60 * 1000)
                    },
                    {
                        id: 'msg4',
                        senderEmail: 'landlord@kaution.com',
                        senderRole: 'landlord',
                        senderName: 'Bob Landlord',
                        text: 'I\'m reviewing the order now. Everything looks good so far.',
                        timestamp: yesterday
                    }
                ],
                createdAt: twoDaysAgo,
                updatedAt: yesterday
            }
        }
    ];
};

