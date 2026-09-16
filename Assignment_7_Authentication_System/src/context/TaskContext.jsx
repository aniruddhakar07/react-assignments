import React, { createContext, useContext, useState, useEffect } from 'react';

const TaskContext = createContext();

const STORAGE_KEY = 'taskflow_auth_tasks_user_v3';
const INITIAL_TASKS = [];

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState(() => {
    // Clear out any previous fake/mock tasks from older keys
    try {
      localStorage.removeItem('taskflow_auth_tasks_v2');
      localStorage.removeItem('taskflow_tasks_v1');
    } catch (e) {}

    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved tasks', e);
      }
    }
    return INITIAL_TASKS;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (newTaskData) => {
    const now = new Date();
    const formattedRaisedDate = now.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }) + ' ' + now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    const newTask = {
      id: 'task-' + Date.now(),
      header: newTaskData.header.trim(),
      description: newTaskData.description.trim(),
      priority: newTaskData.priority || 'Medium',
      category: newTaskData.category || 'Academic',
      raisedDate: formattedRaisedDate,
      createdAt: now.getTime(),
      dueDate: newTaskData.dueDate || now.toISOString().split('T')[0],
      status: newTaskData.status || 'Raised'
    };

    setTasks(prev => [newTask, ...prev]);
    return newTask;
  };

  const updateTask = (id, updatedFields) => {
    setTasks(prev =>
      prev.map(task => (task.id === id ? { ...task, ...updatedFields } : task))
    );
  };

  const updateTaskStatus = (id, newStatus) => {
    setTasks(prev =>
      prev.map(task => (task.id === id ? { ...task, status: newStatus } : task))
    );
  };

  const deleteTask = (id) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const clearAllTasks = () => {
    setTasks([]);
  };

  const resetTasks = () => {
    setTasks([]);
  };

  const getTaskById = (id) => tasks.find(t => t.id === id);

  return (
    <TaskContext.Provider
      value={{
        tasks,
        addTask,
        updateTask,
        updateTaskStatus,
        deleteTask,
        clearAllTasks,
        resetTasks,
        getTaskById
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};
