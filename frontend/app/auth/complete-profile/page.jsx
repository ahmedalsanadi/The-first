// app/auth/complete-profile/page.jsx - Updated onSubmit function
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { completeProfileSchema } from '@/lib/validations/auth';
import useAuthStore from '@/store/auth';
import { useCities, useProfessions } from '@/hooks/useData';
import { useCompleteProfile } from '@/hooks/useAuth';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/Card';
import AuthLayout from '@/components/layout/AuthLayout';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export default function CompleteProfilePage() {
    const router = useRouter();
    const {
        user,
        isAuthenticated,
        isProfileComplete,
        getMissingSteps,
        getNextRequiredStep,
    } = useAuthStore();

    const [showOptionalFields, setShowOptionalFields] = useState(false);

    const { data: cities, isLoading: citiesLoading } = useCities(
        user?.country_id,
    );
    const { data: professions, isLoading: professionsLoading } =
        useProfessions();
    const { mutate: completeProfile, isPending } = useCompleteProfile();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(completeProfileSchema),
        defaultValues: {
            name: user?.name || '',
            email: user?.email || '',
            city_id: user?.city_id?.toString() || '',
            profession_id: user?.profession_id?.toString() || '',
            birth_date: user?.birth_date ? user.birth_date.split('T')[0] : '', // Format date properly
            gender: user?.gender || '',
        },
    });

    const watchedProfessionId = watch('profession_id');

    // Enhanced auth and flow validation
    useEffect(() => {
        if (!isAuthenticated) return;

        // If profile is already complete, redirect to dashboard
        if (isProfileComplete()) {
            router.replace('/dashboard');
            return;
        }

        // Check if this is the correct step
        const nextStep = getNextRequiredStep();
        if (nextStep && nextStep !== '/auth/complete-profile') {
            router.replace(nextStep);
            return;
        }
    }, [isAuthenticated, isProfileComplete, getNextRequiredStep, router]);

    const onSubmit = (data) => {
        console.log('Raw form data:', data);

        // Prepare profile data with proper validation
        const profileData = {};

        // Only include non-empty values and convert properly
        if (data.name && data.name.trim()) {
            profileData.name = data.name.trim();
        }

        if (data.email && data.email.trim()) {
            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (emailRegex.test(data.email)) {
                profileData.email = data.email.trim();
            }
        }

        if (data.city_id && data.city_id !== '') {
            profileData.city_id = parseInt(data.city_id, 10);
        }

        if (data.profession_id && data.profession_id !== '') {
            profileData.profession_id = parseInt(data.profession_id, 10);
        }

        if (data.birth_date && data.birth_date !== '') {
            // Validate date format (YYYY-MM-DD)
            const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
            if (dateRegex.test(data.birth_date)) {
                profileData.birth_date = data.birth_date;
            }
        }

        if (data.gender && data.gender !== '') {
            // Validate gender values
            if (['male', 'female'].includes(data.gender)) {
                profileData.gender = data.gender;
            }
        }

        console.log('Processed profile data:', profileData);

        // Validate required fields
        const missingSteps = getMissingSteps();
        if (
            missingSteps.includes('profession_selected') &&
            !profileData.profession_id
        ) {
            toast.error('Please select your profession to continue');
            return;
        }

        completeProfile(profileData);
    };

    const handleSkip = () => {
        const missingSteps = getMissingSteps();
        const canSkip = !missingSteps.includes('profession_selected');

        if (canSkip) {
            router.replace('/dashboard');
        }
    };

    if (!isAuthenticated || !user) {
        return null;
    }

    const missingSteps = getMissingSteps();
    const isProfessionRequired = missingSteps.includes('profession_selected');
    const canSkip = missingSteps.length === 0 || !isProfessionRequired;

    const completedSteps = user.profile_completion_steps || [];

    return (
        <AuthLayout>
            <Card className="w-full max-w-lg">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        Complete Your Profile
                    </CardTitle>
                    <CardDescription>
                        {isProfessionRequired
                            ? 'Please select your profession to continue'
                            : 'Help us personalize your experience'}
                    </CardDescription>

                    {/* Progress indicator */}
                    <div className="flex items-center justify-center gap-2 mt-4">
                        {[
                            'phone_verified',
                            'password_set',
                            'profession_selected',
                        ].map((step, index) => (
                            <div key={step} className="flex items-center">
                                {completedSteps.includes(step) ? (
                                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                                ) : (
                                    <div
                                        className={`w-5 h-5 rounded-full border-2 ${
                                            step === 'profession_selected'
                                                ? 'border-primary-500 bg-primary-100'
                                                : 'border-gray-300'
                                        }`}
                                    />
                                )}
                                {index < 2 && (
                                    <div className="w-8 h-0.5 bg-gray-300 mx-1" />
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Debug info - remove in production */}
                    <div className="text-xs text-gray-500 mt-2">
                        Missing steps: {missingSteps.join(', ') || 'None'}
                    </div>
                </CardHeader>

                <CardContent>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-6">
                        {/* Required profession field */}
                        <div className="space-y-4">
                            <Select
                                label={
                                    <div className="flex items-center gap-2">
                                        Profession
                                        {isProfessionRequired && (
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        )}
                                        {!isProfessionRequired && (
                                            <span className="text-sm text-gray-500">
                                                (Optional)
                                            </span>
                                        )}
                                    </div>
                                }
                                {...register('profession_id')}
                                error={errors.profession_id?.message}
                                disabled={isPending || professionsLoading}
                                required={isProfessionRequired}>
                                <option value="">
                                    {professionsLoading
                                        ? 'Loading...'
                                        : 'Select your profession'}
                                </option>
                                {professions?.map((profession) => (
                                    <option
                                        key={profession.id}
                                        value={profession.id.toString()}>
                                        {profession.name_ar} - {profession.name}
                                    </option>
                                ))}
                            </Select>

                            {isProfessionRequired && !watchedProfessionId && (
                                <div className="flex items-center gap-2 text-sm text-amber-600">
                                    <AlertCircle className="w-4 h-4" />
                                    Profession selection is required to continue
                                </div>
                            )}
                        </div>

                        {/* Optional fields toggle */}
                        <div className="border-t pt-4">
                            <button
                                type="button"
                                onClick={() =>
                                    setShowOptionalFields(!showOptionalFields)
                                }
                                className="text-sm text-primary-600 hover:text-primary-500 font-medium">
                                {showOptionalFields ? 'Hide' : 'Show'} optional
                                information
                            </button>
                        </div>

                        {/* Optional fields */}
                        {showOptionalFields && (
                            <div className="space-y-4 border-l-4 border-gray-200 pl-4">
                                <Input
                                    label="Full Name"
                                    placeholder="Enter your full name"
                                    {...register('name')}
                                    error={errors.name?.message}
                                    disabled={isPending}
                                />

                                <Input
                                    label="Email"
                                    type="email"
                                    placeholder="Enter your email"
                                    {...register('email')}
                                    error={errors.email?.message}
                                    disabled={isPending}
                                />

                                <Select
                                    label="City"
                                    {...register('city_id')}
                                    error={errors.city_id?.message}
                                    disabled={isPending || citiesLoading}>
                                    <option value="">
                                        {citiesLoading
                                            ? 'Loading...'
                                            : 'Select your city'}
                                    </option>
                                    {cities?.map((city) => (
                                        <option
                                            key={city.id}
                                            value={city.id.toString()}>
                                            {city.name_ar} - {city.name}
                                        </option>
                                    ))}
                                </Select>

                                <Input
                                    label="Date of Birth"
                                    type="date"
                                    {...register('birth_date')}
                                    error={errors.birth_date?.message}
                                    disabled={isPending}
                                    max={new Date().toISOString().split('T')[0]} // Prevent future dates
                                />

                                <Select
                                    label="Gender"
                                    {...register('gender')}
                                    error={errors.gender?.message}
                                    disabled={isPending}>
                                    <option value="">Select gender</option>
                                    <option value="male">Male - ذكر</option>
                                    <option value="female">
                                        Female - أنثى
                                    </option>
                                </Select>
                            </div>
                        )}

                        {/* Action buttons */}
                        <div className="space-y-3 pt-4">
                            <Button
                                type="submit"
                                className="w-full"
                                loading={isPending}
                                disabled={
                                    isPending ||
                                    (isProfessionRequired &&
                                        !watchedProfessionId)
                                }>
                                {isPending ? 'Updating...' : 'Complete Profile'}
                            </Button>

                            {canSkip && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    className="w-full"
                                    onClick={handleSkip}
                                    disabled={isPending}>
                                    Skip for now
                                </Button>
                            )}
                        </div>
                    </form>
                </CardContent>
            </Card>
        </AuthLayout>
    );
}
