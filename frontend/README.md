# Kaution Frontend - React Application

Modern React frontend for the Kaution Deposit Management Platform, built with Vite.

## Technology Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **JavaScript (ES6+)** - Programming language
- **CSS3** - Styling

## Project Structure

```
frontend/
├── src/
│   ├── components/        # React components
│   │   ├── dashboards/   # Role-specific dashboards
│   │   ├── modals/       # Modal components
│   │   ├── Login.jsx     # Login component
│   │   ├── Dashboard.jsx # Main dashboard container
│   │   └── OrderCard.jsx # Order card component
│   ├── hooks/            # Custom React hooks
│   │   ├── useAuth.js    # Authentication hook
│   │   └── useOrders.js  # Orders management hook
│   ├── services/         # Business logic services
│   │   ├── authService.js    # Authentication service
│   │   └── orderService.js   # Order service
│   ├── styles.css        # Global styles
│   ├── App.jsx           # Main app component
│   └── main.jsx          # Entry point
├── public/               # Static assets
├── index.html            # HTML template
├── package.json          # Dependencies
├── vite.config.js        # Vite configuration
└── README.md             # This file
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm (or yarn/pnpm)

### Installation

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:8088`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Features

- ✅ Role-based authentication (Agent, Renter, Landlord)
- ✅ Order management (create, view, approve)
- ✅ Progress tracking with visual timeline
- ✅ Responsive design
- ✅ LocalStorage data persistence

## Development

The frontend uses React hooks for state management and localStorage for data persistence. When you're ready to connect to a backend API, update the service files to make HTTP requests instead of using localStorage.

## Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## Next Steps

- Connect to backend API
- Add state management (Redux/Zustand) if needed
- Add unit tests
- Add error boundaries
- Add loading states and error handling
