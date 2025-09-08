// hooks/useData.js
import { useQuery } from '@tanstack/react-query';
import { dataApi } from '@/lib/api/data';
import { QUERY_KEYS } from '@/config/constants';
import useAppStore from '@/store/app';

export function useCountries() {
    const setCountries = useAppStore((state) => state.setCountries);

    return useQuery({
        queryKey: [QUERY_KEYS.COUNTRIES],
        queryFn: async () => {
            const response = await dataApi.getCountries();
            if (response.success) {
                setCountries(response.data);
                return response.data;
            }
            throw new Error('Failed to fetch countries');
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
        cacheTime: 10 * 60 * 1000, // 10 minutes
    });
}

export function useCities(countryId) {
    const setCities = useAppStore((state) => state.setCities);

    return useQuery({
        queryKey: [QUERY_KEYS.CITIES, countryId],
        queryFn: async () => {
            const response = await dataApi.getCities(countryId);
            if (response.success) {
                setCities(response.data);
                return response.data;
            }
            throw new Error('Failed to fetch cities');
        },
        enabled: !!countryId,
        staleTime: 5 * 60 * 1000,
        cacheTime: 10 * 60 * 1000,
    });
}

export function useProfessions() {
    const setProfessions = useAppStore((state) => state.setProfessions);

    return useQuery({
        queryKey: [QUERY_KEYS.PROFESSIONS],
        queryFn: async () => {
            const response = await dataApi.getProfessions();
            if (response.success) {
                setProfessions(response.data);
                return response.data;
            }
            throw new Error('Failed to fetch professions');
        },
        staleTime: 5 * 60 * 1000,
        cacheTime: 10 * 60 * 1000,
    });
}
