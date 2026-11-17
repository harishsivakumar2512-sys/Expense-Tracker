# Expense Tracker Web Application

A full-stack personal finance and expense tracking web application replicating the UI design and implementing the complete IEEE 830 Software Requirements Specification (SRS v1.0).

---

## 🔗 Unified Merged App Link

The entire application (both the **React Frontend UI** and the **Django REST Backend**) is merged and served from a single unified link:

👉 **[http://127.0.0.1:8000/](http://127.0.0.1:8000/)** *(or [http://localhost:8000/](http://localhost:8000/))*

- No need to manage separate ports or cross-origin URLs.
- Static assets, React SPA routing, authentication, and REST APIs all run together under one origin.

---

## 🎨 Tech Stack

- **Frontend:** React 19 (SPA), Vite, Tailwind CSS v4, Recharts, Lucide React, Axios
- **Backend:** Django 6, Django REST Framework (DRF), SimpleJWT Token Authentication, Django CORS Headers
- **Database:** SQLite (persisted in `backend/db.sqlite3`)
- **Theme:** Precision Dark Mode (`#090a12` background, glowing gradient card surfaces, Indian Rupee `₹` formatting)

---

## 🚀 Quick Start Guide

### 1. Default Demo Credentials
When opening the application, sign in directly using the pre-seeded account:
- **Email:** `harish@example.com`
- **Password:** `password123`
*(A convenient **Auto-fill** button is also available on the Login screen).*

---

### 2. Running the Unified Server
From the project root:
```bash
cd backend
python manage.py runserver 127.0.0.1:8000
```
Then open: **[http://127.0.0.1:8000/](http://127.0.0.1:8000/)**

To re-seed the exact baseline data matching the design screenshot:
```bash
python backend/seed_data.py
```

*(Optional) For standalone frontend development with Vite HMR:*
```bash
cd frontend
npm run dev
# Accessible at http://localhost:5173
```

---

## 📋 Features Implemented (SRS Conformance)

### UC-01: Authentication Module (Login, Register & Logout)
- **Login:** Email and password verification, JWT access + refresh tokens, "Remember Me" toggle (persists in `localStorage` vs `sessionStorage`).
- **Register:** Name, email, password, and confirm password with real-time validation.
- **Logout:** Token revocation and session cleanup with redirect.
- **Profile:** Bottom sidebar user pill with "Harish S" and dropdown for account info & sign out.

### UC-02: Home / Dashboard Page
- **Header:** "Hello, Harish! 👋" greeting with subtitle and interactive period dropdown ("This Month", "Last Month", "6 Months", "This Year").
- **3 Summary KPI Cards:**
  - **Total Income:** `₹25,000` with `↑ +5%` trend badge and emerald glowing wallet icon.
  - **Total Expenses:** `₹16,750` with `↑ +12%` trend badge and red glowing credit card icon.
  - **Savings:** `₹8,250` with `↑ +5%` trend badge and purple glowing piggy bank icon.
- **Expense Overview Line Chart:**
  - Interactive spline line chart plotting Income (Green) vs Expenses (Purple) across `Mon` to `Sun` and `0` to `25k`.
  - Period toggles for *This Month*, *Last Month*, and *6 Months*.
- **Recent Transactions Widget:**
  - Displays latest transactions with category icons, date/time timestamps, and colored amounts (`- ₹420`, `- ₹40`, `+ ₹2,000`, `- ₹1,299`).
  - **See All →** button opens a full transaction manager with search, filter (All / Expense / Income), and delete functionality.
- **Spending by Category Donut Chart:**
  - Recharts Donut chart displaying centered `₹16,750 Total`.
  - Color-coded segments and legend percentages:
    - 🟠 Food & Dining (32%)
    - 🔵 Shopping (28%)
    - 🟢 Transport (18%)
    - 🟣 Entertainment (12%)
    - ⚪ Others (10%)
- **Sidebar Navigation:**
  - Brand logo with gradient wallet icon.
  - Active *Dashboard* pill, plus navigation placeholders for *Transactions*, *Analytics*, *Goals*, and *Settings*.
  - "Save more, achieve more!" promo card with rocket badge.

### UC-03: Add Transaction Component
- **Type Toggle:** Instant switch between *Expense* (purple active) and *Income*.
- **Category Selector:** Dropdown with icons for *Food & Dining*, *Shopping*, *Transport*, *Entertainment*, and *Others*.
- **Amount & Note Inputs:** Validation for positive non-zero numeric amounts and optional notes.
- **Instant Reactive Updates:** Adding a transaction dynamically recalculates summary totals, savings, category distributions, line chart, and recent transaction list without page reloads.
- **Toast Feedback:** Sleek animated notifications for errors and successful records.

---

## 🛠️ API Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/login/` | Authenticate user & return JWT tokens |
| `POST` | `/api/auth/register/` | Register new account |
| `POST` | `/api/auth/token/refresh/` | Refresh expired JWT access token |
| `POST` | `/api/auth/logout/` | Invalidate refresh token |
| `GET` | `/api/auth/me/` | Fetch authenticated user profile |
| `GET` | `/api/dashboard/summary/?period=` | Total income, expenses, and savings |
| `GET` | `/api/dashboard/overview/?range=` | Income vs Expense chart data points |
| `GET` | `/api/dashboard/category-spending/?period=` | Category spending totals and percentages |
| `GET` | `/api/transactions/?limit=` | Transaction list (recent or full) |
| `POST` | `/api/transactions/` | Create new transaction |
| `DELETE` | `/api/transactions/<id>/` | Delete transaction |
| `GET` | `/api/categories/` | List categories with icons & colors |
