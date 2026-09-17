"use client"
import { getCommonData } from '@/services/common'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import Search from './Search'
import { usePathname } from 'next/navigation'
import { CartComponent } from './cart'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '@/store/store'
import { userLogoutRequest } from '@/store/actions/user-actions'
import { useRouter } from 'next/navigation'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { ChevronDown, Menu } from 'lucide-react'
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet'

export const Header = () => {
    const [mounted, setMounted] = useState(false);

    const [logo, setLogo] = useState("");
    const pathname = usePathname();
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>()
    const user: any = useSelector((state: RootState) => state.user.user)
    const isAuthenticated = useSelector((state: RootState) => state.user.isAuthenticated)

    const getHeaderData = async () => {
        const response: any = await getCommonData()

        let logo = `${process.env.NEXT_PUBLIC_IMAGE_END_POINT}` + response?.data?.attributes?.headerLogo?.data?.attributes?.url;

        setLogo(logo)
    }

    const handleLogout = () => {
        dispatch(userLogoutRequest())
        localStorage.removeItem('token')
        localStorage.removeItem('userData')
        router.push('/')
    }

    useEffect(() => {
        getHeaderData();
        setMounted(true);
    }, [])

    if (mounted) {

        if (pathname !== "/login" && pathname !== "/register") {
            return (
                <div className='border-b border-gray-300'>
                    <div className='w-[90%] mx-auto'>
                        <header className="fixed top-0 left-0 z-10 w-full bg-white px-4 py-4 sm:px-6 sm:py-6">
                            <nav className="mx-auto flex w-full max-w-[1440px] flex-wrap items-center justify-between gap-4 lg:flex-nowrap lg:gap-8">
                                <div className="flex shrink-0 items-center">
                                    <Link href="/">
                                        {
                                            logo && <Image src={logo} alt="LOGO" height={250} width={250} className="h-auto w-[150px] sm:w-[210px]" />
                                        }
                                    </Link>
                                </div>
                                <div className="relative order-3 w-full py-1 lg:order-none lg:min-w-0 lg:flex-1">
                                    <Search />
                                </div >

                                <div className='flex items-center justify-end gap-3 sm:gap-6 lg:shrink-0'>
                                    <CartComponent />

                                    {isAuthenticated && user ? (
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

                                    ) : (
                                        <>
                                            <Link href="/login" className="hidden text-[#475467] text-lg font-semibold font-['Inter'] leading-7 sm:block">Log in</Link>

                                            <div className="hidden items-center justify-center gap-1.5 overflow-hidden rounded-[28px] border-2 border-white bg-[#2970fe] px-4 py-2.5 shadow-[inset_0px_0px_0px_1px_rgba(16,24,40,0.18)] sm:flex">
                                                <div className="px-0.5 justify-center items-center flex">
                                                    <Link href="/register" className="text-white text-lg font-semibold font-['Inter'] leading-7">Create profile</Link>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                    <Sheet>
                                        <SheetTrigger asChild>
                                            <button
                                                type="button"
                                                aria-label="Open navigation menu"
                                                className="rounded-md border border-gray-300 p-2 text-slate-700 sm:hidden"
                                            >
                                                <Menu className="h-5 w-5" />
                                            </button>
                                        </SheetTrigger>
                                        <SheetContent side="right" className="w-[min(85vw,360px)] bg-white">
                                            <SheetHeader>
                                                <SheetTitle>
                                                    {logo && (
                                                        <Image src={logo} alt="CPE Warehouse" height={100} width={200} className="h-auto w-[160px]" />
                                                    )}
                                                </SheetTitle>
                                            </SheetHeader>
                                            <nav className="flex flex-col gap-1 px-4">
                                                <SheetClose asChild>
                                                    <Link href="/course-catalog" className="rounded-md px-3 py-3 text-base font-semibold text-slate-700 hover:bg-gray-50">Course Catalogue</Link>
                                                </SheetClose>
                                                <SheetClose asChild>
                                                    <Link href="/bundle-and-subscription" className="rounded-md px-3 py-3 text-base font-semibold text-slate-700 hover:bg-gray-50">Bundles &amp; Subscriptions</Link>
                                                </SheetClose>
                                                <SheetClose asChild>
                                                    <Link href="/about-us" className="rounded-md px-3 py-3 text-base font-semibold text-slate-700 hover:bg-gray-50">About</Link>
                                                </SheetClose>
                                                {!isAuthenticated && (
                                                    <>
                                                        <SheetClose asChild>
                                                            <Link href="/login" className="rounded-md px-3 py-3 text-base font-semibold text-slate-700 hover:bg-gray-50">Log in</Link>
                                                        </SheetClose>
                                                        <SheetClose asChild>
                                                            <Link href="/register" className="rounded-md bg-[#2970fe] px-3 py-3 text-base font-semibold text-white">Create profile</Link>
                                                        </SheetClose>
                                                    </>
                                                )}
                                            </nav>
                                        </SheetContent>
                                    </Sheet>
                                </div>
                            </nav >
                        </header >

                        {
                            !pathname.includes("learner") && <section className="">
                                <div className="container mx-auto">
                                    <div className="mt-25 flex min-h-[72px] items-center justify-center px-4 sm:px-8">
                                        <div className="flex items-center justify-center gap-4">
                                            <div className="hidden items-center justify-center gap-6 sm:flex">
                                                <div
                                                    className="px-3 py-2 bg-white rounded-md justify-center items-center gap-2 flex overflow-hidden">
                                                    <div className="justify-start items-center gap-3 flex">
                                                        <Link href="/course-catalog"
                                                            className="justify-start text-Colors-Text-text-secondary_hover text-lg font-semibold font-['Inter'] leading-normal">Course
                                                            Catalogue</Link>
                                                    </div>
                                                </div>
                                                <div
                                                    className="px-3 py-2 bg-white rounded-md justify-start items-center gap-2 flex overflow-hidden">
                                                    <div className="justify-start items-center gap-3 flex">
                                                        <Link href="/bundle-and-subscription"
                                                            className="justify-start text-Colors-Text-text-secondary_hover text-lg font-semibold font-['Inter'] leading-normal">Bundles
                                                            & Subcriptions</Link>
                                                    </div>
                                                </div>
                                                <div
                                                    className="h-11 px-3 py-2  rounded-md justify-start items-center gap-2 flex overflow-hidden">
                                                    <div className="grow shrink basis-0 h-7 justify-center items-center gap-3 flex">
                                                        <Link href="/about-us"
                                                            className="justify-start text-Colors-Text-text-secondary_hover text-lg font-semibold font-['Inter'] leading-normal">About</Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </div >
                                    </div >
                                </div >
                            </section >
                        }
                    </div>
                </div>
            )
        }
    }

}
