import React from 'react';
import { ArrowLeft, Check, ShieldCheck, Zap, Heart, Scale } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from './CartContext';
import { toast } from './toast';
import ReviewSection from './ReviewSection';

export default function ProductDetailView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state, dispatch } = useCart();
  
  const product = state.products.find((p) => p.id.toString() === id);

  if (!product) return (
    <div className="max-w-5xl mx-auto text-center py-20">
      <h2 className="text-2xl font-bold text-white mb-4">Product Not Found</h2>
      <button onClick={() => navigate('/')} className="text-accent-500 hover:underline">Return to Storefront</button>
    </div>
  );

  const currency = state.currency;
  const basePriceINR = product.priceINR || Math.round(product.priceUSD * 95.68);
  const price = Math.round(basePriceINR * currency.rate);
  const isWish = state.wishlist.includes(product.id);
  const isCompare = state.compareList && state.compareList.includes(product.id);

  const handleAddToCart = () => {
    dispatch({ type: 'ADD_TO_CART', payload: product });
    toast.success(`${product.name} added to your build`);
  };

  const handleToggleWishlist = () => {
    dispatch({ type: 'TOGGLE_WISHLIST', payload: { id: product.id } });
    if (!isWish) toast.success(`${product.name} saved to wishlist`);
  };

  const handleToggleCompare = () => {
    dispatch({ type: 'TOGGLE_COMPARE', payload: { id: product.id } });
    if (!isCompare) toast.info(`${product.name} added to comparison matrix`);
  };

  const handleNotifyMe = () => {
    dispatch({ type: 'SET_STOCK_ALERT', payload: product });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-slide-up">
      <button
        onClick={() => navigate('/')}
        className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-accent-400 transition-colors"
      >
        <ArrowLeft size={16} /> Back to Catalog
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 glass-panel p-8 rounded-3xl relative overflow-hidden">
        {/* Subtle glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-600/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="relative z-10">
          <div className="aspect-square bg-dark-900 rounded-2xl overflow-hidden mb-6 border border-white/10 group shadow-xl">
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
            />
          </div>
          <div className="flex justify-around text-xs text-neutral-400 border border-white/10 bg-dark-800/50 p-4 rounded-xl">
            <span className="flex items-center gap-2"><ShieldCheck size={18} className="text-accent-500" /> 3 Years Warranty</span>
            <span className="flex items-center gap-2"><Zap size={18} className="text-accent-500" /> Tested & Verified</span>
          </div>
        </div>

        <div className="flex flex-col justify-between space-y-8 relative z-10">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-bold text-accent-500 tracking-widest font-mono border border-accent-500/30 bg-accent-500/10 px-3 py-1 rounded-md">{product.category}</span>
              <span className="text-xs text-emerald-400 font-bold flex items-center gap-1.5 bg-emerald-500/10 px-3 py-1 rounded-md border border-emerald-500/20">
                <Check size={14} /> In Stock
              </span>
            </div>

            <div>
              <p className="text-xs font-bold text-primary-400 uppercase tracking-widest mb-1">{product.brand}</p>
              <h1 className="text-3xl lg:text-4xl font-black text-white leading-tight">{product.name}</h1>
              <p className="text-xs font-mono text-neutral-500 mt-2">SKU: {product.sku}</p>
            </div>

            <div className="pt-2 space-y-1.5">
              <div className="flex flex-wrap items-baseline gap-3">
                <span className="text-4xl font-black text-white text-glow font-mono">
                  {currency.symbol}{price.toLocaleString(currency.locale)}
                </span>
                {product.priceDelta !== undefined && product.priceDelta !== 0 && (
                  <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-md border ${
                    product.marketTrend === 'up' 
                      ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' 
                      : 'text-rose-400 bg-rose-500/10 border-rose-500/20'
                  }`}>
                    {product.priceDeltaPercent} Indian Spot Market
                  </span>
                )}
              </div>
              <div className="text-[11px] text-neutral-400 font-mono">
                {currency.code === 'INR' ? (
                  <span>Inclusive of 18% GST • Tracked in Indian Hardware Market</span>
                ) : (
                  <span>Converted from ₹{basePriceINR.toLocaleString('en-IN')} (Forex: {currency.fxRateDisplay || 'Live Rate'})</span>
                )}
              </div>
            </div>

            <p className="text-sm text-neutral-300 border-t border-b border-white/10 py-5 leading-relaxed">
              {product.description}
            </p>

            <div>
              <h4 className="text-xs font-bold uppercase text-neutral-400 tracking-widest mb-3">Technical Specs</h4>
              <div className="border border-white/10 rounded-xl overflow-hidden text-xs">
                {Object.entries(product.specs).map(([k, v], i) => (
                  <div key={k} className={`flex justify-between p-3 ${i % 2 === 0 ? 'bg-dark-800/80' : 'bg-dark-900/80'}`}>
                    <span className="text-neutral-400 font-medium">{k}</span>
                    <span className="font-bold text-neutral-200 font-mono text-right ml-4">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-white hover:bg-accent-400 text-dark-900 font-black py-4 rounded-xl text-sm transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(0,240,255,0.5)] transform hover:-translate-y-1"
              >
                ADD TO BUILD
              </button>

              <button
                onClick={handleToggleCompare}
                title="Compare"
                className={`px-4 py-4 rounded-xl border transition-all ${
                  isCompare 
                    ? 'bg-accent-500 text-dark-900 border-accent-400 font-bold' 
                    : 'bg-dark-800 text-neutral-300 border-white/10 hover:text-white hover:bg-dark-700'
                }`}
              >
                <Scale size={18} />
              </button>

              <button
                onClick={handleToggleWishlist}
                title="Wishlist"
                className={`px-4 py-4 rounded-xl border transition-all ${
                  isWish 
                    ? 'border-rose-500/50 bg-rose-500/10 text-rose-500' 
                    : 'border-white/10 bg-dark-800 text-neutral-400 hover:text-white hover:bg-dark-700'
                }`}
              >
                <Heart size={18} className={isWish ? 'fill-rose-500' : ''} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <ReviewSection product={product} />
    </div>
  );
}