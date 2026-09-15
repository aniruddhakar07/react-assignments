import React from 'react';
import { ShoppingBag, Heart, Cpu } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart, CURRENCIES } from './CartContext';
import { toast } from './toast';

export default function Navbar() {
  const { state, dispatch } = useCart();
  const navigate = useNavigate();
  const totalCartCount = state.cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="sticky top-0 z-50 glass-panel border-b-0 border-white/10">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-3 text-2xl font-black tracking-tighter text-white group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-500 to-primary-600 flex items-center justify-center text-white shadow-[0_0_15px_rgba(0,240,255,0.4)] group-hover:scale-105 group-hover:shadow-[0_0_25px_rgba(0,240,255,0.6)] transition-all duration-300">
            <Cpu size={24} />
          </div>
          <span>Aro<span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-400 to-primary-400">Hardware</span></span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-dark-900/60 p-1.5 rounded-2xl border border-white/10">
          <Link
            to="/"
            className="px-4 py-2 rounded-xl text-xs font-bold text-neutral-300 hover:text-white hover:bg-white/5 transition-all"
          >
            Catalog
          </Link>
          <Link
            to="/builder"
            className="px-4 py-2 rounded-xl text-xs font-bold text-neutral-300 hover:text-accent-400 hover:bg-accent-500/10 transition-all flex items-center gap-1.5"
          >
            <span className="w-2 h-2 rounded-full bg-accent-400 animate-pulse"></span>
            <span>PC Builder</span>
          </Link>
        </nav>

        <div className="flex items-center gap-3 sm:gap-4">
          {/* Live Market Ticker Indicator */}
          <div 
            onClick={() => {
              dispatch({ type: 'UPDATE_MARKET_PRICES' });
              toast.info('Indian Spot Market rates synchronized');
            }}
            title="Indian Hardware Spot Market (Tracked in INR ₹, auto-fluctuates every 8s) - Click to sync"
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-mono cursor-pointer hover:bg-emerald-500/20 transition-all select-none"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="font-bold">LIVE SPOT (₹)</span>
          </div>

          <select
            value={state.currency.code}
            onChange={(e) => {
              const code = e.target.value;
              const selected = (state.currencies && state.currencies[code]) || CURRENCIES[code];
              dispatch({ type: 'SET_CURRENCY', payload: selected });
            }}
            className="text-xs font-bold bg-dark-900/50 border border-white/10 rounded-lg px-2.5 py-2 text-neutral-300 outline-none cursor-pointer focus:border-accent-500 transition-colors"
          >
            <option value="INR">₹ INR (Indian Market Base)</option>
            <option value="USD">
              $ USD ({((state.currencies && state.currencies.USD) || CURRENCIES.USD).fxRateDisplay})
            </option>
            <option value="EUR">
              € EUR ({((state.currencies && state.currencies.EUR) || CURRENCIES.EUR).fxRateDisplay})
            </option>
            <option value="GBP">
              £ GBP ({((state.currencies && state.currencies.GBP) || CURRENCIES.GBP).fxRateDisplay})
            </option>
          </select>

          {/* Compare Button */}
          {state.compareList && state.compareList.length > 0 && (
            <button
              onClick={() => dispatch({ type: 'SET_COMPARE_OPEN', payload: true })}
              title="View comparison matrix"
              className="flex items-center gap-1.5 text-xs text-accent-400 font-bold px-3 py-2 rounded-lg border border-accent-500/30 bg-accent-500/10 hover:bg-accent-500/20 transition-all"
            >
              <span>COMPARE ({state.compareList.length})</span>
            </button>
          )}

          {/* Wishlist Trigger */}
          <button
            onClick={() => dispatch({ type: 'SET_WISHLIST_OPEN', payload: true })}
            aria-label="Open wishlist"
            className="flex items-center gap-2 text-xs text-neutral-300 font-bold px-3 py-2 rounded-lg border border-white/10 bg-dark-900/50 hover:border-white/20 transition-all cursor-pointer shadow-inner"
          >
            <Heart size={16} className={state.wishlist.length > 0 ? 'text-rose-500 fill-rose-500 drop-shadow-[0_0_5px_rgba(244,63,94,0.5)]' : ''} />
            <span>{state.wishlist.length}</span>
          </button>

          {/* Cart Trigger */}
          <button
            onClick={() => navigate('/checkout')}
            className="group flex items-center gap-2 bg-white hover:bg-neutral-100 text-dark-900 text-xs font-black px-4 sm:px-5 py-2.5 rounded-xl transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:-translate-y-0.5"
          >
            <ShoppingBag size={16} className="group-hover:scale-110 transition-transform" />
            <span>CART ({totalCartCount})</span>
          </button>
        </div>
      </div>
    </header>
  );
}