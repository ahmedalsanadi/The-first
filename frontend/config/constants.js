//config/constants.js

export const ENV = {
    API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
    APP_NAME: 'The Fist for Building',
    TOKEN_KEY: 'auth_token',
    USER_KEY: 'user_data',
};

export const API_ENDPOINTS = {
    // Auth endpoints
    INITIATE_REGISTRATION: '/auth/initiate-registration',
    VERIFY_OTP: '/auth/verify-otp',
    SET_PASSWORD: '/auth/set-password',
    LOGIN: '/auth/login',
    ME: '/auth/me',
    LOGOUT: '/auth/logout',
    REFRESH_TOKEN: '/auth/refresh-token',
    COMPLETE_PROFILE: '/auth/complete-profile',

    // Data endpoints
    COUNTRIES: '/data/countries',
    CITIES: '/data/cities',
    PROFESSIONS: '/data/professions',
};

export const ROUTES = {
    HOME: '/',
    AUTH: '/auth',
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    VERIFY_OTP: '/auth/verify-otp',
    SET_PASSWORD: '/auth/set-password',
    COMPLETE_PROFILE: '/auth/complete-profile',
    DASHBOARD: '/dashboard',
    PROFILE: '/profile',
    PRODUCTS: '/products',
    ADS: '/ads',
    AFFILIATE: '/affiliate',
    CITY: '/city',
};

export const STORAGE_KEYS = {
    TOKEN: 'auth_token',
    USER: 'user_data',
    THEME: 'theme',
    LANGUAGE: 'language',
};

export const QUERY_KEYS = {
    USER: 'user',
    COUNTRIES: 'countries',
    CITIES: 'cities',
    PROFESSIONS: 'professions',
    PRODUCTS: 'products',
};

export const YEMEN_PHONE_PREFIXES = ['70', '71', '73', '77', '78'];

export const OTP_EXPIRY_MINUTES = 5;
