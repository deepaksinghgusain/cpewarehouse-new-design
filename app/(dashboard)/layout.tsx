import { Footer } from '@/components/shared/Footer';
import React from 'react'
import LearnerSidebar from './learner-sidebar';
import LearnerNavBar from './learner-navbar';
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function GuestLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const cookieStore = await cookies();
    const token = cookieStore.get("token");

    if (!token) {
        redirect("/login");
    }

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