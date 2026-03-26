import type { BaseEntity } from './common';

export interface ProductColor {
  name: string;
  hex: string;
  image?: string;
}

export interface ProductVariant {
  id: string;
  color: string;
  size: string;
  stock: number;
  sku: string;
  price?: number;
}

export interface Product extends BaseEntity {
  name: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  category: string;
  stock: number;
  sku: string;
  slug: string;
  colors: ProductColor[];
  sizes: string[];
  material?: string;
  weight?: number;
  tags: string[];
  rating?: number;
  reviewCount?: number;
  variants: ProductVariant[];
}

export interface ProductCategory extends BaseEntity {
  name: string;
  slug: string;
  description?: string;
  image?: string;
}
