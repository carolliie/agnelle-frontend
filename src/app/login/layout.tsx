import type { Metadata } from "next";
import "./../../app/globals.css";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
    title: "Admin Panel - Login",
    description: "Login - Agnelle Admin Panel",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <main className="w-full">{children}</main>
                </ThemeProvider>
            </body>
        </html>
    );
}
