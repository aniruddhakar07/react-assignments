import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useBasicAuth } from '../context/BasicAuthContext';
import { ShieldAlert, LogIn, Lock } from 'lucide-react';

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, login } = useBasicAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return (
      <div className="auth-warning-card">
        <div style={{ display: 'inline-flex', padding: '1rem', borderRadius: '50%', background: 'rgba(244, 63, 94, 0.15)', color: '#fda4af', marginBottom: '1rem' }}>
          <Lock size={36} />
        </div>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.5rem' }}>
          Restricted Route Access
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
          This route (<code style={{ color: '#a5b4fc', background: 'rgba(99, 102, 241, 0.1)', padding: '2px 6px', borderRadius: '4px' }}>{location.pathname}</code>) is guarded by the <strong>Protected Route</strong> security guard. Please authenticate to access this action.
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
          <button onClick={login} className="btn btn-primary">
            <LogIn size={16} /> Authenticate & Access
          </button>
        </div>
      </div>
    );
  }

  return children;
};
