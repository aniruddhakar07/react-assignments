export const toast = {
  listeners: new Set(),
  success: (message) => toast.emit('success', message),
  error: (message) => toast.emit('error', message),
  info: (message) => toast.emit('info', message),
  emit: (type, message) => {
    toast.listeners.forEach((listener) => listener({ id: Date.now() + Math.random(), type, message }));
  },
  subscribe: (listener) => {
    toast.listeners.add(listener);
    return () => toast.listeners.delete(listener);
  },
};
