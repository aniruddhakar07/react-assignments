import React from 'react';
import { X, Check, ShieldCheck, Zap, ShoppingBag, ExternalLink, Heart } from 'lucide-react';
import { useCart } from './CartContext';
import { toast } from './toast';
import { useNavigate } from 'react-router-dom';

export default function QuickViewModal() {
  const { state, dispatch } = useCart();
  const navigate = useNavigate();

  const product = state.quickViewProduct;
  if (!product) return null;

  const currency = state.currency;
  const basePriceINR = product.priceINR || Math.round(product.priceUSD * 95.68);
  const price = Math.round(basePriceINR * currency.rate);
  const isWish = state.wishlist.includes(product.id);

  const handleClose = () => {
    dispatch({ type: 'SET_QUICK_VIEW', payload: null });
  };

  const handleAddToCart = () => {
    dispatch({ type: 'ADD_TO_CART', payload: product });
    toast.success(`${product.name} added to cart`);
  };

  const handleToggleWishlist = () => {
    dispatch({ type: 'TOGGLE_WISHLIST', payload: { id: product.id } });
    if (!isWish) toast.success(`${product.name} saved to wishlist`);
  };

  const handleViewFullDetails = () => {
    handleClose();
    navigate(`/product/${product.id}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        onClick={handleClose} 
        className="fixed inset-0 bg-black/75 backdrop-blur-md animate-fade-in"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-dark-900 border border-white/15 rounded-3xl overflow-hidden shadow-2xl z-10 animate-slide-up flex flex-col md:flex-row">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-dark-800/80 border border-white/10 text-neutral-400 hover:text-white hover:bg-dark-700 transition-all"
        >
          <X size={18} />
        </button>

        {/* Product Media Column */}
        <div className="md:w-1/2 bg-dark-950 p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-white/10">
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-dark-900 border border-white/5 group">
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
            />
            <span className="absolute top-3 left-3 text-[10px] font-mono uppercase bg-dark-900/80 backdrop-blur-md px-2.5 py-1 rounded-md text-white border border-white/10">
              {product.category}
            </span>
          </div>

          <div className="mt-4 flex items-center justify-around text-[11px] text-neutral-400">
            <span className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-accent-500" /> 3-Yr Warranty</span>
            <span className="flex items-center gap-1.5"><Zap size={14} className="text-accent-500" /> In Stock</span>
          </div>
        </div>

        {/* Product Info Column */}
        <div className="md:w-1/2 p-6 flex flex-col justify-between space-y-4">
          <div>
            <span className="text-[10px] font-bold text-accent-400 uppercase tracking-widest">{product.brand}</span>
            <h3 className="text-lg font-bold text-white leading-tight mt-1">{product.name}</h3>
            <p className="text-[10px] font-mono text-neutral-500 mt-1">SKU: {product.sku}</p>

            <div className="mt-3">
              <span className="text-2xl font-black text-white text-glow">
                {currency.symbol}{price.toLocaleString(currency.locale)}
              </span>
            </div>

            <p className="text-xs text-neutral-300 mt-3 line-clamp-3 leading-relaxed">
              {product.description}
            </p>

            {/* Quick Specs */}
            <div className="mt-4 pt-4 border-t border-white/10">
              <span className="text-[10px] font-bold uppercase text-neutral-400 tracking-wider block mb-2">Key Specs</span>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(product.keySpecs).slice(0, 4).map(([k, v]) => (
                  <div key={k} className="bg-dark-800/80 border border-white/5 rounded-lg p-2 text-[11px]">
                    <span className="text-neutral-500 block text-[9px] uppercase">{k}</span>
                    <span className="font-mono font-bold text-neutral-200 truncate block">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-4 border-t border-white/10">
            <div className="flex gap-2">
              <button
                onClick={handleAddToCart}
                className="flex-1 py-3 rounded-xl bg-white hover:bg-accent-400 text-dark-900 font-black text-xs transition-all shadow-[0_0_15px_rgba(255,255,255,0.15)] flex items-center justify-center gap-2"
              >
                <ShoppingBag size={15} />
                <span>ADD TO CART</span>
              </button>

              <button
                onClick={handleToggleWishlist}
                title="Wishlist"
                className={`p-3 rounded-xl border transition-all ${
                  isWish 
                    ? 'border-rose-500/50 bg-rose-500/10 text-rose-500' 
                    : 'border-white/10 bg-dark-800 text-neutral-400 hover:text-white'
                }`}
              >
                <Heart size={16} className={isWish ? 'fill-rose-500' : ''} />
              </button>
            </div>

            <button
              onClick={handleViewFullDetails}
              className="w-full py-2.5 rounded-xl border border-white/10 text-neutral-300 hover:text-white hover:bg-white/5 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <span>View Full Specs & Reviews</span>
              <ExternalLink size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
