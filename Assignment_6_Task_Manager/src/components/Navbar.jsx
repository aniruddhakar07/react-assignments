import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { 
  CheckSquare, 
  LayoutDashboard, 
  ListTodo, 
  PlusCircle, 
  CheckCircle2, 
  ShieldCheck, 
  ShieldAlert,
  User
} from 'lucide-react';
import { useBasicAuth } from '../context/BasicAuthContext';

export const Navbar = () => {
  const { isAuthenticated, toggleAuth, user } = useBasicAuth();

  return (
    <header className="navbar">
      {/* Brand */}
      <Link to="/dashboard" className="nav-brand">
        <div className="brand-icon">
          <CheckSquare size={22} strokeWidth={2.5} />
        </div>
        <div>
          <span className="brand-title">TaskFlow Pro</span>
        </div>
      </Link>

      {/* Navigation Links */}
      <nav className="nav-links">
        <NavLink 
          to="/dashboard" 
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <LayoutDashboard size={17} />
          <span>Dashboard</span>
        </NavLink>

        <NavLink 
          to="/tasks" 
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <ListTodo size={17} />
          <span>Tasks</span>
        </NavLink>

        <NavLink 
          to="/add-task" 
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <PlusCircle size={17} />
          <span>Add Task</span>
        </NavLink>

        <NavLink 
          to="/completed" 
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <CheckCircle2 size={17} />
          <span>Completed</span>
        </NavLink>
      </nav>

      {/* Right Actions & Route Guard Tester */}
      <div className="nav-right-actions">
        {/* Toggleable Mock Auth pill to test Route Protection */}
        <div 
          onClick={toggleAuth} 
          title="Click to toggle route protection state"
          className={`auth-toggle-pill ${isAuthenticated ? 'authenticated' : 'unauthenticated'}`}
        >
          <span className={`auth-dot ${isAuthenticated ? 'green' : 'red'}`}></span>
          {isAuthenticated ? (
            <>
              <ShieldCheck size={14} />
              <span>Guard: Open</span>
            </>
          ) : (
            <>
              <ShieldAlert size={14} />
              <span>Guard: Locked</span>
            </>
          )}
        </div>

        {/* User profile capsule */}
        <div 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem', 
            background: 'rgba(255, 255, 255, 0.05)', 
            padding: '0.35rem 0.75rem', 
            borderRadius: 'var(--radius-full)',
            fontSize: '0.825rem',
            border: '1px solid var(--border-subtle)'
          }}
        >
          <div 
            style={{ 
              width: '24px', 
              height: '24px', 
              borderRadius: '50%', 
              background: 'linear-gradient(135deg, var(--primary), var(--accent))', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              color: 'white'
            }}
          >
            <User size={14} />
          </div>
          <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
            {user.displayName}
          </span>
        </div>
      </div>
    </header>
  );
};
