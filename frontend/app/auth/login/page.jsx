// app/auth/login/page.jsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '@/lib/validations/auth';
import { useLogin } from '@/hooks/useAuth';
import useAuthStore from '@/store/auth';
import PhoneInput from '@/components/auth/PhoneInput';
import PasswordInput from '@/components/auth/PasswordInput';
import Button from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import ThemeToggle from '@/components/ui/ThemeToggle';
import Link from 'next/link';

export default function LoginPage() {
    const router = useRouter();
    const { isAuthenticated } = useAuthStore();
    const { mutate: login, isPending } = useLogin();

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            phone: '',
            country_code: '+967',
            password: '',
        },
    });

    const watchedPhone = watch('phone');
    const watchedCountryCode = watch('country_code');
    const watchedPassword = watch('password');

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            router.push('/dashboard');
        }
    }, [isAuthenticated, router]);

    const onSubmit = (data) => {
        console.log('Form data:', data); // Check if this logs
        login(data);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-900 dark:to-gray-800 px-4">
            <div className="absolute top-4 right-4">
                <ThemeToggle />
            </div>

            <Card className="w-full max-w-md bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        Welcome Back
                    </CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-400">
                        Sign in to your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-6">
                        <PhoneInput
                            phone={watchedPhone}
                            countryCode={watchedCountryCode}
                            onPhoneChange={(value) => setValue('phone', value)}
                            onCountryCodeChange={(value) =>
                                setValue('country_code', value)
                            }
                            phoneError={errors.phone?.message}
                            countryCodeError={errors.country_code?.message}
                            disabled={isPending}
                        />

                        <PasswordInput
                            label="Password"
                            placeholder="Enter your password"
                            {...register('password')}
                            value={watchedPassword}
                            error={errors.password?.message}
                            disabled={isPending}
                        />

                        <div className="flex items-center justify-between">
                            <Link
                                href="/auth/forgot-password"
                                className="text-sm text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300">
                                Forgot password?
                            </Link>
                        </div>

                        <Button
                            type="submit"
                            className="w-full"
                            loading={isPending}
                            disabled={isPending}>
                            {isPending ? 'Signing in...' : 'Sign In'}
                        </Button>

                        <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                            Don't have an account?{' '}
                            <Link
                                href="/auth/register"
                                className="text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 font-medium">
                                Create account
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
