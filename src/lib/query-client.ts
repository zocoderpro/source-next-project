import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * 60_000,       // 5 min avant de considérer la donnée périmée
            gcTime: 30 * 60_000,         // 30 min en mémoire avant purge
            refetchOnWindowFocus: false, // pas de refetch à chaque alt-tab
            refetchOnReconnect: false,
            retry: 1,
        },
    },
});