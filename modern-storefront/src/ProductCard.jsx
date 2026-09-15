import React, { memo } from 'react';
import { Heart, Eye, Scale, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from './toast';

const ProductCard = memo(({ item, currency, isWish, isCompare, dispatch }) => {
  const navigate = useNavigate();
  
  const basePriceINR = item.priceINR || Math.round(item.priceUSD * 95.68);
  const price = Math.round(basePriceINR * currency.rate);

  const handleNavigate = () => navigate(`/product/${item.id}`);

  const handleToggleWishlist = (e) => {
    e.stopPropagation();
    dispatch({ type: 'TOGGLE_WISHLIST', payload: { id: item.id } });
    if (!isWish) {
      toast.success(`${item.name} added to wishlist`);
    }
  };

  const handleQuickView = (e) => {
    e.stopPropagation();
    dispatch({ type: 'SET_QUICK_VIEW', payload: item });
  };

  const handleToggleCompare = (e) => {
    e.stopPropagation();
    dispatch({ type: 'TOGGLE_COMPARE', payload: { id: item.id } });
    if (!isCompare) {
      toast.info(`${item.name} added to comparison`);
    }
  };

  const handleNotifyMe = (e) => {
    e.stopPropagation();
    dispatch({ type: 'SET_STOCK_ALERT', payload: item });
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    dispatch({ type: 'ADD_TO_CART', payload: item });
    toast.success(`${item.name} added to cart`);
  };

  return (
    <div className="group glass-card rounded-2xl p-4 flex flex-col justify-between overflow-hidden relative">
      {/* Glow effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent-500/0 to-primary-500/0 group-hover:from-accent-500/10 group-hover:to-primary-500/5 transition-all duration-500 z-0 pointer-events-none"></div>

      <div className="relative z-10">
        <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-dark-900 mb-4 border border-white/5">
          <img
            src={item.image}
            alt={item.name}
            loading="lazy"
            decoding="async"
            width="400"
            height="300"
            onClick={handleNavigate}
            className="w-full h-full object-cover cursor-pointer group-hover:scale-110 transition duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition duration-300 pointer-events-none"></div>
          
          <span className="absolute top-3 left-3 bg-dark-900/80 backdrop-blur-md text-white text-[10px] font-mono px-2.5 py-1 rounded-md border border-white/10 uppercase tracking-wider shadow-lg">
            {item.category}
          </span>

          {/* Action Overlay Badges */}
          <div className="absolute top-3 right-3 flex items-center gap-1.5">
            {/* Quick View Button */}
            <button
              onClick={handleQuickView}
              aria-label={`Quick view ${item.name}`}
              title="Quick View"
              className="p-2 rounded-full bg-dark-900/60 backdrop-blur-md border border-white/10 text-neutral-400 hover:text-accent-400 transition-all shadow-lg hover:scale-110 active:scale-95"
            >
              <Eye size={14} />
            </button>

            {/* Compare Button */}
            <button
              onClick={handleToggleCompare}
              aria-label={isCompare ? "Remove from comparison" : "Add to comparison"}
              title="Compare"
              className={`p-2 rounded-full backdrop-blur-md border transition-all shadow-lg hover:scale-110 active:scale-95 ${
                isCompare 
                  ? 'bg-accent-500 text-dark-900 border-accent-400 shadow-[0_0_10px_rgba(0,240,255,0.5)]' 
                  : 'bg-dark-900/60 border-white/10 text-neutral-400 hover:text-white'
              }`}
            >
              <Scale size={14} />
            </button>

            {/* Wishlist Button */}
            <button
              onClick={handleToggleWishlist}
              aria-label={isWish ? "Remove from wishlist" : "Add to wishlist"}
              title="Wishlist"
              className="p-2 rounded-full bg-dark-900/60 backdrop-blur-md border border-white/10 text-neutral-400 hover:text-rose-400 transition-all shadow-lg hover:scale-110 active:scale-95"
            >
              <Heart size={14} className={isWish ? 'fill-rose-500 text-rose-500' : ''} />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-accent-500 uppercase tracking-widest">{item.brand}</span>
        </div>

        <h3
          onClick={handleNavigate}
          className="font-bold text-white text-sm hover:text-accent-400 cursor-pointer transition line-clamp-2 mt-1 leading-relaxed"
        >
          {item.name}
        </h3>

        <div className="mt-4 flex flex-wrap gap-2">
          {Object.entries(item.keySpecs).slice(0, 3).map(([k, v]) => (
            <span key={k} className="text-[10px] bg-dark-800/80 border border-white/5 text-neutral-300 px-2.5 py-1 rounded-md font-mono">
              {v}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-white/10 flex items-end justify-between relative z-10">
        <div>
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="text-[10px] uppercase text-neutral-500 font-semibold tracking-wider">SPOT (₹ BASE)</span>
            {item.priceDelta !== undefined && item.priceDelta !== 0 && (
              <span className={`text-[10px] font-mono font-bold ${item.marketTrend === 'up' ? 'text-emerald-400' : 'text-rose-400'}`}>
                {item.priceDeltaPercent}
              </span>
            )}
          </div>
          <span className="font-black text-white text-lg tracking-tight text-glow">
            {currency.symbol}{price.toLocaleString(currency.locale)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleAddToCart}
            aria-label={`Add ${item.name} to cart`}
            className="text-xs font-bold px-4 py-2 rounded-lg bg-white text-dark-900 hover:bg-accent-400 transition-colors shadow-[0_0_15px_rgba(255,255,255,0.2)] hover:shadow-[0_0_20px_rgba(0,240,255,0.4)]"
          >
            ADD
          </button>
        </div>
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.item.id === nextProps.item.id &&
    prevProps.item.priceINR === nextProps.item.priceINR &&
    prevProps.item.priceUSD === nextProps.item.priceUSD &&
    prevProps.item.priceDelta === nextProps.item.priceDelta &&
    prevProps.isWish === nextProps.isWish &&
    prevProps.isCompare === nextProps.isCompare &&
    prevProps.currency.code === nextProps.currency.code &&
    prevProps.currency.rate === nextProps.currency.rate &&
    prevProps.currency.symbol === nextProps.currency.symbol
  );
});

export default ProductCard;
