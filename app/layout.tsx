import "./globals.css";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import AppLayout from "./components/app-layout";
import { AuthProvider } from "./contexts/app-auth-context";
import { PostsProvider } from "./contexts/posts-data-context";
import { MessagesProvider } from "./contexts/messages-context";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "ChillZone",
    description: "ChillZone Social Network",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang='en'>
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}>
                <AuthProvider>
                    <PostsProvider>
                        <MessagesProvider>
                            <AppLayout>{children}</AppLayout>
                        </MessagesProvider>
                    </PostsProvider>
                </AuthProvider>
            </body>
        </html>
    );
}
