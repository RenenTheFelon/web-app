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
- **Personal Finance Tools**: Includes five core tools:
    1.  **WealthView**: Monthly calendar view of transactions, recurring projections, and net savings.
    2.  **Income & Expense Tracker**: Unified ledger with five sub-tabs (Ledger Overview, Summary, Add Income, Add Expense, Recurring). Includes "Make this recurring" checkbox in income/expense forms to create recurring transactions inline. The Recurring sub-tab manages recurring income/expense templates with various frequencies (daily, weekly, biweekly, monthly), automatic calendar projections, and full CRUD operations (create, edit, delete, toggle active/inactive).
    3.  **Spending Analytics Dashboard**: Category-based spending breakdown with time range filtering and visualization.
    4.  **Goal Planner**: Tracks financial goals with progress bars and status management.
    5.  **Net Worth Tracker**: Manages assets/liabilities and calculates historical net worth.

**System Design Choices:**
- **Database Schema**: PostgreSQL database with tables for users, categories, income, expenses, recurring transactions, budgets, goals, and net worth. All tables are linked to the `users` table via foreign keys for data isolation.
- **API Design**: RESTful API endpoints for all core functionalities, prefixed with `/api`.
- **Project Structure**: Organized into `web-app/` (React Frontend) and `backend/` (Spring Boot Backend) directories.

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