import { Metadata } from "next";
import "./globals.css";
import ApolloWrapper from "@/components/providers/apollo-wrapper";

import { ToastContainer } from 'react-toastify';
import CookieConsent from '@/components/shared/CookieConsent';

import { Inter } from 'next/font/google';
import { getCommonData } from "@/services/common";
import DisableDevTools from "@/components/shared/DisableDevTools";

const inter = Inter({ subsets: ['latin'] });

export async function generateMetadata(): Promise<Metadata> {
  const response: any = await getCommonData()

  let logo = `${process.env.NEXT_PUBLIC_IMAGE_END_POINT}` + response?.data?.attributes?.headerLogo?.data?.attributes?.url;

  return {
    title: "CPE Warehouse",

    icons: {
      icon: logo
        ? [
          {
            url: logo,
            type: "image/png",
          },
        ]
        : "/favicon.ico",
    },
  };
}

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

        <DisableDevTools />

        <ToastContainer
          position="top-center"
          autoClose={3000}
          className="custom-toast-container"
          toastClassName="custom-toast" />
      </body>
    </html>
  );
}
