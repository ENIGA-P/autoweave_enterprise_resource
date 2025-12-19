# AutoWeave ERP Frontend

Modern ERP frontend built with React and Tailwind CSS featuring an Industrial Elegance design system.

## Quick Start

```bash
npm install
npm run dev
```

Access at `http://localhost:5173`

**Login credentials**: `admin` / `password`

## Backend Setup (Required)

1.  Ensure **MongoDB** is running locally on default port `27017`.
2.  Start the backend server:

```bash
cd server
npm install
npm run dev
```

The backend runs on `http://localhost:5000`.

## Quick Start (Frontend)

```bash
npm install
npm run dev
```

Access at `http://localhost:5173`

## Features

- 🔐 Authentication with protected routes
- 📊 Real-time dashboard with charts
- 🏭 Machine management with status monitoring
- 📦 Order management (List/Kanban views)
- 📈 Production data entry
- 📄 Report generation (PDF/Excel)

## Tech Stack

- React 19.2 + Vite
- Tailwind CSS 4.1 (Industrial theme)
- React Router 7.10
- Recharts for data visualization
- Axios for API calls

## Project Structure

```
src/
├── components/
│   ├── common/      # Reusable UI components
│   └── layout/      # Sidebar, Header, MainLayout
├── context/         # AuthContext
├── pages/           # Page components
│   ├── auth/
│   ├── dashboard/
│   ├── machines/
│   ├── orders/
│   ├── production/
│   └── reports/
├── services/        # API service
└── App.jsx
```

## API Integration

The app uses mock data. To integrate with your backend:

1. Set `VITE_API_URL` in `.env`
2. Replace mock data in page components with actual API calls
3. Update `src/services/api.js` if needed

All API calls use the centralized Axios instance with token interceptors.

## Development

```bash
npm run dev    # Start dev server
npm run build  # Build for production
npm run lint   # Run ESLint
```

## License

MIT
