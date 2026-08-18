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
            <div className='flex flex-1 items-start'>
                <aside className='sticky top-0 h-screen w-[260px] shrink-0 overflow-y-hidden border-r border-gray-200 bg-white'>
                    <LearnerSidebar />
                </aside>

                <div className='flex min-w-0 flex-1 flex-col'>
                    <LearnerNavBar />
                    <main className='flex-1 overflow-x-hidden'>{children}</main>
                </div>
            </div>

            <Footer />
        </div>
    );
}