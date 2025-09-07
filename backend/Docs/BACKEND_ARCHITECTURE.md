# Laravel Backend Documentation

## Project Overview

**Project**: Multi-platform Authentication System with Admin Panel  
**Laravel Version**: 12.x  
**Authentication**: Laravel Sanctum (Token-based API) + Session-based (Admin)  
**Database**: MySQL with Eloquent ORM  
**Features**: Multi-step user registration, OTP verification, Admin management, Profile completion system

---

## Table of Contents

1. [Project Structure](#project-structure)
2. [Database Schema](#database-schema)
3. [API Endpoints](#api-endpoints)
4. [Admin Routes](#admin-routes)
5. [Authentication Flow](#authentication-flow)
6. [Middleware](#middleware)
7. [Services](#services)
8. [Configuration](#configuration)

---

## Project Structure

```
app/
├── Console/
├── Exceptions/
├── Http/
│   ├── Controllers/
│   │   ├── Api/
│   │   │   ├── AuthController.php
│   │   │   └── DataController.php
│   │   └── Admin/
│   │       ├── AuthController.php
│   │       ├── DashboardController.php
│   │       └── UserController.php
│   ├── Middleware/
│   │   ├── AdminMiddleware.php
│   │   └── EnsureProfileComplete.php
│   └── Requests/
│       ├── CompleteProfileRequest.php
│       ├── InitiateRegistrationRequest.php
│       ├── LoginRequest.php
│       ├── SetPasswordRequest.php
│       └── VerifyOtpRequest.php
├── Models/
│   ├── Admin.php
│   ├── City.php
│   ├── Country.php
│   ├── OtpVerification.php
│   ├── Profession.php
│   └── User.php
├── Providers/
└── Services/
    ├── AuthService.php
    └── OtpService.php

config/
├── auth.php
├── cors.php
└── sanctum.php

database/
├── factories/
├── migrations/
├── seeders/
└── ...

routes/
├── api.php
└── web.php
```

---

## Database Schema

### Tables & Relationships

#### 1. **countries**
```php
Schema::create('countries', function (Blueprint $table) {
    $table->id();
    $table->string('name');
    $table->string('code', 2)->unique(); // YE, SA, etc
    $table->string('phone_code', 5); // +967, +966, etc
    $table->boolean('is_active')->default(true);
    $table->timestamps();
});
```

#### 2. **cities**
```php
Schema::create('cities', function (Blueprint $table) {
    $table->id();
    $table->string('name');
    $table->string('name_ar')->nullable(); // Arabic name
    $table->foreignId('country_id')->constrained()->onDelete('cascade');
    $table->boolean('is_active')->default(true);
    $table->timestamps();
});
```

#### 3. **professions**
```php
Schema::create('professions', function (Blueprint $table) {
    $table->id();
    $table->string('name');
    $table->string('name_ar')->nullable(); // Arabic name
    $table->boolean('is_active')->default(true);
    $table->timestamps();
});
```

#### 4. **users**
```php
Schema::create('users', function (Blueprint $table) {
    $table->id();
    $table->string('name')->nullable();
    $table->string('email')->nullable()->unique();
    $table->string('phone')->unique();
    $table->string('country_code', 5);
    $table->timestamp('phone_verified_at')->nullable();
    $table->timestamp('email_verified_at')->nullable();
    $table->string('password');
    $table->foreignId('country_id')->nullable()->constrained()->nullOnDelete();
    $table->foreignId('city_id')->nullable()->constrained()->nullOnDelete();
    $table->foreignId('profession_id')->nullable()->constrained()->nullOnDelete();
    $table->date('birth_date')->nullable();
    $table->enum('gender', ['male', 'female'])->nullable();
    $table->json('profile_completion_steps')->nullable();
    $table->boolean('is_active')->default(true);
    $table->timestamp('last_login_at')->nullable();
    $table->rememberToken();
    $table->timestamps();
    
    $table->index(['phone', 'country_code']);
});
```

#### 5. **admins**
```php
Schema::create('admins', function (Blueprint $table) {
    $table->id();
    $table->string('name');
    $table->string('email')->unique();
    $table->timestamp('email_verified_at')->nullable();
    $table->string('password');
    $table->enum('role', ['super_admin', 'admin', 'moderator'])->default('admin');
    $table->json('permissions')->nullable();
    $table->boolean('is_active')->default(true);
    $table->timestamp('last_login_at')->nullable();
    $table->rememberToken();
    $table->timestamps();
});
```

#### 6. **otp_verifications**
```php
Schema::create('otp_verifications', function (Blueprint $table) {
    $table->id();
    $table->string('phone');
    $table->string('country_code', 5);
    $table->string('otp_code', 4);
    $table->enum('type', ['registration', 'reset_password'])->default('registration');
    $table->enum('method', ['sms', 'whatsapp'])->default('sms');
    $table->timestamp('expires_at');
    $table->boolean('is_used')->default(false);
    $table->integer('attempts')->default(0);
    $table->timestamps();
    
    $table->index(['phone', 'country_code']);
});
```

### Relationships

- **User** → **Country**: `belongsTo` (country_id)
- **User** → **City**: `belongsTo` (city_id)  
- **User** → **Profession**: `belongsTo` (profession_id)
- **City** → **Country**: `belongsTo` (country_id)
- **OtpVerification** → Indexed on (phone, country_code)

---

## API Endpoints

### Authentication Endpoints (`/api/auth/*`)

#### 1. **Initiate Registration**
```http
POST /api/auth/initiate-registration
Content-Type: application/json

{
    "phone": "771234567",
    "country_code": "+967"
}
```

**Response**:
```json
{
    "success": true,
    "data": {
        "exists": false,
        "otp_sent": true,
        "method": "sms"
    },
    "message": "OTP sent successfully"
}
```

#### 2. **Verify OTP**
```http
POST /api/auth/verify-otp
Content-Type: application/json

{
    "phone": "771234567",
    "country_code": "+967",
    "otp_code": "1234"
}
```

#### 3. **Set Password**
```http
POST /api/auth/set-password
Content-Type: application/json

{
    "phone": "771234567",
    "country_code": "+967",
    "password": "secret123",
    "password_confirmation": "secret123"
}
```

#### 4. **Login**
```http
POST /api/auth/login
Content-Type: application/json

{
    "phone": "771234567",
    "country_code": "+967",
    "password": "secret123"
}
```

#### 5. **Complete Profile**
```http
POST /api/auth/complete-profile
Authorization: Bearer {token}
Content-Type: application/json

{
    "name": "John Doe",
    "email": "john@example.com",
    "city_id": 1,
    "profession_id": 1,
    "birth_date": "1990-01-01",
    "gender": "male"
}
```

#### 6. **Get Current User**
```http
GET /api/auth/me
Authorization: Bearer {token}
```

#### 7. **Logout**
```http
POST /api/auth/logout
Authorization: Bearer {token}
```

#### 8. **Refresh Token**
```http
POST /api/auth/refresh-token
Authorization: Bearer {token}
```

### Data Endpoints (`/api/data/*`)

#### 1. **Get Countries**
```http
GET /api/data/countries
```

#### 2. **Get Cities** (with optional filtering)
```http
GET /api/data/cities
GET /api/data/cities?country_id=1
```

#### 3. **Get Professions**
```http
GET /api/data/professions
```

---

## Admin Routes (`/admin/*`)

### Authentication
- `GET /admin/login` - Show login form
- `POST /admin/login` - Process login
- `POST /admin/logout` - Logout

### Dashboard
- `GET /admin/dashboard` - Admin dashboard with statistics

### User Management
- `GET /admin/users` - List users (with search/filters)
- `GET /admin/users/{user}` - Show user details
- `POST /admin/users/{user}/toggle-status` - Toggle user status

---

## Authentication Flow

### User Registration Flow:
1. **Initiate Registration** → Validate phone → Send OTP
2. **Verify OTP** → Create user → Mark phone verified
3. **Set Password** → Hash password → Mark step complete
4. **Complete Profile** → Add personal info → Mark profile complete

### Admin Authentication:
- Session-based authentication
- Role-based permissions (super_admin, admin, moderator)
- Active status checking

### API Authentication:
- Sanctum token-based authentication
- 7-day token expiration
- Token refresh capability

---

## Middleware

### 1. **AdminMiddleware**
- Protects admin routes
- Checks admin authentication and active status
- Supports permission-based access control
- Handles both web and API responses

### 2. **EnsureProfileComplete**
- Protects API routes requiring complete profiles
- Returns 403 with missing steps information
- Guides users through completion process

---

## Services

### 1. **OtpService**
- Generates 4-digit OTP codes
- Determines delivery method (SMS/WhatsApp) based on country
- Handles OTP verification and attempt tracking
- Integrated with Addon SMS/WhatsApp services (placeholder)

### 2. **AuthService**
- Manages multi-step user registration
- Handles phone verification and user creation
- Manages profile completion steps
- Provides login functionality with token generation

---

## Configuration

### 1. **CORS Configuration** (`config/cors.php`)
- Frontend URL from environment variable
- Credentials support enabled
- API paths configured

### 2. **Sanctum Configuration** (`config/sanctum.php`)
- 7-day token expiration
- Stateful domains for SPA authentication
- Web guard configuration

### 3. **Auth Configuration** (`config/auth.php`)
- Multiple guards: web, admin, api
- Separate providers for users and admins
- Password reset configuration for both

### 4. **Middleware Aliases** (`bootstrap/app.php`)
- `admin` → `AdminMiddleware`
- `profile.complete` → `EnsureProfileComplete`

---

## Environment Variables

```env
FRONTEND_URL=http://localhost:3000
SANCTUM_STATEFUL_DOMAINS=localhost,localhost:3000,127.0.0.1
SANCTUM_TOKEN_EXPIRATION=10080 # 7 days in minutes
```

---

## Security Features

- ✅ Phone number validation (Yemen-specific format)
- ✅ OTP-based verification with expiration
- ✅ Password hashing with bcrypt
- ✅ CSRF protection for web routes
- ✅ CORS configuration for API
- ✅ Token-based authentication with expiration
- ✅ Role-based access control for admin
- ✅ Input validation with FormRequest classes

---

## Error Handling

- Standardized JSON response format
- Appropriate HTTP status codes
- Validation error messages
- Detailed error logging
- User-friendly error messages

---

## Future Enhancements

- [ ] Implement actual SMS/WhatsApp integration with Addon
- [ ] Add email verification system
- [ ] Implement password reset functionality
- [ ] Add more admin management features
- [ ] Implement rate limiting
- [ ] Add API documentation with Swagger/OpenAPI

This documentation provides a comprehensive overview of the Laravel backend structure, helping new developers understand the architecture, endpoints, and workflows quickly.