export const QUERY_KEYS = {
  AUTH: {
    ME: ["auth", "me"] as const,
  },
  PRODUCTS: {
    ALL: ["products"] as const,
    LIST: (params?: Record<string, unknown>) =>
      ["products", "list", params] as const,
    DETAIL: (id: string) => ["products", "detail", id] as const,
    SEARCH: (query: string) => ["products", "search", query] as const,
    CATEGORIES: ["products", "categories"] as const,
  },
  CART: {
    GET: ["cart"] as const,
  },
  ORDERS: {
    ALL: ["orders"] as const,
    LIST: (params?: Record<string, unknown>) =>
      ["orders", "list", params] as const,
    DETAIL: (id: string) => ["orders", "detail", id] as const,
  },
} as const;
