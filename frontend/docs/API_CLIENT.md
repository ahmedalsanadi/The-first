# API Client and Endpoints

This document explains how HTTP requests are made via Axios, how tokens are attached, and what endpoint helpers exist.

## Axios Client – `lib/api/client.js`

Creates a preconfigured Axios instance:

-   `baseURL`: `ENV.API_URL` from `config/constants.js` (env var `NEXT_PUBLIC_API_URL`)
-   Default headers: JSON
-   Timeout: 10 seconds

### Request Interceptor

-   Reads token via `getToken()` from `lib/utils/storage.js`
-   If present, injects `Authorization: Bearer <token>` header
-   Logs outgoing request metadata for debugging

### Response Interceptor

-   Returns `response.data` directly on success
-   Handles errors:
    -   `401 Unauthorized`: calls `removeToken()` and hard-redirects to `/auth/login`
    -   `403` with message `Profile incomplete`: redirects to `/auth/complete-profile`
    -   `>= 500`: shows a generic toast error
-   Logs detailed error context (status, data, headers)

## Auth API – `lib/api/auth.js`

Wraps auth endpoints with simple methods that return the parsed `response.data` from Axios client:

-   `initiateRegistration(data)` → POST `/auth/initiate-registration`
-   `verifyOtp(data)` → POST `/auth/verify-otp`
-   `setPassword(data)` → POST `/auth/set-password`
-   `login(data)` → POST `/auth/login`
-   `getMe()` → GET `/auth/me`
-   `logout()` → POST `/auth/logout`
-   `refreshToken()` → POST `/auth/refresh-token`
-   `completeProfile(data)` → POST `/auth/complete-profile`

## Data API – `lib/api/data.js`

-   `getCountries()` → GET `/data/countries`
-   `getCities(countryId?)` → GET `/data/cities` with optional `country_id` param
-   `getProfessions()` → GET `/data/professions`

## Token Storage – `lib/utils/storage.js`

-   `setToken(token)` / `getToken()` / `removeToken()`
-   `setUser(user)` / `getUser()`
-   Keys are defined in `config/constants.js` (`STORAGE_KEYS.TOKEN`, `STORAGE_KEYS.USER`)

Note: Token and user are stored in `localStorage` (not cookies). Zustand `store/auth.js` persists only `registrationData`; session persistence uses the storage helpers.

## Usage Examples

### Login Flow

```js
import { useLogin } from '@/hooks/useAuth';

const { mutate: login, isPending } = useLogin();
login({ phone: '7XXXXXXX', country_code: '+967', password: 'Pass1234' });
// On success, store/auth.js → setAuth(user, token)
```

### Fetch Countries with React Query

```js
import { useCountries } from '@/hooks/useData';

function CountrySelect() {
    const { data: countries, isLoading } = useCountries();
    // Countries are also written to store/app.js via setCountries
}
```

### Manual API Call (if needed)

```js
import apiClient from '@/lib/api/client';
const result = await apiClient.get('/some/endpoint');
```
