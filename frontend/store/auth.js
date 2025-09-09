// store/auth.js
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { setToken, getToken, removeToken, setUser as setUserStorage, getUser } from '@/lib/utils/storage';
import { authApi } from '@/lib/api/auth';

const useAuthStore = create(
    persist(
        (set, get) => ({
            // State
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: true,
            registrationData: null,

            // Actions
            setAuth: (user, token) => {
                setToken(token);
                setUserStorage(user);
                set({
                    user,
                    token,
                    isAuthenticated: true,
                    isLoading: false,
                });
            },

            setUser: (user) => {
                setUserStorage(user);
                set({ user });
            },

            clearAuth: () => {
                removeToken();
                set({
                    user: null,
                    token: null,
                    isAuthenticated: false,
                    isLoading: false,
                    registrationData: null,
                });
            },

            setRegistrationData: (data) => {
                set((state) => ({
                    registrationData: { ...state.registrationData, ...data },
                }));
            },

            clearRegistrationData: () => {
                set({ registrationData: null });
            },

            // Initialize from storage
            initialize: async () => {
                try {
                    const token = getToken();
                    const user = getUser();

                    if (token && user) {
                        set({
                            user,
                            token,
                            isAuthenticated: true,
                            isLoading: false,
                        });

                        // Verify token is still valid by fetching fresh user data
                        try {
                            const response = await authApi.getMe();
                            if (response.success) {
                                const freshUser = response.data.user;
                                setUserStorage(freshUser);
                                set({ user: freshUser });
                            }
                        } catch (error) {
                            // Token invalid, clear auth
                            console.log('Token verification failed:', error);
                            get().clearAuth();
                        }
                    } else {
                        set({ isLoading: false });
                    }
                } catch (error) {
                    console.error('Initialize error:', error);
                    set({ isLoading: false });
                }
            },

            // Helper methods
            isProfileComplete: () => {
                const { user } = get();
                if (!user) return false;
                
                const requiredSteps = ['phone_verified', 'password_set', 'profession_selected'];
                const completedSteps = user.profile_completion_steps || [];
                
                return requiredSteps.every(step => completedSteps.includes(step));
            },

            getMissingSteps: () => {
                const { user } = get();
                if (!user) return [];
                
                const requiredSteps = ['phone_verified', 'password_set', 'profession_selected'];
                const completedSteps = user.profile_completion_steps || [];
                
                return requiredSteps.filter(step => !completedSteps.includes(step));
            },

            getNextRequiredStep: () => {
                const missingSteps = get().getMissingSteps();
                if (missingSteps.length === 0) return null;
                
                // Return the first missing step
                const stepMap = {
                    'phone_verified': '/auth/verify-otp',
                    'password_set': '/auth/set-password',
                    'profession_selected': '/auth/complete-profile'
                };
                
                return stepMap[missingSteps[0]] || null;
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