export const PRODUCT_SORT_OPTIONS = [
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Name: A to Z', value: 'name-asc' },
  { label: 'Name: Z to A', value: 'name-desc' },
  { label: 'Newest First', value: 'createdAt-desc' },
  { label: 'Best Rated', value: 'avgRating-desc' },
] as const;
