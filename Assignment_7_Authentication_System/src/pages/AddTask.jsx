import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTasks } from '../context/TaskContext';
import { 
  PlusCircle, 
  ArrowLeft, 
  Clock, 
  Calendar, 
  Tag, 
  AlertCircle
} from 'lucide-react';

export const AddTask = () => {
  const navigate = useNavigate();
  const { addTask } = useTasks();

  const now = new Date();
  const autoPickedTime = now.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }) + ' ' + now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  const [formData, setFormData] = useState({
    header: '',
    description: '',
    priority: 'High',
    category: 'Academic',
    dueDate: '',
    status: 'Raised'
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!formData.header.trim()) {
      errs.header = 'Task Header is required';
    } else if (formData.header.trim().length < 4) {
      errs.header = 'Header must be at least 4 characters long';
    }

    if (!formData.description.trim()) {
      errs.description = 'Task Description is required';
    }

    if (!formData.dueDate) {
      errs.dueDate = 'Due Date is required';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const newTask = addTask(formData);
    navigate(`/tasks/${newTask.id}`);
  };

  return (
    <div>
      <div className="page-header" style={{ maxWidth: '780px', margin: '0 auto 2rem auto' }}>
        <div className="page-title-group">
          <h1>
            <PlusCircle size={28} color="var(--primary)" />
            <span>Create New Task</span>
          </h1>
          <p>Protected form endpoint. Stamped with system authorization.</p>
        </div>

        <Link to="/tasks" className="btn btn-secondary btn-sm">
          <ArrowLeft size={14} />
          <span>Back to Tasks</span>
        </Link>
      </div>

      <div className="form-card">
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-grid">
            <div className="form-group col-span-2">
              <label className="form-label" htmlFor="task-header">
                Task Header <span style={{ color: '#fb7185' }}>*</span>
              </label>
              <input
                id="task-header"
                type="text"
                placeholder="e.g., Finalize Cloud Computing Seminar PPT"
                className="form-control"
                value={formData.header}
                onChange={(e) => {
                  setFormData({ ...formData, header: e.target.value });
                  if (errors.header) setErrors({ ...errors, header: null });
                }}
              />
              {errors.header && <span className="form-error">{errors.header}</span>}
            </div>

            <div className="form-group col-span-2">
              <label className="form-label" htmlFor="task-description">
                Task Description <span style={{ color: '#fb7185' }}>*</span>
              </label>
              <textarea
                id="task-description"
                rows={4}
                placeholder="Detail key deliverables, resources, and specific requirements..."
                className="form-control"
                value={formData.description}
                onChange={(e) => {
                  setFormData({ ...formData, description: e.target.value });
                  if (errors.description) setErrors({ ...errors, description: null });
                }}
              />
              {errors.description && <span className="form-error">{errors.description}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="task-priority">
                Priority Level
              </label>
              <select
                id="task-priority"
                className="form-control"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              >
                <option value="High">High Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="Low">Low Priority</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="task-category">
                Category
              </label>
              <select
                id="task-category"
                className="form-control"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="Academic">Academic</option>
                <option value="Personal">Personal</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">
                Raised Date & Time (Automatic)
              </label>
              <div className="auto-field-badge">
                <Clock size={15} />
                <span>{autoPickedTime}</span>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="task-due-date">
                Due Date <span style={{ color: '#fb7185' }}>*</span>
              </label>
              <input
                id="task-due-date"
                type="date"
                className="form-control"
                value={formData.dueDate}
                onChange={(e) => {
                  setFormData({ ...formData, dueDate: e.target.value });
                  if (errors.dueDate) setErrors({ ...errors, dueDate: null });
                }}
              />
              <span className="form-help">Select completion deadline</span>
              {errors.dueDate && <span className="form-error">{errors.dueDate}</span>}
            </div>

            <div className="form-group col-span-2">
              <label className="form-label" htmlFor="task-status">
                Initial Status
              </label>
              <select
                id="task-status"
                className="form-control"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="Raised">Raised</option>
                <option value="Pending">Pending</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-subtle)' }}>
            <Link to="/tasks" className="btn btn-secondary">
              Cancel
            </Link>
            <button type="submit" className="btn btn-primary">
              <PlusCircle size={16} />
              <span>Create Task & View Details</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
