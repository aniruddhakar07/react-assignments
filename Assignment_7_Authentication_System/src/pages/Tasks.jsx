import React, { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useTasks } from '../context/TaskContext';
import { TaskFilterBar } from '../components/TaskFilterBar';
import { TaskCard } from '../components/TaskCard';
import { Modal } from '../components/Modal';
import { ListTodo, PlusCircle, Inbox } from 'lucide-react';

export const Tasks = () => {
  const { tasks, deleteTask } = useTasks();
  const [searchParams, setSearchParams] = useSearchParams();

  const categoryFilter = searchParams.get('category') || 'ALL';
  const priorityFilter = searchParams.get('priority') || 'ALL';
  const statusFilter = searchParams.get('status') || 'ALL';
  const searchQuery = searchParams.get('q') || '';
  const sortBy = searchParams.get('sort') || 'NEWEST';

  const [viewMode, setViewMode] = useState('grid');
  const [taskToDelete, setTaskToDelete] = useState(null);

  const updateFilter = (key, value) => {
    setSearchParams(prev => {
      const updated = new URLSearchParams(prev);
      if (!value || value === 'ALL') {
        updated.delete(key);
      } else {
        updated.set(key, value);
      }
      return updated;
    }, { replace: true });
  };

  const handleResetFilters = () => {
    setSearchParams({}, { replace: true });
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      if (categoryFilter !== 'ALL' && task.category !== categoryFilter) return false;
      if (priorityFilter !== 'ALL' && task.priority !== priorityFilter) return false;
      if (statusFilter !== 'ALL' && task.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesHeader = task.header.toLowerCase().includes(q);
        const matchesDesc = task.description.toLowerCase().includes(q);
        if (!matchesHeader && !matchesDesc) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'DUE_DATE') {
        return new Date(a.dueDate) - new Date(b.dueDate);
      }
      if (sortBy === 'PRIORITY') {
        const weight = { High: 3, Medium: 2, Low: 1 };
        return (weight[b.priority] || 0) - (weight[a.priority] || 0);
      }
      return b.id.localeCompare(a.id);
    });
  }, [tasks, categoryFilter, priorityFilter, statusFilter, searchQuery, sortBy]);

  return (
    <div>
      <div className="page-header">
        <div className="page-title-group">
          <h1>
            <ListTodo size={28} color="var(--primary)" />
            <span>Task Directory</span>
          </h1>
          <p>Protected tasks catalog with live URL search query synchronization.</p>
        </div>

        <Link to="/add-task" className="btn btn-primary">
          <PlusCircle size={16} />
          <span>New Task</span>
        </Link>
      </div>

      <TaskFilterBar
        searchQuery={searchQuery}
        setSearchQuery={(val) => updateFilter('q', val)}
        priorityFilter={priorityFilter}
        setPriorityFilter={(val) => updateFilter('priority', val)}
        categoryFilter={categoryFilter}
        setCategoryFilter={(val) => updateFilter('category', val)}
        statusFilter={statusFilter}
        setStatusFilter={(val) => updateFilter('status', val)}
        sortBy={sortBy}
        setSortBy={(val) => updateFilter('sort', val)}
        viewMode={viewMode}
        setViewMode={setViewMode}
        onReset={handleResetFilters}
      />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
        <span>Showing <strong>{filteredTasks.length}</strong> of {tasks.length} tasks</span>
      </div>

      {filteredTasks.length > 0 ? (
        <div className={viewMode === 'grid' ? 'tasks-grid' : 'tasks-list'}>
          {filteredTasks.map(task => (
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
            <Inbox size={32} />
          </div>
          <h3 className="empty-title">No matching tasks found</h3>
          <p className="empty-desc">
            Try adjusting your search query or reset filters.
          </p>
          <button onClick={handleResetFilters} className="btn btn-secondary btn-sm">
            Clear Filters
          </button>
        </div>
      )}

      <Modal
        isOpen={!!taskToDelete}
        onClose={() => setTaskToDelete(null)}
        onConfirm={() => {
          if (taskToDelete) deleteTask(taskToDelete.id);
        }}
        title="Delete Task"
        message={`Are you sure you want to delete "${taskToDelete?.header}"?`}
        confirmText="Delete Task"
        isDanger={true}
      />
    </div>
  );
};
