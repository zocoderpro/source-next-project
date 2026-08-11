//./(protected)/layout.tsx
'use client';

import { useAuthGuard } from '@/hooks/auth/useAuthGuard';
import Navbar from '@/components/layout/navbar';
import  Footer  from '@/components/layout/footer';

export default function ProtectedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { isAuthenticated, isChecking } = useAuthGuard();

    return (
        <>
            <Navbar />
            <main className="flex-1">
                {isChecking || !isAuthenticated ? (
                    <div className="flex min-h-[60vh] items-center justify-center">
                        <span className="text-sm text-muted">Vérification de la session...</span>
                    </div>
                ) : (
                    children
                )}
            </main>
            <Footer />
        </>
    );
}