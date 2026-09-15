import React, { useState } from 'react'
import { useCart } from '../context/CartContext.jsx'

const CATEGORY_CLASS = {
  Audio: 'tag-coral',
  Wearables: 'tag-lime',
  Computing: 'tag-violet',
  Accessories: 'tag-yellow',
}

function Rating({ value, count }) {
  const full = Math.round(value)
  return (
    <div className="product-rating" aria-label={`Rated ${value} out of 5, ${count} reviews`}>
      <span className="rating-stars" aria-hidden="true">
        {'★'.repeat(full)}
        {'☆'.repeat(5 - full)}
      </span>
      <span className="rating-count">({count})</span>
    </div>
  )
}

export default function ProductCard({ product }) {
  const { addToCart } = useCart()
  const [justAdded, setJustAdded] = useState(false)

  const handleAdd = () => {
    addToCart(product)
    setJustAdded(true)
    window.clearTimeout(handleAdd._t)
    handleAdd._t = window.setTimeout(() => setJustAdded(false), 1200)
  }

  return (
    <article className="product-card">
      <div className="product-image-wrap">
        <img src={product.image} alt={product.name} className="product-image" />
        <span className={`product-category-tag ${CATEGORY_CLASS[product.category] || ''}`}>
          {product.category}
        </span>
      </div>
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <Rating value={product.rating} count={product.reviews} />
        <p className="product-price">₹{product.price.toFixed(2)}</p>
      </div>
      <button
        className={`add-btn${justAdded ? ' is-added' : ''}`}
        onClick={handleAdd}
      >
        {justAdded ? 'Added ✓' : 'Add to cart'}
      </button>
    </article>
  )
}
