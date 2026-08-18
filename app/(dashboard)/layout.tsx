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
        <div className='flex min-h-screen flex-col bg-gray-50'>
            <main className='flex flex-1 items-stretch'>
                <div className='sticky top-0 h-screen w-[260px] shrink-0 border-r border-gray-200 bg-white'>
                    <LearnerSidebar />
                </div>

                <div className='flex min-w-0 flex-1 flex-col'>
                    <LearnerNavBar />
                    <div className='flex-1'>{children}</div>
                </div>
            </main>

            <Footer />
        </div>
    );
}