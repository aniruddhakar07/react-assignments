import React, { useMemo, useState } from 'react'
import ProductCard from './ProductCard.jsx'
import products from '../data/products.js'

const CATEGORY_CLASS = {
  Audio: 'chip-coral',
  Wearables: 'chip-lime',
  Computing: 'chip-violet',
  Accessories: 'chip-yellow',
}

export default function ProductList() {
  const [activeCategory, setActiveCategory] = useState('All')

  const categories = useMemo(
    () => ['All', ...new Set(products.map((p) => p.category))],
    []
  )

  const visibleProducts = useMemo(
    () =>
      activeCategory === 'All'
        ? products
        : products.filter((p) => p.category === activeCategory),
    [activeCategory]
  )

  return (
    <section className="product-list">
      <div className="section-heading">
        <h2>Shop</h2>
        <p className="section-subtext">{visibleProducts.length} products</p>
      </div>

      <div className="category-filter" role="group" aria-label="Filter by category">
        {categories.map((category) => (
          <button
            key={category}
            className={`filter-chip ${CATEGORY_CLASS[category] || ''}${
              category === activeCategory ? ' is-active' : ''
            }`}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="product-grid">
        {visibleProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}
