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

export default function SetPasswordPage() {
    const router = useRouter();
    const { registrationData, isAuthenticated , user } = useAuthStore();
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

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            if (user && !user.profile_complete) {
                // Let AuthGuard handle the redirection based on missing steps
                return;
            }
            router.push('/dashboard');
            return;
        }

        // Redirect if no registration data or not verified
        if (!registrationData?.verified) {
            router.push('/auth/register');
            return;
        }
    }, [isAuthenticated, registrationData, router, user]);

    const onSubmit = (data) => {
        setPassword(
            {
                phone: registrationData.phone,
                country_code: registrationData.country_code,
                password: data.password,
                password_confirmation: data.password_confirmation,
            },
             // Remove the onSuccess callback - let the hook handle everything
            // {
            //     onSuccess: (response) => {
            //         if (response.data.next_step === 'select_profession') {
            //             router.push('/auth/select-profession');
            //         }
            //         if (response.data.next_step === 'complete-profile') {
            //             router.push('/auth/complete-profile');
            //         } else {
            //             router.push('/auth/login');
            //         }
            //     },
            // },
        );
    };

    if (!registrationData?.verified) {
        return null; // Will redirect
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 px-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold text-secondary-900">
                        Set Your Password
                    </CardTitle>
                    <CardDescription>
                        Create a secure password for your account
                    </CardDescription>
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

                        <Button
                            type="submit"
                            className="w-full"
                            loading={isPending}
                            disabled={isPending}>
                            {isPending ? 'Setting Password...' : 'Set Password'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
