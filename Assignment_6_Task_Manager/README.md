# Assignment 6 — Task Manager with Routing

A modern Task Management application developed with **React 19** and **React Router v7**, featuring nested layout routing, dynamic route parameters (`/tasks/:id`), URL search parameter synchronization, task lifecycle transitions, and route protection.

---

## 🚀 Installation & Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- npm

### Quick Start
```bash
# 1. Navigate to the project directory
cd Assignment_6_Task_Manager

# 2. Install dependencies
npm install

# 3. Start the Vite development server
npm run dev
```

Open the printed localhost URL in your browser (typically **http://localhost:5173** or **http://localhost:5174**).

### Build for Production
```bash
npm run build
npm run preview
```

---

## ✨ Features

- **Executive Metrics Dashboard**:
  - Top summary cards displaying Total Tasks, Pending Tasks, and Completed Tasks.
  - Category distribution bars (Academic vs. Personal tasks).
  - High-priority urgent task warning cards and recent activities list.
- **Task Directory with URL Search Sync**:
  - Filter tasks by **Search Query**, **Priority** (High, Medium, Low), **Category** (Academic, Personal), and **Status** (Raised, Pending, Closed).
  - Sort by Due Date, Raised Date, or Title.
  - All filter and sort parameters synchronize live to browser URL search params (`?q=...&priority=...`), allowing shareable filtered views.
- **Dynamic Task Details View (`/tasks/:id`)**:
  - Deep-linkable individual task pages using dynamic routing parameters.
  - Task status lifecycle management: transition smoothly from **Raised** → **Pending** → **Closed**.
  - Inline task editing and deletion controls.
- **Controlled Task Creation (`/add-task`)**:
  - Controlled form with real-time validation.
  - Automatically captures the current creation timestamp and defaults due dates.
  - Assigns priority and category tags.
- **Completed Tasks Archive (`/completed`)**:
  - Dedicated view for all resolved tasks.
  - Provides a 1-click **Restore Task** action to move tasks back to active workflow.
- **Route Guard Security Toggle**:
  - Features an interactive **Guard status toggle** right in the top navigation bar (`Guard: Open` vs `Guard: Locked`).
  - Demonstrates route protection by intercepting unauthorized attempts to access protected routes (such as `/add-task`).

---

## 📖 How to Use

### 1. Exploring the Dashboard
- Upon launch, you land on the **Dashboard** (`/dashboard`).
- Review overall task progress, urgent high-priority alerts, and category distributions.
- Click **Add New Task** or **View All Tasks** buttons for quick navigation.

### 2. Browsing and Filtering Tasks
- Navigate to **Tasks** (`/tasks`).
- Type keywords in the search bar or pick options from the **Priority**, **Category**, and **Status** dropdowns.
- Notice how the browser URL updates with query parameters (e.g., `/tasks?priority=High&category=Academic`). You can bookmark or copy this link directly.

### 3. Creating a Task
1. Click **Add Task** in the sidebar or top navigation.
2. Enter the **Task Title** and **Description**.
3. Select **Priority** (High, Medium, Low) and **Category** (Academic, Personal).
4. Select a **Due Date** and click **Create Task**.
5. The task is created with an automatic timestamp and appears in your task list.

### 4. Updating Task Status & Details
1. From the task list or dashboard, click on any task title or card to navigate to its dynamic detail page (`/tasks/:id`).
2. Use the **Status Transition** buttons to progress the task lifecycle:
   - Mark as **In Progress (Pending)**
   - Mark as **Resolved (Closed)**
3. Alternatively, click **Edit Task** to modify title, description, or due date, or click **Delete Task** to remove it.

### 5. Managing Completed Tasks
- Navigate to **Completed** (`/completed`) to view all archived closed tasks.
- Click **Reopen Task** on any item to return it to active status.

### 6. Testing the Route Guard
- In the top navigation bar, click the **Guard Toggle** (`Guard: Open` / `Guard: Locked`).
- When set to `Locked`, attempt navigating to `/add-task`.
- Notice the protected route security card blocking access with an explanation and an unlock button.

---

## 🗺️ Application Routes

| Path | View | Access Level | Description |
| :--- | :--- | :--- | :--- |
| `/` | Redirect | Public | Automatically redirects to `/dashboard` |
| `/dashboard` | `Dashboard` | Public | High-level metrics, category bars, urgent tasks |
| `/tasks` | `Tasks` | Public | Task directory with real-time URL filter sync |
| `/tasks/:id` | `TaskDetails` | Dynamic | Deep-linked individual task view & status lifecycle |
| `/add-task` | `AddTask` | Protected | New task creation form with auto-timestamp |
| `/completed` | `CompletedTasks` | Public | Archive of finished tasks with 1-click restore |
| `*` | `NotFound` | Public | Graceful 404 error page with return-home action |

---

## 🛠️ Tech Stack

- **React 19**: Custom hooks, state management, modular components
- **React Router v7**: Layout nesting, `useParams`, `useSearchParams`, `useNavigate`, `<NavLink>`
- **Lucide React**: Modern icons
- **Vanilla CSS**: Clean responsive design system, status badge themes, card layouts

---

## 📁 Project Structure

```
Assignment_6_Task_Manager/
├── src/
│   ├── components/
│   │   ├── ErrorBoundary.jsx      # Error handling boundary
│   │   ├── Layout.jsx             # Shell layout with Sidebar and Navbar
│   │   ├── Modal.jsx              # Reusable modal dialog
│   │   ├── Navbar.jsx             # Top bar with route guard toggle
│   │   ├── ProtectedRoute.jsx     # Route protection guard
│   │   ├── Sidebar.jsx            # Responsive navigation drawer
│   │   ├── StatCard.jsx           # Dashboard metric cards
│   │   ├── TaskCard.jsx           # Task preview item card
│   │   └── TaskFilterBar.jsx      # Search, filter, and sort controls
│   ├── context/
│   │   ├── BasicAuthContext.jsx   # Route guard state provider
│   │   └── TaskContext.jsx        # Centralized task state & localStorage sync
│   ├── pages/
│   │   ├── AddTask.jsx            # Controlled task creation form
│   │   ├── CompletedTasks.jsx     # Archive of resolved tasks
│   │   ├── Dashboard.jsx          # Metric cards and overview
│   │   ├── NotFound.jsx           # 404 page
│   │   ├── TaskDetails.jsx        # Dynamic task view and lifecycle editor
│   │   └── Tasks.jsx              # Main directory view
│   ├── App.jsx                    # Route definitions and RouterProvider
│   ├── index.css                  # Design system tokens and styles
│   └── main.jsx                   # React entry point
├── index.html
├── package.json
└── vite.config.js
```
