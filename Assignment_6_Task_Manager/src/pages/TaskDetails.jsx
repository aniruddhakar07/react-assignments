import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTasks } from '../context/TaskContext';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  CheckCircle, 
  Edit3, 
  Trash2, 
  Save, 
  X, 
  GraduationCap, 
  UserCheck,
  AlertCircle,
  Hash
} from 'lucide-react';
import { Modal } from '../components/Modal';

export const TaskDetails = () => {
  // Extract URL Parameter using React Router's useParams hook
  const { id } = useParams();
  const navigate = useNavigate();
  const { getTaskById, updateTask, updateTaskStatus, deleteTask } = useTasks();

  const task = getTaskById(id);

  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Edit form state
  const [editHeader, setEditHeader] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editPriority, setEditPriority] = useState('Medium');
  const [editCategory, setEditCategory] = useState('Academic');
  const [editDueDate, setEditDueDate] = useState('');

  // Keep edit fields in sync with task
  React.useEffect(() => {
    if (task) {
      setEditHeader(task.header || '');
      setEditDesc(task.description || '');
      setEditPriority(task.priority || 'Medium');
      setEditCategory(task.category || 'Academic');
      setEditDueDate(task.dueDate || '');
    }
  }, [task]);

  const handleStartEdit = () => {
    if (task) {
      setEditHeader(task.header || '');
      setEditDesc(task.description || '');
      setEditPriority(task.priority || 'Medium');
      setEditCategory(task.category || 'Academic');
      setEditDueDate(task.dueDate || '');
    }
    setIsEditing(true);
  };

  // If task doesn't exist, show not found
  if (!task) {
    return (
      <div className="empty-state" style={{ maxWidth: '600px', margin: '4rem auto' }}>
        <div className="empty-icon" style={{ background: 'rgba(244, 63, 94, 0.15)', color: '#fda4af' }}>
          <AlertCircle size={32} />
        </div>
        <h3 className="empty-title">Task Not Found</h3>
        <p className="empty-desc">
          No task exists with dynamic identifier <code style={{ color: '#a5b4fc' }}>{id}</code>. It may have been deleted or the URL is incorrect.
        </p>
        <Link to="/tasks" className="btn btn-primary">
          <ArrowLeft size={16} />
          <span>Return to Tasks</span>
        </Link>
      </div>
    );
  }

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editHeader.trim()) return;

    updateTask(task.id, {
      header: editHeader.trim(),
      description: editDesc.trim(),
      priority: editPriority,
      category: editCategory,
      dueDate: editDueDate
    });
    setIsEditing(false);
  };

  const handleStatusChange = (newStatus) => {
    updateTaskStatus(task.id, newStatus);
  };

  const handleDelete = () => {
    deleteTask(task.id);
    navigate('/tasks');
  };

  return (
    <div className="details-container">
      {/* Top Action Bar */}
      <div className="details-top-bar">
        <Link to="/tasks" className="btn btn-secondary btn-sm">
          <ArrowLeft size={14} />
          <span>Back to All Tasks</span>
        </Link>

        <div style={{ display: 'flex', gap: '0.6rem' }}>
          {!isEditing ? (
            <button onClick={handleStartEdit} className="btn btn-secondary btn-sm">
              <Edit3 size={14} />
              <span>Edit Details</span>
            </button>
          ) : (
            <button onClick={() => setIsEditing(false)} className="btn btn-secondary btn-sm">
              <X size={14} />
              <span>Cancel Edit</span>
            </button>
          )}

          <button onClick={() => setShowDeleteModal(true)} className="btn btn-danger btn-sm">
            <Trash2 size={14} />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {/* Main Details Card */}
      <div className="details-card">
        {/* Dynamic Route Info Badge */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(99, 102, 241, 0.12)', border: '1px solid var(--border-accent)', color: '#a5b4fc', padding: '3px 10px', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', marginBottom: '1.25rem' }}>
          <Hash size={12} />
          <span>Route: /tasks/{id}</span>
        </div>

        {!isEditing ? (
          <>
            {/* Badges row */}
            <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap' }}>
              <span className={`badge badge-priority-${task.priority.toLowerCase()}`}>
                {task.priority} Priority
              </span>
              <span className={`badge ${task.category === 'Academic' ? 'badge-category-academic' : 'badge-category-personal'}`}>
                {task.category === 'Academic' ? <GraduationCap size={13} /> : <UserCheck size={13} />}
                {task.category}
              </span>
              <span className={`badge badge-status-${task.status.toLowerCase()}`}>
                Status: {task.status}
              </span>
            </div>

            {/* Task Header */}
            <h1 className="details-title">{task.header}</h1>

            {/* Task Description */}
            <div className="details-desc-box">
              {task.description || <span style={{ color: 'var(--text-muted)' }}>No description provided.</span>}
            </div>

            {/* Metadata Grid */}
            <div className="details-meta-grid">
              <div className="details-meta-item">
                <span className="details-meta-label">Raised Date & Time (Automatic)</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginTop: '0.2rem' }}>
                  <Clock size={15} color="#818cf8" />
                  <span className="details-meta-val">{task.raisedDate}</span>
                </div>
              </div>

              <div className="details-meta-item">
                <span className="details-meta-label">Due Date</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginTop: '0.2rem' }}>
                  <Calendar size={15} color="#34d399" />
                  <span className="details-meta-val">{task.dueDate}</span>
                </div>
              </div>

              <div className="details-meta-item">
                <span className="details-meta-label">Current Lifecycle Status</span>
                <div style={{ marginTop: '0.35rem' }}>
                  <select
                    value={task.status}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    style={{
                      background: 'rgba(0, 0, 0, 0.4)',
                      border: '1px solid var(--border-accent)',
                      borderRadius: 'var(--radius-md)',
                      color: 'white',
                      padding: '0.4rem 0.85rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    <option value="Raised">Raised</option>
                    <option value="Pending">Pending (In Progress)</option>
                    <option value="Closed">Closed (Completed)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Status Transition Action Bar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem', background: 'rgba(99, 102, 241, 0.08)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <strong style={{ fontSize: '0.95rem' }}>Quick Lifecycle Transition</strong>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.825rem' }}>Click below to quickly advance task lifecycle status:</p>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => handleStatusChange('Raised')}
                  disabled={task.status === 'Raised'}
                  className="btn btn-secondary btn-sm"
                  style={{ opacity: task.status === 'Raised' ? 0.5 : 1 }}
                >
                  Mark Raised
                </button>
                <button
                  onClick={() => handleStatusChange('Pending')}
                  disabled={task.status === 'Pending'}
                  className="btn btn-secondary btn-sm"
                  style={{ opacity: task.status === 'Pending' ? 0.5 : 1 }}
                >
                  Mark Pending
                </button>
                <button
                  onClick={() => handleStatusChange('Closed')}
                  disabled={task.status === 'Closed'}
                  className="btn btn-success btn-sm"
                  style={{ opacity: task.status === 'Closed' ? 0.5 : 1 }}
                >
                  <CheckCircle size={14} />
                  <span>Mark Closed</span>
                </button>
              </div>
            </div>
          </>
        ) : (
          /* Inline Editing Mode */
          <form onSubmit={handleSaveEdit}>
            <div className="form-grid">
              <div className="form-group col-span-2">
                <label className="form-label">Task Header</label>
                <input
                  type="text"
                  className="form-control"
                  value={editHeader}
                  onChange={(e) => setEditHeader(e.target.value)}
                  required
                />
              </div>

              <div className="form-group col-span-2">
                <label className="form-label">Task Description</label>
                <textarea
                  rows={4}
                  className="form-control"
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Priority</label>
                <select
                  className="form-control"
                  value={editPriority}
                  onChange={(e) => setEditPriority(e.target.value)}
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  className="form-control"
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value)}
                >
                  <option value="Academic">Academic</option>
                  <option value="Personal">Personal</option>
                </select>
              </div>

              <div className="form-group col-span-2">
                <label className="form-label">Due Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={editDueDate}
                  onChange={(e) => setEditDueDate(e.target.value)}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button type="button" onClick={() => setIsEditing(false)} className="btn btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                <Save size={16} />
                <span>Save Changes</span>
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete Task"
        message={`Are you sure you want to permanently delete "${task.header}"? This action cannot be reverted.`}
        confirmText="Confirm Delete"
        isDanger={true}
      />
    </div>
  );
};
