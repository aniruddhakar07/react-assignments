# Assignment 5 — Modern Hardware Storefront & Custom PC Builder

A high-performance computer hardware e-commerce web application and interactive custom PC builder built with **React 19**, **Vite**, **Tailwind CSS**, and **React Router v7**.

Features live market price fluctuations, real-time hardware compatibility checking, multi-currency conversion, promo coupon logic, side-by-side product comparisons, wishlist management, and a complete simulated checkout workflow.

---

## 🚀 Installation & Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- npm

### Quick Start
```bash
# 1. Navigate to the project directory
cd Assignment_5_Online_shopping_cart

# 2. Install dependencies
npm install

# 3. Start the Vite development server
npm run dev
```

Open your browser at the printed localhost URL (default **http://localhost:5173**).

### Build for Production
```bash
npm run build
npm run preview
```

---

## ✨ Features

- **Hardware Catalog & Multi-Faceted Filters**:
  - Browse across 10 hardware categories: Processors, Graphics Cards, Motherboards, RAM, NVMe SSDs, PSUs, Coolers, Cases, Monitors, and Peripherals.
  - Live search, brand filter (AMD, Intel, NVIDIA, ASUS, Corsair, etc.), price range slider, and stock toggle.
  - Switch between 3-column grid view and dense list view.
  - **Live Market Ticker**: Displays real-time hardware price fluctuations with trend indicators (`▲ surging`, `▼ dropping`, `stable`).
- **Interactive Custom PC Builder**:
  - Configure a complete 8-component rig: CPU, Motherboard, GPU, RAM, Storage, PSU, Cooler, and Case.
  - **Automated Compatibility Verification**:
    - **Socket Matching**: Detects socket incompatibilities (e.g., AMD AM5 vs. Intel LGA1700).
    - **Form Factor Verification**: Checks motherboard dimensions against case specifications (ATX, Micro-ATX, Mini-ITX).
    - **Power Budget Calculator**: Evaluates total estimated power consumption under load against PSU wattage and warns if headroom is insufficient.
  - One-click transfer of the entire custom rig into the shopping cart.
- **Cart & Promotions Engine**:
  - Quantity controls with stock limits, one-click item removal, and empty-cart actions.
  - **Free Shipping Tracker**: Visual progress bar indicating how close the user is to free shipping.
  - **Active Promo Code Engine**: Instant coupon validation and discount calculations.
- **Multi-Currency System**:
  - Switch between **INR (₹)**, **USD ($)**, **EUR (€)**, and **GBP (£)** with dynamic localized tax calculations (GST, US Sales Tax, VAT).
- **Side-by-Side Product Comparison**:
  - Pin up to 4 components in the comparison bar.
  - View a detailed technical matrix comparing sockets, clocks, cores, TDP, form factors, and interfaces.
- **Product Details & Quick-View**:
  - Inspect high-resolution photography, technical specs, customer star reviews, and submit verified user reviews.
- **Wishlist & Stock Notifications**:
  - Slide-out wishlist drawer with quick "Move to Cart" action.
  - Out-of-stock notification sign-up modal.
- **Simulated Checkout Flow**:
  - Multi-step checkout: Shipping Address, Payment Method selection (UPI/QR, Card, Net Banking, COD), transparent cost breakdown, and order placement with a printable confirmation receipt.

---

## 📖 How to Use

### 1. Browsing & Filtering Hardware
- Use the **Category Tabs** or **Search Bar** to browse components.
- Use the left sidebar to filter by **Brand**, adjust the **Price Range Slider**, or toggle **In Stock Only**.
- Switch between **Grid** and **List** layout using the display icons.

### 2. Building a Custom PC
1. Click **PC Builder** in the navigation header.
2. For each slot (CPU, Motherboard, GPU, etc.), click **Choose Component** and select a part.
3. Observe real-time compatibility badges:
   - If an incompatible CPU and Motherboard are selected, a prominent alert warns of the socket mismatch.
   - The **Estimated Power Consumption** meter recalculates wattage as you add parts.
4. When satisfied with your build, click **Add Complete Rig to Cart**.

### 3. Comparing Components
1. Click the **Compare** icon on up to 4 product cards.
2. Click the floating **Compare Bar** at the bottom of the screen to open the side-by-side spec comparison table.

### 4. Testing Promo Codes in the Cart
Open the Cart and apply any of these active test coupons:
| Coupon Code | Discount Benefit |
| :--- | :--- |
| **`CYBER10`** | 10% instant discount on all cart items |
| **`PCBUILD5`** | 5% discount on custom PC builds |
| **`SUMMER20`** | 20% discount on order subtotal |
| **`FREESHIP`** | Waives 100% of shipping fees |

### 5. Switching Currencies
- Click the currency dropdown in the top navbar to toggle between **₹ INR**, **$ USD**, **€ EUR**, and **£ GBP**.
- All prices, discounts, and regional taxes update across the catalog and checkout instantly.

### 6. Completing Checkout
1. Click **Checkout** from the cart.
2. Enter mock shipping address details (Name, Address, City, PIN).
3. Choose a simulated payment method (e.g., UPI, Card, or COD).
4. Click **Confirm & Place Order** to view the final order confirmation receipt and tracking code.

---

## 🛠️ Tech Stack

- **React 19**: Context API + `useReducer` for global store, `useMemo`, `React.lazy` code splitting
- **React Router v7**: Client-side multi-page routing
- **Tailwind CSS 3**: Custom dark-neumorphic and cyberpunk aesthetics, glassmorphism
- **Lucide Icons**: Crisp interface iconography
- **LocalStorage**: Preserves Cart, Wishlist, PC Build, and active currency across sessions

---

## 📁 Project Structure

```
Assignment_5_Online_shopping_cart/
├── src/
│   ├── data/
│   │   └── hardwareProducts.js   # Hardware catalog with specifications
│   ├── App.jsx                   # Router setup, error boundary & layout
│   ├── CartContext.jsx           # Global state (Cart, Wishlist, Currency, Build)
│   ├── CheckoutView.jsx          # Multi-step checkout & order receipt
│   ├── CompareBar.jsx            # Floating compare drawer bar
│   ├── CompareModal.jsx          # Spec matrix comparison modal
│   ├── ComponentRequestModal.jsx # Custom parts request form
│   ├── Footer.jsx                # Store footer & support links
│   ├── Navbar.jsx                # Navigation, currency switcher & drawer triggers
│   ├── PCBuilderView.jsx         # Custom PC configurator & compatibility engine
│   ├── ProductCard.jsx           # Catalog item card
│   ├── ProductDetailView.jsx     # Dedicated product page & review form
│   ├── QuickViewModal.jsx        # Quick-look product preview modal
│   ├── ReviewSection.jsx         # Verified customer reviews
│   ├── StockAlertModal.jsx       # Out-of-stock notification modal
│   ├── StorefrontView.jsx        # Main catalog with filters and live market ticker
│   ├── toast.js                  # Toast notification utility
│   ├── ToastContainer.jsx        # Toast banner renderer
│   ├── WishlistDrawer.jsx        # Slide-out saved items drawer
│   ├── index.css                 # Tailwind directives & theme styles
│   └── main.jsx                  # Application entry point
├── index.html
├── package.json
├── tailwind.config.js
└── vite.config.js
```
