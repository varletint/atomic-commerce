import { useCartStore } from '@/store';
import { Product } from '@/types';

export function useCart() {
  const { items, addItem, removeItem, updateQuantity, clearCart, getTotal, getItemCount } =
    useCartStore();

  const addToCart = (product: Product, quantity = 1) => {
    addItem(product, quantity);
    // Optional: Show toast notification
  };

  const removeFromCart = (productId: string) => {
    removeItem(productId);
    // Optional: Show toast notification
  };

  return {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    total: getTotal(),
    itemCount: getItemCount(),
  };
}
