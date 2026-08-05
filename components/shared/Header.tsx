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
import { ChevronDown } from 'lucide-react'

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
                        <header className="flex justify-center fixed px-2 py-6 top-0 left-0 bg-white z-10 w-[100%]">
                            <nav className="flex justify-between gap-8">
                                <div className="flex items-center w-[300px]">
                                    <Link href="/">
                                        {
                                            logo && <Image src={logo} alt="LOGO" height={250} width={250} />
                                        }
                                    </Link>
                                </div>
                                <div className="relative pr-3 md:pr-0 py-1 lg:w-[600px]">
                                    <Search />
                                </div >

                                <div className='flex justify-end w-[400px] gap-8 items-center'>
                                    <CartComponent />

                                    {isAuthenticated && user ? (
                                        <DropdownMenu modal={false}>
                                            <DropdownMenuTrigger asChild>
                                                <button className="px-4 py-2.5 cursor-pointer bg-white rounded-lg border border-gray-300 shadow-sm flex items-center gap-2">
                                                    <span className="text-base font-semibold text-slate-700">
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
                                            <Link href="/login" className="text-[#475467] text-lg font-semibold font-['Inter'] leading-7">Log in</Link>

                                            <div className="px-4 py-2.5 bg-[#2970fe] rounded-[28px] shadow-[inset_0px_0px_0px_1px_rgba(16,24,40,0.18)] border-2 border-white justify-center items-center gap-1.5 flex overflow-hidden">
                                                <div className="px-0.5 justify-center items-center flex">
                                                    <Link href="/register" className="text-white text-lg font-semibold font-['Inter'] leading-7">Create profile</Link>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </nav >
                        </header >

                        {
                            !pathname.includes("learner") && <section className="">
                                <div className="container mx-auto">
                                    <div className="h-[72px] px-8 mt-25 justify-center items-center">
                                        <div className="justify-center items-center gap-4 flex">
                                            <div className="justify-center items-center gap-6 flex">
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
