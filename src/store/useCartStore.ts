import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, Product, SelectedVariant } from '@/types';
import { STORAGE_KEYS } from '@/constants';
import { cartApi } from '@/features/cart/api/cartApi';
import { useAuthStore } from './useAuthStore';

interface CartState {
  items: CartItem[];
  isSyncing: boolean;

  // Core actions (used by all consumers — same interface as before)
  addItem: (product: Product, quantity?: number, selectedVariant?: SelectedVariant) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;

  // Backend sync actions (called explicitly, NOT from useEffect)
  syncCartFromServer: () => Promise<void>;
  mergeLocalCartToServer: () => Promise<void>;
}

/** Check auth state without subscribing (no hook, no useEffect) */
const isAuthenticated = () => useAuthStore.getState().isAuthenticated;

/** Generate a deterministic cart‐line ID based on product + selected variant */
const generateCartItemId = (productId: string, selectedVariant?: SelectedVariant) => {
  if (!selectedVariant || Object.keys(selectedVariant).length === 0) {
    return productId;
  }
  const variantString = Object.entries(selectedVariant)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}:${v}`)
    .join('|');
  return `${productId}-${variantString}`;
};

/** Extract the raw productId (MongoDB _id) from a cart‐item id */
const extractProductId = (cartItemId: string): string => {
  // If the ID contains a variant suffix (e.g. "abc123-Size:M|Color:Red"), strip it
  const dashIdx = cartItemId.indexOf('-');
  // MongoDB ObjectIds are 24 hex chars — only strip if there's a variant suffix
  if (dashIdx === 24) return cartItemId.substring(0, 24);
  return cartItemId;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isSyncing: false,

      /* ── Add Item ─────────────────────────────── */
      addItem: (product, quantity = 1, selectedVariant) => {
        // Resolve the actual product ID — backend returns _id, but TS type says id
        const pid = (product as any)._id ?? product.id;

        // 1. Optimistic local update
        set((state) => {
          const cartItemId = generateCartItemId(pid, selectedVariant);
          const existingItem = state.items.find((item) => item.id === cartItemId);

          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.id === cartItemId ? { ...item, quantity: item.quantity + quantity } : item
              ),
            };
          }

          return {
            items: [
              ...state.items,
              {
                id: cartItemId,
                product,
                selectedVariant,
                quantity,
                price: product.price,
              },
            ],
          };
        });

        // 2. Sync to backend (fire-and-forget, no useEffect)
        if (isAuthenticated()) {
          cartApi.addItem(pid, quantity).catch(console.error);
        }
      },

      /* ── Remove Item ──────────────────────────── */
      removeItem: (cartItemId) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== cartItemId),
        }));

        if (isAuthenticated()) {
          const productId = extractProductId(cartItemId);
          cartApi.removeItem(productId).catch(console.error);
        }
      },

      /* ── Update Quantity ──────────────────────── */
      updateQuantity: (cartItemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(cartItemId);
          return;
        }

        set((state) => ({
          items: state.items.map((item) => (item.id === cartItemId ? { ...item, quantity } : item)),
        }));

        if (isAuthenticated()) {
          const productId = extractProductId(cartItemId);
          cartApi.updateQuantity(productId, quantity).catch(console.error);
        }
      },

      /* ── Clear Cart ───────────────────────────── */
      clearCart: () => {
        set({ items: [] });

        if (isAuthenticated()) {
          cartApi.clearCart().catch(console.error);
        }
      },

      /* ── Computed ──────────────────────────────── */
      getTotal: () => get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),

      getItemCount: () => get().items.reduce((count, item) => count + item.quantity, 0),

      /* ── Sync: Pull server → local ────────────── */
      syncCartFromServer: async () => {
        if (!isAuthenticated()) return;

        set({ isSyncing: true });
        try {
          const serverCart = await cartApi.getCart();

          // Map backend items to frontend CartItem shape.
          // We don't have the full Product object from the backend cart,
          // so we build a lightweight stub that satisfies the UI.
          const mappedItems: CartItem[] = serverCart.items.map((item) => ({
            id: item.product, // productId is the cart line ID for non-variant items
            product: {
              id: item.product,
              name: item.productName,
              price: item.currentPrice,
              available: item.available,
              // Minimal stubs for required Product fields
              sku: '',
              slug: '',
              description: '',
              category: '',
              tags: [],
              productType: 'physical' as const,
              images: [],
              hasVariants: false,
              variants: [],
              variantOptionNames: [],
              weightUnit: 'g' as const,
              isFeatured: false,
              avgRating: 0,
              reviewCount: 0,
              minOrderQty: 1,
              isActive: true,
              stock: item.available,
              reserved: 0,
              createdAt: '',
              updatedAt: '',
            },
            quantity: item.quantity,
            price: item.currentPrice,
          }));

          set({ items: mappedItems, isSyncing: false });
        } catch (error) {
          console.error('[Cart] Failed to sync from server:', error);
          set({ isSyncing: false });
        }
      },

      /* ── Merge: Push local → server ───────────── */
      mergeLocalCartToServer: async () => {
        if (!isAuthenticated()) return;

        const localItems = get().items;
        if (localItems.length === 0) return;

        try {
          // Push each local item to the server sequentially
          // (backend addItem merges quantity if item already exists)
          for (const item of localItems) {
            const productId = extractProductId(item.id);
            await cartApi.addItem(productId, item.quantity);
          }
        } catch (error) {
          console.error('[Cart] Failed to merge local cart to server:', error);
        }
      },
    }),
    {
      name: STORAGE_KEYS.CART,
      partialize: (state) => ({ items: state.items }),
    }
  )
);
