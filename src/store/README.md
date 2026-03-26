# Zustand Store Architecture

## Store Organization

We use Zustand for client-side state management with the following stores:

### 1. `useCartStore` - Shopping Cart State

- **Persisted**: Yes (localStorage)
- **Purpose**: Manage cart items, quantities, and totals
- **Actions**: addItem, removeItem, updateQuantity, clearCart, getTotal, getItemCount

```tsx
import { useCartStore } from '@/store';

function Component() {
  const items = useCartStore((state) => state.items);
  const addItem = useCartStore((state) => state.addItem);

  // Or use the custom hook
  const { items, addToCart, total } = useCart();
}
```

### 2. `useThemeStore` - Theme Management

- **Persisted**: Yes (localStorage)
- **Purpose**: Handle light/dark/system theme
- **Actions**: setTheme, toggleTheme

```tsx
import { useThemeStore } from '@/store';

function Component() {
  const theme = useThemeStore((state) => state.theme);
  const setTheme = useThemeStore((state) => state.setTheme);

  // Or use the custom hook
  const { theme, toggleTheme, isDark } = useTheme();
}
```

### 3. `useUIStore` - UI State

- **Persisted**: No (ephemeral)
- **Purpose**: Manage UI toggles (sidebar, cart drawer, mobile menu, search)
- **Actions**: toggleSidebar, toggleCart, toggleMobileMenu, toggleSearch, closeAll

```tsx
import { useUIStore } from '@/store';

function Component() {
  const isCartOpen = useUIStore((state) => state.isCartOpen);
  const toggleCart = useUIStore((state) => state.toggleCart);
}
```

### 4. `useAuthStore` - Authentication State

- **Persisted**: Partial (user only, not token)
- **Purpose**: Manage user authentication state
- **Actions**: setAuth, clearAuth, updateUser

```tsx
import { useAuthStore } from '@/store';

function Component() {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
}
```

## Best Practices

### 1. Selector Pattern (Recommended)

Use selectors to prevent unnecessary re-renders:

```tsx
// ✅ Good - only re-renders when items change
const items = useCartStore((state) => state.items);

// ❌ Bad - re-renders on any store change
const { items } = useCartStore();
```

### 2. Custom Hooks

Use custom hooks for complex logic:

```tsx
// Instead of using store directly
const { addItem } = useCartStore();

// Use custom hook with additional logic
const { addToCart } = useCart(); // Includes toast notifications, etc.
```

### 3. Computed Values

Use getters for computed values:

```tsx
const total = useCartStore((state) => state.getTotal());
const itemCount = useCartStore((state) => state.getItemCount());
```

### 4. Persistence

Stores that need persistence use `persist` middleware:

- Cart items (survive page refresh)
- Theme preference
- User data (not token for security)

## State Management Strategy

- **Client State (Zustand)**: UI state, theme, cart, auth status
- **Server State (React Query)**: Products, orders, user profile from API
- **Form State**: React Hook Form or native React state
- **URL State**: React Router (search params, filters)

## DevTools

Install Zustand DevTools for debugging:

```tsx
import { devtools } from 'zustand/middleware';

export const useCartStore = create<CartState>()(
  devtools(
    persist(
      (set, get) => ({
        // ... store implementation
      }),
      { name: 'cart-storage' }
    ),
    { name: 'CartStore' }
  )
);
```
