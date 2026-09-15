import React, { useState } from 'react'
import { useCart } from '../context/CartContext.jsx'

export default function Coupon() {
  const { applyCoupon, couponCode, discountPercent, couponError } = useCart()
  const [input, setInput] = useState('')

  const handleApply = (e) => {
    e.preventDefault()
    applyCoupon(input)
  }

  return (
    <form className="coupon-form" onSubmit={handleApply}>
      <label htmlFor="coupon">Coupon code</label>
      <div className="coupon-input-row">
        <input
          id="coupon"
          type="text"
          placeholder="Enter code"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit">Apply</button>
      </div>
      {couponCode && (
        <p className="coupon-note coupon-note-success">
          {couponCode} applied — {discountPercent}% off
        </p>
      )}
      {couponError && <p className="coupon-note coupon-note-error">{couponError}</p>}
    </form>
  )
}
