import React from 'react'
import { useCart } from '../context/CartContext.jsx'

export default function CartItem({ item }) {
  const { updateQuantity, removeFromCart } = useCart()

  return (
    <div className="cart-item">
      <img src={item.image} alt={item.name} className="cart-item-image" />

      <div className="cart-item-body">
        <div className="cart-item-top">
          <p className="cart-item-name">{item.name}</p>
          <button
            className="cart-item-remove"
            onClick={() => removeFromCart(item.id)}
            aria-label={`Remove ${item.name} from cart`}
          >
            ×
          </button>
        </div>

        <div className="cart-item-bottom">
          <div className="quantity-controls">
            <button
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              aria-label={`Decrease quantity of ${item.name}`}
            >
              −
            </button>
            <span>{item.quantity}</span>
            <button
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              aria-label={`Increase quantity of ${item.name}`}
            >
              +
            </button>
          </div>
          <p className="cart-item-total">₹{(item.price * item.quantity).toFixed(2)}</p>
        </div>
      </div>
    </div>
  )
}
