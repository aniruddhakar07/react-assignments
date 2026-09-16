import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { useAuth } from '../context/AuthContext';

export const Layout = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="app-layout">
      <Navbar />
      <div className="main-container">
        {isAuthenticated && <Sidebar />}
        <main className="content-wrapper">
          <Outlet />
        </main>
      </div>

      <footer 
        style={{ 
          borderTop: '1px solid var(--border-subtle)', 
          padding: '1.25rem 2rem', 
          textAlign: 'center', 
          color: 'var(--text-muted)', 
          fontSize: '0.825rem',
          background: 'rgba(17, 24, 39, 0.5)'
        }}
      >
        <span>
          <strong>TaskFlow Pro</strong> &bull; Enterprise Authentication &bull; Route Protection &bull; JWT Token Simulation
        </span>
      </footer>
    </div>
  );
};
