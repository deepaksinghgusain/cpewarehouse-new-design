import { Metadata } from "next";
import "./globals.css";
import ApolloWrapper from "@/components/providers/apollo-wrapper";

import { ToastContainer } from 'react-toastify';
import CookieConsent from '@/components/shared/CookieConsent';

import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    template: '%s | CPEWarehouse',
    default: 'CPEWarehouse',
  },
  description: 'The official Next.js Course Dashboard',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SERVER_URL as string),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ApolloWrapper>
          <>
            {children}
            <CookieConsent />
          </>
        </ApolloWrapper>

        <ToastContainer 
          position="top-center" 
          autoClose={3000}
          className="custom-toast-container"
          toastClassName="custom-toast" />
      </body>
    </html>
  );
}
