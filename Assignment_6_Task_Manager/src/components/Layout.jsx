import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';

export const Layout = () => {
  return (
    <div className="app-layout">
      <Navbar />
      <div className="main-container">
        <Sidebar />
        <main className="content-wrapper">
          <Outlet />
        </main>
      </div>

      {/* Footer */}
      <footer 
        style={{ 
          borderTop: '1px solid var(--border-subtle)', 
          padding: '1.25rem 2rem', 
          textAlign: 'center', 
          color: 'var(--text-muted)', 
          fontSize: '0.825rem',
          background: 'rgba(15, 23, 42, 0.4)'
        }}
      >
        <span>
          <strong>TaskFlow Pro</strong> &bull; Modern Task Management Workspace &bull; React Router v7 &bull; Dynamic Routing
        </span>
      </footer>
    </div>
  );
};
