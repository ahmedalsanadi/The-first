// components/auth/PasswordInput.jsx
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import Input from '@/components/ui/Input';
import { cn } from '@/lib/utils';

export default function PasswordInput({
    label = 'Password',
    placeholder = 'Enter your password',
    value,
    onChange,
    error,
    disabled,
    showStrength = false,
    ...props
}) {
    const [showPassword, setShowPassword] = useState(false);

    const getPasswordStrength = (password) => {
        if (!password) return { score: 0, text: '', color: '' };

        let score = 0;
        if (password.length >= 8) score++;
        if (/[a-z]/.test(password)) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/\d/.test(password)) score++;
        if (/[^a-zA-Z\d]/.test(password)) score++;

        const strength = {
            0: { text: 'Very Weak', color: 'bg-red-500' },
            1: { text: 'Weak', color: 'bg-red-400' },
            2: { text: 'Fair', color: 'bg-yellow-500' },
            3: { text: 'Good', color: 'bg-blue-500' },
            4: { text: 'Strong', color: 'bg-green-500' },
            5: { text: 'Very Strong', color: 'bg-green-600' },
        };

        return { score, ...strength[score] };
    };

    const strength = showStrength ? getPasswordStrength(value) : null;

    return (
        <div className="space-y-2">
            <div className="relative">
                <Input
                    type={showPassword ? 'text' : 'password'}
                    label={label}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    error={error}
                    disabled={disabled}
                    className={cn('ltr:pr-10 rtl:pl-10')}
                    {...props}
                />
                <button
                    type="button"
                    className={cn(
                        'absolute top-9 text-secondary-400 hover:text-secondary-600',
                        'ltr:right-3 rtl:left-3',
                    )}
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}>
                    {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                    ) : (
                        <Eye className="h-4 w-4" />
                    )}
                </button>
            </div>

            {showStrength && value && (
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-secondary-200 rounded-full overflow-hidden">
                            <div
                                className={cn(
                                    'h-full transition-all duration-300',
                                    strength.color,
                                )}
                                style={{
                                    width: `${(strength.score / 5) * 100}%`,
                                }}
                            />
                        </div>
                        <span className="text-xs text-secondary-600">
                            {strength.text}
                        </span>
                    </div>

                    <div className="text-xs text-secondary-500 space-y-1">
                        <p>Password must contain:</p>
                        <ul className="space-y-1 ml-4 rtl:ml-0 rtl:mr-4">
                            <li
                                className={
                                    value.length >= 8 ? 'text-green-600' : ''
                                }>
                                • At least 8 characters
                            </li>
                            <li
                                className={
                                    /[a-z]/.test(value) ? 'text-green-600' : ''
                                }>
                                • One lowercase letter
                            </li>
                            <li
                                className={
                                    /[A-Z]/.test(value) ? 'text-green-600' : ''
                                }>
                                • One uppercase letter
                            </li>
                            <li
                                className={
                                    /\d/.test(value) ? 'text-green-600' : ''
                                }>
                                • One number
                            </li>
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
}
