import React, { useState } from 'react'
import { useCart } from '../context/CartContext.jsx'
import CartItem from './CartItem.jsx'
import Coupon from './Coupon.jsx'

export default function Cart() {
  const { items, totals, clearCart, discountPercent } = useCart()
  const [checkoutNote, setCheckoutNote] = useState(false)

  return (
    <section className="cart" id="cart" aria-label="Cart">
      <div className="section-heading">
        <h2>Cart</h2>
        {items.length > 0 && <p className="section-subtext">{totals.itemCount} items</p>}
      </div>

      {items.length === 0 ? (
        <p className="empty-cart">Nothing here yet. Add a product to get started.</p>
      ) : (
        <>
          <div className="cart-items">
            {items.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
          </div>

          <Coupon />

          <div className="cart-summary">
            <div className="summary-row">
              <span>Subtotal</span>
              <span>₹{totals.subtotal.toFixed(2)}</span>
            </div>
            {discountPercent > 0 && (
              <div className="summary-row summary-row-discount">
                <span>Discount ({discountPercent}%)</span>
                <span>−₹{totals.discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="summary-row">
              <span>GST ({(totals.gstRate * 100).toFixed(0)}%)</span>
              <span>₹{totals.gstAmount.toFixed(2)}</span>
            </div>
            <div className="summary-row summary-row-total">
              <span>Grand total</span>
              <span>₹{totals.grandTotal.toFixed(2)}</span>
            </div>
          </div>

          <button className="checkout-btn" onClick={() => setCheckoutNote(true)}>
            Proceed to checkout
          </button>
          {checkoutNote && (
            <p className="checkout-note">Checkout isn't wired up in this build.</p>
          )}

          <button className="clear-cart-btn" onClick={clearCart}>
            Clear cart
          </button>
        </>
      )}
    </section>
  )
}
