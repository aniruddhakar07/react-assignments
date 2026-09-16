# Assignment 7 — Authentication System & Route Protection

An enterprise-ready **Authentication and Route Protection System** developed with **React 19** and **React Router v7**, integrating the complete Task Management system from Assignment 6 with simulated JSON Web Token (JWT) authorization, real-time password strength analytics, session persistence controls, and strict route guarding.

---

## 🚀 Installation & Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- npm

### Quick Start
```bash
# 1. Navigate to the project directory
cd Assignment_7_Authentication_System

# 2. Install dependencies
npm install

# 3. Start the Vite development server
npm run dev
```

Open the printed localhost URL in your browser (typically **http://localhost:5173** or **http://localhost:5175**).

### Build for Production
```bash
npm run build
npm run preview
```

---

## ✨ Features

- **User Authentication Flow**:
  - **Login View (`/login`)**: Secure login screen with credential validation and 1-click demo credential autofill.
  - **Registration View (`/register`)**: New account registration with real-time field validation and duplicate check.
  - **Session Invalidation (Logout)**: Clears tokens, purges session credentials, and redirects cleanly.
- **Simulated JSON Web Tokens (JWT)**:
  - Generates RFC 7519 standard 3-part encoded tokens: `Header.Payload.Signature`.
  - Includes issued-at (`iat`) and expiration (`exp`) timestamps.
  - Interactive **JWT Token Inspector Modal** accessible right from the navbar:
    - Displays raw color-coded token segments.
    - Decodes Header and Payload claims into JSON.
    - Displays live countdown timer until token expiration.
    - Includes 1-click token clipboard copy.
- **Interactive Password Strength Meter**:
  - 4-segmented dynamic color meter (Weak, Fair, Good, Strong).
  - Real-time requirement criteria checklist:
    - Minimum 8 characters
    - At least one uppercase letter
    - At least one lowercase letter
    - At least one numeric digit
    - At least one special symbol (`!@#$%^&*`)
- **"Remember Me" Session Persistence**:
  - **Checked**: Saves credentials and token to `localStorage` (persists across browser restarts).
  - **Unchecked**: Saves to `sessionStorage` (scoped to active browser tab session only).
- **Strict Route Protection**:
  - Intercepts all unauthorized attempts to access protected pages (`/dashboard`, `/tasks`, `/tasks/:id`, `/add-task`, `/completed`).
  - Redirects unauthenticated visitors to `/login?redirect=${encodeURIComponent(targetPath)}`.
  - Automatically redirects users back to their intended target page once authenticated.
- **Integrated Full-Featured Task Manager**:
  - Full Task Manager features including executive metrics, category progress, URL search parameter syncing, dynamic task detail views (`/tasks/:id`), lifecycle status modification (`Raised` → `Pending` → `Closed`), and completed archives.

---

## 📖 How to Use & Test Guide

### 1. Quick Login with Pre-Configured Demo Accounts
On the `/login` page, click either of the convenient autofill buttons:
- **Admin**: `admin` / `Password@123`
- **Student**: `student` / `Password@123`
Then click **Sign In** to log in immediately.

### 2. Testing Registration & Password Strength Meter
1. On the login screen, click **Don't have an account? Register**.
2. Type in a Full Name, Username, and Email.
3. In the **Password** field, start typing and observe the live meter:
   - Notice the segmented bar transitioning from **Red (Weak)** to **Yellow (Fair)** to **Green (Strong)** as you fulfill criteria.
   - Each checklist item updates in real time with green checkmarks.
4. Complete registration to sign in automatically with your new account.

### 3. Inspecting the Live JWT Token
1. Once logged in, locate the **JWT Token** badge in the top navigation bar.
2. Click it to open the **JWT Token Inspector Modal**.
3. Inspect the raw 3-segment token:
   - Red segment: Header (`{"alg":"HS256","typ":"JWT"}`)
   - Purple segment: Payload (user ID, username, roles, expiration)
   - Cyan segment: HMAC Signature
4. View the live countdown timer displaying token remaining lifetime.
5. Click **Copy Token** to copy the token to your clipboard.

### 4. Testing "Remember Me" Persistence
- When logging in, check **Remember Me**: close your browser tab or restart your browser, and open the app again. You will remain logged in (backed by `localStorage`).
- When logging in, uncheck **Remember Me**: close the tab and reopen. The session is cleared (backed by `sessionStorage`).

### 5. Testing Route Protection & Redirect Memory
1. Click **Sign Out** in the user menu.
2. Manually type a protected URL into your browser address bar (e.g., `http://localhost:5175/tasks/task-101` or `/add-task`).
3. Observe how the router intercepts the request and redirects to `/login?redirect=...`.
4. Sign in. The system automatically navigates you straight to the page you originally tried to visit.

---

## 👤 Pre-Configured Demo Credentials

| Role | Username | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin` | `Password@123` | Full administrative & task management access |
| **Student** | `student` | `Password@123` | Standard user access & task creation |

---

## 🛠️ Tech Stack

- **React 19**: Custom hooks (`useAuth`, `useTasks`), modular component architecture
- **React Router v7**: Layout routing, route protection guards, URL query syncing
- **Lucide React**: Modern UI icons
- **Vanilla CSS**: Dark theme, form validation states, modal overlays, responsive sidebar
- **JWT Simulation**: Client-side Base64Url encoding, deterministic HMAC signatures, expiration tracking

---

## 📁 Project Structure

```
Assignment_7_Authentication_System/
├── src/
│   ├── components/
│   │   ├── ErrorBoundary.jsx          # Exception catcher
│   │   ├── JwtTokenModal.jsx          # Interactive JWT token debugger modal
│   │   ├── Layout.jsx                 # App layout with Sidebar and Navbar
│   │   ├── Modal.jsx                  # Modal dialog base
│   │   ├── Navbar.jsx                 # Header with user menu & JWT badge
│   │   ├── PasswordStrengthBar.jsx    # Real-time password meter & criteria list
│   │   ├── ProtectedRoute.jsx         # Authentication route guard
│   │   ├── Sidebar.jsx                # Responsive navigation drawer
│   │   ├── StatCard.jsx               # Metric summary cards
│   │   ├── TaskCard.jsx               # Task item card
│   │   └── TaskFilterBar.jsx          # Search and filter controls
│   ├── context/
│   │   ├── AuthContext.jsx            # Authentication state, login, register, JWT
│   │   └── TaskContext.jsx            # Task state and localStorage sync
│   ├── pages/
│   │   ├── AddTask.jsx                # New task creation form
│   │   ├── CompletedTasks.jsx         # Archive of completed tasks
│   │   ├── Dashboard.jsx              # Executive metrics & overview
│   │   ├── Login.jsx                  # Login form with autofill demo buttons
│   │   ├── NotFound.jsx               # 404 page
│   │   ├── Register.jsx               # User registration with password meter
│   │   ├── TaskDetails.jsx            # Dynamic task view and lifecycle editor
│   │   └── Tasks.jsx                  # Main task directory
│   ├── utils/
│   │   ├── jwt.js                     # RFC 7519 simulated JWT encoder/decoder
│   │   └── passwordStrength.js        # Password analysis algorithm
│   ├── App.jsx                        # Routing and ProtectedRoute definitions
│   ├── index.css                      # Design system tokens and styles
│   └── main.jsx                       # React entry point
├── index.html
├── package.json
└── vite.config.js
```
