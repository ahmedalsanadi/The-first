# Validations

Form validation is implemented with Zod and integrated using `react-hook-form` + `@hookform/resolvers/zod`.

## Location

-   All auth and profile schemas live in `lib/validations/auth.js`.

## Schemas

### initiateRegistrationSchema

Fields:

-   `phone`: string of digits, length rules; if 9 digits, must match Yemen prefixes from `YEMEN_PHONE_PREFIXES`.
-   `country_code`: e.g., `+967`, 1–4 digits.

Used by:

-   `app/auth/register/page.jsx`

### verifyOtpSchema

Fields:

-   `phone`
-   `country_code`
-   `otp_code`: exactly 4 digits

Used by:

-   `app/auth/verify-otp/page.jsx`

### setPasswordSchema

Fields:

-   `password`: at least 8 chars, includes lowercase, uppercase, number
-   `password_confirmation`: must match `password`

Used by:

-   `app/auth/set-password/page.jsx`

### completeProfileSchema

Optional fields with refinements:

-   `name`: min 2 characters when provided
-   `email`: valid email if provided (or empty string)
-   `city_id`: numeric string if provided
-   `profession_id`: numeric string if provided
-   `birth_date`: `YYYY-MM-DD`, not in the future, not before 1900-01-01
-   `gender`: `'male' | 'female'` if provided

Used by:

-   `app/auth/complete-profile/page.jsx`

## Integration Pattern

In pages, Zod schemas are wired via `zodResolver`:

```jsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '@/lib/validations/auth';

const {
    register,
    handleSubmit,
    formState: { errors },
} = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
        /* ... */
    },
});
```

Errors are surfaced via UI primitives like `Input` and `Select` by passing `error={errors.field?.message}`.

## Constants

-   `YEMEN_PHONE_PREFIXES` and `OTP_EXPIRY_MINUTES` in `config/constants.js` support validation logic and UI messaging.
