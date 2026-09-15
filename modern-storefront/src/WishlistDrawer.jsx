import React from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, Heart } from 'lucide-react';
import { useCart } from './CartContext';
import { toast } from './toast';
import { useNavigate } from 'react-router-dom';

export default function WishlistDrawer() {
  const { state, dispatch } = useCart();
  const navigate = useNavigate();

  if (!state.isWishlistOpen) return null;

  const wishlistProducts = state.products.filter((p) => state.wishlist.includes(p.id));
  const currency = state.currency;

  const handleClose = () => {
    dispatch({ type: 'SET_WISHLIST_OPEN', payload: false });
  };

  const handleMoveToCart = (item) => {
    dispatch({ type: 'ADD_TO_CART', payload: item });
    dispatch({ type: 'TOGGLE_WISHLIST', payload: { id: item.id } });
    toast.success(`${item.name} moved to cart`);
  };

  const handleRemove = (id, name) => {
    dispatch({ type: 'TOGGLE_WISHLIST', payload: { id } });
    toast.info(`${name} removed from wishlist`);
  };

  const handleMoveAllToCart = () => {
    if (wishlistProducts.length === 0) return;
    dispatch({ type: 'ADD_MULTIPLE_TO_CART', payload: wishlistProducts });
    wishlistProducts.forEach((p) => {
      dispatch({ type: 'TOGGLE_WISHLIST', payload: { id: p.id } });
    });
    toast.success(`Moved all ${wishlistProducts.length} items to your cart!`);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        onClick={handleClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-fade-in"
      />

      {/* Slide-over panel */}
      <div className="relative w-full max-w-md bg-dark-900/95 backdrop-blur-2xl border-l border-white/10 shadow-2xl h-full flex flex-col z-10 animate-slide-up">
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-500 border border-rose-500/20">
              <Heart size={20} className="fill-rose-500" />
            </div>
            <div>
              <h2 className="font-black text-white text-lg tracking-tight">Saved Hardware</h2>
              <p className="text-xs text-neutral-400 font-mono">{wishlistProducts.length} items on wishlist</p>
            </div>
          </div>
          <button 
            onClick={handleClose}
            className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Item List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
          {wishlistProducts.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <div className="p-5 rounded-full bg-dark-800 border border-white/5 mb-4 text-neutral-500">
                <Heart size={36} />
              </div>
              <h3 className="font-bold text-white text-lg mb-1">Your wishlist is empty</h3>
              <p className="text-xs text-neutral-400 max-w-xs mb-6">
                Explore the catalog and click the heart icon on any component to save it for later.
              </p>
              <button
                onClick={handleClose}
                className="px-5 py-2.5 rounded-xl bg-accent-600 text-white text-xs font-bold hover:bg-accent-500 transition-colors shadow-[0_0_15px_rgba(0,240,255,0.2)]"
              >
                Browse Catalog
              </button>
            </div>
          ) : (
            wishlistProducts.map((item) => {
              const basePriceINR = item.priceINR || Math.round(item.priceUSD * 95.68);
              const price = Math.round(basePriceINR * currency.rate);
              return (
                <div 
                  key={item.id} 
                  className="glass-card rounded-xl p-3 flex gap-3 items-center group relative border border-white/5 hover:border-white/15 transition-all"
                >
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    onClick={() => { handleClose(); navigate(`/product/${item.id}`); }}
                    className="w-16 h-16 rounded-lg object-cover bg-dark-950 border border-white/5 cursor-pointer group-hover:scale-105 transition-transform" 
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-mono uppercase text-accent-400">{item.brand}</span>
                    <h4 
                      onClick={() => { handleClose(); navigate(`/product/${item.id}`); }}
                      className="font-bold text-xs text-white truncate cursor-pointer hover:text-accent-400 transition-colors"
                    >
                      {item.name}
                    </h4>
                    <p className="text-xs font-black text-white mt-1">
                      {currency.symbol}{price.toLocaleString(currency.locale)}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <button
                      onClick={() => handleMoveToCart(item)}
                      title="Move to cart"
                      className="p-2 rounded-lg bg-white/10 hover:bg-accent-500 hover:text-dark-900 text-white transition-all"
                    >
                      <ShoppingBag size={14} />
                    </button>
                    <button
                      onClick={() => handleRemove(item.id, item.name)}
                      title="Remove from wishlist"
                      className="p-2 rounded-lg hover:bg-rose-500/20 hover:text-rose-400 text-neutral-400 transition-all"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer actions */}
        {wishlistProducts.length > 0 && (
          <div className="p-6 border-t border-white/10 bg-dark-950/50 space-y-3">
            <button
              onClick={handleMoveAllToCart}
              className="w-full py-3 px-4 rounded-xl bg-white hover:bg-accent-400 text-dark-900 font-black text-xs transition-all shadow-[0_0_20px_rgba(255,255,255,0.15)] flex items-center justify-center gap-2"
            >
              <ShoppingBag size={16} />
              <span>MOVE ALL TO CART</span>
              <ArrowRight size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
