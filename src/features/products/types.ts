export interface ProductFilters {
  category?: string;
  brand?: string;
  tag?: string;
  isFeatured?: boolean;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sortBy?: 'price' | 'name' | 'createdAt' | 'avgRating';
  sortOrder?: 'asc' | 'desc';
  colors?: string[];
  sizes?: string[];
  material?: string;
  inStock?: boolean;
  tags?: string[];
}
