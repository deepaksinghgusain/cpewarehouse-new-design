import { Footer } from '@/components/shared/Footer';
import { Header } from '@/components/shared/Header';
import Link from 'next/link';
import React from 'react'
import LearnerSidebar from './learner-sidebar';


export default function GuestLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {



    return (
        <div className='flex flex-col h-screen'>
            <Header />
            <main className='flex flex-1 wrapper'>
                <LearnerSidebar />
                <div>
                    {children}
                </div>
            </main >
            <Footer />
        </div >
    );
}