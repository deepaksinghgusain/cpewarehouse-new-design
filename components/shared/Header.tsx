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
                <div className='z-10'>
                    <div className='w-[90%] mx-auto'>
                        <header className="fixed left-0 top-0 z-40 w-full bg-white px-4 py-3 sm:px-6 sm:py-4 lg:pt-3">
                            <nav className="mx-auto grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-3 lg:flex lg:flex-nowrap lg:justify-between lg:gap-8">
                                <div className="flex min-w-0 items-center">
                                    <Link href="/">
                                        {
                                            logo && <Image src={logo} alt="LOGO" height={250} width={250} className="h-auto w-[min(150px,40vw)] max-w-full sm:w-[210px]" />
                                        }
                                    </Link>
                                </div>
                                <div className="relative col-span-2 row-start-2 w-full min-w-0 lg:order-none lg:col-auto lg:row-auto lg:flex-1 lg:py-1">
                                    <Search />
                                </div >

                                <div className='col-start-2 row-start-1 flex items-center justify-end gap-2 sm:gap-6 lg:col-auto lg:row-auto lg:shrink-0'>
                                    <CartComponent />

                                    {isAuthenticated && user ? (
                                        <DropdownMenu modal={false}>
                                            <DropdownMenuTrigger asChild>
                                                <button className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-300 bg-white px-2 py-2 shadow-sm sm:px-4 sm:py-2.5">
                                                    <span className="max-w-[72px] truncate text-base font-semibold text-slate-700 sm:max-w-[120px]">
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
                                                    <Link href="/learner/cpe-tracker" prefetch={false}>CPE Tracker</Link>
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

                        <div aria-hidden="true" className="hidden h-[84px] lg:block" />

                        <section className="hidden border-b border-gray-200 bg-white lg:block">
                            <div className="container mx-auto">
                                <div className="flex min-h-[50px] items-center justify-center px-4 sm:px-8">
                                    <div className="flex items-center justify-center gap-4">
                                        <div className="hidden items-center justify-center gap-6 sm:flex">
                                            <div className="px-3 py-2 bg-white rounded-md justify-center items-center gap-2 flex overflow-hidden">
                                                <div className="justify-start items-center gap-3 flex">
                                                    <Link href="/course-catalog"
                                                        className="justify-start text-Colors-Text-text-secondary_hover text-lg font-semibold font-['Inter'] leading-normal">Course
                                                        Catalogue</Link>
                                                </div>
                                            </div>
                                            <div className="px-3 py-2 bg-white rounded-md justify-start items-center gap-2 flex overflow-hidden">
                                                <div className="justify-start items-center gap-3 flex">
                                                    <Link href="/bundle-and-subscription"
                                                        className="justify-start text-Colors-Text-text-secondary_hover text-lg font-semibold font-['Inter'] leading-normal">Bundles
                                                        & Subcriptions</Link>
                                                </div>
                                            </div>
                                            <div className="h-11 px-3 py-2 rounded-md justify-start items-center gap-2 flex overflow-hidden">
                                                <div className="grow shrink basis-0 h-7 justify-center items-center gap-3 flex">
                                                    <Link href="/about-us"
                                                        className="justify-start text-Colors-Text-text-secondary_hover text-lg font-semibold font-['Inter'] leading-normal">About</Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                    </div>
                </div>
            )
        }
    }

}
