"use client";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import SearchComponent from '@/components/shared/Search';
import { ChevronDown, Search } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { userLogoutRequest } from '@/store/actions/user-actions';
import { RootState } from '@/store/store';
import { imageUrl } from '@/lib/constants';

const LearnerNavBar = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.user.user as any);
    const cartItemsCount = useSelector((state: RootState) => state.cart.items?.length ?? 0);
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    const profileImage = user?.profileImage?.url
        ? `${imageUrl}${user.profileImage.url}`
        : "https://placehold.co/29x29";

    const handleLogout = () => {
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
        <div className="sticky top-0 z-50 flex w-full max-w-[1280px] flex-wrap items-center justify-between gap-3 bg-white px-4 py-4 sm:px-6 lg:flex-nowrap lg:gap-0 lg:px-8 lg:py-5">

            <Link href="/" className="lg:hidden" aria-label="Go to homepage">
                <Image
                    src="/assets/images/logo.png"
                    alt="CPE Warehouse"
                    width={120}
                    height={42}
                    className="h-10 w-auto object-contain"
                    priority
                />
            </Link>

            {/* LEFT MENU */}
            <div className="hidden items-center gap-1 lg:flex">

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

                {/* <div className="px-3 py-2 rounded-md flex items-center gap-2">
                    <span className="text-base font-semibold text-gray-600">
                        Cpe Forums
                    </span>
                </div> */}
            </div>


            {/* RIGHT SIDE */}
            <div className="ml-auto flex items-center gap-2 sm:gap-4 lg:ml-0 lg:gap-4">

                {/* icon box */}
                <div className="relative hidden lg:block">
                    <button
                        type="button"
                        onClick={() => setIsSearchOpen((prev) => !prev)}
                        className="w-12 h-12 p-2 bg-white rounded-md flex justify-center items-center cursor-pointer hover:bg-gray-50"
                        aria-label="Open search"
                    >
                        <Search className="w-5 h-5 text-gray-700" />
                    </button>

                    {isSearchOpen && (
                        <div className="absolute right-0 top-[52px] z-[60] w-[min(360px,calc(100vw-2rem))] rounded-xl border border-gray-200 bg-white p-3 shadow-xl">
                            <SearchComponent />
                        </div>
                    )}
                </div>

                {/* cart icon with counter */}
                <div className="relative w-12 h-12 flex items-center justify-center">
                    <img src="/assets/icons/cart-image.png" className="w-8 h-8" alt="cart" />
                    {cartItemsCount > 0 && (
                        <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1 text-[10px] font-semibold text-white">
                            {cartItemsCount}
                        </span>
                    )}
                </div>

                {/* avatar */}
                <img
                    className="hidden h-7 w-7 lg:block"
                    src={profileImage}
                    alt="profile"
                />

                {/* account menu */}
                <DropdownMenu modal={false}>
                    <DropdownMenuTrigger asChild>
                        <button className="px-4 py-2.5 cursor-pointer bg-white rounded-lg border border-gray-300 shadow-sm flex items-center gap-2">
                            <span className="max-w-[120px] truncate text-base font-semibold text-slate-700 sm:max-w-none">
                                {user?.firstName || user?.username || 'My Account'}
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
                        <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
                            Logout
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    )
}

export default LearnerNavBar