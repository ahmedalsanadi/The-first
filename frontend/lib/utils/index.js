// lib/utils/index.js
import { clsx } from 'clsx';

export function cn(...inputs) {
    return clsx(inputs);
}

export function formatPhone(phone, country_code) {
    if (!phone || !country_code) return '';
    return `${country_code} ${phone}`;
}

export function validateYemenPhone(phone) {
    const YEMEN_PREFIXES = ['70', '71', '73', '77', '78'];
    if (phone.length !== 9) return false;
    const prefix = phone.substring(0, 2);
    return YEMEN_PREFIXES.includes(prefix);
}

export function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

export function getInitials(name) {
    if (!name) return 'U';
    return name
        .split(' ')
        .map((word) => word.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 2);
}

export function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

export function throttle(func, limit) {
    let inThrottle;
    return function () {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
}
