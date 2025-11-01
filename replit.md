# WealthWise - Financial Learning Platform

## Overview
WealthWise is a React-based financial learning and market overview platform that helps users on their journey to financial wisdom. The application provides market insights, educational content, product information, and personal finance tools.

## Tech Stack
- **Frontend Framework**: React 19.1.1
- **Build Tool**: Vite 7.1.7
- **Routing**: React Router DOM 7.9.3
- **Styling**: Tailwind CSS 3.4.13
- **HTTP Client**: Axios 1.12.2
- **Additional Features**: TradingView widget integration for stock charts

## Project Structure
```
web-app/
├── public/              # Static assets
├── src/
│   ├── assets/         # Images and static resources
│   ├── components/     # Reusable React components
│   │   ├── charts/     # TradingView widget
│   │   ├── layout/     # Navbar and Sidebar
│   │   └── stocks/     # Stock overview components
│   ├── layouts/        # Page layouts (MainLayout)
│   ├── pages/          # Page components
│   │   ├── Home/
│   │   ├── Learn/
│   │   ├── PersonalFinance/
│   │   └── Products/   # Charts, Products, Watchlist
│   ├── routes/         # Router configuration
│   ├── styles/         # Global CSS
│   └── utils/          # Utility functions (formatters)
├── vite.config.js      # Vite configuration
├── tailwind.config.js  # Tailwind CSS configuration
└── package.json        # Dependencies and scripts
```

## Development Setup

### Running Locally
The application is configured to run on port 5000 with Vite's development server:
```bash
cd web-app && npm run dev
```

The dev server is configured to:
- Listen on `0.0.0.0:5000` for Replit compatibility
- Support Hot Module Replacement (HMR)
- Proxy-friendly for Replit's iframe preview

### Building for Production
```bash
cd web-app && npm run build
```

### Preview Production Build
```bash
cd web-app && npm run preview
```

## Deployment
The application is configured for deployment using Replit's autoscale deployment:
- **Build Command**: `npm run build --prefix web-app`
- **Run Command**: `npx vite preview --host 0.0.0.0 --port 5000 --strictPort`
- **Deployment Type**: Autoscale (stateless frontend application)

## Key Features
1. **Market Overview**: Welcome page with financial wisdom introduction
2. **Learn**: Educational content for financial literacy
3. **Products**: 
   - Interactive charts with TradingView widget
   - Product listings
   - Watchlist functionality
4. **Personal Finance**: Tools and resources for personal financial management

## Configuration Notes
- Vite is configured to allow all hosts for Replit's proxy environment
- Port 5000 is used for both development and production preview
- HMR client port is set to 5000 for proper hot reload in Replit

## Recent Changes
- **2025-11-01**: Initial Replit environment setup
  - Installed Node.js 20 and project dependencies
  - Configured Vite for Replit (host: 0.0.0.0, port: 5000)
  - Set up frontend workflow
  - Configured deployment settings
  - Added .gitignore for Node.js projects

## Environment Variables
Currently no environment variables are required for basic functionality.

## User Preferences
None documented yet.
