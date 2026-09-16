import React, { useState, useEffect } from 'react';
import { X, Send, Cpu, CheckCircle2 } from 'lucide-react';
import { useCart } from './CartContext';
import { toast } from './toast';

export default function ComponentRequestModal() {
  const { state, dispatch } = useCart();
  const [partName, setPartName] = useState('');
  const [budget, setBudget] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (typeof state.componentRequestOpen === 'string') {
      setPartName(state.componentRequestOpen);
    }
  }, [state.componentRequestOpen]);

  if (!state.componentRequestOpen) return null;

  const handleClose = () => {
    dispatch({ type: 'SET_COMPONENT_REQUEST', payload: null });
    setIsSubmitted(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!partName.trim() || !email.trim()) {
      toast.error('Please fill in the component name and contact email.');
      return;
    }

    try {
      const existing = JSON.parse(localStorage.getItem('hardwareSourcingRequests') || '[]');
      const newRequest = {
        id: Date.now(),
        partName,
        budget,
        email,
        notes,
        currency: state.currency.code,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem('hardwareSourcingRequests', JSON.stringify([...existing, newRequest]));
    } catch (err) {
      console.error('Failed to save request to localStorage', err);
    }

    setIsSubmitted(true);
    toast.success('Procurement request logged successfully!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        onClick={handleClose} 
        className="fixed inset-0 bg-black/80 backdrop-blur-md animate-fade-in"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg bg-dark-900 border border-white/15 rounded-3xl overflow-hidden shadow-2xl z-10 animate-slide-up p-8">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-dark-800 text-neutral-400 hover:text-white border border-white/10 transition-colors"
        >
          <X size={18} />
        </button>

        {isSubmitted ? (
          <div className="text-center py-6 space-y-4 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-accent-500/15 text-accent-400 border border-accent-500/30 flex items-center justify-center mx-auto shadow-[0_0_25px_rgba(0,240,255,0.3)]">
              <CheckCircle2 size={36} />
            </div>
            <h3 className="text-2xl font-black text-white">Sourcing Request Received</h3>
            <p className="text-xs text-neutral-300 max-w-sm mx-auto leading-relaxed">
              We have forwarded your request for <span className="text-accent-400 font-bold font-mono">"{partName}"</span> to our authorized distributor partners. We will email updates to <span className="text-white font-mono">{email}</span> within 24 hours.
            </p>
            <button
              onClick={handleClose}
              className="mt-4 px-6 py-2.5 rounded-xl bg-white text-dark-900 font-bold text-xs hover:bg-neutral-200 transition-colors"
            >
              Close Window
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-accent-500/10 text-accent-400 border border-accent-500/20">
                <Cpu size={24} />
              </div>
              <div>
                <h3 className="text-xl font-black text-white tracking-tight">Special Hardware Sourcing</h3>
                <p className="text-xs text-neutral-400">Can't find a component? Our team will track down rare & custom parts.</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-400 font-semibold mb-1 uppercase tracking-wider text-[10px]">
                  Desired Hardware Model / Spec <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. RTX 5090 FE, Threadripper 7980X, DDR4-3600 CL16..."
                  value={partName}
                  onChange={(e) => setPartName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-dark-950 border border-white/10 text-white placeholder-neutral-500 focus:outline-none focus:border-accent-500 font-mono text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-400 font-semibold mb-1 uppercase tracking-wider text-[10px]">
                    Target Budget ({state.currency.code})
                  </label>
                  <input
                    type="text"
                    placeholder={`e.g. ${state.currency.symbol}1,500`}
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-dark-950 border border-white/10 text-white placeholder-neutral-500 focus:outline-none focus:border-accent-500 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 font-semibold mb-1 uppercase tracking-wider text-[10px]">
                    Your Email Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="builder@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-dark-950 border border-white/10 text-white placeholder-neutral-500 focus:outline-none focus:border-accent-500 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-400 font-semibold mb-1 uppercase tracking-wider text-[10px]">
                  Special Requirements / Notes (Optional)
                </label>
                <textarea
                  rows="2"
                  placeholder="Specific revision, brand preference (ASUS, MSI, Corsair), or delivery timeline..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-dark-950 border border-white/10 text-white placeholder-neutral-500 focus:outline-none focus:border-accent-500 text-xs resize-none"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 py-3 rounded-xl bg-dark-800 text-neutral-300 font-bold hover:bg-dark-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-accent-500 hover:bg-accent-400 text-dark-900 font-black flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,240,255,0.3)] transition-all"
                >
                  <Send size={14} />
                  <span>SUBMIT REQUEST</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
