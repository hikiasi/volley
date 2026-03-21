import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { AuthProvider } from "@/components/auth/auth-provider";
import { BottomNav } from "@/components/layout/BottomNav";

import { LayoutProvider } from "@/app/contexts/LayoutContext";

const inter = Inter({ subsets: ["latin", "cyrillic"] });

export const metadata: Metadata = {
  title: "VOLLEYDZEN",
  description: "Telegram Mini App for Volleyballers",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="dark bg-v-dark">
      <head>
        <Script
          src="https://telegram.org/js/telegram-web-app.js"
          strategy="beforeInteractive"
        />
        <Script 
          src="https://telegram.org/js/telegram-widget.js?22"
          strategy="beforeInteractive"
        />
      </head>
      <body className={`${inter.className} bg-v-dark text-white antialiased`}>
        <LayoutProvider>
          <AuthProvider>
              <main className="max-w-md mx-auto w-full relative pb-32">
                {children}
              </main>
              <BottomNav />
          </AuthProvider>
        </LayoutProvider>
      </body>
    </html>
  );
}
