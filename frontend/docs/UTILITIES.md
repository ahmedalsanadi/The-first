# Utilities and Constants

This document covers small utility helpers, storage utilities, and global constants.

## Utilities – `lib/utils/index.js`

-   `cn(...inputs)`
    -   Wrapper over `clsx` to concatenate conditional class names.
-   `formatPhone(phone, country_code)`
    -   Returns a human-readable phone string like `+967 7XXXXXXX`.
-   `validateYemenPhone(phone)`
    -   Checks 9-digit Yemen phone numbers against allowed prefixes.
-   `formatTime(seconds)`
    -   Formats seconds as `m:ss` (used in OTP countdown UIs).
-   `getInitials(name)`
    -   Derives up to 2-letter initials from a name.
-   `debounce(func, wait)`
    -   Debounces execution by `wait` ms.
-   `throttle(func, limit)`
    -   Throttles execution to once per `limit` ms.

## Storage – `lib/utils/storage.js`

Manages token and user persistence via `localStorage` keys from `config/constants.js`.

-   `setToken(token)` / `getToken()` / `removeToken()`
    -   Token is stored under `STORAGE_KEYS.TOKEN`.
    -   `removeToken()` also removes `STORAGE_KEYS.USER` to fully clear session.
-   `setUser(user)` / `getUser()`
    -   User object is serialized to JSON under `STORAGE_KEYS.USER`.

Notes:

-   Storage guards `typeof window !== 'undefined'` to avoid SSR crashes.
-   Zustand `store/auth.js` is responsible for overall auth state; storage is the persistence backing for session.

## Constants – `config/constants.js`

-   `ENV`
    -   `API_URL` – from `NEXT_PUBLIC_API_URL` or `http://localhost:8000/api`
    -   `APP_NAME`, `TOKEN_KEY`, `USER_KEY` (keys mirrored by `STORAGE_KEYS`)
-   `API_ENDPOINTS`
    -   Maps logical actions to API paths used by `lib/api/*` modules.
-   `ROUTES`
    -   Centralized route strings for pages.
-   `STORAGE_KEYS`
    -   Keys used by `lib/utils/storage.js`.
-   `QUERY_KEYS`
    -   Cache keys for React Query usage.
-   `YEMEN_PHONE_PREFIXES`
    -   Consumed by validation logic.
-   `OTP_EXPIRY_MINUTES`
    -   Used by OTP UI to show timers and resend logic.

## Extending

-   Add new API endpoints to `API_ENDPOINTS` and create a corresponding method in `lib/api/<module>.js`.
-   When adding new tokens or user fields, prefer `store/auth.js` actions and keep `lib/utils/storage.js` as a thin persistence layer.
-   For new theme tokens, update `app/globals.css` `@theme` section.
