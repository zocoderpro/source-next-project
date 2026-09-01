import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
    title: "SOurce Next Project",
    description:
        "Description de l'application Source Next Project",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="fr"
            className=""
        >
            <body className="min-h-full flex flex-col">
                {children}
            </body>
        </html>
    );
}