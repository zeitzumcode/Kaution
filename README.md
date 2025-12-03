# Kaution - Deposit Management Platform

A comprehensive deposit management platform for housing agents, renters, and landlords to manage rental deposits efficiently with built-in communication.

## Features

### For Housing Agents
- Create deposit orders with property details
- Track all created orders
- Monitor order progress and status
- Automatically create chat rooms for each order
- Communicate with renters and landlords
- Receive notifications for order updates

### For Renters
- View deposit orders assigned to you
- Track order progress and status
- Join chat rooms for order-specific communication
- Receive notifications for order updates

### For Landlords
- View deposit orders for your properties
- Track order progress and status
- Join chat rooms for order-specific communication
- Receive notifications for order updates

## Key Features

- **Multi-Role Support**: Login as Agent, Renter, or Landlord with role-based dashboards
- **Simplified Login**: Email-only authentication (no passwords required for demo)
- **Order Management**: Create, view, and track deposit orders
- **Chat Rooms**: Automatically created chat rooms for each order accessible via floating widget
- **Floating Chat Widget**: Persistent chat interface in bottom-right corner for easy access
- **Progress Tracking**: Visual timeline showing order progress through different stages
- **Notifications**: Browser and in-app notifications for important updates
- **Modern UI**: Clean, minimalist design with smooth animations
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Demo Data**: Pre-loaded sample order for easy testing
- **Data Persistence**: All data stored locally in browser (LocalStorage) or PostgreSQL backend
- **Backend API**: FastAPI backend with PostgreSQL available (see `BACKEND_SETUP.md`)

## Getting Started

### Prerequisites

- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- A modern web browser (Chrome, Firefox, Safari, Edge)

### Running Locally

The frontend is now built with **React** using Vite. Follow these steps:

#### Step 1: Install Dependencies

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install npm dependencies:
   ```bash
   npm install
   ```

#### Step 2: Start Development Server

Run the React development server:
   ```bash
   npm run dev
   ```

   The app will automatically open at `http://localhost:8088`

**Note:** Press `Ctrl+C` in the terminal to stop the server when you're done.

#### Alternative: Build for Production

To build the production version:
   ```bash
   npm run build
   npm run preview
   ```

### Usage

#### Login

1. Select your role: Agent, Renter, or Landlord
2. Enter your email address
3. Click "Login"

**Quick Demo Login:**
- **Agent**: Click "Demo Agent" button or enter `agent@kaution.com`
- **Renter**: Click "Demo Renter" button or enter `renter@kaution.com`
- **Landlord**: Click "Demo Landlord" button or enter `landlord@kaution.com`

#### Creating an Order (Agents Only)

1. Log in as an Agent
2. Click "Create a new order" button (if orders exist) or "Create New Order"
3. Fill in the order details:
   - Order Title
   - Renter Email
   - Landlord Email
   - Property Address
   - Deposit Amount
   - Description (optional)
4. Click "Create Order"
5. A chat room is automatically created for this order

#### Viewing Orders

1. Click on any order card to see full details
2. View order information, progress timeline, and participant details
3. Each order shows its current status with color-coded badges

#### Chat Rooms

1. Click the chat icon on any order card to open the chat for that order
2. Or use the floating chat widget in the bottom-right corner
3. Select an order from the list (if multiple orders exist)
4. Send and receive messages - all parties (agent, renter, landlord) are included
5. Chat rooms are order-specific and automatically created with each order

## Order Progress Stages

Each deposit order goes through the following stages:

1. **Order Created** - Initial order creation by agent
2. **Renter Review** - Renter reviews and approves
3. **Landlord Review** - Landlord reviews and approves
4. **Deposit Held** - Deposit is secured
5. **Completed** - Order fully processed

## Technology Stack

### Frontend
- **React 18**: Modern UI library with hooks
- **Vite**: Fast build tool and dev server
- **CSS3**: Modern styling with responsive design and animations
- **LocalStorage**: Client-side data persistence (will be replaced with API calls)
- **Browser Notifications API**: For push notifications

### Key Libraries
- React 18.2.0
- React DOM 18.2.0
- Vite 5.0.8

### Backend
- **FastAPI** - Full REST API available (see `backend/` directory)
- **Multiple Database Options:**
  - PostgreSQL (Relational, SQLAlchemy)
  - MongoDB (NoSQL Document, Beanie)
  - DynamoDB (AWS NoSQL, Docker local) ⭐ Recommended
- RESTful API for order management, authentication, and chat
- Future: WebSocket support for real-time chat
- Future: JWT authentication

## Project Structure

```
Kaution/
├── frontend/                          # Frontend React application
│   ├── src/
│   │   ├── components/               # React components
│   │   │   ├── dashboards/          # Role-specific dashboards
│   │   │   │   └── AgentDashboard.jsx
│   │   │   ├── modals/              # Modal components
│   │   │   │   ├── CreateOrderModal.jsx
│   │   │   │   └── OrderDetailModal.jsx
│   │   │   ├── ChatRoom.jsx         # Chat room component
│   │   │   ├── Dashboard.jsx        # Main dashboard wrapper
│   │   │   ├── FloatingChatWidget.jsx # Floating chat widget
│   │   │   ├── Landing.jsx          # Landing page
│   │   │   ├── Login.jsx            # Login modal
│   │   │   ├── NotificationContainer.jsx
│   │   │   └── OrderCard.jsx        # Order card component
│   │   ├── hooks/                   # Custom React hooks
│   │   │   ├── useAuth.js          # Authentication hook
│   │   │   ├── useNotifications.js # Notifications hook
│   │   │   └── useOrders.js        # Orders management hook
│   │   ├── services/                # Business logic services
│   │   │   ├── authService.js      # Authentication logic
│   │   │   ├── chatService.js      # Chat room management
│   │   │   ├── demoData.js         # Demo data generation
│   │   │   └── orderService.js     # Order management
│   │   ├── App.jsx                  # Main app component
│   │   ├── main.jsx                 # React entry point
│   │   └── styles.css               # All styling
│   ├── package.json                 # Dependencies and scripts
│   └── vite.config.js               # Vite configuration
├── backend/                        # Backend API (FastAPI + PostgreSQL)
│   ├── routers/                   # API route handlers
│   ├── models.py                  # Database models
│   ├── schemas.py                 # Pydantic schemas
│   ├── main.py                    # FastAPI application
│   └── README.md                  # Backend documentation
├── README.md                      # This file
├── BACKEND_SETUP.md               # Backend setup summary
├── FEATURES.md                    # Feature documentation
└── DEMO_DATA.md                   # Demo data guide
```

## Browser Compatibility

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Demo Data

The application includes demo data that loads automatically:
- **1 sample order** (Order #1001) in "In Progress" status
- **Pre-configured chat room** with example messages
- **Demo users** for each role (agent, renter, landlord)

To reload demo data, use the "Load Demo Data" button if available, or clear your browser's LocalStorage and refresh.

## Data Storage

All data is stored in the browser's LocalStorage. This means:
- Data persists across browser sessions
- Data is browser-specific (not synced across devices)
- Clearing browser data will remove all stored information
- Demo data is automatically initialized on first load

## UI Features

- **Landing Page**: Beautiful introduction page with platform overview
- **Role-Based Dashboards**: Customized views for agents, renters, and landlords
- **Modern Order Cards**: Clean card design with status badges and quick actions
- **Floating Chat Widget**: Persistent, accessible chat interface
- **Order Details Modal**: Comprehensive order information with progress timeline
- **Smooth Animations**: Polished user experience with transitions

## Future Enhancements

Potential features for future versions:
- User authentication with server-side validation
- Email notifications for order updates
- Document upload and management
- Payment processing integration
- Multi-currency support
- Advanced reporting and analytics
- Real-time chat with WebSocket
- Mobile app version
- Push notifications for mobile devices

## License

This project is open source and available for educational and commercial use.

## Support

For questions or issues, please open an issue in the repository.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.