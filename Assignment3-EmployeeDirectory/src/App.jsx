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

function EmployeeForm({ formData, onChange, onSubmit, onCancel, isEditing }) {
  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    onChange({ ...formData, [name]: value });
  };

  return (
    <form className="employee-form" onSubmit={onSubmit}>
      <h2>{isEditing ? "Edit employee" : "Add employee"}</h2>

      <div className="form-grid">
        <label>
          Name
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleFieldChange}
            placeholder="Full name"
            required
          />
        </label>

        <label>
          Employee ID
          <input
            type="text"
            name="employeeId"
            value={formData.employeeId}
            onChange={handleFieldChange}
            placeholder="EMP004"
            required
            disabled={isEditing}
          />
        </label>

        <label>
          Department
          <select name="department" value={formData.department} onChange={handleFieldChange}>
            {DEPARTMENTS.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </label>

        <label>
          Gender
          <select name="gender" value={formData.gender} onChange={handleFieldChange}>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </label>

        <label>
          Phone number
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleFieldChange}
            placeholder="10-digit number"
            pattern="[0-9]{10}"
            required
          />
        </label>

        <label className="full-width">
          Local address
          <input
            type="text"
            name="localAddress"
            value={formData.localAddress}
            onChange={handleFieldChange}
            placeholder="Current stay near the farm"
            required
          />
        </label>

        <label className="full-width">
          Permanent address
          <input
            type="text"
            name="permanentAddress"
            value={formData.permanentAddress}
            onChange={handleFieldChange}
            placeholder="Home town / village"
            required
          />
        </label>
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

function EmployeeCard({ employee, onEdit, onDelete }) {
  const initials = employee.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="employee-card">
      <div className="card-top">
        <div className="avatar">{initials}</div>
        <div>
          <p className="emp-name">{employee.name}</p>
          <p className="emp-id">{employee.employeeId}</p>
        </div>
        <span className="dept-badge">{employee.department}</span>
      </div>

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
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All");

  const openAddForm = () => {
    setFormData(EMPTY_FORM);
    setEditingId(null);
    setShowForm(true);
  };

  const openEditForm = (employee) => {
    setFormData(employee);
    setEditingId(employee.id);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setFormData(EMPTY_FORM);
    setEditingId(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingId !== null) {
      setEmployees((prev) =>
        prev.map((emp) => (emp.id === editingId ? { ...formData, id: editingId } : emp))
      );
    } else {
      const idExists = employees.some((emp) => emp.employeeId === formData.employeeId);
      if (idExists) {
        alert("An employee with this ID already exists.");
        return;
      }
      setEmployees((prev) => [...prev, { ...formData, id: Date.now() }]);
    }

    closeForm();
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

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(search.toLowerCase()) ||
      emp.employeeId.toLowerCase().includes(search.toLowerCase());
    const matchesDept = departmentFilter === "All" || emp.department === departmentFilter;
    return matchesSearch && matchesDept;
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

        <span className="employee-count">
          Showing {filteredEmployees.length} of {employees.length} employees
        </span>
      </section>

      {showForm && (
        <EmployeeForm
          formData={formData}
          onChange={setFormData}
          onSubmit={handleSubmit}
          onCancel={closeForm}
          isEditing={editingId !== null}
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
