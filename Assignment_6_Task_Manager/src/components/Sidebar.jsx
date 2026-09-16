import React from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ListTodo, 
  PlusCircle, 
  CheckCircle2, 
  GraduationCap, 
  UserCheck, 
  Clock, 
  AlertCircle,
  FolderOpen
} from 'lucide-react';
import { useTasks } from '../context/TaskContext';

export const Sidebar = () => {
  const { tasks } = useTasks();
  const location = useLocation();

  const academicCount = tasks.filter(t => t.category === 'Academic').length;
  const personalCount = tasks.filter(t => t.category === 'Personal').length;

  const raisedCount = tasks.filter(t => t.status === 'Raised').length;
  const pendingCount = tasks.filter(t => t.status === 'Pending').length;
  const closedCount = tasks.filter(t => t.status === 'Closed').length;

  return (
    <aside className="sidebar">
      {/* Main Views */}
      <div>
        <div className="sidebar-heading">Navigation</div>
        <div className="sidebar-menu">
          <NavLink 
            to="/dashboard" 
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <LayoutDashboard size={16} />
              <span>Dashboard</span>
            </div>
            <span className="sidebar-count">{tasks.length}</span>
          </NavLink>

          <NavLink 
            to="/tasks" 
            end
            className={({ isActive }) => `sidebar-link ${isActive && !location.search ? 'active' : ''}`}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <ListTodo size={16} />
              <span>All Tasks</span>
            </div>
            <span className="sidebar-count">{tasks.length}</span>
          </NavLink>

          <NavLink 
            to="/add-task" 
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <PlusCircle size={16} />
              <span>Add New Task</span>
            </div>
          </NavLink>

          <NavLink 
            to="/completed" 
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <CheckCircle2 size={16} />
              <span>Completed</span>
            </div>
            <span className="sidebar-count" style={{ color: '#34d399' }}>{closedCount}</span>
          </NavLink>
        </div>
      </div>

      {/* Categories */}
      <div>
        <div className="sidebar-heading">Categories</div>
        <div className="sidebar-menu">
          <Link 
            to="/tasks?category=Academic" 
            className={`sidebar-link ${location.search.includes('category=Academic') ? 'active' : ''}`}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <GraduationCap size={16} color="#818cf8" />
              <span>Academic</span>
            </div>
            <span className="sidebar-count">{academicCount}</span>
          </Link>

          <Link 
            to="/tasks?category=Personal" 
            className={`sidebar-link ${location.search.includes('category=Personal') ? 'active' : ''}`}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <UserCheck size={16} color="#e879f9" />
              <span>Personal</span>
            </div>
            <span className="sidebar-count">{personalCount}</span>
          </Link>
        </div>
      </div>

      {/* Status Filters */}
      <div>
        <div className="sidebar-heading">By Status</div>
        <div className="sidebar-menu">
          <Link 
            to="/tasks?status=Raised" 
            className={`sidebar-link ${location.search.includes('status=Raised') ? 'active' : ''}`}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <AlertCircle size={16} color="#a5b4fc" />
              <span>Raised</span>
            </div>
            <span className="sidebar-count">{raisedCount}</span>
          </Link>

          <Link 
            to="/tasks?status=Pending" 
            className={`sidebar-link ${location.search.includes('status=Pending') ? 'active' : ''}`}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Clock size={16} color="#fcd34d" />
              <span>Pending</span>
            </div>
            <span className="sidebar-count">{pendingCount}</span>
          </Link>

          <Link 
            to="/tasks?status=Closed" 
            className={`sidebar-link ${location.search.includes('status=Closed') ? 'active' : ''}`}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <CheckCircle2 size={16} color="#6ee7b7" />
              <span>Closed</span>
            </div>
            <span className="sidebar-count">{closedCount}</span>
          </Link>
        </div>
      </div>
    </aside>
  );
};
