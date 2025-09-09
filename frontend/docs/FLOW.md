# Data Flow and Sequence Diagrams

This document explains, step by step, how user inputs move through components, hooks, APIs, and stores. Mermaid diagrams illustrate the control and data flow.

Legend:

-   UI = Page/Component under `app/` or `components/`
-   Hook = React hook in `hooks/`
-   Store = Zustand store in `store/`
-   API = API layer in `lib/api/`
-   Client = Axios client in `lib/api/client.js`
-   Util = Helper in `lib/utils/`

## 1) Registration: Enter phone → Send OTP

Flow summary:

-   UI `app/auth/register/page.jsx` uses `react-hook-form` + `initiateRegistrationSchema`
-   Calls Hook `useInitiateRegistration()` → API `authApi.initiateRegistration()` → Client attaches token (none yet) → server responds
-   On success, Store `useAuthStore.setRegistrationData()` updates registration flow

```mermaid
sequenceDiagram
    participant UI as UI: register/page.jsx
    participant Hook as Hook: useInitiateRegistration()
    participant API as API: authApi.initiateRegistration
    participant Client as Client: apiClient (Axios)
    participant Store as Store: useAuthStore

    UI->>Hook: mutate({ phone, country_code })
    Hook->>API: initiateRegistration(data)
    API->>Client: POST /auth/initiate-registration
    Client-->>API: response { success, data: { exists, method } }
    API-->>Hook: data
    Hook->>Store: setRegistrationData({ phone, country_code, ... })
    Hook-->>UI: success → navigate (/auth/verify-otp or /auth/login)
```

Key files:

-   UI: `app/auth/register/page.jsx`
-   Hook: `hooks/useAuth.js::useInitiateRegistration`
-   API: `lib/api/auth.js::authApi.initiateRegistration`
-   Client: `lib/api/client.js`
-   Store: `store/auth.js::setRegistrationData`
-   Validation: `lib/validations/auth.js::initiateRegistrationSchema`

## 2) Verify OTP

```mermaid
sequenceDiagram
    participant UI as UI: verify-otp/page.jsx
    participant Hook as Hook: useVerifyOtp()
    participant API as API: authApi.verifyOtp
    participant Client as Client: apiClient (Axios)
    participant Store as Store: useAuthStore

    UI->>Hook: mutate({ phone, country_code, otp_code })
    Hook->>API: verifyOtp(data)
    API->>Client: POST /auth/verify-otp
    Client-->>API: response { success, data: { next_step } }
    API-->>Hook: data
    Hook->>Store: setRegistrationData({ verified: true })
    Hook-->>UI: success → navigate(next_step)
```

Key files:

-   UI: `app/auth/verify-otp/page.jsx`
-   Hook: `hooks/useAuth.js::useVerifyOtp`
-   API: `lib/api/auth.js::authApi.verifyOtp`
-   Validation: `lib/validations/auth.js::verifyOtpSchema`

## 3) Set Password (auto-login)

```mermaid
sequenceDiagram
    participant UI as UI: set-password/page.jsx
    participant Hook as Hook: useSetPassword()
    participant API as API: authApi.setPassword & authApi.login
    participant Client as Client: apiClient (Axios)
    participant Store as Store: useAuthStore
    participant Util as Util: storage (setToken,setUser)

    UI->>Hook: mutate({ phone, country_code, password, password_confirmation })
    Hook->>API: setPassword(data)
    API->>Client: POST /auth/set-password
    Client-->>API: response { success, data }
    API-->>Hook: data
    Hook->>API: login({ phone, country_code, password })
    API->>Client: POST /auth/login
    Client-->>API: response { success, data: { user, token } }
    API-->>Hook: data
    Hook->>Store: setAuth(user, token)
    Store->>Util: setToken(token), setUser(user)
    Hook->>Store: clearRegistrationData()
    Hook-->>UI: success → toast, guard handles redirect
```

Key files:

-   UI: `app/auth/set-password/page.jsx`
-   Hook: `hooks/useAuth.js::useSetPassword`
-   API: `lib/api/auth.js::authApi.setPassword`, `authApi.login`
-   Store: `store/auth.js::setAuth`, `clearRegistrationData`
-   Util: `lib/utils/storage.js`
-   Validation: `lib/validations/auth.js::setPasswordSchema`

## 4) Login

```mermaid
sequenceDiagram
    participant UI as UI: login/page.jsx
    participant Hook as Hook: useLogin()
    participant API as API: authApi.login
    participant Client as Client: apiClient
    participant Store as Store: useAuthStore
    participant Util as Util: storage

    UI->>Hook: mutate({ phone, country_code, password })
    Hook->>API: login(data)
    API->>Client: POST /auth/login
    Client-->>API: response { success, data: { user, token } }
    API-->>Hook: data
    Hook->>Store: setAuth(user, token)
    Store->>Util: setToken(token), setUser(user)
    Hook-->>UI: success → toast, guard redirects
```

Key files:

-   UI: `app/auth/login/page.jsx`
-   Hook: `hooks/useAuth.js::useLogin`
-   API: `lib/api/auth.js::authApi.login`
-   Store: `store/auth.js::setAuth`
-   Util: `lib/utils/storage.js`
-   Validation: `lib/validations/auth.js::loginSchema`

## 5) Complete Profile

```mermaid
flowchart TD
    A[UI: complete-profile/page.jsx] -->|collect optional/required fields| B[Zod: completeProfileSchema]
    B --> C[Hook: useCompleteProfile()]
    C --> D[API: authApi.completeProfile]
    D --> E[Client: POST /auth/complete-profile]
    E -->|{ success, user }| F[Store: useAuthStore.setUser(user)]
    F --> G[AuthGuard checks profile completion → redirect]
```

Key files:

-   UI: `app/auth/complete-profile/page.jsx`
-   Hook: `hooks/useAuth.js::useCompleteProfile`
-   API: `lib/api/auth.js::authApi.completeProfile`
-   Store: `store/auth.js::setUser`
-   Validation: `lib/validations/auth.js::completeProfileSchema`

## 6) Guarded Navigation (Public/Auth/Protected)

```mermaid
flowchart TD
    subgraph Layout
      L[app/layout.js] --> AG[components/layout/AuthGuard.jsx]
    end

    AG -->|reads| S[store/auth.js]
    S -->|state| AG

    AG -->|Public route? allow| OK1[Render]
    AG -->|Auth route + isAuthenticated| R1[/dashboard or next step/]
    AG -->|Protected route + !isAuthenticated| R2[/auth/login/]
    AG -->|Protected + incomplete profile| R3[/auth/complete-profile/]
```

Key files:

-   Layout: `app/layout.js`
-   Guard: `components/layout/AuthGuard.jsx`
-   Store: `store/auth.js`

## 7) Token Lifecycle and Axios Interceptors

```mermaid
sequenceDiagram
    participant Store as Store: useAuthStore
    participant Util as Util: storage.js
    participant Client as Client: apiClient (Axios)
    participant API as API: authApi.getMe
    participant UI as UI: AppProvider.initialize

    UI->>Store: initialize()
    Store->>Util: getToken(), getUser()
    Store-->>UI: set isAuthenticated if present
    Store->>API: getMe() (background)
    API->>Client: GET /auth/me (Authorization: Bearer <token>)
    Client-->>API: response { success, data: { user } } OR 401
    API-->>Store: if success → setUser(freshUser); if 401 → clearAuth()

    Note over Client: Interceptor behaviors
    Client->>Client: request: add Authorization if getToken()
    Client->>Client: response: on 401 → removeToken(), window.location='/auth/login'
    Client->>Client: response: on 403+"Profile incomplete" → redirect '/auth/complete-profile'
```

Key files:

-   Client: `lib/api/client.js`
-   Store: `store/auth.js::initialize`, `clearAuth`, `setUser`
-   Util: `lib/utils/storage.js`
-   Provider: `components/layout/AppProvider.jsx`

## 8) Data Lists (Countries/Cities/Professions)

```mermaid
sequenceDiagram
    participant UI as UI Component (e.g., PhoneInput)
    participant Hook as Hook: useCountries()/useCities()/useProfessions()
    participant API as API: dataApi.get*
    participant Client as Client: apiClient
    participant Store as Store: useAppStore

    UI->>Hook: useQuery()
    Hook->>API: getCountries()/getCities(countryId)/getProfessions()
    API->>Client: GET /data/*
    Client-->>API: response { success, data }
    API-->>Hook: data
    Hook->>Store: setCountries/setCities/setProfessions
    Hook-->>UI: return data (and loading states)
```

Key files:

-   Hooks: `hooks/useData.js`
-   API: `lib/api/data.js`
-   Store: `store/app.js`

---

If you want, we can embed these diagrams into `ARCHITECTURE.md` or link to this file from each page’s header for quick onboarding. We can also generate PNG/SVG exports for inclusion in external docs or a wiki.
