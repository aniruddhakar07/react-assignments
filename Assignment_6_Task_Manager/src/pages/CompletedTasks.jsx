import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTasks } from '../context/TaskContext';
import { TaskCard } from '../components/TaskCard';
import { Modal } from '../components/Modal';
import { CheckCircle2, RotateCcw, PlusCircle, Sparkles } from 'lucide-react';

export const CompletedTasks = () => {
  const { tasks, deleteTask, updateTaskStatus } = useTasks();
  const [taskToDelete, setTaskToDelete] = useState(null);

  const completedTasks = tasks.filter(t => t.status === 'Closed');

  const handleReopenAll = () => {
    completedTasks.forEach(task => updateTaskStatus(task.id, 'Pending'));
  };

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div className="page-title-group">
          <h1>
            <CheckCircle2 size={28} color="#34d399" />
            <span>Completed Tasks</span>
          </h1>
          <p>Archive of all resolved and closed tasks with reactivation options.</p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          {completedTasks.length > 0 && (
            <button onClick={handleReopenAll} className="btn btn-secondary btn-sm">
              <RotateCcw size={14} />
              <span>Reopen All Completed</span>
            </button>
          )}
          <Link to="/add-task" className="btn btn-primary btn-sm">
            <PlusCircle size={14} />
            <span>New Task</span>
          </Link>
        </div>
      </div>

      {/* Completion Milestone Card */}
      <div 
        style={{ 
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12), rgba(19, 27, 46, 0.9))', 
          border: '1px solid rgba(16, 185, 129, 0.3)', 
          borderRadius: 'var(--radius-lg)', 
          padding: '1.5rem 2rem', 
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Sparkles size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff' }}>
              {completedTasks.length} Task{completedTasks.length !== 1 ? 's' : ''} Successfully Closed
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              {tasks.length > 0 
                ? `${Math.round((completedTasks.length / tasks.length) * 100)}% of all registered work items completed` 
                : 'No tasks registered'}
            </p>
          </div>
        </div>

        <Link to="/tasks" className="btn btn-secondary btn-sm" style={{ border: '1px solid rgba(16, 185, 129, 0.4)' }}>
          <span>View Unfinished Tasks</span>
        </Link>
      </div>

      {/* Grid or Empty state */}
      {completedTasks.length > 0 ? (
        <div className="tasks-grid">
          {completedTasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onDeleteClick={(t) => setTaskToDelete(t)}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">
            <CheckCircle2 size={32} />
          </div>
          <h3 className="empty-title">No completed tasks yet</h3>
          <p className="empty-desc">
            When you mark any task as "Closed", it will automatically be archived in this dedicated view.
          </p>
          <Link to="/tasks" className="btn btn-primary btn-sm">
            Browse Active Tasks
          </Link>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!taskToDelete}
        onClose={() => setTaskToDelete(null)}
        onConfirm={() => {
          if (taskToDelete) deleteTask(taskToDelete.id);
        }}
        title="Permanently Delete Completed Task"
        message={`Are you sure you want to permanently delete "${taskToDelete?.header}"?`}
        confirmText="Delete"
        isDanger={true}
      />
    </div>
  );
};
