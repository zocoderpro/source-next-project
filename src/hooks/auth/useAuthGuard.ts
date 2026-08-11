//./hooks/auth/useAuthGuard.ts
'use client';

import { useEffect, useSyncExternalStore } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getAccessToken } from '@/lib/auth/token-store';

type AuthStatus = 'checking' | 'authenticated' | 'unauthenticated';

function subscribe(callback: () => void) {
    window.addEventListener('storage', callback);
    return () => window.removeEventListener('storage', callback);
}

function getSnapshot(): AuthStatus {
    return getAccessToken() ? 'authenticated' : 'unauthenticated';
}

function getServerSnapshot(): AuthStatus {
    // Ni vrai ni faux — on ne sait juste pas encore, tant que le client
    // n'a pas confirmé en lisant le vrai localStorage.
    return 'checking';
}

interface AuthGuardResult {
    isAuthenticated: boolean;
    isChecking: boolean;
}

export function useAuthGuard(): AuthGuardResult {
    const router = useRouter();
    const pathname = usePathname();

    const status = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

    useEffect(() => {
        // Ne redirige QUE si on est certains d'être déconnectés —
        // jamais pendant l'état transitoire 'checking'.
        if (status === 'unauthenticated') {
            const redirectTo = encodeURIComponent(pathname);
            router.replace(`/auth/login?redirect_to=${redirectTo}`);
        }
    }, [status, pathname, router]);

    return {
        isAuthenticated: status === 'authenticated',
        isChecking: status === 'checking',
    };
}