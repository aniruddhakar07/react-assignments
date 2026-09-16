import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TaskProvider } from './context/TaskContext';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ErrorBoundary } from './components/ErrorBoundary';

// Public Auth Pages
import { Login } from './pages/Login';
import { Register } from './pages/Register';

// Protected Pages (Assignment 6 integrated)
import { Dashboard } from './pages/Dashboard';
import { Tasks } from './pages/Tasks';
import { AddTask } from './pages/AddTask';
import { TaskDetails } from './pages/TaskDetails';
import { CompletedTasks } from './pages/CompletedTasks';
import { NotFound } from './pages/NotFound';

// Root Index Redirector component
const RootRedirect = () => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return null;
  return <Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />;
};

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <TaskProvider>
          <BrowserRouter>
          <Routes>
            {/* Master Layout */}
            <Route path="/" element={<Layout />}>
              {/* Root redirect */}
              <Route index element={<RootRedirect />} />

              {/* Public Authentication Pages */}
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />

              {/* Protected Routes (Assignment 7 core requirement: Protected Dashboard & Task routes) */}
              <Route 
                path="dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="tasks" 
                element={
                  <ProtectedRoute>
                    <Tasks />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="tasks/:id" 
                element={
                  <ProtectedRoute>
                    <TaskDetails />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="add-task" 
                element={
                  <ProtectedRoute>
                    <AddTask />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="completed" 
                element={
                  <ProtectedRoute>
                    <CompletedTasks />
                  </ProtectedRoute>
                } 
              />

              {/* 404 Fallback */}
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </TaskProvider>
    </AuthProvider>
    </ErrorBoundary>
  );
}
