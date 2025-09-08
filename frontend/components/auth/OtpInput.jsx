// components/auth/OtpInput.jsx
import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

export default function OtpInput({ value, onChange, error, disabled }) {
    const [otp, setOtp] = useState(value ? value.split('') : ['', '', '', '']);
    const inputRefs = useRef([]);

    useEffect(() => {
        setOtp(value ? value.split('') : ['', '', '', '']);
    }, [value]);

    const handleChange = (index, digit) => {
        if (digit.length > 1) return;

        const newOtp = [...otp];
        newOtp[index] = digit;
        setOtp(newOtp);

        const otpString = newOtp.join('');
        onChange(otpString);

        // Auto focus next input
        if (digit && index < 3) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        // Handle backspace
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').slice(0, 4);
        if (/^\d+$/.test(pastedData)) {
            const newOtp = pastedData
                .split('')
                .concat(['', '', '', ''])
                .slice(0, 4);
            setOtp(newOtp);
            onChange(newOtp.join(''));

            // Focus the next empty input or last input
            const nextEmptyIndex = newOtp.findIndex((digit) => !digit);
            const focusIndex = nextEmptyIndex === -1 ? 3 : nextEmptyIndex;
            inputRefs.current[focusIndex]?.focus();
        }
    };

    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-secondary-700">
                Verification Code
            </label>
            <div className="flex gap-3 justify-center">
                {otp.map((digit, index) => (
                    <input
                        key={index}
                        ref={(el) => (inputRefs.current[index] = el)}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        onPaste={handlePaste}
                        disabled={disabled}
                        className={cn(
                            'w-12 h-12 text-center text-lg font-semibold rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors',
                            error ? 'border-red-500' : 'border-secondary-300',
                            disabled && 'opacity-50 cursor-not-allowed',
                        )}
                    />
                ))}
            </div>
            {error && (
                <p className="text-sm text-red-600 text-center">{error}</p>
            )}
        </div>
    );
}
