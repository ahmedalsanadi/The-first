# Routes and Navigation

This app uses the Next.js App Router under `app/` with client-side runtime guards.

## Route Types

-   Public
    -   `/` (home)
-   Auth Flow
    -   `/auth/register`
    -   `/auth/verify-otp`
    -   `/auth/set-password`
    -   `/auth/complete-profile`
    -   `/auth/login`
-   Protected
    -   `/dashboard`
    -   `/profile`
    -   (future) `/products`, `/ads`, `/affiliate`, `/city`

See `components/layout/AuthGuard.jsx` for the guard logic.

## Guard Logic Overview

-   While loading auth state, a loading spinner renders.
-   If authenticated:
    -   Visiting any auth route redirects either to `/dashboard` if `isProfileComplete()` is true or to the `getNextRequiredStep()` route if the profile is incomplete.
    -   Visiting protected routes with incomplete profile redirects to the required step (e.g., `/auth/complete-profile`).
-   If not authenticated:
    -   Public routes are allowed.
    -   Protected routes redirect to `/auth/login`.
    -   Auth routes are allowed but the guard ensures the user follows the correct step order, using `getCurrentRegistrationStep()` from `store/auth.js`.

## File Map

-   Root layout: `app/layout.js`
-   Home: `app/page.js`
-   Auth pages:
    -   Register: `app/auth/register/page.jsx`
    -   Verify OTP: `app/auth/verify-otp/page.jsx`
    -   Set Password: `app/auth/set-password/page.jsx`
    -   Complete Profile: `app/auth/complete-profile/page.jsx`
    -   Login: `app/auth/login/page.jsx`
-   Protected pages:
    -   Dashboard: `app/dashboard/page.jsx`
    -   Profile: `app/profile/page.jsx`

## Constants

`config/constants.js` defines `ROUTES` you can import throughout the app for consistency.
