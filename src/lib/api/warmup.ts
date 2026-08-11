import { env } from '@/lib/config/env';

const WARMUP_KEY = 'athena_backend_warmed';

/**
 * Réveille le backend Cloud Run (cold start) une seule fois par session navigateur,
 * dès l'arrivée sur le site.
 * ******zocoder****
 */
export function warmupBackend(): void {
    if (typeof window === 'undefined') return;
    //if (env.profil === 'prod') return;

    if (sessionStorage.getItem(WARMUP_KEY)) return;
    sessionStorage.setItem(WARMUP_KEY, '1');

    const baseUrl = env.apiUrl.replace(/\/api\/?$/, '');

    fetch(`${baseUrl}/actuator/health`, {
        method: 'GET',
        cache: 'no-store',
    }).catch(() => {
        // silencieux — best effort
    });
}