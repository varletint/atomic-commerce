export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sortBy?: 'price' | 'name' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  colors?: string[];
  sizes?: string[];
  material?: string;
  inStock?: boolean;
  tags?: string[];
}
