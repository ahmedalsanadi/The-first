// hooks/useAuth.js
import { useMutation } from '@tanstack/react-query';
import { authApi } from '@/lib/api/auth';
import useAuthStore from '@/store/auth';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export function useInitiateRegistration() {
    const { setRegistrationData, clearError } = useAuthStore();

    return useMutation({
        mutationFn: authApi.initiateRegistration,
        onMutate: () => {
            clearError();
        },
        onSuccess: (data, variables) => {
            console.log('✓ Registration initiated:', data);

            if (data.success) {
                setRegistrationData({
                    phone: variables.phone,
                    country_code: variables.country_code,
                    exists: data.data.exists,
                    verified: false,
                    passwordSet: false,
                    method: data.data.method,
                });

                toast.success(data.message || 'Verification code sent!');
            }
        },
        onError: (error) => {
            console.error('❌ Registration failed:', error);
            const message =
                error.response?.data?.message ||
                'Registration failed. Please try again.';
            toast.error(message);
        },
    });
}

export function useVerifyOtp() {
    const { setRegistrationData, clearError } = useAuthStore();

    return useMutation({
        mutationFn: authApi.verifyOtp,
        onMutate: () => {
            clearError();
        },
        onSuccess: (data, variables) => {
            console.log('✓ OTP verified:', data);

            if (data.success) {
                setRegistrationData({
                    phone: variables.phone,
                    country_code: variables.country_code,
                    verified: true,
                    passwordSet: false,
                });

                toast.success('Phone verified successfully!');
            }
        },
        onError: (error) => {
            console.error('❌ OTP verification failed:', error);
            const message =
                error.response?.data?.message ||
                'Invalid verification code. Please try again.';
            toast.error(message);
        },
    });
}

export function useSetPassword() {
    const { setAuth, clearRegistrationData, clearError } = useAuthStore();
    const { mutate: login } = useLogin();

    return useMutation({
        mutationFn: authApi.setPassword,
        onMutate: () => {
            clearError();
        },
        onSuccess: async (data, variables) => {
            console.log('✓ Password set successfully');

            if (data.success) {
                toast.success('Password set successfully!');

                // Automatically login after setting password
                try {
                    const loginResponse = await authApi.login({
                        phone: variables.phone,
                        country_code: variables.country_code,
                        password: variables.password,
                    });

                    if (loginResponse.success) {
                        setAuth(
                            loginResponse.data.user,
                            loginResponse.data.token,
                        );
                        clearRegistrationData();
                    }
                } catch (loginError) {
                    console.error('Auto-login failed:', loginError);
                    // Fallback: still set user data without token
                    if (data.data.user) {
                        setAuth(data.data.user, data.data.token || '');
                        clearRegistrationData();
                    }
                }
            }
        },
        onError: (error) => {
            console.error('❌ Set password failed:', error);
            const message =
                error.response?.data?.message ||
                'Failed to set password. Please try again.';
            toast.error(message);
        },
    });
}

export function useLogin() {
    const { setAuth, clearRegistrationData, clearError } = useAuthStore();

    return useMutation({
        mutationFn: authApi.login,
        onMutate: () => {
            clearError();
        },
        onSuccess: (data) => {
            console.log('✓ Login successful:', data);

            if (data.success && data.data.user && data.data.token) {
                setAuth(data.data.user, data.data.token);
                clearRegistrationData();
                toast.success('Welcome back!');
            }
        },
        onError: (error) => {
            console.error('❌ Login failed:', error);
            const message =
                error.response?.data?.message ||
                'Login failed. Please check your credentials.';
            toast.error(message);
        },
    });
}

export function useCompleteProfile() {
    const { setUser, clearError } = useAuthStore();

    return useMutation({
        mutationFn: authApi.completeProfile,
        onMutate: () => {
            clearError();
        },
        onSuccess: (data) => {
            console.log('✓ Profile updated:', data);

            if (data.success && data.data.user) {
                setUser(data.data.user);
                toast.success('Profile updated successfully!');
            }
        },
        onError: (error) => {
            console.error('❌ Profile update failed:', error);

            // Log detailed error information
            if (error.response) {
                console.log('Error status:', error.response.status);
                console.log('Error data:', error.response.data);
                console.log('Error headers:', error.response.headers);
            }

            // Handle validation errors specifically
            if (error.response?.status === 422) {
                const validationErrors = error.response.data?.errors;
                if (validationErrors) {
                    console.log('Validation errors:', validationErrors);
                    // Show first validation error
                    const firstError = Object.values(validationErrors)[0];
                    toast.error(
                        Array.isArray(firstError) ? firstError[0] : firstError,
                    );
                } else {
                    toast.error(
                        error.response.data?.message ||
                            'Validation failed. Please check your input.',
                    );
                }
            } else {
                const message =
                    error.response?.data?.message ||
                    'Failed to update profile. Please try again.';
                toast.error(message);
            }
        },
    });
}

export function useLogout() {
    const { clearAuth, clearError } = useAuthStore();
    const router = useRouter();

    return useMutation({
        mutationFn: authApi.logout,
        onMutate: () => {
            clearError();
        },
        onSuccess: () => {
            clearAuth();
            router.push('/auth/login');
            toast.success('Logged out successfully');
        },
        onError: (error) => {
            console.error('Logout error:', error);
            // Still clear auth even if API call fails
            clearAuth();
            router.push('/auth/login');
        },
    });
}
