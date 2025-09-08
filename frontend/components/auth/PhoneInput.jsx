// components/auth/PhoneInput.jsx
import { useState } from 'react';
import { useCountries } from '@/hooks/useData';
import Select from '@/components/ui/Select';
import Input from '@/components/ui/Input';
import { cn } from '@/lib/utils';

export default function PhoneInput({
    phone,
    countryCode,
    onPhoneChange,
    onCountryCodeChange,
    phoneError,
    countryCodeError,
    disabled,
}) {
    const { data: countries, isLoading } = useCountries();

    return (
        <div className="space-y-4">
            <Select
                label="Country"
                value={countryCode}
                onChange={(e) => onCountryCodeChange(e.target.value)}
                error={countryCodeError}
                disabled={disabled || isLoading}
                required>
                {countries?.map((country) => (
                    <option key={country.id} value={country.phone_code}>
                        {country.name} ({country.phone_code})
                    </option>
                ))}
            </Select>

            <div className="relative">
                <Input
                    label="Phone Number"
                    type="tel"
                    value={phone}
                    onChange={(e) => onPhoneChange(e.target.value)}
                    placeholder={
                        countryCode === '+967' ? '7XXXXXXXX' : 'Phone number'
                    }
                    error={phoneError}
                    disabled={disabled}
                    required
                    className="pl-16"
                />
                {countryCode && (
                    <div className="absolute left-3 top-9 flex items-center text-sm text-secondary-500">
                        {countryCode}
                    </div>
                )}
            </div>

            {countryCode === '+967' && (
                <p className="text-xs text-secondary-500">
                    Yemen numbers must start with 70, 71, 73, 77, or 78 and be 9
                    digits
                </p>
            )}
        </div>
    );
}
