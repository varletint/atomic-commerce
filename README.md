# Atomic Order - Ecommerce Platform

Modern, scalable ecommerce frontend built with React, TypeScript, and Vite.

## Tech Stack

- React 19 + TypeScript
- Vite 8
- React Query (TanStack Query)
- Axios
- Zod (validation)
- React Router

## Project Structure

```
src/
├── api/          # API client & endpoints
├── components/   # Reusable UI components
├── config/       # App configuration
├── constants/    # App constants & keys
├── errors/       # Error handling
├── features/     # Feature modules
├── guards/       # Route guards
├── hooks/        # Custom hooks
├── lib/          # Third-party configs
├── providers/    # React providers
├── schemas/      # Zod validation schemas
├── services/     # Business logic services
├── types/        # TypeScript types
└── utils/        # Utility functions
```

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Copy environment variables:

```bash
cp .env.example .env.local
```

3. Start development server:

```bash
npm run dev
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Features

- Feature-based architecture
- Type-safe API layer with Axios interceptors
- Centralized state management
- SEO optimization
- Error boundaries
- Route guards
- Form validation with Zod
- Responsive design ready
