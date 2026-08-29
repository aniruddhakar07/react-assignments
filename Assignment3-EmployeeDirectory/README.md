# Assignment 3 — Employee Directory using State and Events

A React app for managing farm employee records (Name, Employee ID, Department,
Gender, Phone Number, Local address, Permanent address) using `useState` and
event handling.

## Features
- **Add employee** — form with validation (required fields, 10-digit phone, unique ID)
- **Edit employee** — same form pre-filled, ID locked
- **Delete employee** — with a confirm prompt
- **Search employee** — live search by name or employee ID
- **Department filter** — dropdown filter
- **Employee count** — shows filtered vs total count

## Two ways to run it

### 1. Instant preview, no setup
Open `demo.html` directly in a browser (double-click it). It loads React from
a CDN and runs the exact same component logic — nothing to install.

### 2. As a real Create React App project
```
npm install
npm start
```
This uses `src/App.jsx`, `src/App.css`, and `src/index.js` — the same source
you'd drop into any CRA/Vite React project.

## Concepts demonstrated
- `useState` for employee list, form data, search text, filter, and edit mode
- Event handling: `onSubmit`, `onChange`, `onClick`
- Conditional rendering: showing the form only when adding/editing, showing
  an empty state when no employees match the search/filter
