function required(name: string, value: string | undefined): string {
    if (!value) {
        throw new Error(`Variable d'environnement manquante: ${name}`);
    }
    return value;
}

export const env = {
    apiUrl: required('NEXT_PUBLIC_API_URL', process.env.NEXT_PUBLIC_API_URL),
    apiImageUrl: process.env.NEXT_PUBLIC_API_URL_IMAGE ?? '',
    eventsBucketUrl: required(
        'NEXT_PUBLIC_EVENTS_BUCKET_URL',
        process.env.NEXT_PUBLIC_EVENTS_BUCKET_URL
    ),
    googleClientId: required('NEXT_PUBLIC_GOOGLE_CLIENT_ID', process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID),
    profil: required('NEXT_PUBLIC_PROFIL', process.env.NEXT_PUBLIC_PROFIL),
};