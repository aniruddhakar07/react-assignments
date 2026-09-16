import React, { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  Cpu, 
  Zap, 
  HelpCircle, 
  ArrowRight, 
  RotateCcw, 
  Sparkles, 
  ShieldCheck, 
  ChevronLeft, 
  ChevronRight, 
  Eye, 
  ShoppingCart, 
  Flame 
} from 'lucide-react';
import { useCart } from './CartContext';
import { toast } from './toast';
import ProductCard from './ProductCard';

const TRENDING_CHIPS = [
  'RTX 4090',
  'Ryzen 9800X3D',
  'AM5 Motherboard',
  'DDR5 6000MHz',
  'PCIe Gen5 SSD',
  'White Build',
  'Mini-ITX'
];

// Simple debounce hook
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export default function StorefrontView() {
  const { state, dispatch } = useCart();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [sortBy, setSortBy] = useState('featured');
  const [spotlightIndex, setSpotlightIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  const categories = ['All', 'CPU', 'GPU', 'Motherboard', 'RAM', 'Storage', 'Cooling', 'Cases', 'Power Supplies', 'Peripherals'];
  
  const debouncedSearch = useDebounce(search, 300);

  // Iconic flagship hardware items for the interactive spotlight carousel
  const spotlightIds = ['cpu-9800x3d', 'gpu-rtx4090', 'gpu-rtx4070ti-s-aero', 'case-hyte-y70'];
  const spotlightProducts = useMemo(() => {
    const prods = spotlightIds.map((id) => state.products.find((p) => p.id === id)).filter(Boolean);
    return prods.length > 0 ? prods : state.products.slice(0, 4);
  }, [state.products]);

  const activeSpotlight = spotlightProducts[spotlightIndex] || spotlightProducts[0];

  // Auto-cycle spotlight carousel (pauses on hover)
  useEffect(() => {
    if (!autoPlay || spotlightProducts.length <= 1) return;
    const interval = setInterval(() => {
      setSpotlightIndex((prev) => (prev + 1) % spotlightProducts.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [autoPlay, spotlightProducts.length]);

  const handlePrevSpotlight = (e) => {
    e.stopPropagation();
    setSpotlightIndex((prev) => (prev - 1 + spotlightProducts.length) % spotlightProducts.length);
  };

  const handleNextSpotlight = (e) => {
    e.stopPropagation();
    setSpotlightIndex((prev) => (prev + 1) % spotlightProducts.length);
  };

  const filtered = useMemo(() => {
    return state.products
      .filter((p) => {
        const matchesQuery = p.name.toLowerCase().includes(debouncedSearch.toLowerCase()) || 
                             p.brand.toLowerCase().includes(debouncedSearch.toLowerCase());
        const matchesCategory = category === 'All' || p.category === category;
        return matchesQuery && matchesCategory;
      })
      .sort((a, b) => {
        const priceA = a.priceINR || Math.round(a.priceUSD * 95.68);
        const priceB = b.priceINR || Math.round(b.priceUSD * 95.68);
        if (sortBy === 'price-low') return priceA - priceB;
        if (sortBy === 'price-high') return priceB - priceA;
        if (sortBy === 'rating') return b.rating - a.rating;
        return 0;
      });
  }, [state.products, debouncedSearch, category, sortBy]);

  // Detect likely category for smart in-stock recommendations when search yields 0 items
  const suggestedAlternatives = useMemo(() => {
    if (filtered.length > 0 || !debouncedSearch.trim()) return [];

    const q = debouncedSearch.toLowerCase();
    let detectedCategory = null;

    if (/gpu|rtx|gtx|radeon|graphics|video card|geforce|5090|5080|3080|4080/.test(q)) detectedCategory = 'GPU';
    else if (/cpu|intel|ryzen|processor|threadripper|core i|7800x|14900|9950|9800/.test(q)) detectedCategory = 'CPU';
    else if (/motherboard|mainboard|b650|z790|x670|am5|lga1700|b550/.test(q)) detectedCategory = 'Motherboard';
    else if (/ram|memory|ddr5|ddr4|corsair vengeance|trident/.test(q)) detectedCategory = 'RAM';
    else if (/ssd|nvme|m\.2|storage|samsung 990|crucial/.test(q)) detectedCategory = 'Storage';
    else if (/cooler|aio|cooling|liquid freezer|kraken|noctua|fan/.test(q)) detectedCategory = 'Cooling';
    else if (/case|chassis|h9|h6|o11|y70|nr200/.test(q)) detectedCategory = 'Cases';
    else if (/psu|power supply|watt|seasonic|sf750/.test(q)) detectedCategory = 'Power Supplies';

    if (detectedCategory) {
      return state.products.filter((p) => p.category === detectedCategory).slice(0, 4);
    }

    // Default fallback: top rated components
    return state.products.slice(0, 4);
  }, [filtered.length, debouncedSearch, state.products]);

  const handleOpenComponentRequest = () => {
    dispatch({ type: 'SET_COMPONENT_REQUEST', payload: search });
  };

  return (
    <div className="space-y-8">
      {/* Compact, High-Appeal Interactive Hero Section */}
      <div className="relative glass-panel rounded-3xl overflow-hidden p-6 sm:p-8 lg:p-10 border-t border-l border-white/20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent-500/15 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary-600/15 rounded-full blur-[100px] pointer-events-none"></div>
        
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Punchy & Compact Value Proposition */}
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-dark-900/80 border border-white/10 text-accent-400 text-xs font-mono shadow-inner">
              <span className="w-2 h-2 rounded-full bg-accent-400 animate-ping"></span>
              <span className="font-semibold tracking-wide uppercase">NEXT-GEN HARDWARE STOREFRONT • {state.products.length} VERIFIED PARTS</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.1]">
              Build Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-400 via-white to-primary-400">Dream Machine</span>
            </h1>

            <p className="text-neutral-400 text-xs sm:text-sm md:text-base leading-relaxed max-w-xl">
              Curated enthusiast CPUs, GPUs, motherboards, and cooling with automated socket compatibility, real-time localized currency, and zero guesswork.
            </p>

            {/* Quick Action CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Link
                to="/builder"
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-400 hover:to-accent-500 text-dark-950 font-black text-xs sm:text-sm transition-all shadow-[0_0_25px_rgba(0,240,255,0.35)] hover:shadow-[0_0_35px_rgba(0,240,255,0.5)] flex items-center gap-2 group"
              >
                <Zap size={16} className="text-dark-950 group-hover:scale-110 transition-transform" />
                <span>Launch PC Part Builder</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>

              <button
                onClick={() => {
                  const el = document.getElementById('catalog-controls');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-5 py-3 rounded-xl bg-dark-800/80 hover:bg-dark-700/80 border border-white/10 hover:border-white/20 text-white font-bold text-xs sm:text-sm transition-colors flex items-center gap-2"
              >
                <Flame size={15} className="text-amber-400" />
                <span>Browse All {state.products.length} Parts</span>
              </button>
            </div>

            {/* Trust Badges Bar */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-2 border-t border-white/10">
              <div className="flex items-center gap-2 text-xs text-neutral-300">
                <ShieldCheck size={16} className="text-emerald-400 flex-shrink-0" />
                <span className="text-[11px] sm:text-xs font-medium">Socket Verified</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-neutral-300">
                <Zap size={16} className="text-accent-400 flex-shrink-0" />
                <span className="text-[11px] sm:text-xs font-medium">Live Power Est.</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-neutral-300">
                <Sparkles size={16} className="text-amber-400 flex-shrink-0" />
                <span className="text-[11px] sm:text-xs font-medium">Verified Hardware</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Featured Hardware Spotlight */}
          <div className="lg:col-span-5">
            {activeSpotlight && (
              <div 
                className="glass-card rounded-2xl p-5 border border-white/15 relative overflow-hidden group shadow-2xl bg-dark-900/70 backdrop-blur-xl"
                onMouseEnter={() => setAutoPlay(false)}
                onMouseLeave={() => setAutoPlay(true)}
              >
                {/* Header tag & carousel navigation */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent-500/10 border border-accent-500/30 text-accent-400 text-[10px] font-mono font-black uppercase tracking-wider">
                    <Flame size={12} className="text-accent-400" />
                    FLAGSHIP SPOTLIGHT
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={handlePrevSpotlight}
                      aria-label="Previous Spotlight"
                      className="w-7 h-7 rounded-lg bg-dark-800/80 hover:bg-dark-700 text-neutral-300 hover:text-white flex items-center justify-center border border-white/10 transition-colors"
                    >
                      <ChevronLeft size={14} />
                    </button>
                    <span className="text-[11px] font-mono text-neutral-400 px-1">
                      {spotlightIndex + 1}/{spotlightProducts.length}
                    </span>
                    <button
                      onClick={handleNextSpotlight}
                      aria-label="Next Spotlight"
                      className="w-7 h-7 rounded-lg bg-dark-800/80 hover:bg-dark-700 text-neutral-300 hover:text-white flex items-center justify-center border border-white/10 transition-colors"
                    >
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>

                {/* Spotlight Image & Specs */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                  <div 
                    onClick={() => navigate(`/product/${activeSpotlight.id}`)}
                    className="sm:col-span-5 aspect-square rounded-xl overflow-hidden bg-dark-950 border border-white/10 relative cursor-pointer group-hover:border-accent-500/40 transition-colors"
                  >
                    <img
                      src={activeSpotlight.image}
                      alt={activeSpotlight.name}
                      decoding="async"
                      width="300"
                      height="300"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-950/80 via-transparent to-transparent pointer-events-none"></div>
                    <span className="absolute bottom-2 left-2 text-[10px] font-mono px-2 py-0.5 rounded bg-dark-900/90 text-neutral-300 border border-white/10">
                      {activeSpotlight.category}
                    </span>
                  </div>

                  <div className="sm:col-span-7 space-y-2">
                    <div className="text-[11px] font-bold text-accent-400 uppercase tracking-wide">
                      {activeSpotlight.brand}
                    </div>
                    <h3 
                      onClick={() => navigate(`/product/${activeSpotlight.id}`)}
                      className="text-sm sm:text-base font-black text-white leading-snug cursor-pointer hover:text-accent-400 transition-colors line-clamp-2"
                    >
                      {activeSpotlight.name}
                    </h3>

                    {/* Price & Rating */}
                    <div className="flex items-baseline justify-between pt-0.5">
                      <div>
                        <span className="text-lg sm:text-xl font-black text-white font-mono">
                          {state.currency.symbol}{Math.round((activeSpotlight.priceINR || Math.round(activeSpotlight.priceUSD * 95.68)) * state.currency.rate).toLocaleString(state.currency.locale)}
                        </span>
                        <span className="text-[10px] text-neutral-400 ml-1 font-mono">
                          {state.currency.code}
                        </span>
                      </div>
                      <span className="text-[11px] font-mono text-emerald-400 font-medium bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                        In Stock
                      </span>
                    </div>

                    {/* Key Specs Pills */}
                    {activeSpotlight.keySpecs && (
                      <div className="flex flex-wrap gap-1 pt-0.5">
                        {Object.entries(activeSpotlight.keySpecs).slice(0, 2).map(([k, v]) => (
                          <span key={k} className="text-[10px] px-2 py-0.5 rounded bg-dark-950/90 border border-white/5 text-neutral-300 font-mono">
                            {k}: {v}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-2 pt-1.5">
                      <button
                        onClick={() => dispatch({ type: 'SET_QUICK_VIEW', payload: activeSpotlight })}
                        className="p-2 rounded-xl bg-dark-800 hover:bg-dark-700 text-neutral-300 hover:text-white border border-white/10 transition-colors flex items-center justify-center"
                        title="Quick View"
                      >
                        <Eye size={15} />
                      </button>
                      <button
                        onClick={() => {
                          dispatch({ type: 'ADD_TO_CART', payload: activeSpotlight });
                          toast.success(`${activeSpotlight.name} added to cart`);
                        }}
                        className="flex-1 py-2 px-3 rounded-xl bg-accent-500 hover:bg-accent-400 text-dark-950 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(0,240,255,0.25)]"
                      >
                        <ShoppingCart size={13} />
                        <span>Add to Cart</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Mini Spotlight Dots Selector */}
                <div className="flex items-center justify-center gap-1.5 mt-3 pt-2 border-t border-white/5">
                  {spotlightProducts.map((prod, idx) => (
                    <button
                      key={prod.id}
                      onClick={() => setSpotlightIndex(idx)}
                      aria-label={`Go to slide ${idx + 1}`}
                      className={`h-1.5 rounded-full transition-all ${
                        idx === spotlightIndex ? 'w-6 bg-accent-400' : 'w-2 bg-neutral-700 hover:bg-neutral-500'
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Filters, Search & Trending Chips */}
      <div id="catalog-controls" className="space-y-3">
        <div className="glass-panel p-4 rounded-2xl flex flex-col lg:flex-row gap-4 items-center justify-between sticky top-6 z-20 shadow-2xl backdrop-blur-xl">
          <div className="relative w-full lg:w-96">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Search CPU, GPU, brand, model..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-dark-900/50 rounded-xl text-sm border border-white/10 text-white placeholder-neutral-500 focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500 transition-all"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto items-center">
            <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 max-w-full custom-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`text-xs px-4 py-2 rounded-xl font-medium transition-all whitespace-nowrap border ${
                    category === cat 
                      ? 'bg-accent-600/20 border-accent-500 text-accent-500 shadow-[0_0_15px_rgba(0,240,255,0.3)]' 
                      : 'bg-dark-800/50 border-white/5 text-neutral-400 hover:text-white hover:border-white/20'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-xs bg-dark-900/50 border border-white/10 rounded-xl px-4 py-3 font-medium text-neutral-300 outline-none cursor-pointer focus:border-accent-500 w-full sm:w-auto"
            >
              <option value="featured">Sort: Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        {/* Trending Chips & Live Market Status */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-2">
          <div className="flex items-center gap-2 overflow-x-auto text-xs text-neutral-400 custom-scrollbar">
            <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 flex-shrink-0">Popular:</span>
            {TRENDING_CHIPS.map((chip) => (
              <button
                key={chip}
                onClick={() => { setSearch(chip); setCategory('All'); }}
                className="px-2.5 py-1 rounded-lg bg-dark-800/60 hover:bg-dark-700/80 border border-white/5 hover:border-accent-500/30 text-neutral-300 hover:text-accent-400 transition-colors whitespace-nowrap text-[11px]"
              >
                {chip}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 flex-shrink-0 self-start sm:self-auto">
            <div 
              title="Prices anchored to Indian Hardware Market (INR ₹), auto-fluctuating with live spot availability and converted live for foreign currencies"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono cursor-help"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              <span>LIVE SPOT MARKET (IN ₹)</span>
            </div>
            <button
              onClick={() => {
                dispatch({ type: 'UPDATE_MARKET_PRICES' });
                toast.success('Indian market spot rates synchronized!');
              }}
              title="Sync live component market prices"
              className="px-2.5 py-1 rounded-lg bg-dark-800/80 hover:bg-dark-700 border border-white/10 text-neutral-300 hover:text-white text-[11px] font-mono flex items-center gap-1 transition-colors"
            >
              <RotateCcw size={11} />
              <span>Sync</span>
            </button>
          </div>
        </div>
      </div>

      {/* Product Grid / Empty State */}
      {filtered.length === 0 ? (
        <div className="space-y-10">
          <div className="text-center py-16 glass-panel rounded-3xl flex flex-col items-center justify-center p-6 border border-white/10 relative overflow-hidden">
            <div className="bg-dark-800 p-5 rounded-full border border-white/5 mb-4 text-neutral-400">
              <Cpu size={40} />
            </div>
            <h3 className="text-2xl font-black text-white mb-2">No components matched "{search}"</h3>
            <p className="text-neutral-400 mb-6 max-w-md text-xs leading-relaxed">
              We couldn't locate this exact model in current stock. You can submit a custom sourcing request or check our in-stock alternatives below.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <button 
                onClick={() => { setSearch(''); setCategory('All'); }}
                className="px-5 py-2.5 rounded-xl bg-dark-800 hover:bg-dark-700 text-white text-xs font-bold border border-white/10 transition-colors flex items-center gap-1.5"
              >
                <RotateCcw size={13} />
                <span>Reset Filters</span>
              </button>

              <button 
                onClick={handleOpenComponentRequest}
                className="px-5 py-2.5 rounded-xl bg-accent-500 text-dark-900 text-xs font-black hover:bg-accent-400 transition-colors shadow-[0_0_20px_rgba(0,240,255,0.3)] flex items-center gap-1.5"
              >
                <HelpCircle size={14} />
                <span>Request Custom Procurement</span>
              </button>
            </div>
          </div>

          {/* Smart In-Stock Alternatives Section */}
          {suggestedAlternatives.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-accent-400"></span>
                <h4 className="text-base font-black text-white tracking-tight">
                  Recommended In-Stock Alternatives
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {suggestedAlternatives.map((item) => (
                  <ProductCard 
                    key={item.id} 
                    item={item} 
                    currency={state.currency} 
                    isWish={Boolean(state.wishlist && state.wishlist.includes(item.id))} 
                    isCompare={Boolean(state.compareList && state.compareList.includes(item.id))}
                    dispatch={dispatch} 
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((item) => (
            <ProductCard 
              key={item.id} 
              item={item} 
              currency={state.currency} 
              isWish={Boolean(state.wishlist && state.wishlist.includes(item.id))} 
              isCompare={Boolean(state.compareList && state.compareList.includes(item.id))}
              dispatch={dispatch} 
            />
          ))}
        </div>
      )}
    </div>
  );
}