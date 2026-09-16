import React from 'react';
import { Scale, X, ArrowRight } from 'lucide-react';
import { useCart } from './CartContext';

export default function CompareBar() {
  const { state, dispatch } = useCart();

  if (!state.compareList || state.compareList.length === 0) return null;

  const compareProducts = state.products.filter((p) => state.compareList.includes(p.id));

  const handleOpenModal = () => {
    dispatch({ type: 'SET_COMPARE_OPEN', payload: true });
  };

  const handleClear = () => {
    dispatch({ type: 'CLEAR_COMPARE' });
  };

  const handleRemoveOne = (e, id) => {
    e.stopPropagation();
    dispatch({ type: 'TOGGLE_COMPARE', payload: { id } });
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 animate-slide-up max-w-2xl w-full px-4">
      <div className="glass-panel border border-accent-500/40 rounded-2xl p-3 shadow-[0_10px_40px_rgba(0,0,0,0.6)] flex items-center justify-between gap-4 bg-dark-950/90 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-accent-500/10 text-accent-400 border border-accent-500/30 shadow-[0_0_15px_rgba(0,240,255,0.2)]">
            <Scale size={18} />
          </div>
          <div>
            <span className="text-xs font-bold text-white block">Compare Components</span>
            <span className="text-[10px] text-neutral-400 font-mono">{compareProducts.length} of 4 slots filled</span>
          </div>
        </div>

        {/* Selected Product Avatars */}
        <div className="flex items-center gap-2">
          {compareProducts.map((p) => (
            <div key={p.id} className="relative group">
              <img 
                src={p.image} 
                alt={p.name} 
                className="w-10 h-10 rounded-lg object-cover border border-white/10 bg-dark-900 group-hover:border-accent-500 transition-colors" 
              />
              <button
                onClick={(e) => handleRemoveOne(e, p.id)}
                className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-dark-900 text-neutral-400 hover:text-rose-400 rounded-full flex items-center justify-center border border-white/20 text-[10px]"
              >
                ×
              </button>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleClear}
            className="text-[11px] text-neutral-400 hover:text-white px-2.5 py-1.5 rounded-lg hover:bg-white/5 transition-colors"
          >
            Clear
          </button>
          <button
            onClick={handleOpenModal}
            className="px-4 py-2 rounded-xl bg-accent-500 hover:bg-accent-400 text-dark-900 font-black text-xs transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,240,255,0.3)] hover:scale-105"
          >
            <span>Compare Now</span>
            <ArrowRight size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}
