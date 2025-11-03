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
- **Personal Finance Tools**: Includes six core tools:
    1.  **WealthView**: Monthly calendar view of transactions, recurring projections, and net savings. Displays both actual and recurring transactions with visual distinction (blue border + ↻ icon for recurring items).
    2.  **Income & Expense Tracker**: Unified ledger showing both regular AND recurring transactions, summary views, and forms for income/expense tracking with custom categories and running balance calculations. Recurring transactions appear with blue highlighting and ↻ icon.
    3.  **Recurring Transaction Manager**: Manages recurring income/expense templates with various frequencies and automatic calendar projections. These automatically appear in both WealthView calendar and Income & Expense ledger.
    4.  **Spending Analytics Dashboard**: Category-based spending breakdown with time range filtering and visualization.
    5.  **Goal Planner**: Tracks financial goals with progress bars and status management.
    6.  **Net Worth Tracker**: Manages individual assets/liabilities (cars, property, savings, loans) and calculates 12-month net worth projection based on total monthly income minus expenses (includes both regular and recurring transactions).

**System Design Choices:**
- **Database Schema**: PostgreSQL database with tables for users, categories, income, expenses, recurring_transactions, budgets, goals, assets. All tables are linked to the `users` table via foreign keys for data isolation.
- **API Design**: RESTful API endpoints for all core functionalities, prefixed with `/api`.
- **Project Structure**: Organized into `web-app/` (React Frontend) and `backend/` (Spring Boot Backend) directories.
- **Data Integration**: Recurring transactions are seamlessly integrated across the platform:
  - Calendar auto-generates monthly instances for display
  - Income & Expense ledger includes recurring items with visual distinction
  - Net worth projections factor in recurring monthly income/expenses
  - All components stay synchronized through independent API fetches

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