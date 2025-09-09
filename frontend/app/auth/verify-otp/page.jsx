// app/auth/verify-otp/page.jsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { verifyOtpSchema } from '@/lib/validations/auth';
import { useVerifyOtp, useInitiateRegistration } from '@/hooks/useAuth';
import useAuthStore from '@/store/auth';
import OtpInput from '@/components/auth/OtpInput';
import Button from '@/components/ui/Button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/Card';
import { formatTime } from '@/lib/utils';
import toast from 'react-hot-toast';
import AuthLayout from '@/components/layout/AuthLayout';

export default function VerifyOtpPage() {
    const router = useRouter();
    const { registrationData, isAuthenticated } = useAuthStore();
    const { mutate: verifyOtp, isPending: isVerifying } = useVerifyOtp();
    const { mutate: resendOtp, isPending: isResending } =
        useInitiateRegistration();

    const [countdown, setCountdown] = useState(300); // 5 minutes
    const [canResend, setCanResend] = useState(false);

    const {
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(verifyOtpSchema),
        defaultValues: {
            phone: registrationData?.phone || '',
            country_code: registrationData?.country_code || '',
            otp_code: '',
        },
    });

    const watchedOtpCode = watch('otp_code');

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            router.push('/dashboard');
            return;
        }

        // Redirect if no registration data
        if (!registrationData?.phone) {
            router.push('/auth/register');
            return;
        }
    }, [isAuthenticated, registrationData, router]);

    // Countdown timer
    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            setCanResend(true);
        }
    }, [countdown]);

    const onSubmit = (data) => {
        verifyOtp(data, {
            onSuccess: (response) => {
                if (response.data.next_step === 'set_password') {
                    router.push('/auth/set-password');
                } else if (response.data.next_step === 'select_profession') {
                    router.push('/auth/complete-profile');
                } else {
                    router.push('/dashboard');
                }
            },
        });
    };

    const handleResendOtp = () => {
        if (!canResend || !registrationData) return;

        resendOtp(
            {
                phone: registrationData.phone,
                country_code: registrationData.country_code,
            },
            {
                onSuccess: () => {
                    setCountdown(300);
                    setCanResend(false);
                    toast.success('Verification code sent!');
                },
            },
        );
    };

    if (!registrationData?.phone) {
        return null; // Will redirect
    }

    return (
        <AuthLayout>
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold text-secondary-900">
                        Verify Your Phone
                    </CardTitle>
                    <CardDescription>
                        We sent a verification code to{' '}
                        <span className="font-medium text-secondary-900">
                            {registrationData.country_code}{' '}
                            {registrationData.phone}
                        </span>
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-6">
                        <OtpInput
                            value={watchedOtpCode}
                            onChange={(value) => setValue('otp_code', value)}
                            error={errors.otp_code?.message}
                            disabled={isVerifying}
                        />

                        {registrationData.method && (
                            <div className="text-center text-sm text-secondary-600">
                                Code sent via{' '}
                                {registrationData.method === 'sms'
                                    ? 'SMS'
                                    : 'WhatsApp'}
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="w-full"
                            loading={isVerifying}
                            disabled={
                                isVerifying || watchedOtpCode.length !== 4
                            }>
                            {isVerifying ? 'Verifying...' : 'Verify Code'}
                        </Button>

                        <div className="text-center">
                            {canResend ? (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={handleResendOtp}
                                    loading={isResending}
                                    disabled={isResending}
                                    className="text-primary-600 hover:text-primary-500">
                                    {isResending ? 'Sending...' : 'Resend Code'}
                                </Button>
                            ) : (
                                <div className="text-sm text-secondary-500">
                                    Resend code in {formatTime(countdown)}
                                </div>
                            )}
                        </div>

                        <div className="text-center text-sm text-secondary-600">
                            Wrong number?{' '}
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => router.push('/auth/register')}
                                className="text-primary-600 hover:text-primary-500 p-0 h-auto font-medium">
                                Change phone number
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </AuthLayout>
    );
}
