# Styling and Theming

This project uses Tailwind CSS v4 with a tokens-first approach and dark-mode via a `data-theme` attribute on `<html>`.

## Tailwind Entry and Global Styles

-   Tailwind is imported in `app/globals.css` and `tailwind.css` at repository root.
-   The app uses `@theme` to define CSS variables for colors, fonts, and animations.
-   Global layers are defined in `app/globals.css` under `@layer base`, `@layer components`, and `@layer utilities`.

Key files:

-   `app/globals.css` – primary Tailwind entry and theme tokens used by the app
-   `tailwind.css` – additional theme variables (kept for compatibility, but `app/globals.css` is the source of truth in this codebase)

## Dark Mode

-   Implemented using Tailwind v4 `@custom-variant dark` and `[data-theme="dark"]` attribute selectors.
-   `ThemeProvider` (`components/layout/ThemeProvider.jsx`) and `useTheme()` (`hooks/useTheme.js`) set `data-theme` on `document.documentElement`.

Usage:

```jsx
// Root layout sets RTL and relies on ThemeProvider
<html lang="ar" dir="rtl" suppressHydrationWarning>
  <body>...
```

## Theme Tokens

Defined in `app/globals.css` `@theme` block:

-   Primary scale: `--color-primary-50` … `--color-primary-900`
-   Secondary scale: `--color-secondary-50` … `--color-secondary-900`
-   Dark palette: `--color-dark-50` … `--color-dark-950`
-   Font families: `--font-sans`, `--font-arabic`
-   Animations: `--animate-fade-in`, `--animate-slide-up`, `--animate-pulse-slow`

Global CSS variables for backgrounds, text, and borders are set on `:root` and overridden in `[data-theme="dark"]`.

## Components Layer

`@layer components` includes examples like `.card`, `.input`, and `.btn-primary` that adapt to dark mode with `@dark` variant.

## Utilities Layer

`@layer utilities` defines helpers like `.animate-fade-in` and `.animate-slide-up` with corresponding keyframes.

## RTL Support

-   The app root sets `dir="rtl"` in `app/layout.js` (`<html lang="ar" dir="rtl">`).
-   Additional RTL helpers are included in `app/globals.css` (e.g., `.space-x-reverse` override).

## Theming in Components

-   UI components use Tailwind classes referencing the theme (e.g., `bg-primary-600`, `text-secondary-700`).
-   `ThemedCard` variants (`components/ui/ThemedCard.jsx`) provide pre-styled Card pieces for dark and light themes.

## Best Practices

-   Prefer using existing UI primitives (`Button`, `Input`, `Select`, `Card` parts) to keep styles consistent.
-   Use `cn()` from `lib/utils/index.js` to concatenate conditional classes cleanly.
-   For new design tokens, add them to `app/globals.css` `@theme` block.
