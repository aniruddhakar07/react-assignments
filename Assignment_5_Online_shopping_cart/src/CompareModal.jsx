import React from 'react';
import { X, ShoppingBag, Scale, Trash2 } from 'lucide-react';
import { useCart } from './CartContext';
import { toast } from './toast';

export default function CompareModal() {
  const { state, dispatch } = useCart();

  if (!state.isCompareOpen) return null;

  const compareProducts = state.products.filter((p) => state.compareList.includes(p.id));
  const currency = state.currency;

  const handleClose = () => {
    dispatch({ type: 'SET_COMPARE_OPEN', payload: false });
  };

  const handleRemoveProduct = (id) => {
    dispatch({ type: 'TOGGLE_COMPARE', payload: { id } });
    if (compareProducts.length <= 1) {
      handleClose();
    }
  };

  const handleAddToCart = (item) => {
    dispatch({ type: 'ADD_TO_CART', payload: item });
    toast.success(`${item.name} added to cart`);
  };

  // Collect all unique specs keys
  const allSpecKeys = Array.from(
    new Set(compareProducts.flatMap((p) => Object.keys(p.specs || {})))
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        onClick={handleClose} 
        className="fixed inset-0 bg-black/80 backdrop-blur-md animate-fade-in"
      />

      {/* Modal Box */}
      <div className="relative w-full max-w-5xl bg-dark-900 border border-white/15 rounded-3xl overflow-hidden shadow-2xl z-10 animate-slide-up flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-dark-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-accent-500/10 text-accent-400 border border-accent-500/20">
              <Scale size={20} />
            </div>
            <div>
              <h2 className="font-black text-white text-lg tracking-tight">Component Comparison Matrix</h2>
              <p className="text-xs text-neutral-400 font-mono">Evaluating {compareProducts.length} hardware components</p>
            </div>
          </div>
          <button 
            onClick={handleClose}
            className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Comparison Content */}
        <div className="flex-1 overflow-x-auto overflow-y-auto p-6 custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[600px]">
            {/* Header Row: Products */}
            <thead>
              <tr className="border-b border-white/10">
                <th className="p-4 w-44 text-xs uppercase tracking-wider text-neutral-500 font-bold">
                  Attributes
                </th>
                {compareProducts.map((p) => {
                  const basePriceINR = p.priceINR || Math.round(p.priceUSD * 95.68);
                  const price = Math.round(basePriceINR * currency.rate);
                  return (
                    <th key={p.id} className="p-4 align-top w-64">
                      <div className="space-y-3 relative group">
                        <button
                          onClick={() => handleRemoveProduct(p.id)}
                          className="absolute -top-2 -right-2 p-1.5 rounded-full bg-dark-800 text-neutral-400 hover:text-rose-400 border border-white/10 shadow-lg"
                          title="Remove from comparison"
                        >
                          <X size={12} />
                        </button>

                        <div className="aspect-video rounded-xl bg-dark-950 overflow-hidden border border-white/5">
                          <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                        </div>

                        <div>
                          <span className="text-[10px] font-mono text-accent-400 uppercase">{p.brand}</span>
                          <h4 className="text-xs font-bold text-white line-clamp-2 mt-0.5">{p.name}</h4>
                          <span className="text-sm font-black text-white block mt-1">
                            {currency.symbol}{price.toLocaleString(currency.locale)}
                          </span>
                        </div>

                        <button
                          onClick={() => handleAddToCart(p)}
                          className="w-full py-2 rounded-lg bg-white hover:bg-accent-400 text-dark-900 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow"
                        >
                          <ShoppingBag size={13} />
                          <span>Add to Cart</span>
                        </button>
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>

            {/* Spec Rows */}
            <tbody className="divide-y divide-white/5 text-xs">
              <tr className="bg-dark-800/30">
                <td className="p-4 font-bold text-neutral-400">Category</td>
                {compareProducts.map((p) => (
                  <td key={p.id} className="p-4 text-white font-mono uppercase text-[11px]">{p.category}</td>
                ))}
              </tr>

              {/* Dynamic Technical Specs */}
              {allSpecKeys.map((specKey, idx) => (
                <tr key={specKey} className={idx % 2 === 0 ? 'bg-dark-800/30' : ''}>
                  <td className="p-4 font-bold text-neutral-400">{specKey}</td>
                  {compareProducts.map((p) => (
                    <td key={p.id} className="p-4 text-neutral-200 font-mono">
                      {p.specs && p.specs[specKey] ? p.specs[specKey] : <span className="text-neutral-600">—</span>}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
