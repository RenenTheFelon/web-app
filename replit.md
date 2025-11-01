# WealthWise - Full-Stack Financial Learning Platform

## Overview
WealthWise is a comprehensive full-stack financial platform combining market insights, educational content, and powerful personal finance management tools. Built with React frontend and Spring Boot backend, it provides users with everything they need for their journey to financial wisdom.

## Tech Stack
### Frontend
- **Framework**: React 19.1.1
- **Build Tool**: Vite 7.1.7
- **Routing**: React Router DOM 7.9.3
- **Styling**: Tailwind CSS 3.4.13
- **HTTP Client**: Axios 1.12.2
- **Additional**: TradingView widget integration

### Backend
- **Framework**: Spring Boot 3.2.0
- **Language**: Java 17
- **Build Tool**: Maven 3.x
- **Database**: PostgreSQL (Neon-hosted)
- **ORM**: Hibernate/JPA
- **Validation**: Jakarta Validation
- **CORS**: Configured for frontend integration

## Architecture
This is a full-stack application with:
- **Frontend** (React/Vite) running on port 5000
- **Backend** (Spring Boot) running on port 8080
- **Database** (PostgreSQL) with connection pooling

## Project Structure
```
.
├── web-app/                    # React Frontend
│   ├── src/
│   │   ├── components/         # Reusable components
│   │   ├── pages/
│   │   │   ├── PersonalFinance/
│   │   │   │   ├── components/     # 6 Personal Finance tools
│   │   │   │   │   ├── BudgetCalendar.jsx
│   │   │   │   │   ├── BudgetCalculator.jsx
│   │   │   │   │   ├── IncomeExpenseTracker.jsx
│   │   │   │   │   ├── SpendingAnalytics.jsx
│   │   │   │   │   ├── GoalPlanner.jsx
│   │   │   │   │   └── NetWorthTracker.jsx
│   │   │   │   └── PersonalFinance.jsx
│   │   │   └── ...
│   │   └── services/
│   │       └── api.js          # Backend API integration
│   └── package.json
├── backend/                    # Spring Boot Backend
│   ├── src/main/java/com/wealthwise/finance/
│   │   ├── controller/         # REST API endpoints
│   │   ├── service/            # Business logic
│   │   ├── repository/         # Data access layer
│   │   ├── entity/             # Database entities
│   │   ├── dto/                # Data transfer objects
│   │   ├── config/             # CORS configuration
│   │   └── exception/          # Global exception handling
│   ├── src/main/resources/
│   │   └── application.properties
│   └── pom.xml
└── replit.md                   # This file
```

## Personal Finance Features

The Personal Finance tab includes **6 fully integrated tools**:

### 1. Budget Calendar 📅
- Monthly view of income and expenses
- Daily transaction tracking
- Visual indicators (green for income, red for expenses)
- Monthly totals and balance calculations

### 2. Budget Calculator 💰
- Input monthly income and expenses
- Real-time balance calculation
- Visual feedback (surplus/deficit indicators)
- Save budgets to database

### 3. Income & Expense Tracker 📊
- Dual tab interface for Income and Expenses
- Category-based organization (8 expense, 6 income categories)
- Full CRUD operations (Create, Read, Update, Delete)
- Transaction history with date/description/amount

### 4. Spending Analytics Dashboard 📈
- Category-based spending breakdown
- Time range filtering (week/month/year)
- Percentage distribution visualization
- Top 5 expenses ranking
- Key metrics cards

### 5. Goal Planner 🎯
- Create and track financial goals
- Progress bars showing completion percentage
- Target amount and date tracking
- Status management (In Progress/Completed/Cancelled)
- Days remaining calculations

### 6. Net Worth Tracker 💎
- Assets and liabilities management
- Automatic net worth calculation (assets - liabilities)
- Historical record tracking
- Trend analysis over time
- Detailed breakdown fields

## Database Schema

### Tables
- **users**: User accounts (id, username, email, timestamps)
- **income**: Income records (source, amount, category, date, description)
- **expenses**: Expense records (name, amount, category, date, description)
- **budgets**: Budget plans (name, total_income, total_expenses, balance, month/year)
- **goals**: Financial goals (name, target_amount, current_amount, target_date, status)
- **net_worth**: Net worth snapshots (total_assets, total_liabilities, net_worth, date, breakdowns)

All tables have foreign key relationships to users table for data isolation.

## API Endpoints

All endpoints are prefixed with `/api`:

### Users
- `GET /api/users` - Get all users
- `GET /api/users/{id}` - Get user by ID
- `POST /api/users` - Create user
- `PUT /api/users/{id}` - Update user
- `DELETE /api/users/{id}` - Delete user

### Income
- `GET /api/income/user/{userId}` - Get all income for user
- `GET /api/income/user/{userId}/range?start={date}&end={date}` - Get income by date range
- `POST /api/income` - Create income entry
- `PUT /api/income/{id}` - Update income
- `DELETE /api/income/{id}` - Delete income

### Expenses
- `GET /api/expenses/user/{userId}` - Get all expenses for user
- `GET /api/expenses/user/{userId}/range?start={date}&end={date}` - Get expenses by date range
- `POST /api/expenses` - Create expense entry
- `PUT /api/expenses/{id}` - Update expense
- `DELETE /api/expenses/{id}` - Delete expense

### Budgets
- `GET /api/budgets/user/{userId}` - Get all budgets for user
- `POST /api/budgets` - Create budget
- `PUT /api/budgets/{id}` - Update budget
- `DELETE /api/budgets/{id}` - Delete budget

### Goals
- `GET /api/goals/user/{userId}` - Get all goals for user
- `POST /api/goals` - Create goal
- `PUT /api/goals/{id}` - Update goal
- `DELETE /api/goals/{id}` - Delete goal

### Net Worth
- `GET /api/networth/user/{userId}` - Get all net worth records for user
- `POST /api/networth` - Create net worth record
- `PUT /api/networth/{id}` - Update net worth record
- `DELETE /api/networth/{id}` - Delete net worth record

## Development Setup

### Prerequisites
- Node.js 20 (installed via Replit)
- Java 17+ (installed via Replit)
- PostgreSQL database (configured via environment variables)

### Running Locally

**Frontend:**
```bash
cd web-app && npm run dev
```
Runs on http://localhost:5000

**Backend:**
```bash
cd backend && mvn spring-boot:run
```
Runs on http://localhost:8080

### Environment Variables
The following variables are automatically configured in Replit:
- `DATABASE_URL` - PostgreSQL connection string
- `PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD`, `PGDATABASE` - Database connection details

## Deployment
- **Frontend**: Autoscale deployment (stateless)
  - Build: `npm run build --prefix web-app`
  - Run: `npx vite preview --host 0.0.0.0 --port 5000 --strictPort`
- **Backend**: Needs to be deployed separately on VPS
  - Package: `mvn clean package`
  - Run: `java -jar target/wealthwise-backend.jar`

## VPS Migration Notes

For migrating to your VPS:

1. **PostgreSQL Setup**: Configure your production PostgreSQL database
2. **Environment Variables**: Set `PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD`, `PGDATABASE`
3. **Backend Deployment**: 
   - Build: `mvn clean package`
   - Run: `java -jar backend/target/wealthwise-backend.jar`
   - Runs on port 8080 by default
4. **Frontend Configuration**: Update `web-app/src/services/api.js` with your production backend URL
5. **CORS**: Update `backend/src/main/java/com/wealthwise/finance/config/CorsConfig.java` with your production frontend URL

## Recent Changes
- **2025-11-01**: Full-stack Personal Finance implementation
  - Installed Java 17 and Spring Boot dependencies
  - Created complete Spring Boot backend with 6 REST controllers
  - Implemented JPA entities for all financial data models
  - Created PostgreSQL database with 6 tables
  - Built 6 React Personal Finance components with full CRUD functionality
  - Integrated frontend with backend via Axios
  - Set up workflows for both frontend and backend
  - Configured database connection and CORS
  - Created demo user (id=1, username='demo_user')

## Testing
- **Demo User**: A test user (ID: 1, username: 'demo_user') is pre-created
- **API Testing**: Use curl or Postman to test endpoints
- **Frontend Testing**: Navigate to Personal Finance tab to test all 6 tools

## User Preferences
None documented yet.
