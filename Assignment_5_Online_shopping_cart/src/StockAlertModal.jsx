import React, { useState } from 'react';
import { X, Bell, CheckCircle2 } from 'lucide-react';
import { useCart } from './CartContext';
import { toast } from './toast';

export default function StockAlertModal() {
  const { state, dispatch } = useCart();
  const [email, setEmail] = useState('');
  const [isDone, setIsDone] = useState(false);

  const product = state.stockAlertItem;
  if (!product) return null;

  const handleClose = () => {
    dispatch({ type: 'SET_STOCK_ALERT', payload: null });
    setIsDone(false);
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    try {
      const current = JSON.parse(localStorage.getItem('hardwareStockAlerts') || '[]');
      current.push({
        id: Date.now(),
        productId: product.id,
        productName: product.name,
        email,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem('hardwareStockAlerts', JSON.stringify(current));
    } catch (err) {
      console.error(err);
    }

    setIsDone(true);
    toast.success(`Subscribed to stock alerts for ${product.name}!`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div onClick={handleClose} className="fixed inset-0 bg-black/80 backdrop-blur-md animate-fade-in" />

      {/* Modal Content */}
      <div className="relative w-full max-w-md bg-dark-900 border border-white/15 rounded-3xl overflow-hidden shadow-2xl z-10 animate-slide-up p-6">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-dark-800 text-neutral-400 hover:text-white border border-white/10 transition-colors"
        >
          <X size={16} />
        </button>

        {isDone ? (
          <div className="text-center py-6 space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(16,185,129,0.3)]">
              <CheckCircle2 size={30} />
            </div>
            <h3 className="text-xl font-bold text-white">Stock Alert Activated!</h3>
            <p className="text-xs text-neutral-400">
              We'll send an automated ping to <span className="text-white font-mono">{email}</span> the instant new batch allocations arrive.
            </p>
            <button
              onClick={handleClose}
              className="mt-3 px-5 py-2 rounded-xl bg-white text-dark-900 text-xs font-bold hover:bg-neutral-200"
            >
              Done
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-accent-500/10 text-accent-400 border border-accent-500/20">
                <Bell size={20} />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Back-in-Stock Notification</h3>
                <p className="text-[11px] text-neutral-400">Get notified immediately upon warehouse restock</p>
              </div>
            </div>

            <div className="flex gap-3 items-center p-3 rounded-xl bg-dark-950 border border-white/5">
              <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded-lg border border-white/5" />
              <div className="min-w-0 flex-1">
                <span className="text-[9px] font-mono text-accent-400 uppercase">{product.brand}</span>
                <p className="text-xs font-bold text-white truncate">{product.name}</p>
                <span className="text-[10px] text-rose-400 font-medium">Currently Low / Reserved Stock</span>
              </div>
            </div>

            <form onSubmit={handleSubscribe} className="space-y-3 text-xs">
              <div>
                <label className="block text-neutral-400 font-semibold mb-1 uppercase tracking-wider text-[9px]">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-dark-950 border border-white/10 text-white placeholder-neutral-500 focus:outline-none focus:border-accent-500 text-xs"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-accent-500 hover:bg-accent-400 text-dark-900 font-black text-xs transition-all shadow-[0_0_15px_rgba(0,240,255,0.3)]"
              >
                NOTIFY ME
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
