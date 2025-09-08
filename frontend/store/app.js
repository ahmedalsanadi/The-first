// store/app.js
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const useAppStore = create(
    persist(
        (set, get) => ({
            // UI State
            sidebarOpen: false,
            theme: 'light',
            language: 'ar',
            isRTL: true,

            // App Data
            countries: [],
            cities: [],
            professions: [],
            selectedCity: null,

            // UI Actions
            toggleSidebar: () =>
                set((state) => ({ sidebarOpen: !state.sidebarOpen })),
            setSidebarOpen: (open) => set({ sidebarOpen: open }),

            // Theme Actions
            setTheme: (theme) => {
                // Validate theme value
                const validTheme =
                    theme === 'light' || theme === 'dark' ? theme : 'light';
                set({ theme: validTheme });
            },

            toggleTheme: () => {
                const currentTheme = get().theme;
                set({ theme: currentTheme === 'light' ? 'dark' : 'light' });
            },

            setLanguage: (language) =>
                set({
                    language,
                    isRTL: language === 'ar',
                }),

            // Data Actions
            setCountries: (countries) => set({ countries }),
            setCities: (cities) => set({ cities }),
            setProfessions: (professions) => set({ professions }),
            setSelectedCity: (city) => set({ selectedCity: city }),

            // Get functions
            getCountryByCode: (code) => {
                return get().countries.find(
                    (country) => country.phone_code === code,
                );
            },

            getCitiesByCountry: (countryId) => {
                return get().cities.filter(
                    (city) => city.country_id === countryId,
                );
            },
        }),
        {
            name: 'app-storage',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                theme: state.theme,
                language: state.language,
                isRTL: state.isRTL,
                selectedCity: state.selectedCity,
            }),
        },
    ),
);

export default useAppStore;
