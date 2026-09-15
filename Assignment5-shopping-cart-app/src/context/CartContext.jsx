import React, { createContext, useContext, useReducer, useMemo } from 'react'

const CartContext = createContext(null)

const GST_RATE = 0.18 // 18% GST

// Valid coupon codes and the percentage discount they apply to the subtotal
const COUPONS = {
  SAVE10: 10,
  SAVE20: 20,
  WELCOME5: 5,
}

const initialState = {
  items: [], // { id, name, price, image, quantity }
  couponCode: '',
  discountPercent: 0,
  couponError: '',
}

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const product = action.payload
      const existing = state.items.find((item) => item.id === product.id)
      if (existing) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        }
      }
      return {
        ...state,
        items: [...state.items, { ...product, quantity: 1 }],
      }
    }

    case 'REMOVE_FROM_CART': {
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload.id),
      }
    }

    case 'UPDATE_QUANTITY': {
      const { id, quantity } = action.payload
      if (quantity <= 0) {
        return {
          ...state,
          items: state.items.filter((item) => item.id !== id),
        }
      }
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === id ? { ...item, quantity } : item
        ),
      }
    }

    case 'APPLY_COUPON': {
      const code = action.payload.trim().toUpperCase()
      if (!code) {
        return { ...state, couponCode: '', discountPercent: 0, couponError: '' }
      }
      if (COUPONS[code] !== undefined) {
        return {
          ...state,
          couponCode: code,
          discountPercent: COUPONS[code],
          couponError: '',
        }
      }
      return {
        ...state,
        couponCode: '',
        discountPercent: 0,
        couponError: 'Invalid coupon code',
      }
    }

    case 'CLEAR_CART': {
      return { ...initialState }
    }

    default:
      return state
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState)

  const totals = useMemo(() => {
    const subtotal = state.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    )
    const discountAmount = (subtotal * state.discountPercent) / 100
    const taxableAmount = subtotal - discountAmount
    const gstAmount = taxableAmount * GST_RATE
    const grandTotal = taxableAmount + gstAmount
    const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0)

    return {
      subtotal,
      discountAmount,
      taxableAmount,
      gstAmount,
      grandTotal,
      itemCount,
      gstRate: GST_RATE,
    }
  }, [state.items, state.discountPercent])

  const value = {
    items: state.items,
    couponCode: state.couponCode,
    discountPercent: state.discountPercent,
    couponError: state.couponError,
    totals,
    addToCart: (product) => dispatch({ type: 'ADD_TO_CART', payload: product }),
    removeFromCart: (id) => dispatch({ type: 'REMOVE_FROM_CART', payload: { id } }),
    updateQuantity: (id, quantity) =>
      dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } }),
    applyCoupon: (code) => dispatch({ type: 'APPLY_COUPON', payload: code }),
    clearCart: () => dispatch({ type: 'CLEAR_CART' }),
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
