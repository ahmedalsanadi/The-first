// components/ui/DirectionToggle.jsx
'use client';

import Button from '@/components/ui/Button';
import useAppStore from '@/store/app';

export default function DirectionToggle({ className }) {
    const { language, isRTL, setLanguage } = useAppStore();

    const toggleDir = () => {
        // Switch between Arabic (rtl) and English (ltr)
        setLanguage(isRTL ? 'en' : 'ar');
    };

    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={toggleDir}
            className={className}
            aria-label={`Switch to ${isRTL ? 'LTR' : 'RTL'} direction`}>
            {isRTL ? 'LTR' : 'RTL'}
        </Button>
    );
}
