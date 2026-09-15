# Assignment 5 — Online Shopping Cart

React app built with `useReducer` + Context API for state management, as specified
in the assignment's prerequisites.

## Requirements mapping

| Requirement | Where it's implemented |
|---|---|
| Product List | `src/components/ProductList.jsx`, data in `src/data/products.js` |
| Add to Cart | `ADD_TO_CART` action in `src/context/CartContext.jsx`, triggered from `ProductCard.jsx` |
| Remove Item | `REMOVE_FROM_CART` action, triggered from `CartItem.jsx` |
| Quantity Update | `UPDATE_QUANTITY` action, +/- buttons in `CartItem.jsx` (auto-removes at 0) |
| Grand Total | Computed via `useMemo` in `CartContext.jsx` (`totals.grandTotal`) |
| Coupon Code | `Coupon.jsx` + `APPLY_COUPON` action. Valid codes: `SAVE10` (10%), `SAVE20` (20%), `WELCOME5` (5%) |
| GST Calculation | 18% GST applied to the post-discount amount, shown in `Cart.jsx` |

## State management architecture

- `CartContext.jsx` holds a single `useReducer` with actions:
  `ADD_TO_CART`, `REMOVE_FROM_CART`, `UPDATE_QUANTITY`, `APPLY_COUPON`, `CLEAR_CART`.
- Derived totals (subtotal, discount, GST, grand total) are computed with `useMemo`
  rather than stored in state, so they can never drift out of sync with the cart items.
- `useCart()` is the custom hook every component uses to read state and dispatch actions —
  no prop drilling.

## Design

Bold, color-blocked storefront look: Space Grotesk for headlines/prices, Inter for
body text, a violet header/hero, and per-category accent colors (coral, lime, violet,
yellow) carried through the filter chips and product tags. Cards use a flat "sticker"
style — solid 2px borders with a hard offset shadow — instead of soft drop shadows.
Tokens live in `src/index.css`; layout and component styles in `src/App.css`.

## Running it

```bash
npm install
npm run dev
```

Then open the printed localhost URL. Requires Node.js and npm.

## Notes / things you may want to change before submitting

- Product images use placeholder URLs (`placehold.co`) — swap in real product photos if required.
- Coupon codes and the 18% GST rate are hardcoded in `CartContext.jsx` — adjust to match
  whatever your instructor specified, if different values were given in class.
