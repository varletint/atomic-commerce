export const env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || '/api',
  appUrl: import.meta.env.VITE_APP_URL || 'http://localhost:5173',
  /** Relative path or absolute URL for OG/Twitter when a page has no image (must be crawlable; prefer PNG/JPEG ≥1200×630 — SVG often fails on Facebook). */
  ogDefaultImage: import.meta.env.VITE_OG_DEFAULT_IMAGE || '/favicon.svg',
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
  stripePublicKey: import.meta.env.VITE_STRIPE_PUBLIC_KEY || '',
  googleAnalyticsId: import.meta.env.VITE_GA_ID || '',
} as const;
