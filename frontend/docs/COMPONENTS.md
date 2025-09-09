# Components Guide

This guide documents the main layout and UI components, their props, and usage patterns. File paths are relative to `frontend/`.

## Layout Components

### AppProvider – `components/layout/AppProvider.jsx`

-   Wraps React Query (`QueryClientProvider`) and renders a global `Toaster`.
-   Calls `useAuthStore().initialize()` on mount to hydrate auth state.
-   Props: `{ children }` only.

### ThemeProvider – `components/layout/ThemeProvider.jsx`

-   Applies `data-theme` attribute to `<html>` based on Zustand `store/app.js` `theme` state.
-   Props: `{ children }` only.

### AuthGuard – `components/layout/AuthGuard.jsx`

-   Client-side guard handling redirects for public, auth, and protected routes.
-   Shows `LoadingSpinner` while `isLoading` is true.
-   Props: `{ children }` only.

### AuthLayout – `components/layout/AuthLayout.jsx`

-   Auth pages wrapper with a centered card layout and `ThemeToggle` button.
-   Props: `{ children }` only.

## UI Primitives

### Button – `components/ui/Button.jsx`

Props:

-   `variant`: `'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'` (default: `primary`)
-   `size`: `'sm' | 'md' | 'lg' | 'xl'` (default: `md`)
-   `loading`: boolean, shows spinner and disables
-   `disabled`: boolean
-   `className`, `...props` are forwarded to `<button>`

Example:

```jsx
<Button variant="primary" size="lg" loading={isSubmitting}>
    Submit
</Button>
```

### Card – `components/ui/Card.jsx`

Exports:

-   `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`

Example:

```jsx
<Card>
    <CardHeader>
        <CardTitle>Title</CardTitle>
        <CardDescription>Subtitle</CardDescription>
    </CardHeader>
    <CardContent>Body</CardContent>
</Card>
```

### ThemedCard – `components/ui/ThemedCard.jsx`

Exports:

-   `ThemedCard`, `ThemedCardHeader`, `ThemedCardTitle`, `ThemedCardDescription`, `ThemedCardContent`
-   Adds dark-mode friendly defaults to `Card` parts.

### Input – `components/ui/Input.jsx`

Props:

-   `label`, `placeholder`, `type` (default: `text`), `error`, `required`, `className`, others forwarded to `<input>`

### Select – `components/ui/Select.jsx`

Props:

-   `label`, `error`, `placeholder`, `required`, children `<option>`, `className`, others forwarded to `<select>`

### LoadingSpinner – `components/ui/LoadingSpinner.jsx`

Props:

-   `size`: `'small' | 'default' | 'large'` (default: `default`)
-   `text`: string (default: `"Loading..."`)

### ThemeToggle – `components/ui/ThemeToggle.jsx`

-   Uses `useTheme()` to toggle between light and dark themes.
-   Props: `className`.

## Auth Components

### PhoneInput – `components/auth/PhoneInput.jsx`

Props:

-   `phone`, `countryCode`
-   `onPhoneChange(value)`, `onCountryCodeChange(value)`
-   `phoneError`, `countryCodeError`
-   `disabled` Notes:
-   Fetches countries via `useCountries()`; shows phone code in input.

### PasswordInput – `components/auth/PasswordInput.jsx`

Props:

-   `label`, `placeholder`, `value`, `onChange`, `error`, `disabled`
-   `showStrength`: boolean – displays strength meter and password tips

### OtpInput – `components/auth/OtpInput.jsx`

Props:

-   `value`: 4-digit string, `onChange(value)`
-   `error`, `disabled` Behavior:
-   Manages 4 separate inputs, handles paste, auto-advance, and backspace focus.

## Usage Patterns

-   Prefer UI primitives for consistent styles and accessibility.
-   Combine with `react-hook-form` via `register` or controlled values as shown in pages under `app/auth/*`.
