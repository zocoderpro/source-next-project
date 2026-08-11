'use client'

import Navbar from '@/components/layout/navbar';
import Footer from '@/components/layout/footer';
import { usePathname } from 'next/navigation';


const HIDDEN_ROUTES = ['/EventContact', '/Confirmation'];


export default function PublicLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const hideNav = HIDDEN_ROUTES.some(route => pathname.startsWith(route));

    return (
        <>
            {!hideNav && <Navbar />}
            <main className="flex-1">{children}</main>
            {!hideNav && <Footer />}
        </>
    );
}