import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { AuthProvider } from "@/components/auth/auth-provider";

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
    <html lang="ru" className="dark">
      <head>
        <Script
          src="https://telegram.org/js/telegram-web-app.js"
          strategy="beforeInteractive"
        />
      </head>
      <body className={`${inter.className} bg-[#0A0A0A] text-white min-h-screen antialiased overflow-x-hidden`}>
        <AuthProvider>
          <main className="max-w-[430px] mx-auto min-h-screen relative pb-20">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
