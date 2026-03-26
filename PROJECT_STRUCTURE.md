# Project Structure

## Complete Directory Tree

```
atomic-oder/
├── public/
│   ├── favicon.svg
│   ├── icons.svg
│   ├── robots.txt
│   └── sitemap.xml
├── src/
│   ├── api/                    # API layer
│   │   ├── axios.ts           # Axios instance with interceptors
│   │   ├── endpoints.ts       # API endpoint constants
│   │   └── types.ts           # API request/response types
│   ├── assets/                 # Static assets
│   │   ├── images/
│   │   └── icons/
│   ├── components/             # Reusable components
│   │   ├── ui/                # Base UI components
│   │   ├── layout/            # Layout components
│   │   ├── shared/            # Shared business components
│   │   └── seo/               # SEO components
│   │       ├── MetaTags.tsx
│   │       ├── JsonLd.tsx
│   │       └── index.ts
│   ├── config/                 # App configuration
│   │   ├── env.ts             # Environment variables
│   │   ├── routes.ts          # Route constants
│   │   ├── seo.ts             # SEO config
│   │   └── index.ts
│   ├── constants/              # App constants
│   │   ├── app.ts             # App name, version, defaults
│   │   ├── queryKeys.ts       # React Query keys
│   │   ├── storageKeys.ts     # localStorage keys
│   │   ├── regex.ts           # Validation patterns
│   │   └── index.ts
│   ├── errors/                 # Error handling
│   │   ├── AppError.ts        # Base error class
│   │   ├── ApiError.ts        # API-specific errors
│   │   ├── errorMessages.ts   # Error strings
│   │   ├── ErrorBoundary.tsx  # React error boundary
│   │   └── index.ts
│   ├── features/               # Feature modules
│   │   └── products/
│   │       ├── api/           # Feature-scoped API
│   │       │   └── productApi.ts
│   │       ├── components/
│   │       │   ├── ProductCard.tsx
│   │       │   ├── ProductGrid.tsx
│   │       │   └── index.ts
│   │       ├── hooks/
│   │       │   ├── useProducts.ts
│   │       │   └── index.ts
│   │       ├── constants.ts
│   │       ├── types.ts
│   │       └── index.ts
│   ├── guards/                 # Route guards
│   │   ├── AuthGuard.tsx
│   │   ├── GuestGuard.tsx
│   │   └── index.ts
│   ├── hooks/                  # Global custom hooks
│   │   ├── useDebounce.ts
│   │   ├── useLocalStorage.ts
│   │   ├── useMediaQuery.ts
│   │   └── index.ts
│   ├── lib/                    # Third-party configs
│   │   └── react-query.ts
│   ├── providers/              # React providers
│   │   ├── AppProviders.tsx   # Composed providers
│   │   ├── QueryProvider.tsx
│   │   └── index.ts
│   ├── schemas/                # Zod validation schemas
│   │   ├── common.schema.ts
│   │   ├── auth.schema.ts
│   │   ├── product.schema.ts
│   │   ├── order.schema.ts
│   │   └── index.ts
│   ├── services/               # Cross-cutting services
│   │   └── analyticsService.ts
│   ├── types/                  # Global TypeScript types
│   │   ├── common.ts
│   │   ├── user.ts
│   │   ├── product.ts
│   │   ├── cart.ts
│   │   ├── order.ts
│   │   ├── api.ts
│   │   └── index.ts
│   ├── utils/                  # Utility functions
│   │   ├── format.ts          # Formatting helpers
│   │   ├── storage.ts         # Storage helpers
│   │   ├── helpers.ts         # General helpers
│   │   └── index.ts
│   ├── App.tsx
│   └── main.tsx
├── .env.example
├── .gitignore
├── .prettierrc
├── eslint.config.js
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## Key Principles

### 1. Feature-Based Organization

Each feature owns its code (API, components, hooks, types):

- `features/products/` - Product listing, detail, filters
- `features/cart/` - Shopping cart functionality
- `features/checkout/` - Checkout flow
- `features/auth/` - Authentication
- `features/orders/` - Order management

### 2. Barrel Exports (index.ts)

Every folder re-exports cleanly to avoid deep imports:

```ts
// Instead of:
import { ProductCard } from '@/features/products/components/ProductCard';

// Use:
import { ProductCard } from '@/features/products';
```

### 3. Separation of Concerns

- `api/` - HTTP client configuration
- `services/` - Business logic (analytics, payments)
- `features/*/api/` - Feature-specific API calls
- `types/` - Shared TypeScript definitions
- `schemas/` - Shared validation rules

### 4. Configuration Management

- `config/env.ts` - Environment variables
- `config/routes.ts` - Route constants
- `config/seo.ts` - SEO defaults
- `constants/` - App-wide constants

### 5. Error Handling

- Custom error classes (`AppError`, `ApiError`)
- Error boundary component
- Centralized error messages
- Axios interceptors for API errors

### 6. Type Safety

- Centralized type definitions
- Zod schemas for runtime validation
- Generic API response types
- Feature-specific types

## Next Steps

1. Install dependencies:

```bash
cd atomic-oder
npm install
```

2. Create `.env.local`:

```bash
cp .env.example .env.local
```

3. Add remaining features:

- `features/cart/`
- `features/checkout/`
- `features/auth/`
- `features/orders/`

4. Add UI components:

- `components/ui/Button.tsx`
- `components/ui/Input.tsx`
- `components/ui/Card.tsx`
- `components/layout/Header.tsx`
- `components/layout/Footer.tsx`

5. Set up routing with React Router
6. Implement authentication flow
7. Add testing infrastructure
