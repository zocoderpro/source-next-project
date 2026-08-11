//./auth/providers.tsx
'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useEffect } from 'react';
import { queryClient } from '../lib/query-client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { env } from '@/lib/config/env';
import { warmupBackend } from '@/lib/api/warmup';

export function Providers({ children }: { children: ReactNode }) {
    useEffect(() => {
        warmupBackend();
    }, []);
    return (
        <QueryClientProvider client={queryClient}>
            <GoogleOAuthProvider clientId={env.googleClientId}>
                
                {children}
            </GoogleOAuthProvider>
        </QueryClientProvider>
    );
}