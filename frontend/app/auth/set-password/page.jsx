// app/auth/set-password/page.jsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { setPasswordSchema } from '@/lib/validations/auth';
import { useSetPassword } from '@/hooks/useAuth';
import useAuthStore from '@/store/auth';
import PasswordInput from '@/components/auth/PasswordInput';
import Button from '@/components/ui/Button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/Card';
import AuthLayout from '@/components/layout/AuthLayout';

export default function SetPasswordPage() {
    const router = useRouter();
    const {
        registrationData,
        isAuthenticated,
        user,
        isRegistrationDataValid,
        getCurrentRegistrationStep,
    } = useAuthStore();

    const { mutate: setPassword, isPending } = useSetPassword();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(setPasswordSchema),
        defaultValues: {
            password: '',
            password_confirmation: '',
        },
    });

    const watchedPassword = watch('password');

    // Enhanced redirect logic
    useEffect(() => {
        // If authenticated and password already set, let AuthGuard handle redirection
        if (
            isAuthenticated &&
            user?.profile_completion_steps?.includes('password_set')
        ) {
            return;
        }

        // If not authenticated, validate registration flow
        if (!isAuthenticated) {
            const correctStep = getCurrentRegistrationStep();
            if (correctStep !== '/auth/set-password') {
                router.replace(correctStep);
                return;
            }

            // Additional validation for registration data
            if (!isRegistrationDataValid() || !registrationData?.verified) {
                router.replace('/auth/register');
                return;
            }
        }
    }, [
        isAuthenticated,
        registrationData,
        router,
        user,
        isRegistrationDataValid,
        getCurrentRegistrationStep,
    ]);

    const onSubmit = (data) => {
        if (!registrationData?.phone || !registrationData?.country_code) {
            router.replace('/auth/register');
            return;
        }

        setPassword({
            phone: registrationData.phone,
            country_code: registrationData.country_code,
            password: data.password,
            password_confirmation: data.password_confirmation,
        });
    };

    // Show loading while validating
    if (!registrationData && !isAuthenticated) {
        return null;
    }

    return (
        <AuthLayout>
            <Card className="w-full max-w-md bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        Set Your Password
                    </CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-400">
                        Create a secure password for your account
                    </CardDescription>
                    {registrationData && (
                        <div className="text-sm text-gray-500 mt-2">
                            Account: {registrationData.country_code}{' '}
                            {registrationData.phone}
                        </div>
                    )}
                </CardHeader>

                <CardContent>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-6">
                        <PasswordInput
                            label="Password"
                            placeholder="Create a password"
                            {...register('password')}
                            value={watchedPassword}
                            error={errors.password?.message}
                            disabled={isPending}
                            showStrength={true}
                        />

                        <PasswordInput
                            label="Confirm Password"
                            placeholder="Confirm your password"
                            {...register('password_confirmation')}
                            error={errors.password_confirmation?.message}
                            disabled={isPending}
                        />

                        <div className="text-xs text-gray-500 space-y-1">
                            <p>Password requirements:</p>
                            <ul className="list-disc list-inside space-y-0.5 text-gray-400">
                                <li>At least 8 characters</li>
                                <li>One uppercase letter</li>
                                <li>One lowercase letter</li>
                                <li>One number</li>
                            </ul>
                        </div>

                        <Button
                            type="submit"
                            className="w-full"
                            loading={isPending}
                            disabled={isPending || !watchedPassword}>
                            {isPending
                                ? 'Setting Password...'
                                : 'Set Password & Continue'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </AuthLayout>
    );
}
