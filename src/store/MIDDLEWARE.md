# Zustand Middleware Guide

## Available Middleware

### 1. Persist Middleware

Saves store state to localStorage with error handling and versioning.

```tsx
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { customStorage, createPersistOptions } from './middleware';

export const useStore = create<State>()(
  persist(
    (set) => ({
      // ... store implementation
    }),
    createPersistOptions('my-store', 1) // name, version
  )
);
```

**Features**:

- Error handling for localStorage failures
- Version migration support
- Custom storage implementation

### 2. Logger Middleware

Logs state changes in development mode.

```tsx
import { create } from 'zustand';
import { logger } from './middleware';

export const useStore = create<State>()(
  logger(
    (set) => ({
      count: 0,
      increment: () => set((state) => ({ count: state.count + 1 })),
    }),
    'CounterStore' // Store name for logs
  )
);
```

**Output**:

```
🔄 CounterStore Update
  Previous: { count: 0 }
  Next: { count: 1 }
```

### 3. Combining Middleware

```tsx
import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import { logger, createPersistOptions } from './middleware';

export const useStore = create<State>()(
  devtools(
    logger(
      persist(
        (set) => ({
          // ... store implementation
        }),
        createPersistOptions('my-store', 1)
      ),
      'MyStore'
    ),
    { name: 'MyStore' }
  )
);
```

**Order matters**:

1. `devtools` (outermost) - Redux DevTools integration
2. `logger` - Console logging
3. `persist` (innermost) - localStorage persistence

## Custom Storage

The `customStorage` implementation handles errors gracefully:

```tsx
// Handles quota exceeded errors
// Handles private browsing mode
// Logs errors without breaking the app
```

## Version Migration

Handle breaking changes in persisted state:

```tsx
const persistOptions = {
  name: 'my-store',
  version: 2,
  migrate: (persistedState: any, version: number) => {
    if (version === 0) {
      // v0 -> v1: rename field
      return {
        ...persistedState,
        newField: persistedState.oldField,
      };
    }
    if (version === 1) {
      // v1 -> v2: add default value
      return {
        ...persistedState,
        anotherField: 'default',
      };
    }
    return persistedState;
  },
};
```

## Best Practices

1. **Use persist for**:
   - Cart items
   - User preferences (theme, language)
   - Form drafts
   - Auth state (user data, not tokens)

2. **Don't persist**:
   - UI state (modals, drawers)
   - Temporary data
   - Sensitive tokens (use memory only)

3. **Use logger in development**:
   - Automatically disabled in production
   - Helps debug state changes
   - Shows before/after snapshots

4. **Version your stores**:
   - Increment version on breaking changes
   - Provide migration logic
   - Test migrations thoroughly

## Example: Full Store Setup

```tsx
import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import { logger, createPersistOptions } from './middleware';

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
}

export const useCartStore = create<CartState>()(
  devtools(
    logger(
      persist(
        (set) => ({
          items: [],
          addItem: (item) =>
            set((state) => ({
              items: [...state.items, item],
            })),
          removeItem: (id) =>
            set((state) => ({
              items: state.items.filter((i) => i.id !== id),
            })),
        }),
        createPersistOptions('cart-store', 1)
      ),
      'CartStore'
    ),
    { name: 'CartStore' }
  )
);
```

This gives you:

- ✅ Redux DevTools integration
- ✅ Console logging in dev
- ✅ localStorage persistence
- ✅ Error handling
- ✅ Version migration support
