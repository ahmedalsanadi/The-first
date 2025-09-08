// app/auth/register/page.jsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { initiateRegistrationSchema } from '@/lib/validations/auth';
import { useInitiateRegistration } from '@/hooks/useAuth';
import useAuthStore from '@/store/auth';
import PhoneInput from '@/components/auth/PhoneInput';
import Button from '@/components/ui/Button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/Card';
import Link from 'next/link';
import toast from 'react-hot-toast';
import AuthLayout from '@/components/layout/AuthLayout';

export default function RegisterPage() {
    const router = useRouter();
    const { isAuthenticated } = useAuthStore();
    const { mutate: initiateRegistration, isPending } =
        useInitiateRegistration();

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(initiateRegistrationSchema),
        defaultValues: {
            phone: '',
            country_code: '+967',
        },
    });

    const watchedPhone = watch('phone');
    const watchedCountryCode = watch('country_code');

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            router.push('/dashboard');
        }
    }, [isAuthenticated, router]);

    const onSubmit = (data) => {
        initiateRegistration(data, {
            onSuccess: (response) => {
                if (response.data.exists && response.data.verified) {
                    router.push('/auth/login');
                } else {
                    router.push('/auth/verify-otp');
                }
            },
        });
    };

    return (
        <AuthLayout>
            <Card className="w-full max-w-md bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        Create Account
                    </CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-400">
                        Enter your phone number to get started
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-6">
                        <PhoneInput
                            phone={watchedPhone}
                            countryCode ={watchedCountryCode}
                            onPhoneChange={(value) => setValue('phone', value)}
                            onCountryCodeChange={(value) =>
                                setValue('country_code', value)
                            }
                            phoneError={errors.phone?.message}
                            countryCodeError={errors.country_code?.message}
                            disabled={isPending}
                        />

                        <Button
                            type="submit"
                            className="w-full"
                            loading={isPending}
                            disabled={isPending}>
                            {isPending
                                ? 'Sending...'
                                : 'Send Verification Code'}
                        </Button>

                        <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                            Already have an account?{' '}
                            <Link
                                href="/auth/login"
                                className="text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 font-medium">
                                Sign in
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </AuthLayout>
    );
}
