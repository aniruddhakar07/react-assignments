import React, { useState } from 'react';
import { Trash2, ArrowLeft, ShieldCheck, CreditCard, Printer, CheckCircle2, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from './CartContext';
import { toast } from './toast';

export default function CheckoutView() {
  const { state, dispatch } = useCart();
  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState('');
  const [orderDetails, setOrderDetails] = useState(null);

  const currency = state.currency;
  const isINR = currency.code === 'INR';

  const subtotalINR = state.cart.reduce((sum, i) => {
    const itemINR = i.priceINR || Math.round(i.priceUSD * 95.68);
    return sum + itemINR * i.quantity;
  }, 0);
  const discountINR = state.appliedCoupon === 'ARO10' ? Math.round(subtotalINR * 0.1) : 0;
  const netTotalINR = Math.max(0, subtotalINR - discountINR);
  const gstIncludedINR = Math.round(netTotalINR - netTotalINR / 1.18);

  const fmt = (inr) => `${currency.symbol}${Math.round(inr * currency.rate).toLocaleString(currency.locale)}`;

  const subtotalFormatted = fmt(subtotalINR);
  const discountFormatted = discountINR > 0 ? `-${fmt(discountINR)}` : null;
  const totalFormatted = fmt(netTotalINR);
  const taxFormatted = isINR
    ? `₹${gstIncludedINR.toLocaleString('en-IN')} (18% GST Included)`
    : `${currency.symbol}${Math.round(gstIncludedINR * currency.rate).toLocaleString(currency.locale)} (Taxes/Duty Included)`;

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (couponCode.trim().toUpperCase() === 'ARO10') {
      dispatch({ type: 'APPLY_COUPON', payload: 'ARO10' });
      toast.success('Coupon ARO10 applied successfully!');
    } else {
      toast.error('Invalid coupon code.');
    }
  };

  const handleCheckout = () => {
    const details = {
      orderId: `ARO-2026-${Math.floor(10000 + Math.random() * 90000)}`,
      date: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      items: [...state.cart],
      subtotalFormatted,
      discountFormatted,
      taxFormatted,
      totalFormatted,
      taxLabel: isINR ? 'GST (18% Included)' : currency.taxLabel
    };

    setOrderDetails(details);
    dispatch({ type: 'CLEAR_CART' });
    toast.success('Order placed successfully!');
  };

  const handlePrint = () => {
    window.print();
  };

  if (orderDetails) {
    return (
      <div className="max-w-2xl mx-auto my-10 space-y-6 animate-slide-up">
        {/* Printable Receipt Card */}
        <div id="printable-receipt" className="glass-panel p-8 sm:p-10 rounded-3xl space-y-6 border border-white/15 shadow-2xl relative overflow-hidden bg-dark-900/90 print:bg-white print:text-black print:border-none print:shadow-none">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-white/10 print:border-neutral-300 gap-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-500 to-primary-600 flex items-center justify-center text-white font-black text-sm">
                  A
                </div>
                <span className="font-black text-xl text-white tracking-tight print:text-black">
                  Aro<span className="text-accent-400 print:text-neutral-800">Hardware</span>
                </span>
              </div>
              <p className="text-xs text-neutral-400 mt-1 print:text-neutral-600">Official Commercial Tax Invoice & Receipt</p>
            </div>

            <div className="text-left sm:text-right text-xs">
              <span className="font-mono font-bold text-accent-400 block text-sm print:text-neutral-900">{orderDetails.orderId}</span>
              <span className="text-neutral-400 font-mono print:text-neutral-600">{orderDetails.date}</span>
            </div>
          </div>

          {/* Status badge */}
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2 print:border-neutral-300 print:text-emerald-700">
            <CheckCircle2 size={16} />
            <span>Order Confirmed & Electrostatic Packaging Dispatched</span>
          </div>

          {/* Items Table */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider print:text-neutral-700">Purchased Hardware</h4>
            <div className="divide-y divide-white/5 print:divide-neutral-200">
              {orderDetails.items.map((item) => {
                const itemINR = item.priceINR || Math.round(item.priceUSD * 95.68);
                return (
                  <div key={item.id} className="py-2.5 flex items-center justify-between text-xs">
                    <div className="min-w-0 flex-1 pr-4">
                      <p className="font-bold text-white truncate print:text-black">{item.name}</p>
                      <span className="text-[10px] text-neutral-400 font-mono print:text-neutral-500">Qty: {item.quantity} × {fmt(itemINR)}</span>
                    </div>
                    <span className="font-mono font-bold text-white print:text-black">
                      {fmt(itemINR * item.quantity)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Totals */}
          <div className="pt-4 border-t border-white/10 print:border-neutral-300 space-y-2 text-xs text-neutral-400 print:text-neutral-700">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="text-white font-mono print:text-black">{orderDetails.subtotalFormatted}</span>
            </div>
            {orderDetails.discountFormatted && (
              <div className="flex justify-between text-accent-400 print:text-emerald-700">
                <span>Promotional Discount (ARO10)</span>
                <span className="font-mono">{orderDetails.discountFormatted}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>{orderDetails.taxLabel}</span>
              <span className="text-white font-mono print:text-black">{orderDetails.taxFormatted}</span>
            </div>
            <div className="pt-3 border-t border-white/10 print:border-neutral-300 flex justify-between items-end">
              <span className="text-sm font-bold text-white uppercase tracking-wider print:text-black">Total Paid</span>
              <span className="text-2xl font-black text-white font-mono print:text-black">{orderDetails.totalFormatted}</span>
            </div>
          </div>

          <p className="text-[10px] text-neutral-500 text-center font-mono pt-4 border-t border-white/5 print:border-neutral-200">
            3-Year Limited Manufacturer Warranty Active. Keep this receipt for serial warranty registration.
          </p>
        </div>

        {/* User Action Buttons (Hidden on Print) */}
        <div className="flex gap-4 print:hidden">
          <button
            onClick={handlePrint}
            className="flex-1 py-3.5 rounded-xl bg-dark-800 hover:bg-dark-700 border border-white/10 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow"
          >
            <Printer size={15} />
            <span>Print / Save PDF Receipt</span>
          </button>

          <button
            onClick={() => { setOrderDetails(null); navigate('/'); }}
            className="flex-1 py-3.5 rounded-xl bg-accent-500 hover:bg-accent-400 text-dark-900 font-black text-xs flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(0,240,255,0.3)]"
          >
            <span>Return to Catalog</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
      <button
        onClick={() => navigate('/')}
        className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-accent-400 transition-colors"
      >
        <ArrowLeft size={16} /> Back to Catalog
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center gap-3 border-b border-white/10 pb-4">
            <div className="p-2 bg-dark-800 rounded-lg border border-white/5 text-accent-400">
              <ShoppingBag size={18} />
            </div>
            <h2 className="text-xl font-bold text-white">
              Hardware Cart <span className="text-neutral-500 font-mono text-sm ml-2">({state.cart.length} items)</span>
            </h2>
          </div>

          {state.cart.length === 0 ? (
            <div className="glass-panel p-16 rounded-2xl text-center flex flex-col items-center justify-center min-h-[300px]">
              <div className="bg-dark-800 p-6 rounded-full border border-white/5 mb-6 text-neutral-500">
                <ShoppingBag size={36} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Your cart is empty</h3>
              <p className="text-neutral-400 mb-8 max-w-md text-xs">Looks like you haven't added any premium hardware to your cart yet.</p>
              <button
                onClick={() => navigate('/')}
                className="px-6 py-3 rounded-xl bg-accent-600 text-white font-bold hover:bg-accent-500 transition-colors shadow-[0_0_20px_rgba(0,240,255,0.2)] text-xs"
              >
                Browse Catalog
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {state.cart.map((item) => (
                <div key={item.id} className="glass-panel p-4 rounded-2xl flex gap-4 items-center group transition-all hover:border-white/20">
                  <div className="h-20 w-20 rounded-xl bg-dark-900 overflow-hidden border border-white/5 flex-shrink-0">
                    <img src={item.image} alt={item.name} className="h-full w-full object-cover group-hover:scale-110 transition duration-500" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-white truncate group-hover:text-accent-400 transition-colors">{item.name}</h4>
                    <p className="text-xs text-neutral-500 font-mono mt-1">{fmt(item.priceINR || Math.round(item.priceUSD * 95.68))} each</p>
                    
                    <div className="flex items-center gap-4 mt-3">
                      <div className="flex items-center bg-dark-900 rounded-lg border border-white/10 overflow-hidden">
                        <button 
                          onClick={() => dispatch({ type: 'UPDATE_QUANTITY', payload: { id: item.id, quantity: Math.max(1, item.quantity - 1) } })}
                          className="px-3 py-1 text-neutral-400 hover:text-white hover:bg-dark-800 transition-colors"
                        >-</button>
                        <span className="w-8 text-center text-xs font-bold text-white bg-dark-800 py-1 font-mono">{item.quantity}</span>
                        <button 
                          onClick={() => dispatch({ type: 'UPDATE_QUANTITY', payload: { id: item.id, quantity: item.quantity + 1 } })}
                          className="px-3 py-1 text-neutral-400 hover:text-white hover:bg-dark-800 transition-colors"
                        >+</button>
                      </div>
                      
                      <button onClick={() => {
                        dispatch({ type: 'REMOVE_FROM_CART', payload: { id: item.id } });
                        toast.info(`${item.name} removed from cart`);
                      }} className="text-neutral-500 hover:text-rose-500 transition-colors flex items-center gap-1 text-xs font-medium">
                        <Trash2 size={14} /> Remove
                      </button>
                    </div>
                  </div>
                  
                  <div className="text-lg font-black text-white text-glow whitespace-nowrap pl-4">
                    {fmt((item.priceINR || Math.round(item.priceUSD * 95.68)) * item.quantity)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-2 relative">
          <div className="glass-panel p-8 rounded-3xl sticky top-28 border-t border-l border-white/20 shadow-2xl">
            <h3 className="font-black text-white text-lg mb-6 flex items-center gap-2">
              <CreditCard size={20} className="text-accent-500" /> Order Summary
            </h3>
            
            <div className="space-y-4 text-sm text-neutral-400 border-b border-white/10 pb-6 mb-6">
              <div className="flex justify-between items-center">
                <span>Subtotal</span>
                <span className="text-white font-medium">{subtotalFormatted}</span>
              </div>
              
              {state.appliedCoupon && (
                <div className="flex justify-between items-center text-accent-400 bg-accent-500/10 px-3 py-2 rounded-lg border border-accent-500/20">
                  <span className="font-semibold">Coupon (10% OFF)</span>
                  <span className="font-bold">{discountFormatted}</span>
                </div>
              )}
              
              <div className="flex justify-between items-center">
                <span>{isINR ? 'GST (18% Included)' : currency.taxLabel}</span>
                <span className="text-white font-medium text-xs font-mono">{taxFormatted}</span>
              </div>
            </div>

            <div className="flex justify-between items-end mb-8">
              <span className="text-sm font-bold text-neutral-300 uppercase tracking-widest">Total Payable</span>
              <span className="text-3xl font-black text-white text-glow">{totalFormatted}</span>
            </div>

            <form onSubmit={handleApplyCoupon} className="flex gap-2 mb-6">
              <input
                type="text"
                placeholder="PROMO CODE (e.g. ARO10)"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="flex-1 px-4 py-3 text-xs bg-dark-900 border border-white/10 rounded-xl uppercase outline-none focus:border-accent-500 text-white placeholder-neutral-600 transition-colors font-mono"
              />
              <button type="submit" className="text-xs bg-dark-800 hover:bg-dark-700 border border-white/10 text-white px-5 py-3 rounded-xl font-bold transition-colors">
                APPLY
              </button>
            </form>

            <button
              onClick={handleCheckout}
              disabled={state.cart.length === 0}
              className="w-full bg-white hover:bg-accent-400 disabled:opacity-50 disabled:hover:bg-white text-dark-900 font-black py-4 rounded-xl text-sm transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(0,240,255,0.4)] disabled:shadow-none transform hover:-translate-y-1 disabled:hover:translate-y-0"
            >
              SECURE CHECKOUT
            </button>
            
            <p className="text-[10px] text-center text-neutral-500 mt-4 font-medium uppercase tracking-widest flex items-center justify-center gap-1.5">
              <ShieldCheck size={12} /> SSL Encrypted Payment
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}