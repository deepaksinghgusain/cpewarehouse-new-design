import { Metadata } from "next";
import "./globals.css";
import ApolloWrapper from "@/components/providers/apollo-wrapper";

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
        <ApolloWrapper>{children}</ApolloWrapper>
      </body>
    </html>
  );
}
