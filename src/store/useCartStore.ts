import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, Product, SelectedVariant } from '@/types';
import { STORAGE_KEYS } from '@/constants';

interface CartState {
  items: CartItem[];
  addItem: (product: Product, quantity?: number, selectedVariant?: SelectedVariant) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

// Helper to generate a unique ID for a cart line item based on the product and chosen variants
const generateCartItemId = (productId: string, selectedVariant?: SelectedVariant) => {
  if (!selectedVariant || Object.keys(selectedVariant).length === 0) {
    return productId;
  }
  // Sort keys to ensure consistent ID generation regardless of object key order
  const variantString = Object.entries(selectedVariant)
    .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
    .map(([key, value]) => `${key}:${value}`)
    .join('|');

  return `${productId}-${variantString}`;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, quantity = 1, selectedVariant) => {
        set((state) => {
          const cartItemId = generateCartItemId(product.id, selectedVariant);
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
                id: cartItemId, // Use deterministic ID instead of random UUID
                product,
                selectedVariant,
                quantity,
                price: product.price,
              },
            ],
          };
        });
      },

      removeItem: (cartItemId) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== cartItemId),
        }));
      },

      updateQuantity: (cartItemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(cartItemId);
          return;
        }

        set((state) => ({
          items: state.items.map((item) => (item.id === cartItemId ? { ...item, quantity } : item)),
        }));
      },

      clearCart: () => set({ items: [] }),

      getTotal: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      },

      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: STORAGE_KEYS.CART,
    }
  )
);
