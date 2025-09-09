'use client';

import Button from '@/components/ui/Button';
import { useLogout } from '@/hooks/useAuth';

export default function LogoutButton({
    className,
    children = 'Logout',
    size = 'sm',
    variant = 'danger',
}) {
    const { mutate: logout, isPending } = useLogout();

    return (
        <Button
            variant={variant}
            size={size}
            className={className}
            loading={isPending}
            onClick={() => logout()}>
            {children}
        </Button>
    );
}
