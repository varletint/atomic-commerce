import type { Product } from './product';

export interface SelectedVariant {
  [optionName: string]: string; // e.g., { "Size": "M", "Color": "Obsidian Black" }
}

export interface CartItem {
  id: string; // The unique cart line item ID (productId + stringified variants)
  product: Product;
  selectedVariant?: SelectedVariant;
  quantity: number;
  price: number;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
}
