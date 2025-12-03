# Kaution Platform Features

## User Roles & Relationships

### Agent (Housing Agent)
- **Creates** deposit orders
- **Automatically creates** chat rooms for each order
- **Includes** renter and landlord email addresses in the chat room
- **Tracks** all created orders
- **Monitors** order progress
- **Communicates** with renters and landlords via chat

### Renter (Order Participant)
- **Participates** in order chat rooms via email
- Orders include renter email for communication
- Can be invited to review orders through the platform

### Landlord (Order Participant)
- **Participates** in order chat rooms via email
- Orders include landlord email for communication
- Can be invited to review orders through the platform

## Key Features

### 1. Simplified Login
- No password required
- Just email address
- Quick demo login button
- All users are agents with full access

### 2. Chat Rooms
- **Auto-created** when agent creates an order
- **Participants**: Agent, Renter, Landlord
- **Order-specific**: Each order has its own chat
- **Real-time messaging**: Send and receive messages
- **Accessible** via tabs in order detail view

### 3. Order Management
- **Creation**: Agents create orders with property details
- **Review Process**: 
  1. Renter reviews first
  2. Landlord reviews after renter approval
  3. Deposit is automatically held
  4. Order completes
- **Progress Tracking**: Visual timeline showing all stages
- **Status Updates**: Real-time status changes

### 4. Notifications
- **Browser notifications** for order updates
- **In-app notifications** for:
  - Order creation
  - Order approvals
  - Status changes
  - New chat messages (coming soon)
- **Auto-dismiss** after 5 seconds
- **Manual dismiss** option

### 5. Beautiful UI
- **Landing page** with platform introduction
- **Habito-style** gradient backgrounds
- **Clean, modern design**
- **Responsive** for all devices
- **Smooth animations**

## How It Works

1. **Agent creates order** → Chat room automatically created
2. **Renter receives notification** → Reviews order details
3. **Renter approves** → Notifies landlord
4. **Landlord reviews** → Approves order
5. **Deposit held** → All three can track progress
6. **All parties chat** → Communicate about the order

## Technology

- React 18
- Vite (build tool)
- LocalStorage (data persistence)
- Modern CSS with animations
- Browser Notifications API

## Next Steps

When connecting to a backend:
- Replace localStorage with API calls
- Add WebSocket for real-time chat
- Add proper authentication
- Add email notifications
- Add file uploads

