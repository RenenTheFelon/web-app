# WealthWise - Full-Stack Financial Learning Platform

## Overview
WealthWise is a comprehensive full-stack financial platform designed to empower users with market insights, educational content, and robust personal finance management tools. It aims to guide users toward financial literacy and wisdom through an integrated experience.

## User Preferences
None documented yet.

## System Architecture
WealthWise is a full-stack application utilizing a React frontend and a Spring Boot backend.

**UI/UX Decisions:**
- Frontend built with React and styled using Tailwind CSS for a modern, responsive design.
- TradingView widget integration for market insights.
- Intuitive personal finance tools with clear visual indicators (e.g., color-coded transactions, progress bars).

**Technical Implementations:**
- **Frontend**: React 19.1.1, Vite 7.1.7, React Router DOM 7.9.3, Axios 1.12.2. Runs on port 5000.
- **Backend**: Spring Boot 3.2.0, Java 17, Maven. Runs on port 8080. Utilizes Hibernate/JPA for ORM and Jakarta Validation. CORS is configured for seamless frontend integration.
- **Monthly Carryover System**: Implemented true ledger-style month-to-month balance tracking:
    - MonthlyBalance entity stores opening balance, closing balance, total income, and total expense per month
    - Opening balance automatically equals previous month's closing balance (creating carryover continuity)
    - Closing balance = opening balance + total income - total expenses
    - Repository uses Spring Data naming convention with `findFirstByUserIdAndYearAndMonthBefore` to prevent NonUniqueResultException
    - Unique constraint on (user_id, year, month) ensures data integrity
- **Personal Finance Tools**: Includes five core tools:
    1.  **WealthView**: Monthly calendar view with automatic carryover balances. Displays opening balance (carried from previous month) and closing balance (will carry to next month) prominently. Shows transactions, recurring projections, and net savings with clean visual hierarchy.
    2.  **Income & Expense Tracker**: Unified ledger with five sub-tabs (Ledger Overview, Summary, Add Income, Add Expense, Recurring). Ledger Overview displays projected recurring transactions inline with actual transactions, using visual indicators (blue background, ↻ icon) to distinguish them. Includes "Make this recurring" checkbox in income/expense forms to create recurring transactions inline. The Recurring sub-tab manages recurring income/expense templates with various frequencies (daily, weekly, biweekly, monthly), automatic calendar projections, and full CRUD operations (create, edit, delete, toggle active/inactive).
    3.  **Spending Analytics Dashboard**: Category-based spending breakdown with time range filtering and visualization.
    4.  **Goal Planner**: Tracks financial goals with progress bars and status management.
    5.  **Net Worth Tracker**: Manages assets/liabilities and calculates historical net worth. Features 12-month projection visualization using monthly balance carryover data - accurately accumulates monthly deltas (closing - opening) to project future net worth based on recurring income/expenses.

**System Design Choices:**
- **Database Schema**: PostgreSQL database with tables for users, categories, income, expenses, recurring transactions, budgets, goals, net worth, and monthly_balances. All tables are linked to the `users` table via foreign keys for data isolation.
- **API Design**: RESTful API endpoints for all core functionalities, prefixed with `/api`. Monthly balance endpoints:
    - `GET /api/monthly-balance/{year}/{month}` - Get or calculate monthly balance
    - `GET /api/monthly-balance/{year}/{month}/projected` - Get projected balance including recurring transactions
    - `POST /api/monthly-balance/{year}/{month}/recalculate` - Force recalculation of monthly balance
- **Project Structure**: Organized into `web-app/` (React Frontend) and `backend/` (Spring Boot Backend) directories.
- **Backend Architecture**: 10 JPA repositories managing data persistence including MonthlyBalanceRepository for month-to-month carryover tracking.

## External Dependencies
- **Database**: PostgreSQL (Neon-hosted).
- **Frontend Libraries**:
    - React
    - React Router DOM
    - Axios
    - Tailwind CSS
- **Backend Libraries**:
    - Spring Boot
    - Hibernate/JPA
    - Jakarta Validation
- **External Integrations**:
    - TradingView widget.