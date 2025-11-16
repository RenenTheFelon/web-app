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
- **Monthly Projection System**: Recurring transactions automatically generate actual income/expense database entries for 12 months ahead:
    - Income and Expense entities include `is_recurring` boolean flag and `recurring_transaction_id` foreign key
    - Backend automatically creates/updates/deletes future entries when recurring transactions change
    - Frontend displays recurring entries with visual indicators (↻ icon, blue highlight)
    - All financial tools filter and display month-specific data with accurate running balances
- **Personal Finance Tools**: Includes five core tools:
    1.  **WealthView**: Monthly calendar view with automatic carryover balances. Displays opening balance (carried from previous month) and closing balance (will carry to next month) prominently. Shows transactions, recurring projections, and net savings with clean visual hierarchy.
    2.  **Income & Expense Tracker**: Unified ledger with five sub-tabs supporting full monthly projection navigation:
        - **Ledger Overview**: Month-by-month ledger with Previous/Next navigation buttons. Displays opening balance ("Carried from previous month") and projected closing balance ("Will carry to next month") for selected month. Running balance calculation starts from monthly opening balance. Shows all income/expense entries including recurring projections with visual indicators (↻ icon, blue highlight, blue left border).
        - **Summary**: Month-filtered view showing total income, total expense, and detailed transaction tables for the selected month. Recurring transactions identified with ↻ icon and blue highlight.
        - **Add Income/Add Expense**: Forms for adding one-time or recurring transactions with inline "Make this recurring" checkbox.
        - **Recurring**: Manages recurring transaction templates with full CRUD operations (create, edit, delete, toggle active/inactive).
    3.  **Spending Analytics Dashboard**: Category-based spending breakdown with time range filtering and visualization.
    4.  **Goal Planner**: Tracks financial goals with progress bars and status management.
    5.  **Net Worth Tracker**: Manages assets/liabilities and calculates historical net worth. Features 12-month projection visualization using monthly balance carryover data - accurately accumulates monthly deltas (closing - opening) to project future net worth based on recurring income/expenses.
- **Trading Journal**: Comprehensive trading performance analysis dashboard for manual trade tracking:
    - **Manual Trade Entry**: Collapsible form for recording trades with all essential fields (asset, order type, entry/exit prices, P/L, timestamps, duration, session, strategy tags). Auto-calculates trade duration from open/close times.
    - **Behavioral Bias Panel**: Visual representation of trading bias (bull vs. bear) with horizontal progress bar showing BUY vs. SELL order distribution. Displays "Rather Bull", "Rather Bear", or "Neutral" based on trade ratios.
    - **Trading Day Performance Panel**: 7-day bar chart showing daily profit/loss for the current week (Sunday-Saturday). Green bars for profits, red for losses, with "Best Day" indicator showing highest profit day.
    - **Profitability Panel**: Circular donut chart displaying win rate percentage with detailed statistics (total trades, winning/losing trades, total profit/loss, net P/L). Color-coded green for profits, red for losses.
    - **Most Traded Instruments Panel**: Top 3 most-traded assets with horizontal bars showing win/loss breakdown for each instrument.

**System Design Choices:**
- **Database Schema**: PostgreSQL database with tables for users, categories, income, expenses, recurring transactions, budgets, goals, net worth, monthly_balances, and trades. All tables are linked to the `users` table via foreign keys for data isolation.
- **API Design**: RESTful API endpoints for all core functionalities, prefixed with `/api`. Key endpoints include:
    - Monthly balance: `GET /api/monthly-balance/{year}/{month}`, `GET /api/monthly-balance/{year}/{month}/projected`, `POST /api/monthly-balance/{year}/{month}/recalculate`
    - Trading journal: `GET/POST/PUT/DELETE /api/trades`, `GET /api/trades/analytics/behavioral-bias`, `GET /api/trades/analytics/profitability`, `GET /api/trades/analytics/most-traded`, `GET /api/trades/analytics/trading-day-performance`
- **Project Structure**: Organized into `web-app/` (React Frontend) and `backend/` (Spring Boot Backend) directories.
- **Backend Architecture**: 11 JPA repositories managing data persistence including MonthlyBalanceRepository for month-to-month carryover tracking and TradeRepository for trading journal analytics.

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