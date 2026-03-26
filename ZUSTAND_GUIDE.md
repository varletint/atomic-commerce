# Zustand State Management Guide

## Overview

Zustand handles all client-side state while React Query manages server state. This separation keeps concerns clear and performance optimal.

## Store Architecture

### 🛒 Cart Store (`useCartStore`)

**Persisted**: ✅ Yes (localStorage)

```tsx
import { useCart } from '@/hooks';

function ProductCard({ product }) {
  const { addToCart, items, total, itemCount } = useCart();

  return <button onClick={() => addToCart(product, 1)}>Add to Cart ({itemCount})</button>;
}
```

**Features**:

- Add/remove items
- Update quantities
- Calculate totals
- Persist across sessions

### 🎨 Theme Store (`useThemeStore`)

**Persisted**: ✅ Yes (localStorage)

```tsx
import { useTheme } from '@/hooks';

function ThemeToggle() {
  const { theme, toggleTheme, isDark } = useTheme();

  return <button onClick={toggleTheme}>{isDark ? '🌙' : '☀️'}</button>;
}
```

**Features**:

- Light/dark/system modes
- Auto-apply on mount
- Respects system preferences

### 🎛️ UI Store (`useUIStore`)

**Persisted**: ❌ No (ephemeral)

```tsx
import { useUIStore } from '@/store';

function Header() {
  const { isCartOpen, toggleCart, isMobileMenuOpen, toggleMobileMenu } = useUIStore();

  return (
    <>
      <button onClick={toggleCart}>Cart</button>
      <button onClick={toggleMobileMenu}>Menu</button>
    </>
  );
}
```

**Features**:

- Sidebar, cart drawer, mobile menu, search modal
- Close all at once
- No persistence (resets on refresh)

### 🔐 Auth Store (`useAuthStore`)

**Persisted**: ⚠️ Partial (user only, not token)

```tsx
import { useAuthStore } from '@/store';

function Profile() {
  const user = useAuthStore((state) => state.user);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  return (
    <div>
      <p>Welcome, {user?.firstName}</p>
      <button onClick={clearAuth}>Logout</button>
    </div>
  );
}
```

**Features**:

- User data & authentication status
- Token management (not persisted for security)
- Used by route guards

## Usage Patterns

### ✅ Selector Pattern (Recommended)

```tsx
// Only re-renders when items change
const items = useCartStore((state) => state.items);
const addItem = useCartStore((state) => state.addItem);
```

### ❌ Avoid Destructuring

```tsx
// Re-renders on ANY store change
const { items, total, itemCount } = useCartStore();
```

### ✅ Custom Hooks

```tsx
// Use abstracted hooks for better DX
const { addToCart, total } = useCart();
const { toggleTheme, isDark } = useTheme();
```

## State Management Strategy

| State Type       | Tool            | Examples                             |
| ---------------- | --------------- | ------------------------------------ |
| **Client State** | Zustand         | Theme, cart, UI toggles, auth status |
| **Server State** | React Query     | Products, orders, user profile       |
| **Form State**   | React Hook Form | Login, checkout, profile edit        |
| **URL State**    | React Router    | Search params, filters, pagination   |

## Example: Cart Flow

```tsx
// 1. Add to cart from product page
function ProductDetail({ product }) {
  const { addToCart } = useCart();
  const { openCart } = useUIStore();

  const handleAddToCart = () => {
    addToCart(product, 1);
    openCart(); // Show cart drawer
  };

  return <button onClick={handleAddToCart}>Add to Cart</button>;
}

// 2. Cart drawer shows items
function CartDrawer() {
  const { isCartOpen, closeCart } = useUIStore();
  const { items, total, removeFromCart } = useCart();

  return (
    <Drawer open={isCartOpen} onClose={closeCart}>
      {items.map((item) => (
        <CartItem key={item.id} item={item} onRemove={() => removeFromCart(item.product.id)} />
      ))}
      <p>Total: ${total}</p>
    </Drawer>
  );
}
```

## DevTools Setup (Optional)

```tsx
import { devtools } from 'zustand/middleware';

export const useCartStore = create<CartState>()(
  devtools(
    persist(
      (set, get) => ({
        /* ... */
      }),
      { name: 'cart-storage' }
    ),
    { name: 'CartStore' }
  )
);
```

## Next Steps

1. Install dependencies: `npm install`
2. Use stores in your components
3. Check `src/store/README.md` for detailed API docs
4. Explore example usage in guards and hooks
