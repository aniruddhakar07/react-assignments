# Assignment 2 — Student Information Portal

A full-featured student record and academic grading portal built with **React 19** and **Vite**, featuring dual display modes (Cards & Table), interactive multi-semester grade tracking, real-time search and department filtering, and persistent local storage.

---

## 🚀 Installation & Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- npm

### Quick Start
```bash
# 1. Navigate to the project directory
cd Assignment_2_Student_information_portal

# 2. Install dependencies
npm install

# 3. Start the Vite development server
npm run dev
```

Open the printed localhost URL (default **http://localhost:5173**) in your browser.

### Build for Production
```bash
npm run build
npm run preview
```

---

## ✨ Features

- **Dual View Modes (Cards & Table)**:
  - **Cards View**: Visual student cards with an interactive 8-semester grade grid, student avatars, and inline detail editing.
  - **Table View**: Compact ledger view displaying Roll Number, Name, Department, Completed Semesters count, Overall CGPA, and quick action buttons.
  - **View Preference Memory**: Automatically saves your selected view mode to `localStorage`.
- **Interactive 8-Semester Grade Tracking**:
  - Each student tracks up to 8 individual semester grades.
  - Click directly on any semester slot (Sem 1 to Sem 8) to enter or update grades (0.0 to 10.0).
  - Overall CGPA updates automatically based on completed semesters.
- **Search, Filter & Sort**:
  - **Live Search**: Instant real-time search matching student names and roll numbers.
  - **Dynamic Department Filter**: Dropdown menu automatically populated from departments in existing records.
  - **CGPA Sorting**: Cycle between Default order, Highest CGPA first, and Lowest CGPA first.
- **Strict Data Validation**:
  - Requires exactly 12-digit numeric Roll Numbers (`^\d{12}$`).
  - Automatic duplicate roll number prevention on creation and inline edits.
  - Safe confirmation prompts before deleting individual records or clearing the entire directory.
- **Data Persistence**: All student records and updates persist across browser restarts in `localStorage`.

---

## 📖 How to Use

### 1. Enrolling a New Student
1. Locate the **Add Student** panel at the top.
2. Enter the student's **Full Name**.
3. Enter a valid **12-digit Roll Number** (e.g., `231001102240`).
4. Select a **Department** from the dropdown (or add a new one).
5. Click **Add Student**. If valid, the new student card appears instantly in the list.

### 2. Updating Semester Grades
1. In **Cards View**, locate the 8 semester boxes at the bottom of any student card.
2. Click on any empty or existing semester box.
3. Type a GPA value between `0.0` and `10.0` and press Enter (or click save).
4. Watch the **Overall CGPA** badge update automatically in real time.

### 3. Switching Views
- Click the **Cards** or **Table** buttons in the toolbar to toggle between card grid and tabular view.
- Refresh the browser to verify that your view preference is preserved.

### 4. Searching, Filtering, and Sorting
- **Search**: Type in the search box to filter by name or 12-digit roll number.
- **Filter**: Choose a department from the dropdown to narrow down students.
- **Sort**: Click the **Sort by CGPA** button to toggle between Highest first, Lowest first, and Default order.

### 5. Editing or Deleting Records
- Click the **Edit** icon on any card/row to update name, roll number, or department.
- Click the **Delete** icon and confirm the prompt to remove an individual student record.

---

## 🛠️ Tech Stack

- **React 19**: `useState`, `useMemo`, and `useEffect` for state management and local storage synchronization
- **Vite 6**: Fast modern dev server and bundler
- **Vanilla CSS**: Responsive grid layouts, modern typography, card designs, and dark styling

---

## 📁 Project Structure

```
Assignment_2_Student_information_portal/
├── src/
│   ├── components/
│   │   ├── AddStudentForm.jsx     # Student enrollment form with validation
│   │   ├── DepartmentFilter.jsx   # Dynamic department dropdown
│   │   ├── Footer.jsx             # Summary footer
│   │   ├── Header.jsx             # Application header
│   │   ├── SearchBar.jsx          # Live search input
│   │   ├── StudentCard.jsx        # Student card with 8-semester grade editor
│   │   ├── StudentList.jsx        # Responsive card grid container
│   │   └── StudentTable.jsx       # Dense tabular data view
│   ├── App.jsx                    # Root state manager & localStorage sync
│   ├── index.css                  # Global styles, variables, and responsive layout
│   ├── main.jsx                   # React 19 root entry
│   └── utils.js                   # CGPA calculation, formatting & validation logic
├── index.html
├── package.json
└── vite.config.js
```
