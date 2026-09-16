import React from 'react';

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-dark-900 mt-24 relative overflow-hidden">
      {/* Subtle glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-accent-500/50 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 gap-6">
        <div className="flex flex-col items-center sm:items-start gap-1">
          <p className="font-bold text-neutral-300 tracking-widest uppercase">Aro<span className="text-accent-500">Hardware</span></p>
          <p>&copy; 2026 Aro Storefront. Elite components for elite builds.</p>
        </div>
        <div className="flex gap-6 font-medium">
          <a href="#" className="hover:text-accent-400 transition-colors">Support</a>
          <a href="#" className="hover:text-accent-400 transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-accent-400 transition-colors">Privacy Policy</a>
        </div>
      </div>
    </footer>
  );
}
