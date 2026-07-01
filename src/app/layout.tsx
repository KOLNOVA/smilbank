import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import { AuthProvider } from "@/context/auth-context";
import { Toaster } from "sonner";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/routing';
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat", display: "swap" });

export const metadata: Metadata = {
  title: { default: "Smil-Bank | Votre partenaire financier", template: "%s | Smil-Bank" },
  description: "Plateforme sécurisée de gestion de patrimoine, d'investissement et de crédit.",
  icons: { icon: "/favicon.png", shortcut: "/favicon.png", apple: "/logo.png" },
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={`${inter.variable} ${montserrat.variable} antialiased bg-white text-gray-800`}>
        <NextIntlClientProvider messages={messages}>
          <AuthProvider>
            {children}
            <Toaster position="top-right" richColors closeButton toastOptions={{ duration: 4000 }} />
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
