import type { Metadata } from "next";
import { Inter, Inter_Tight, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const interBody = Inter({
    subsets: ["latin"],
    weight: ["400", "500", "600"],
    variable: "--font-body",
});

const interTightDisplay = Inter_Tight({
    subsets: ["latin"],
    weight: ["500", "600", "700", "800"],
    variable: "--font-display",
});

const plexMono = IBM_Plex_Mono({
    subsets: ["latin"],
    weight: ["400", "500"],
    variable: "--font-mono",
});

export const metadata: Metadata = {
    title: "AthenaEvent — Transformez vos événements en intelligence",
    description:
        "AthenaEvent est la plateforme d'intelligence événementielle. Inscription, badges instantanés, capture de leads par QR, automatisation marketing et analytics en temps réel.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="fr"
            className={`${interBody.variable} ${interTightDisplay.variable} ${plexMono.variable} h-full antialiased`}
        >
            <body className="min-h-full flex flex-col">
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}