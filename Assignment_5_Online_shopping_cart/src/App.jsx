import React, { Component, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './CartContext';
import Navbar from './Navbar';
import Footer from './Footer';
import ToastContainer from './ToastContainer';
import WishlistDrawer from './WishlistDrawer';
import QuickViewModal from './QuickViewModal';
import CompareBar from './CompareBar';
import CompareModal from './CompareModal';
import ComponentRequestModal from './ComponentRequestModal';
import StockAlertModal from './StockAlertModal';

// Keep StorefrontView synchronous for instant initial render
import StorefrontView from './StorefrontView';

// Code-split heavy routes on-demand
const PCBuilderView = lazy(() => import('./PCBuilderView'));
const ProductDetailView = lazy(() => import('./ProductDetailView'));
const CheckoutView = lazy(() => import('./CheckoutView'));

function RouteLoadingFallback() {
  return (
    <div className="flex-1 flex items-center justify-center min-h-[50vh] py-12">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-accent-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-mono text-neutral-400">Loading component...</p>
      </div>
    </div>
  );
}

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-dark-900 text-white flex items-center justify-center p-6">
          <div className="glass-panel p-8 rounded-3xl max-w-md text-center space-y-4 border border-rose-500/30">
            <h2 className="text-xl font-bold text-rose-400">Something went wrong</h2>
            <p className="text-xs text-neutral-400 leading-relaxed">
              An unexpected display issue occurred with cached browser data.
            </p>
            <p className="text-[11px] font-mono text-rose-300 bg-dark-950 p-2.5 rounded-lg border border-white/5 truncate">
              {this.state.error?.message || 'Unknown error'}
            </p>
            <button
              onClick={this.handleReset}
              className="w-full py-3 rounded-xl bg-accent-500 text-dark-900 font-bold text-xs hover:bg-accent-400 transition-colors shadow-[0_0_15px_rgba(0,240,255,0.3)]"
            >
              Reset Cache & Reload Storefront
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <Router>
        <CartProvider>
          <div className="min-h-screen flex flex-col justify-between bg-dark-900 text-neutral-200">
            <Navbar />
            <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8 relative z-10 flex flex-col">
              {/* Subtle background glow effect */}
              <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden">
                <div className="absolute -top-[40%] -left-[10%] w-[70%] h-[70%] rounded-full bg-primary-600/10 blur-[120px]"></div>
                <div className="absolute top-[60%] -right-[10%] w-[60%] h-[60%] rounded-full bg-accent-600/10 blur-[120px]"></div>
              </div>
              
              <div className="animate-fade-in flex-1">
                <Suspense fallback={<RouteLoadingFallback />}>
                  <Routes>
                    <Route path="/" element={<StorefrontView />} />
                    <Route path="/builder" element={<PCBuilderView />} />
                    <Route path="/product/:id" element={<ProductDetailView />} />
                    <Route path="/checkout" element={<CheckoutView />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </Suspense>
              </div>
            </main>
            <Footer />
          </div>

          {/* Global Overlays and Modals */}
          <WishlistDrawer />
          <QuickViewModal />
          <CompareBar />
          <CompareModal />
          <ComponentRequestModal />
          <StockAlertModal />
          <ToastContainer />
        </CartProvider>
      </Router>
    </ErrorBoundary>
  );
}
