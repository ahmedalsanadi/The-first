// store/auth.js
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
    setToken,
    getToken,
    removeToken,
    setUser as setUserStorage,
    getUser,
} from '@/lib/utils/storage';
import { authApi } from '@/lib/api/auth';

const PROFILE_STEPS = {
    PHONE_VERIFIED: 'phone_verified',
    PASSWORD_SET: 'password_set',
    PROFESSION_SELECTED: 'profession_selected',
};

const STEP_ROUTES = {
    [PROFILE_STEPS.PHONE_VERIFIED]: '/auth/verify-otp',
    [PROFILE_STEPS.PASSWORD_SET]: '/auth/set-password',
    [PROFILE_STEPS.PROFESSION_SELECTED]: '/auth/complete-profile',
};

const useAuthStore = create(
    persist(
        (set, get) => ({
            // State
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: true,
            registrationData: null,
            error: null,

            // Actions
            setAuth: (user, token) => {
                if (!user || !token) {
                    console.error('Invalid auth data provided');
                    return;
                }

                setToken(token);
                setUserStorage(user);
                set({
                    user,
                    token,
                    isAuthenticated: true,
                    isLoading: false,
                    error: null,
                });
            },

            setUser: (user) => {
                if (!user) {
                    console.error('Invalid user data provided');
                    return;
                }

                setUserStorage(user);
                set({ user, error: null });
            },

            setError: (error) => {
                set({ error, isLoading: false });
            },

            clearError: () => {
                set({ error: null });
            },

            clearAuth: () => {
                removeToken();
                set({
                    user: null,
                    token: null,
                    isAuthenticated: false,
                    isLoading: false,
                    registrationData: null,
                    error: null,
                });
            },

            setRegistrationData: (data) => {
                set((state) => ({
                    registrationData: {
                        ...state.registrationData,
                        ...data,
                        timestamp: Date.now(), // Add timestamp for expiry
                    },
                }));
            },

            clearRegistrationData: () => {
                set({ registrationData: null });
            },

            // Initialize from storage with better error handling
            initialize: async () => {
                try {
                    set({ isLoading: true, error: null });

                    const token = getToken();
                    const user = getUser();

                    if (!token || !user) {
                        set({ isLoading: false });
                        return;
                    }

                    // Quick auth setup first
                    set({
                        user,
                        token,
                        isAuthenticated: true,
                        isLoading: false,
                    });

                    // Then verify token in background
                    try {
                        const response = await authApi.getMe();
                        if (response.success) {
                            const freshUser = response.data.user;
                            setUserStorage(freshUser);
                            set({ user: freshUser });
                        }
                    } catch (error) {
                        console.log('Token verification failed, clearing auth');
                        get().clearAuth();
                    }
                } catch (error) {
                    console.error('Initialize error:', error);
                    set({
                        isLoading: false,
                        error: 'Failed to initialize auth',
                    });
                }
            },

            // Helper methods with better logic
            isProfileComplete: () => {
                const { user } = get();
                if (!user) return false;

                const requiredSteps = Object.values(PROFILE_STEPS);
                const completedSteps = user.profile_completion_steps || [];

                return requiredSteps.every((step) =>
                    completedSteps.includes(step),
                );
            },

            getMissingSteps: () => {
                const { user } = get();
                if (!user) return Object.values(PROFILE_STEPS);

                const requiredSteps = Object.values(PROFILE_STEPS);
                const completedSteps = user.profile_completion_steps || [];

                return requiredSteps.filter(
                    (step) => !completedSteps.includes(step),
                );
            },

            getNextRequiredStep: () => {
                const missingSteps = get().getMissingSteps();
                if (missingSteps.length === 0) return null;

                // Return route for the first missing step
                return STEP_ROUTES[missingSteps[0]] || null;
            },

            // Registration flow helpers
            isRegistrationDataValid: () => {
                const { registrationData } = get();
                if (!registrationData) return false;

                // Check if data is not expired (5 minutes)
                const isExpired =
                    Date.now() - (registrationData.timestamp || 0) >
                    5 * 60 * 1000;
                return (
                    !isExpired &&
                    registrationData.phone &&
                    registrationData.country_code
                );
            },

            getCurrentRegistrationStep: () => {
                const { registrationData, isAuthenticated, user } = get();

                if (isAuthenticated && user) {
                    return get().getNextRequiredStep();
                }

                if (!registrationData || !get().isRegistrationDataValid()) {
                    return '/auth/register';
                }

                if (!registrationData.verified) {
                    return '/auth/verify-otp';
                }

                if (!registrationData.passwordSet) {
                    return '/auth/set-password';
                }

                return '/auth/complete-profile';
            },
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                registrationData: state.registrationData,
            }),
        },
    ),
);

export default useAuthStore;
