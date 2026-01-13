# Requirements Document

## Introduction

Admin Dashboard for AnalyticaOS platform that provides administrators with a comprehensive view of platform metrics, user management, transaction monitoring, and token management capabilities.

## Glossary

- **Admin_Dashboard**: The main administrative interface for platform management
- **Stats_Card**: A card component displaying a single metric with title, value, subtitle, and trend indicator
- **Transaction_Volume_Chart**: An area chart showing transaction volume over time with daily/weekly/monthly views
- **Orbits_Wallet**: The administrative platform wallet showing balance and token holdings
- **Recent_Transactions_Table**: A table displaying the latest platform transactions

## Requirements

### Requirement 1: Admin Dashboard Layout

**User Story:** As an admin, I want a clean sidebar navigation with dashboard sections, so that I can easily navigate between different admin functions.

#### Acceptance Criteria

1. THE Admin_Dashboard SHALL display a sidebar with navigation items: Dashboard, Transactions, Tokens, Users, and Settings
2. THE Admin_Dashboard SHALL display the current page title in the header
3. THE Admin_Dashboard SHALL include a search bar in the header
4. THE Admin_Dashboard SHALL display a notification bell icon with badge count in the header
5. THE Admin_Dashboard SHALL show "Admin Version 1.0.0" at the bottom of the sidebar

### Requirement 2: Statistics Cards

**User Story:** As an admin, I want to see key platform metrics at a glance, so that I can monitor platform health.

#### Acceptance Criteria

1. THE Admin_Dashboard SHALL display a "Total Users" card showing user count with subtitle "Active wallets on the platform" and percentage change vs last month
2. THE Admin_Dashboard SHALL display a "Total Transactions" card showing transaction count with subtitle "All time transaction count" and percentage change vs last month
3. THE Admin_Dashboard SHALL display an "Airdrops Distributed" card showing total value with subtitle "Tokens distributed to users" and percentage change vs last month
4. THE Admin_Dashboard SHALL display a "Total Yields Paid" card showing yield amount with subtitle "Yield payments to holders" and percentage change vs last month
5. WHEN percentage change is positive THEN THE Stats_Card SHALL display the value in green with "+" prefix
6. WHEN percentage change is negative THEN THE Stats_Card SHALL display the value in red with "-" prefix

### Requirement 3: Transaction Volume Chart

**User Story:** As an admin, I want to visualize transaction volume over time, so that I can identify trends and patterns.

#### Acceptance Criteria

1. THE Transaction_Volume_Chart SHALL display an area chart with transaction volume data
2. THE Transaction_Volume_Chart SHALL support Daily, Weekly, and Monthly view toggles
3. WHEN Daily view is selected THEN THE Transaction_Volume_Chart SHALL show data points for each day
4. THE Transaction_Volume_Chart SHALL display Y-axis values in dollar format (e.g., $2,500, $5,000)
5. THE Transaction_Volume_Chart SHALL display X-axis with date labels

### Requirement 4: Orbits Wallet Card

**User Story:** As an admin, I want to see the platform's administrative wallet details, so that I can monitor platform funds.

#### Acceptance Criteria

1. THE Orbits_Wallet SHALL display the wallet address with truncation (e.g., "0x1a2b3c...7q8r9s0t")
2. THE Orbits_Wallet SHALL include a "Copy" button to copy the full wallet address
3. THE Orbits_Wallet SHALL display the total balance in dollar format
4. THE Orbits_Wallet SHALL list all tokens held with their names, symbols, and values

### Requirement 5: Recent Transactions Table

**User Story:** As an admin, I want to see recent platform transactions, so that I can monitor activity and identify issues.

#### Acceptance Criteria

1. THE Recent_Transactions_Table SHALL display columns: Transaction ID, User, Amount, Type, Status, Date, Action
2. THE Recent_Transactions_Table SHALL show the transaction ID in format "TX123456"
3. THE Recent_Transactions_Table SHALL display user email addresses
4. THE Recent_Transactions_Table SHALL format amounts in dollar format
5. THE Recent_Transactions_Table SHALL display transaction types: Purchase, Yield, Transfer
6. WHEN status is "Completed" THEN THE Recent_Transactions_Table SHALL display a green badge
7. WHEN status is "Pending" THEN THE Recent_Transactions_Table SHALL display a yellow badge
8. THE Recent_Transactions_Table SHALL include a "View All" button linking to full transactions page
9. THE Recent_Transactions_Table SHALL include an action button (eye icon) to view transaction details

### Requirement 6: Admin Authentication

**User Story:** As a platform owner, I want only authorized admins to access the dashboard, so that sensitive data is protected.

#### Acceptance Criteria

1. WHEN a non-admin user attempts to access /admin routes THEN THE System SHALL redirect to login page
2. THE System SHALL verify admin role before rendering admin pages
3. IF user session is invalid THEN THE System SHALL redirect to login page

### Requirement 7: Admin API Endpoints

**User Story:** As an admin dashboard, I need API endpoints to fetch platform statistics, so that I can display real-time data.

#### Acceptance Criteria

1. THE System SHALL provide GET /api/admin/stats endpoint returning total users, transactions, airdrops, and yields
2. THE System SHALL provide GET /api/admin/transactions endpoint returning paginated transaction list
3. THE System SHALL provide GET /api/admin/chart-data endpoint returning transaction volume data for charts
4. THE System SHALL provide GET /api/admin/wallet endpoint returning platform wallet details
