import { Footer } from '@/components/shared/Footer';
import React from 'react'
import LearnerSidebar from './learner-sidebar';
import { ChevronDown, LucideShoppingCart, Search } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import LearnerNavBar from './learner-navbar';


export default function GuestLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {



    return (
        <div className='flex flex-col h-screen'>
            <main className='flex flex-1 wrapper'>
                <LearnerSidebar />
                <div className='w-full'>
                    <LearnerNavBar />
                    {children}
                </div>
            </main >
            <Footer />
        </div >
    );
}