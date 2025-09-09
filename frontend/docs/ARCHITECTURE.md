# Architecture Overview

This document explains how the frontend is structured and how data flows across layers.

## High-Level Layers

-   UI (components and pages) in `app/` and `components/`
-   Client state in `store/` (Zustand)
-   Server state and async mutations in React Query via hooks in `hooks/`
-   API access through Axios client in `lib/api/`
-   Validation and utilities in `lib/`
-   Configuration constants in `config/constants.js`

## Providers Composition

Defined in `app/layout.js`:

-   `AppProvider` (`components/layout/AppProvider.jsx`)
    -   Creates a `QueryClient` and wraps the app with `QueryClientProvider`.
    -   Calls `useAuthStore().initialize()` on mount to hydrate auth state from `localStorage` and validate the session using `authApi.getMe()`.
    -   Displays `react-hot-toast` `Toaster`.
-   `ThemeProvider` (`components/layout/ThemeProvider.jsx`)
    -   Reads `theme` from `store/app.js` and applies it via `document.documentElement.dataset.theme`.
-   `AuthGuard` (`components/layout/AuthGuard.jsx`)
    -   Centralizes routing logic for public, auth flow, and protected routes.
    -   Inspects `useAuthStore()` state to determine redirects.

## Routing Model (App Router)

-   Pages live under `app/` (e.g., `app/auth/register/page.jsx`).
-   `AuthGuard` gatekeeps navigation at runtime (client side), inspecting:
    -   `PUBLIC_ROUTES`: `/`
    -   `AUTH_ROUTES`: `/auth/register`, `/auth/verify-otp`, `/auth/set-password`, `/auth/login`, `/auth/complete-profile`
    -   `PROTECTED_ROUTES`: `/dashboard`, `/profile`, `/products`, `/ads`, `/affiliate`, `/city`

## Authentication Flow

-   Registration and login flows are implemented as React Query mutations in `hooks/useAuth.js` calling `lib/api/auth.js`.
-   Persistent pieces:
    -   Token and basic user info stored in `localStorage` via `lib/utils/storage.js` helpers.
    -   A subset of registration data persisted by Zustand `persist` in `store/auth.js` to guide multi-step flow even across reloads.
-   Axios `apiClient` (`lib/api/client.js`):
    -   Adds `Authorization: Bearer <token>` if `getToken()` returns a value.
    -   On `401`, clears token and redirects to `/auth/login`.
    -   On forbidden + profile incomplete, redirects to `/auth/complete-profile`.

## Data Flow

1. UI triggers hook mutation (`hooks/useAuth.js`).
2. Hook calls endpoint method from `lib/api/auth.js` or `lib/api/data.js`.
3. Axios client `lib/api/client.js` injects token and handles errors.
4. On success, hooks update Zustand stores via `useAuthStore` or `useAppStore` actions.
5. Components re-render from store changes; navigation may be adjusted by `AuthGuard`.

## State Sources

-   Client state (`store/auth.js`, `store/app.js`) – UI prefs and session.
-   Server state (`@tanstack/react-query`) – fetched lists like cities/professions (via `hooks/useData.js`).

## Validation

-   Forms validated with Zod schemas from `lib/validations/auth.js` integrated using `react-hook-form` + `zodResolver`.

## Files Map

-   Entry layout: `app/layout.js`
-   Auth pages: `app/auth/*/page.jsx`
-   Dashboard: `app/dashboard/page.jsx`
-   Profile: `app/profile/page.jsx`
-   Providers: `components/layout/*.jsx`
-   UI Primitives: `components/ui/*.jsx`
-   Auth store: `store/auth.js`
-   App store: `store/app.js`
-   API client: `lib/api/client.js`
-   Auth API: `lib/api/auth.js`
-   Data API: `lib/api/data.js`
-   Storage helpers: `lib/utils/storage.js`
-   Misc utils: `lib/utils/index.js`
-   Validation schemas: `lib/validations/auth.js`
-   Constants: `config/constants.js`
