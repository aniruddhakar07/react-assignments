import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { TaskProvider } from './context/TaskContext';
import { BasicAuthProvider } from './context/BasicAuthContext';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ErrorBoundary } from './components/ErrorBoundary';

// Pages
import { Dashboard } from './pages/Dashboard';
import { Tasks } from './pages/Tasks';
import { AddTask } from './pages/AddTask';
import { TaskDetails } from './pages/TaskDetails';
import { CompletedTasks } from './pages/CompletedTasks';
import { NotFound } from './pages/NotFound';

export default function App() {
  return (
    <ErrorBoundary>
      <BasicAuthProvider>
        <TaskProvider>
          <BrowserRouter>
          <Routes>
            {/* Root Layout with Nested Routes */}
            <Route path="/" element={<Layout />}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              
              {/* 1. Dashboard Page */}
              <Route path="dashboard" element={<Dashboard />} />
              
              {/* 2. Tasks Page (with filter/search query parameters) */}
              <Route path="tasks" element={<Tasks />} />
              
              {/* 3. Task Details Dynamic Route with URL Parameters (:id) */}
              <Route path="tasks/:id" element={<TaskDetails />} />
              
              {/* 4. Add Task Page - Guarded by Protected Route (Basic) */}
              <Route 
                path="add-task" 
                element={
                  <ProtectedRoute>
                    <AddTask />
                  </ProtectedRoute>
                } 
              />
              
              {/* 5. Completed Tasks Page */}
              <Route path="completed" element={<CompletedTasks />} />
              
              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </TaskProvider>
    </BasicAuthProvider>
    </ErrorBoundary>
  );
}
