import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  ExternalLink, 
  Trash2, 
  CheckCircle, 
  RotateCcw,
  GraduationCap, 
  UserCheck
} from 'lucide-react';
import { useTasks } from '../context/TaskContext';

export const TaskCard = ({ task, onDeleteClick }) => {
  const { updateTaskStatus } = useTasks();

  const isClosed = task.status === 'Closed';

  const handleToggleComplete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    updateTaskStatus(task.id, isClosed ? 'Pending' : 'Closed');
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'High': return 'badge-priority-high';
      case 'Medium': return 'badge-priority-medium';
      case 'Low': return 'badge-priority-low';
      default: return 'badge-priority-medium';
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Raised': return 'badge-status-raised';
      case 'Pending': return 'badge-status-pending';
      case 'Closed': return 'badge-status-closed';
      default: return 'badge-status-raised';
    }
  };

  return (
    <div className={`task-card ${isClosed ? 'status-closed' : ''}`}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', gap: '0.5rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
            <span className={`badge ${getPriorityClass(task.priority)}`}>
              {task.priority} Priority
            </span>
            <span className={`badge ${task.category === 'Academic' ? 'badge-category-academic' : 'badge-category-personal'}`}>
              {task.category === 'Academic' ? <GraduationCap size={12} /> : <UserCheck size={12} />}
              {task.category}
            </span>
          </div>

          <span className={`badge ${getStatusClass(task.status)}`}>
            {task.status}
          </span>
        </div>

        <Link to={`/tasks/${task.id}`}>
          <h3 className="task-card-title">{task.header}</h3>
        </Link>

        <p className="task-card-desc">{task.description}</p>
      </div>

      <div className="task-meta-grid">
        <div className="task-meta-item">
          <Clock size={13} />
          <span><strong>Raised:</strong> {task.raisedDate}</span>
        </div>
        <div className="task-meta-item">
          <Calendar size={13} />
          <span><strong>Due:</strong> {task.dueDate}</span>
        </div>
      </div>

      <div className="task-card-actions">
        <Link to={`/tasks/${task.id}`} className="btn btn-secondary btn-sm">
          <ExternalLink size={13} />
          <span>Details</span>
        </Link>

        <div style={{ display: 'flex', gap: '0.4rem' }}>
          <button
            onClick={handleToggleComplete}
            title={isClosed ? 'Reopen task' : 'Mark as Closed'}
            className={`btn btn-sm ${isClosed ? 'btn-secondary' : 'btn-success'}`}
          >
            {isClosed ? <RotateCcw size={13} /> : <CheckCircle size={13} />}
            <span>{isClosed ? 'Reopen' : 'Close'}</span>
          </button>

          <button
            onClick={() => onDeleteClick(task)}
            title="Delete task"
            className="btn btn-danger btn-sm"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>
    </div>
  );
};
