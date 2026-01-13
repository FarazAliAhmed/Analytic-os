'use client'

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NextTopLoader from 'nextjs-toploader';
import AuthProvider from '@/components/providers/AuthProvider';
import { ZendeskProvider } from '@/components/providers/ZendeskProvider';
import {
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <ZendeskProvider>
              <NextTopLoader color="#4459FF" showSpinner={false} />
              {children}
            </ZendeskProvider>
          </AuthProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
