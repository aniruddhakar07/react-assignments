import React from 'react'
import ProductList from './components/ProductList.jsx'
import Cart from './components/Cart.jsx'
import { useCart } from './context/CartContext.jsx'
import './App.css'

function CartPill() {
  const { totals } = useCart()

  const scrollToCart = () => {
    document.getElementById('cart')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <button className="cart-pill" onClick={scrollToCart} aria-label="Go to cart">
      <span className="cart-pill-count">{totals.itemCount}</span>
      <span className="cart-pill-total">₹{totals.grandTotal.toFixed(2)}</span>
    </button>
  )
}

export default function App() {
  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header-inner">
          <span className="brand-mark">Aro</span>
          <CartPill />
        </div>
      </header>

      <section className="hero">
        <h1 className="hero-heading">Fresh tech,<br />no fuss.</h1>
        <p className="hero-sub">
          Everyday gear, picked to actually last. Use <span className="hero-code">SAVE10</span> for
          10% off your order.
        </p>
      </section>

      <main className="app-main">
        <ProductList />
        <Cart />
      </main>

      <footer className="app-footer">
        <span>© 2026 Aro. Built with React, useReducer and Context API.</span>
      </footer>
    </div>
  )
}
