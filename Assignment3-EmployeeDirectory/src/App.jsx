import React, { useState, useEffect } from "react";
import "./App.css";

const STORAGE_KEY = "farm-employee-directory";

const DEPARTMENTS = [
  "Crops",
  "Livestock",
  "Dairy",
  "Machinery & Maintenance",
  "Warehouse & Logistics",
  "Administration",
];

const EMPTY_FORM = {
  name: "",
  employeeId: "",
  department: DEPARTMENTS[0],
  gender: "Male",
  phone: "",
  localAddress: "",
  permanentAddress: "",
};

const SORT_OPTIONS = [
  { value: "name", label: "Name (A–Z)" },
  { value: "department", label: "Department" },
  { value: "employeeId", label: "Employee ID" },
];

function validateForm(formData, employees, editingId) {
  const errors = {};

  if (!formData.name.trim()) {
    errors.name = "Name is required.";
  }

  if (!formData.employeeId.trim()) {
    errors.employeeId = "Employee ID is required.";
  } else {
    const idTaken = employees.some(
      (emp) => emp.employeeId.toLowerCase() === formData.employeeId.trim().toLowerCase() && emp.id !== editingId
    );
    if (idTaken) errors.employeeId = "This Employee ID is already in use.";
  }

  if (!formData.phone.trim()) {
    errors.phone = "Phone number is required.";
  } else if (!/^[0-9]{10}$/.test(formData.phone.trim())) {
    errors.phone = "Enter a valid 10-digit phone number.";
  } else {
    const phoneTaken = employees.some(
      (emp) => emp.phone === formData.phone.trim() && emp.id !== editingId
    );
    if (phoneTaken) errors.phone = "This phone number is already registered to another employee.";
  }

  if (!formData.localAddress.trim()) errors.localAddress = "Local address is required.";
  if (!formData.permanentAddress.trim()) errors.permanentAddress = "Permanent address is required.";

  return errors;
}

function Field({ label, error, className, children }) {
  return (
    <label className={className}>
      {label}
      {children}
      {error && <span className="field-error">{error}</span>}
    </label>
  );
}

function EmployeeForm({ formData, onChange, onSubmit, onCancel, isEditing, errors }) {
  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    onChange({ ...formData, [name]: value });
  };

  return (
    <form className="employee-form" onSubmit={onSubmit} noValidate>
      <h2>{isEditing ? "Edit employee" : "Add employee"}</h2>

      <div className="form-grid">
        <Field label="Name" error={errors.name}>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleFieldChange}
            placeholder="Full name"
            className={errors.name ? "invalid" : ""}
          />
        </Field>

        <Field label="Employee ID" error={errors.employeeId}>
          <input
            type="text"
            name="employeeId"
            value={formData.employeeId}
            onChange={handleFieldChange}
            placeholder="EMP004"
            disabled={isEditing}
            className={errors.employeeId ? "invalid" : ""}
          />
        </Field>

        <Field label="Department">
          <select name="department" value={formData.department} onChange={handleFieldChange}>
            {DEPARTMENTS.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Gender">
          <select name="gender" value={formData.gender} onChange={handleFieldChange}>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </Field>

        <Field label="Phone number" error={errors.phone}>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleFieldChange}
            placeholder="10-digit number"
            className={errors.phone ? "invalid" : ""}
          />
        </Field>

        <Field label="Local address" error={errors.localAddress} className="full-width">
          <input
            type="text"
            name="localAddress"
            value={formData.localAddress}
            onChange={handleFieldChange}
            placeholder="Current stay near the farm"
            className={errors.localAddress ? "invalid" : ""}
          />
        </Field>

        <Field label="Permanent address" error={errors.permanentAddress} className="full-width">
          <input
            type="text"
            name="permanentAddress"
            value={formData.permanentAddress}
            onChange={handleFieldChange}
            placeholder="Home town / village"
            className={errors.permanentAddress ? "invalid" : ""}
          />
        </Field>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn primary">
          {isEditing ? "Save changes" : "Add employee"}
        </button>
        <button type="button" className="btn ghost" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}

const RECENT_WINDOW_MS = 5 * 60 * 1000; // 5 minutes

function isRecent(addedAt) {
  return addedAt && Date.now() - addedAt < RECENT_WINDOW_MS;
}

function EmployeeCard({ employee, onEdit, onDelete }) {
  const initials = employee.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const recent = isRecent(employee.addedAt);

  return (
    <div className="employee-card">
      <div className="card-top">
        <div className="avatar">{initials}</div>
        <div className="name-block">
          <p className="emp-name">
            {employee.name}
            {recent && <span className="new-badge">New</span>}
          </p>
          <p className="emp-id">{employee.employeeId}</p>
        </div>
      </div>

      <span className="dept-badge">{employee.department}</span>

      <dl className="card-details">
        <div>
          <dt>Gender</dt>
          <dd>{employee.gender}</dd>
        </div>
        <div>
          <dt>Phone</dt>
          <dd>{employee.phone}</dd>
        </div>
        <div>
          <dt>Local address</dt>
          <dd>{employee.localAddress}</dd>
        </div>
        <div>
          <dt>Permanent address</dt>
          <dd>{employee.permanentAddress}</dd>
        </div>
      </dl>

      <div className="card-actions">
        <button className="btn small" onClick={() => onEdit(employee)}>
          Edit
        </button>
        <button className="btn small danger" onClick={() => onDelete(employee.id)}>
          Delete
        </button>
      </div>
    </div>
  );
}

function loadEmployees() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (err) {
    console.error("Could not read saved employees:", err);
    return [];
  }
}

export default function App() {
  const [employees, setEmployees] = useState(loadEmployees);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(employees));
    } catch (err) {
      console.error("Could not save employees:", err);
    }
  }, [employees]);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [initialFormSnapshot, setInitialFormSnapshot] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors] = useState({});
  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [sortBy, setSortBy] = useState("name");
  const [, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 30000);
    return () => clearInterval(interval);
  }, []);

  const openAddForm = () => {
    setFormData(EMPTY_FORM);
    setInitialFormSnapshot(EMPTY_FORM);
    setEditingId(null);
    setErrors({});
    setShowForm(true);
  };

  const openEditForm = (employee) => {
    setFormData(employee);
    setInitialFormSnapshot(employee);
    setEditingId(employee.id);
    setErrors({});
    setShowForm(true);
  };

  const hasUnsavedChanges = () => JSON.stringify(formData) !== JSON.stringify(initialFormSnapshot);

  const closeForm = ({ skipConfirm = false } = {}) => {
    if (!skipConfirm && hasUnsavedChanges()) {
      const discard = window.confirm("You have unsaved changes. Discard them?");
      if (!discard) return;
    }
    setShowForm(false);
    setFormData(EMPTY_FORM);
    setErrors({});
    setEditingId(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validateForm(formData, employees, editingId);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (editingId !== null) {
      setEmployees((prev) =>
        prev.map((emp) => (emp.id === editingId ? { ...formData, id: editingId } : emp))
      );
    } else {
      setEmployees((prev) => [...prev, { ...formData, id: Date.now(), addedAt: Date.now() }]);
    }

    closeForm({ skipConfirm: true });
  };

  const handleDelete = (id) => {
    if (window.confirm("Remove this employee from the directory?")) {
      setEmployees((prev) => prev.filter((emp) => emp.id !== id));
    }
  };

  const handleReset = () => {
    if (window.confirm("Clear all employees? This cannot be undone.")) {
      setEmployees([]);
    }
  };

  const departmentCounts = DEPARTMENTS.map((dept) => ({
    dept,
    count: employees.filter((emp) => emp.department === dept).length,
  })).filter((entry) => entry.count > 0);

  const filteredEmployees = employees
    .filter((emp) => {
      const matchesSearch =
        emp.name.toLowerCase().includes(search.toLowerCase()) ||
        emp.employeeId.toLowerCase().includes(search.toLowerCase());
      const matchesDept = departmentFilter === "All" || emp.department === departmentFilter;
      return matchesSearch && matchesDept;
    })
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "department") return a.department.localeCompare(b.department);
      if (sortBy === "employeeId") return a.employeeId.localeCompare(b.employeeId, undefined, { numeric: true });
      return 0;
    });

  return (
    <div className="app">
      <header className="app-header">
        <div>
          <h1>Farm employee directory</h1>
          <p className="subtitle">Track who works where, and how to reach them.</p>
        </div>
        <div className="header-actions">
          <button className="btn ghost" onClick={handleReset}>
            Clear all
          </button>
          <button className="btn primary" onClick={openAddForm}>
            Add employee
          </button>
        </div>
      </header>

      {departmentCounts.length > 0 && (
        <div className="dept-stats">
          {departmentCounts.map(({ dept, count }) => (
            <span key={dept} className="dept-stat-pill">
              {dept} <strong>{count}</strong>
            </span>
          ))}
        </div>
      )}

      <section className="toolbar">
        <input
          type="text"
          className="search-input"
          placeholder="Search by name or employee ID"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select value={departmentFilter} onChange={(e) => setDepartmentFilter(e.target.value)}>
          <option value="All">All departments</option>
          {DEPARTMENTS.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>

        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              Sort: {opt.label}
            </option>
          ))}
        </select>

        <span className="employee-count">
          Showing {filteredEmployees.length} of {employees.length} employees
        </span>
      </section>

      {showForm && (
        <EmployeeForm
          formData={formData}
          onChange={setFormData}
          onSubmit={handleSubmit}
          onCancel={() => closeForm()}
          isEditing={editingId !== null}
          errors={errors}
        />
      )}

      {filteredEmployees.length === 0 ? (
        <p className="empty-state">
          {employees.length === 0
            ? "No employees yet. Click \"Add employee\" to get started."
            : "No employees match your search or filter."}
        </p>
      ) : (
        <div className="employee-grid">
          {filteredEmployees.map((emp) => (
            <EmployeeCard key={emp.id} employee={emp} onEdit={openEditForm} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
