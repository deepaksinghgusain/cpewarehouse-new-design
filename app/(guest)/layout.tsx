import { Footer } from '@/components/shared/Footer';
import { Header } from '@/components/shared/Header';
import LoadingUI from '@/components/ui/loading';
import { Metadata } from 'next';
import React from 'react'


export default function GuestLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className='flex h-screen flex-col'>
            <Header />
            <main className='flex-1 wrapper'>{children}</main>
            <Footer />
        </div>
    );
}