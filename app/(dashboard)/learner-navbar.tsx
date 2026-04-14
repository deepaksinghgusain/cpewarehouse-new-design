"use client";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { ChevronDown, LucideShoppingCart, Search } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { userLogoutRequest } from '@/store/actions/user-actions';
import { RootState } from '@/store/store';
import { imageUrl } from '@/lib/constants';

const LearnerNavBar = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.user.user as any);

    const profileImage = user?.profileImage?.url
        ? `${imageUrl}${user.profileImage.url}`
        : "https://placehold.co/29x29";

    const handlogout = () => {
        dispatch(userLogoutRequest());

        localStorage.removeItem('remember');
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('lastname');
        localStorage.removeItem('userId');
        localStorage.removeItem('userData');
        localStorage.removeItem('email');
        localStorage.removeItem('PTIN');
        localStorage.removeItem('rem_email');
        localStorage.removeItem('rem_pass');
        document.cookie = "token=; path=/; max-age=0; SameSite=Lax";

        router.push('/login');
    }

    return (
        <div className="sticky top-0 z-50 bg-white py-5 w-full max-w-[1280px] px-8  flex justify-between items-center">

            {/* LEFT MENU */}
            <div className="flex items-center gap-1">

                <div className="px-3 py-2 rounded-md flex items-center gap-2">
                    <Link href="/about-us" className="text-base font-semibold text-gray-600">
                        About
                    </Link>
                </div>

                <div className="px-3 py-2 rounded-md  flex items-center gap-2">
                    <Link href="/course-catalog" className="text-base font-semibold ">
                        Course Catalogue
                    </Link>
                </div>

                <div className="px-3 py-2 rounded-md flex items-center gap-2">
                    <span className="text-base font-semibold text-gray-600">
                        Self-Study
                    </span>
                </div>

                <div className="px-3 py-2 rounded-md flex items-center gap-2">
                    <span className="text-base font-semibold text-gray-600">
                        Cpe Forums
                    </span>
                </div>
            </div>


            {/* RIGHT SIDE */}
            <div className="flex items-center gap-4">

                {/* icon box */}
                <div className="w-12 h-12 p-2 bg-white rounded-md flex justify-center items-center">
                    <div className="w-6 h-6 relative">
                        <div className="w-4 h-4 absolute left-[3px] top-[3px]">
                            <Search />
                        </div>
                    </div>
                </div>

                {/* black square */}
                <div className="w-12 h-12 flex items-center">
                    <img src="/assets/icons/cart-image.png" className="w-8 h-8"></img>
                </div>

                {/* avatar */}
                <img
                    className="w-7 h-7"
                    src={profileImage}
                    alt="profile"
                />

                {/* dashboard button */}
                <DropdownMenu modal={false}>
                    <DropdownMenuTrigger asChild>
                        <button className="px-4 py-2.5 cursor-pointer bg-white rounded-lg border border-gray-300 shadow-sm flex items-center gap-2">
                            <span className="text-base font-semibold text-slate-700">
                                Dashboard
                            </span>
                            <ChevronDown className="w-4 h-4" />
                        </button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end" className="w-44 z-50 bg-white rounded-md border border-gray-200 shadow-lg">
                        <DropdownMenuItem className="cursor-pointer" asChild>
                            <Link href="/learner/dashboard" prefetch={false}>Dashboard</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer" asChild>
                            <Link href="/learner/certificates" prefetch={false}>Certificates</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer" asChild>
                            <Link href="/learner/invoice" prefetch={false}>Invoices</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer" asChild>
                            <Link href="/learner/profile" prefetch={false}>Profile</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer" onClick={handlogout}>
                            Logout
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    )
}

export default LearnerNavBar