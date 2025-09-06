
# Database Schema

## Tables & Relationships

### 1. **countries**
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

### 2. **cities**
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

### 3. **professions**
```php
Schema::create('professions', function (Blueprint $table) {
    $table->id();
    $table->string('name');
    $table->string('name_ar')->nullable(); // Arabic name
    $table->boolean('is_active')->default(true);
    $table->timestamps();
});
```

### 4. **users**
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

### 5. **admins**
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

### 6. **otp_verifications**
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

### 7. Relationships

- **User** → **Country**: `belongsTo` (country_id)
- **User** → **City**: `belongsTo` (city_id)  
- **User** → **Profession**: `belongsTo` (profession_id)
- **City** → **Country**: `belongsTo` (country_id)
- **OtpVerification** → Indexed on (phone, country_code)

---
