import React from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, Home, ListTodo } from 'lucide-react';

export const NotFound = () => {
  return (
    <div className="empty-state" style={{ maxWidth: '540px', margin: '4rem auto' }}>
      <div className="empty-icon" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8', width: '80px', height: '80px' }}>
        <HelpCircle size={40} />
      </div>
      <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff' }}>404 - Page Not Found</h2>
      <p className="empty-desc">
        The requested routing endpoint does not exist. Please check the URL parameter or navigate back.
      </p>
      <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
        <Link to="/dashboard" className="btn btn-primary">
          <Home size={16} />
          <span>Dashboard</span>
        </Link>
        <Link to="/tasks" className="btn btn-secondary">
          <ListTodo size={16} />
          <span>Task Directory</span>
        </Link>
      </div>
    </div>
  );
};
