import React, { createContext, useContext, useReducer, useEffect, useMemo } from 'react';
import { HARDWARE_PRODUCTS } from './data/hardwareProducts';

export const CURRENCIES = {
  INR: { 
    code: 'INR', 
    symbol: '₹', 
    rate: 1.0, 
    locale: 'en-IN', 
    taxLabel: 'GST (18% Included)', 
    taxRate: 0.18, 
    isBase: true,
    name: 'Indian Rupee',
    fxRateDisplay: 'Anchor Base (₹)'
  },
  USD: { 
    code: 'USD', 
    symbol: '$', 
    rate: 0.010452, // 1 USD ≈ ₹95.68
    locale: 'en-US', 
    taxLabel: 'Sales Tax (8%)', 
    taxRate: 0.08, 
    isBase: false,
    fxRateDisplay: '1 USD ≈ ₹95.68',
    name: 'US Dollar'
  },
  EUR: { 
    code: 'EUR', 
    symbol: '€', 
    rate: 0.009065, // 1 EUR ≈ ₹110.31
    locale: 'de-DE', 
    taxLabel: 'VAT (19%)', 
    taxRate: 0.19, 
    isBase: false,
    fxRateDisplay: '1 EUR ≈ ₹110.31',
    name: 'Euro'
  },
  GBP: { 
    code: 'GBP', 
    symbol: '£', 
    rate: 0.007758, // 1 GBP ≈ ₹128.90
    locale: 'en-GB', 
    taxLabel: 'VAT (20%)', 
    taxRate: 0.20, 
    isBase: false,
    fxRateDisplay: '1 GBP ≈ ₹128.90',
    name: 'British Pound'
  }
};

export const formatCurrencyPrice = (priceINR, currency = CURRENCIES.INR) => {
  const safeCurr = currency || CURRENCIES.INR;
  const converted = Math.round(priceINR * safeCurr.rate);
  return `${safeCurr.symbol}${converted.toLocaleString(safeCurr.locale)}`;
};

const getInitialProducts = () => {
  return HARDWARE_PRODUCTS.map((p) => {
    const baseINR = p.priceINR || Math.round(p.priceUSD * 95.68);
    const baseUSD = Math.round(baseINR * 0.010452);
    return {
      ...p,
      basePriceINR: baseINR,
      priceINR: baseINR,
      basePriceUSD: baseUSD,
      priceUSD: baseUSD,
      priceDeltaINR: 0,
      priceDeltaUSD: 0,
      priceDelta: 0,
      priceDeltaPercent: '0.0%',
      marketTrend: 'stable',
      lastUpdated: Date.now()
    };
  });
};

const getInitialState = () => {
  const initialProducts = getInitialProducts();
  try {
    const localData = localStorage.getItem('modernStorefrontState');
    if (localData) {
      const parsed = JSON.parse(localData);
      
      const rawCart = Array.isArray(parsed?.cart) ? parsed.cart : [];
      const updatedCart = rawCart
        .filter(item => item && typeof item === 'object' && item.id)
        .map(cartItem => {
          const latestProduct = initialProducts.find(p => p.id === cartItem.id);
          return latestProduct ? { ...latestProduct, quantity: Math.max(1, Number(cartItem.quantity) || 1) } : cartItem;
        });

      let safeCurrency = CURRENCIES.INR;
      const savedCode = parsed?.currencyCode || (typeof parsed?.currency === 'string' ? parsed.currency : (parsed?.currency?.code || 'INR'));
      if (savedCode && CURRENCIES[savedCode]) {
        safeCurrency = CURRENCIES[savedCode];
      }

      return {
        products: initialProducts,
        cart: updatedCart,
        wishlist: Array.isArray(parsed?.wishlist) ? parsed.wishlist.filter(Boolean) : [],
        appliedCoupon: typeof parsed?.appliedCoupon === 'string' ? parsed.appliedCoupon : null,
        currencies: CURRENCIES,
        currency: safeCurrency,
        compareList: Array.isArray(parsed?.compareList) ? parsed.compareList.filter(Boolean) : [],
        isWishlistOpen: false,
        isCompareOpen: false,
        quickViewProduct: null,
        componentRequestOpen: null,
        stockAlertItem: null,
        marketTicker: {
          lastUpdated: Date.now(),
          active: true,
          tickCount: 0
        }
      };
    }
  } catch (e) {
    console.error('Failed to load state from localStorage', e);
  }

  return {
    products: initialProducts,
    cart: [],
    wishlist: [],
    appliedCoupon: null,
    currencies: CURRENCIES,
    currency: CURRENCIES.INR,
    compareList: [],
    isWishlistOpen: false,
    isCompareOpen: false,
    quickViewProduct: null,
    componentRequestOpen: null, // null or string query
    stockAlertItem: null,
    marketTicker: {
      lastUpdated: Date.now(),
      active: true,
      tickCount: 0
    }
  };
};

function shopReducer(state, action) {
  let newState = state;
  switch (action.type) {
    case 'UPDATE_MARKET_PRICES': {
      // Dynamic automated real-world hardware market fluctuations
      // Tracked primarily in the Indian Retail & Wholesale Hardware Market (INR / ₹)
      const updatedProducts = state.products.map((product) => {
        // ~40% chance per component to experience a market tick
        const shouldFluctuate = Math.random() < 0.40;
        if (!shouldFluctuate) return product;

        const baseINR = product.basePriceINR || product.priceINR || Math.round(product.priceUSD * 95.68);
        // Realistic Indian spot market fluctuation between -2.5% and +2.5%
        const deltaPct = (Math.random() * 5 - 2.5);
        // Round to nearest 10 INR for clean retail street pricing
        const newPriceINR = Math.max(999, Math.round((baseINR * (1 + deltaPct / 100)) / 10) * 10);
        const deltaINR = newPriceINR - baseINR;
        const trend = deltaINR > 0 ? 'up' : deltaINR < 0 ? 'down' : 'stable';
        
        // Auto-convert to USD / foreign benchmarks using live Forex multiplier
        const usdRate = (state.currencies && state.currencies.USD && state.currencies.USD.rate) || 0.010452;
        const newPriceUSD = Math.round(newPriceINR * usdRate);
        const deltaUSD = newPriceUSD - (product.basePriceUSD || Math.round(baseINR * usdRate));

        return {
          ...product,
          basePriceINR: baseINR,
          priceINR: newPriceINR,
          basePriceUSD: product.basePriceUSD || Math.round(baseINR * usdRate),
          priceUSD: newPriceUSD,
          priceDeltaINR: deltaINR,
          priceDeltaUSD: deltaUSD,
          priceDelta: deltaINR,
          priceDeltaPercent: `${deltaINR >= 0 ? '+' : ''}${((deltaINR / baseINR) * 100).toFixed(1)}%`,
          marketTrend: trend,
          lastUpdated: Date.now()
        };
      });

      // Synchronize cart items with updated market rates
      const updatedCart = state.cart.map((cartItem) => {
        const matched = updatedProducts.find((p) => p.id === cartItem.id);
        return matched ? { 
          ...cartItem, 
          priceINR: matched.priceINR, 
          priceUSD: matched.priceUSD 
        } : cartItem;
      });

      newState = {
        ...state,
        products: updatedProducts,
        cart: updatedCart,
        marketTicker: {
          lastUpdated: Date.now(),
          active: true,
          tickCount: (state.marketTicker?.tickCount || 0) + 1
        }
      };
      break;
    }
    case 'UPDATE_EXCHANGE_RATES': {
      const rates = action.payload;
      if (!rates) return state;

      const usdRate = rates.USD || 0.010452;
      const eurRate = rates.EUR || 0.009065;
      const gbpRate = rates.GBP || 0.007758;

      const updatedCurrencies = {
        INR: { ...CURRENCIES.INR },
        USD: {
          ...CURRENCIES.USD,
          rate: usdRate,
          fxRateDisplay: `1 USD ≈ ₹${(1 / usdRate).toFixed(2)}`
        },
        EUR: {
          ...CURRENCIES.EUR,
          rate: eurRate,
          fxRateDisplay: `1 EUR ≈ ₹${(1 / eurRate).toFixed(2)}`
        },
        GBP: {
          ...CURRENCIES.GBP,
          rate: gbpRate,
          fxRateDisplay: `1 GBP ≈ ₹${(1 / gbpRate).toFixed(2)}`
        }
      };

      const currentCode = state.currency?.code || 'INR';
      const updatedCurrency = updatedCurrencies[currentCode] || updatedCurrencies.INR;

      newState = {
        ...state,
        currencies: updatedCurrencies,
        currency: updatedCurrency
      };
      break;
    }
    case 'SET_CURRENCY':
      newState = { ...state, currency: action.payload };
      break;
    case 'ADD_TO_CART': {
      const existing = state.cart.find((i) => i.id === action.payload.id);
      newState = {
        ...state,
        cart: existing
          ? state.cart.map((i) => (i.id === action.payload.id ? { ...i, quantity: i.quantity + 1 } : i))
          : [...state.cart, { ...action.payload, quantity: 1 }]
      };
      break;
    }
    case 'ADD_MULTIPLE_TO_CART': {
      let updatedCart = [...state.cart];
      for (const item of action.payload) {
        const existingIndex = updatedCart.findIndex((i) => i.id === item.id);
        if (existingIndex > -1) {
          updatedCart[existingIndex] = {
            ...updatedCart[existingIndex],
            quantity: updatedCart[existingIndex].quantity + (item.quantity || 1)
          };
        } else {
          updatedCart.push({ ...item, quantity: item.quantity || 1 });
        }
      }
      newState = { ...state, cart: updatedCart };
      break;
    }
    case 'REMOVE_FROM_CART':
      newState = { ...state, cart: state.cart.filter((i) => i.id !== action.payload.id) };
      break;
    case 'UPDATE_QUANTITY':
      newState = {
        ...state,
        cart: state.cart.map((i) =>
          i.id === action.payload.id ? { ...i, quantity: Math.max(1, action.payload.quantity) } : i
        )
      };
      break;
    case 'TOGGLE_WISHLIST': {
      const exists = state.wishlist.includes(action.payload.id);
      newState = {
        ...state,
        wishlist: exists ? state.wishlist.filter((id) => id !== action.payload.id) : [...state.wishlist, action.payload.id]
      };
      break;
    }
    case 'APPLY_COUPON':
      newState = { ...state, appliedCoupon: action.payload };
      break;
    case 'CLEAR_CART':
      newState = { ...state, cart: [], appliedCoupon: null };
      break;
    case 'TOGGLE_COMPARE': {
      const id = action.payload.id;
      const exists = state.compareList.includes(id);
      let updated;
      if (exists) {
        updated = state.compareList.filter((x) => x !== id);
      } else {
        if (state.compareList.length >= 4) {
          updated = [...state.compareList.slice(1), id];
        } else {
          updated = [...state.compareList, id];
        }
      }
      newState = { ...state, compareList: updated };
      break;
    }
    case 'CLEAR_COMPARE':
      newState = { ...state, compareList: [], isCompareOpen: false };
      break;
    case 'SET_WISHLIST_OPEN':
      newState = { ...state, isWishlistOpen: Boolean(action.payload) };
      break;
    case 'SET_COMPARE_OPEN':
      newState = { ...state, isCompareOpen: Boolean(action.payload) };
      break;
    case 'SET_QUICK_VIEW':
      newState = { ...state, quickViewProduct: action.payload || null };
      break;
    case 'SET_COMPONENT_REQUEST':
      newState = { ...state, componentRequestOpen: action.payload };
      break;
    case 'SET_STOCK_ALERT':
      newState = { ...state, stockAlertItem: action.payload || null };
      break;
    default:
      return state;
  }

  // Save specific parts of state to localStorage
  try {
    const stateToSave = {
      cart: newState.cart,
      wishlist: newState.wishlist,
      appliedCoupon: newState.appliedCoupon,
      currencyCode: newState.currency?.code || 'INR'
    };
    localStorage.setItem('modernStorefrontState', JSON.stringify(stateToSave));
  } catch (e) {
    console.error('Failed to save state to localStorage', e);
  }

  return newState;
}

const CartContext = createContext();

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(shopReducer, getInitialState());

  // Live Forex Rate Fetcher from Open Exchange Rates API
  useEffect(() => {
    const fetchLiveForex = async () => {
      try {
        const res = await fetch('https://open.er-api.com/v6/latest/INR');
        if (!res.ok) return;
        const data = await res.json();
        if (data && data.rates) {
          dispatch({ type: 'UPDATE_EXCHANGE_RATES', payload: data.rates });
        }
      } catch (err) {
        console.warn('Using accurate static fallback forex rates', err);
      }
    };

    fetchLiveForex();
    // Poll live exchange rates every 3 minutes
    const forexTimer = setInterval(fetchLiveForex, 180000);
    return () => clearInterval(forexTimer);
  }, []);

  useEffect(() => {
    const localData = localStorage.getItem('modernStorefrontState');
    if (!localData) {
      dispatch({ type: 'SET_CURRENCY', payload: CURRENCIES.INR });
    }
  }, []);

  // Live Automated Market Pricing Engine (auto-updates every 8 seconds)
  useEffect(() => {
    dispatch({ type: 'UPDATE_MARKET_PRICES' });

    const marketInterval = setInterval(() => {
      dispatch({ type: 'UPDATE_MARKET_PRICES' });
    }, 8000);

    return () => clearInterval(marketInterval);
  }, []);

  const value = useMemo(() => ({ state, dispatch }), [state]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => useContext(CartContext);