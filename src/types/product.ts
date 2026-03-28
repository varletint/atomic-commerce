import type { BaseEntity } from './common';

/* ─────────────────────────────────────────────
 *  Sub-types (mirror backend schema)
 * ───────────────────────────────────────────── */

export interface ProductImage {
  url: string;
  altText?: string;
  sortOrder: number;
  isPrimary: boolean;
}

export interface VariantOption {
  name: string; // e.g. "Size", "Color", "Material"
  value: string; // e.g. "M", "Red", "Cotton"
}

export interface ProductVariant {
  _id: string;
  sku: string;
  variantOptions: VariantOption[];
  price: number;
  compareAtPrice?: number;
  costPrice?: number;
  weight?: number;
  images?: ProductImage[];
  isActive: boolean;
}

export interface ProductSeo {
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
}

export interface ProductDimensions {
  length?: number;
  width?: number;
  height?: number;
  unit: 'cm' | 'in';
}

/** Color info used by the UI for swatch rendering */
export interface ProductColor {
  name: string;
  hex: string;
  image?: string;
}

/* ─────────────────────────────────────────────
 *  Main Product interface (matches backend ProductWithStock)
 * ───────────────────────────────────────────── */

export interface Product extends BaseEntity {
  sku: string;
  slug: string;
  name: string;
  shortDescription?: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  costPrice?: number;
  category: string;
  brand?: string;
  tags: string[];
  productType: 'physical' | 'digital' | 'service';

  // Images (object array, not plain strings)
  images: ProductImage[];

  // Variants
  hasVariants: boolean;
  variants: ProductVariant[];
  variantOptionNames: string[]; // e.g. ["Size", "Color"]

  // Shipping / physical
  weight?: number;
  weightUnit: 'g' | 'kg' | 'lb' | 'oz';
  dimensions?: ProductDimensions;
  material?: string;
  careInstructions?: string;

  // Merchandising
  isFeatured: boolean;
  avgRating: number;
  reviewCount: number;
  minOrderQty: number;

  // SEO
  seo?: ProductSeo;

  isActive: boolean;

  // Stock (from ProductWithStock merge)
  stock: number;
  reserved: number;
  available: number;
}

export interface ProductCategory extends BaseEntity {
  name: string;
  slug: string;
  description?: string;
  image?: string;
}

/* ─────────────────────────────────────────────
 *  Utility helpers — extract display-friendly
 *  data from the variant-based structure
 * ───────────────────────────────────────────── */

/**
 * Extract unique color values from a product's variants.
 * Looks for variant options named "Color" (case-insensitive).
 */
export function getUniqueColors(product: Product): string[] {
  if (!product.hasVariants || !product.variants.length) return [];
  const colorSet = new Set<string>();
  for (const v of product.variants) {
    for (const opt of v.variantOptions) {
      if (opt.name.toLowerCase() === 'color') {
        colorSet.add(opt.value);
      }
    }
  }
  return Array.from(colorSet);
}

/**
 * Extract unique size values from a product's variants.
 * Looks for variant options named "Size" (case-insensitive).
 */
export function getUniqueSizes(product: Product): string[] {
  if (!product.hasVariants || !product.variants.length) return [];
  const sizeSet = new Set<string>();
  for (const v of product.variants) {
    for (const opt of v.variantOptions) {
      if (opt.name.toLowerCase() === 'size') {
        sizeSet.add(opt.value);
      }
    }
  }
  return Array.from(sizeSet);
}

/**
 * Get the primary image URL, falling back to first image or empty string.
 */
export function getPrimaryImageUrl(product: Product): string {
  const primary = product.images.find((img) => img.isPrimary);
  return primary?.url ?? product.images[0]?.url ?? '';
}

/**
 * Get unique values for any variant option name (generic helper).
 */
export function getUniqueOptionValues(product: Product, optionName: string): string[] {
  if (!product.hasVariants || !product.variants.length) return [];
  const values = new Set<string>();
  const normalized = optionName.toLowerCase();
  for (const v of product.variants) {
    for (const opt of v.variantOptions) {
      if (opt.name.toLowerCase() === normalized) {
        values.add(opt.value);
      }
    }
  }
  return Array.from(values);
}
