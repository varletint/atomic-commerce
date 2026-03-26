export const env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api",
  appUrl: import.meta.env.VITE_APP_URL || "http://localhost:5173",
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
  stripePublicKey: import.meta.env.VITE_STRIPE_PUBLIC_KEY || "",
  googleAnalyticsId: import.meta.env.VITE_GA_ID || "",
} as const;
