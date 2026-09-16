import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { 
  CheckSquare, 
  LayoutDashboard, 
  ListTodo, 
  PlusCircle, 
  CheckCircle2, 
  LogOut, 
  Key, 
  User,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { JwtTokenModal } from './JwtTokenModal';

export const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [showJwtModal, setShowJwtModal] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
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

        {/* Protected Navigation Links */}
        {isAuthenticated && (
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
        )}

        {/* Right Section: JWT Inspector & User Menu & Logout */}
        <div className="nav-right-actions">
          {isAuthenticated ? (
            <>
              {/* Trigger for JWT Token Modal */}
              <button 
                onClick={() => setShowJwtModal(true)} 
                className="jwt-pill"
                title="Inspect Simulated JWT Token, Claims, and Expiration"
              >
                <Key size={14} />
                <span>JWT Token</span>
              </button>

              {/* User Profile Capsule */}
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
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.1 }}>
                    {user?.displayName || user?.username}
                  </span>
                </div>
              </div>

              {/* Logout Button */}
              <button 
                onClick={handleLogout} 
                className="btn btn-secondary btn-sm"
                title="Sign out of system"
              >
                <LogOut size={14} />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <Link to="/login" className="btn btn-primary btn-sm">
              <span>Sign In</span>
            </Link>
          )}
        </div>
      </header>

      {/* JWT Inspector Modal */}
      <JwtTokenModal 
        isOpen={showJwtModal} 
        onClose={() => setShowJwtModal(false)} 
      />
    </>
  );
};
