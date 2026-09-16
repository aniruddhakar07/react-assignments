# Assignment 3 — Farm Employee Directory

An agricultural operations employee directory application built with **React** and **CSS**, featuring multi-field form validation, real-time department statistics, live-expiring "New" employee badges, multi-criteria filtering, and local storage persistence.

---

## 🚀 Installation & Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- npm

### Quick Start
```bash
# 1. Navigate to the project directory
cd Assignment_3_Employee_Directory

# 2. Install dependencies
npm install

# 3. Start the development server
npm start
# OR (if using dev script)
npm run dev
```

The application opens automatically in your browser at **http://localhost:3000** (or your local port).

### Build for Production
```bash
npm run build
```

---

## ✨ Features

- **Department Analytics & Metrics**:
  - Top metric badges display real-time employee counts across departments (Crops, Livestock, Dairy, Machinery & Maintenance, Warehouse & Logistics, Administration).
  - Empty departments automatically hide or adjust dynamically.
- **5-Minute Live "New" Employee Badges**:
  - Newly added staff members receive a vibrant green **"New"** badge.
  - A real-time background interval ticker automatically monitors timestamp ages and removes badges once 5 minutes pass—no page refresh required.
- **Robust Multi-Field Form Validation**:
  - **Employee ID**: Enforces unique identification numbers across staff.
  - **Phone Number**: Validates strict 10-digit phone numbers (`/^[0-9]{10}$/`) and checks for duplicates.
  - **Dual Address Support**: Separate inputs for Local (near-farm residence) and Permanent home addresses.
  - **Unsaved Changes Safeguard**: Warns users if they attempt to discard form inputs with unsaved changes.
- **Search & Multi-Criteria Sorting**:
  - Real-time search by Employee Name or Employee ID.
  - Department filter buttons to view specific crews.
  - Sort by Name (A–Z), Department, or Natural Employee ID ordering.
- **Full Data Persistence**: Automatically syncs directory state to browser `localStorage`.

---

## 📖 How to Use

### 1. Adding a New Employee
1. Click **Add Employee** (or open the enrollment drawer/form).
2. Fill in the required details:
   - **Full Name**
   - **Employee ID** (e.g., `EMP008`)
   - **Department** (select from Crops, Livestock, Dairy, etc.)
   - **Gender**
   - **10-Digit Phone Number** (must be exactly 10 digits)
   - **Local Address** and **Permanent Address**
3. Click **Submit**. If valid, the employee card appears immediately with a **"New"** badge.

### 2. Observing the 5-Minute "New" Badge Ticker
- Observe the green **"New"** badge on recently added employee cards.
- The background ticker checks timestamps every 30 seconds; after 5 minutes from creation, the badge disappears automatically in real time.

### 3. Searching and Filtering
- **Search Bar**: Type any part of an employee's name or ID to filter the grid instantly.
- **Department Pills**: Click any department badge in the header to filter to that specific team. Click "All" to reset.
- **Sort Dropdown**: Switch between sorting by Name (A–Z), Department, or Employee ID.

### 4. Editing and Deleting
- **Edit**: Click the edit button on an employee card to load their details into the form and update their information.
- **Delete**: Click the delete icon; confirm the browser dialog to remove the employee.

---

## 🛠️ Tech Stack

- **React**: Component hierarchy, state machines with `useState`, interval timer tickers and localStorage syncing with `useEffect`
- **Vanilla CSS**: Bespoke responsive styles, avatar initials, department badge themes, and modal layout

---

## 📁 Project Structure

```
Assignment_3_Employee_Directory/
├── public/
│   └── index.html
├── src/
│   ├── App.css          # Form styling, card grid, badge themes, responsive rules
│   ├── App.jsx          # Directory state, validation, timer logic, UI layout
│   └── index.js         # React application root
├── package.json
└── README.md
```
