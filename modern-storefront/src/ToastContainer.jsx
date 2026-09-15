import React, { useState, useEffect } from 'react';
import { toast } from './toast';
import { Check, Info, X } from 'lucide-react';

export default function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const unsubscribe = toast.subscribe((newToast) => {
      setToasts((current) => [...current, newToast]);
      
      // Auto dismiss after 3s
      setTimeout(() => {
        setToasts((current) => current.filter((t) => t.id !== newToast.id));
      }, 3000);
    });
    
    return unsubscribe;
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
      {toasts.map((t) => (
        <div 
          key={t.id} 
          className="animate-slide-up glass-panel pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl min-w-[250px] shadow-2xl border-l-4 border-l-accent-500"
          style={{ borderLeftColor: t.type === 'success' ? '#00f0ff' : t.type === 'error' ? '#f43f5e' : '#3b82f6' }}
        >
          {t.type === 'success' && <div className="bg-accent-500/20 p-1.5 rounded-full text-accent-500"><Check size={16} /></div>}
          {t.type === 'error' && <div className="bg-rose-500/20 p-1.5 rounded-full text-rose-500"><X size={16} /></div>}
          {t.type === 'info' && <div className="bg-blue-500/20 p-1.5 rounded-full text-blue-500"><Info size={16} /></div>}
          
          <span className="text-sm font-medium text-white flex-1">{t.message}</span>
        </div>
      ))}
    </div>
  );
}
