'use client'

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NextTopLoader from 'nextjs-toploader';
import AuthProvider from '@/components/providers/AuthProvider';
import { ZendeskProvider } from '@/components/providers/ZendeskProvider';

import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultConfig,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  base,
} from 'wagmi/chains';
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

const config = getDefaultConfig({
  appName: 'Analyti-web3',
  projectId: `${process.env.NEXT_PUBLIC_PROJECT_ID}`,
  chains: [mainnet, polygon, optimism, arbitrum, base],
  ssr: true,
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
        <WagmiProvider config={config}>
          <QueryClientProvider client={queryClient}>
            <RainbowKitProvider>
              <AuthProvider>
                <ZendeskProvider>
                  <NextTopLoader color="#4459FF" showSpinner={false} />
                  {children}
                </ZendeskProvider>
              </AuthProvider>
            </RainbowKitProvider>
          </QueryClientProvider>
        </WagmiProvider>
      </body>
    </html>
  );
}
