//./lib/auth/token-store.ts
import type { AuthUser } from '@/types/auth';

import type { ProfileUser } from '@/types/auth';

const ACCESS_TOKEN_KEY = 'athena_access_token';
const REFRESH_TOKEN_KEY = 'athena_refresh_token';
const USER_KEY = 'athena_user';

export function getAccessToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getUser(): AuthUser | null {
    if (typeof window === 'undefined') return null;
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
}

export function setAuth(accessToken: string, refreshToken: string, user: AuthUser) {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    // Déclenche manuellement l'event 'storage' pour que useSyncExternalStore
    // se resynchronise dans le même onglet (l'event natif ne se déclenche
    // que sur les AUTRES onglets)
    window.dispatchEvent(new Event('storage'));
}

export function clearAuth() {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    window.dispatchEvent(new Event('storage'));
}

let refreshPromise: Promise<boolean> | null = null;

export async function refreshAccessToken(): Promise<boolean> {
    if (refreshPromise) return refreshPromise;

    refreshPromise = (async () => {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
        if (!refreshToken) return false;

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/refresh`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refreshToken }),
            });
            if (!res.ok) return false;

            const json = await res.json();
            localStorage.setItem(ACCESS_TOKEN_KEY, json.data.accessToken);
            localStorage.setItem(REFRESH_TOKEN_KEY, json.data.refreshToken);
            return true;
        } catch {
            return false;
        } finally {
            refreshPromise = null;
        }
    })();

    return refreshPromise;
}

export function setAccessAndRefreshTokens(accessToken: string, refreshToken: string) {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    window.dispatchEvent(new Event('storage'));
}

export function getUserInitials(user: AuthUser | null): string {
    if (!user) return '';
    const first = user.firstName?.[0] ?? '';
    const last = user.lastName?.[0] ?? '';
    return (first + last).toUpperCase() || user.email?.[0]?.toUpperCase() || '?';
}

export function getProfileInitials(user: ProfileUser | null | undefined): string {
    if (!user) return '';
    const first = user.firstName?.[0] ?? '';
    const last = user.lastName?.[0] ?? '';
    return (first + last).toUpperCase() || user.email?.[0]?.toUpperCase() || '?';
}