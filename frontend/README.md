# Frontend Documentation

A Next.js 15 app (React 19) for The First for Building platform. This README gives a high-level overview. For deep dives, see the docs in `docs/`.

## Tech Stack

-   Next.js `15.5.2` (App Router)
-   React `19.1.0`
-   Tailwind CSS `^4`
-   @tanstack/react-query `^5` (server-state)
-   Zustand `^4.4.0` (client-state)
-   Zod `^3.22.0` (validation)
-   Axios `^1.6.0` (HTTP)
-   react-hook-form `^7.47.0` + @hookform/resolvers
-   react-hot-toast (notifications)
-   js-cookie (not currently used for token)
-   lucide-react (icons), swiper, framer-motion

## Project Structure

```
frontend/
├─ app/                 # Next.js app router (pages, layouts)
│  ├─ layout.js         # Root layout – wraps Theme, Query, AuthGuard
│  ├─ globals.css       # Global styles
│  ├─ page.js           # Home page
│  ├─ auth/
│  │  ├─ register/page.jsx
│  │  ├─ verify-otp/page.jsx
│  │  ├─ set-password/page.jsx
│  │  └─ complete-profile/page.jsx
│  ├─ dashboard/page.jsx
│  └─ profile/page.jsx
├─ components/
│  ├─ layout/           # AppProvider, AuthGuard, ThemeProvider, AuthLayout
│  ├─ auth/             # PhoneInput, PasswordInput, OtpInput
│  └─ ui/               # Button, Card, Input, Select, ThemeToggle, etc.
├─ config/
│  └─ constants.js      # ENV, API_ENDPOINTS, ROUTES, STORAGE_KEYS, QUERY_KEYS
├─ hooks/
│  ├─ useAuth.js        # Auth flow mutations (register, login, etc.)
│  └─ useData.js        # Data fetching hooks (cities, professions, ...)
├─ lib/
│  ├─ api/
│  │  ├─ client.js      # Axios instance + interceptors
│  │  ├─ auth.js        # Auth endpoints
│  │  └─ data.js        # Data endpoints
│  ├─ utils/
│  │  ├─ storage.js     # localStorage token & user helpers
│  │  └─ index.js       # misc utilities (cn, debounce, formatTime, ...)
│  └─ validations/
│     └─ auth.js        # Zod schemas for auth & profile
├─ store/
│  ├─ auth.js           # Auth state (Zustand) with registration flow helpers
│  └─ app.js            # UI + catalog state (theme, language, cities, ...)
├─ tailwind.css         # Tailwind v4 entry + theme tokens
└─ package.json         # Scripts & dependencies
```

## Quick Start

-   Prereqs: Node 18+
-   Environment: set `NEXT_PUBLIC_API_URL` to backend API base.

Install & run:

```bash
pnpm i # or npm i / yarn
pnpm dev # next dev --turbopack
```

Build & start:

```bash
pnpm build
pnpm start
```

## Key Concepts

-   Providers are composed in `app/layout.js`:
    -   `AppProvider` wraps React Query and initializes auth store on mount.
    -   `ThemeProvider` handles light/dark theme.
    -   `AuthGuard` centralizes routing rules for public/auth/protected flows.
-   Token storage: saved in `localStorage` (see `lib/utils/storage.js`) and injected by Axios `Authorization` header in `lib/api/client.js`.
-   Auth flow is guided by `store/auth.js` profile steps and route helpers.

## Documentation Index

-   docs/ARCHITECTURE.md
-   docs/ROUTES.md
-   docs/STATE_MANAGEMENT.md
-   docs/API_CLIENT.md
-   docs/COMPONENTS.md
-   docs/STYLING.md
-   docs/VALIDATIONS.md
-   docs/UTILITIES.md
