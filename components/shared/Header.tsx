"use client"
import { getCommonData } from '@/services/common'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import Search from './Search'

export const Header = () => {
    const [logo, setLogo] = useState("http://srv1246425.hstgr.cloud:3000/uploads/CPEW_Logo_230_42_light_bg_f108e1dbca_5125244a0f.png");

    const getHeaderData = async () => {
        const response: any = await getCommonData()

        let logo = `${process.env.NEXT_PUBLIC_IMAGE_END_POINT}` + response?.data?.attributes?.headerLogo?.data?.attributes?.url;

        console.log(logo);


        setLogo(logo)
    }

    useEffect(() => {
        // getHeaderData();
    }, [])

    return (
        <div className='w-[90%] mx-auto'>
            <header className="flex sticky px-2 py-2 mt-4 top-0 bg-white z-50 w-[100%]">
                <nav className="flex justify-between gap-8">
                    <div className="flex items-center w-[300px]">
                        <a href="/">
                            <Image src={logo} alt="LOGO" height={200} width={200} />
                        </a>
                    </div>
                    <div className="relative pr-3 md:pr-0 py-1 lg:w-[600px]">
                        <div className="justify-start items-center gap-4 flex w-full">
                            <div className="h-12 justify-start items-center flex border border-[#D0D5DD] rounded-md w-full">
                                <div className="pr-3 inset-y-0 pl-3 flex items-center cursor-pointer">
                                    <svg className="h-5 w-5 text-[#667085] " xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                        stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                            d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
                                    </svg>
                                </div>
                                <div className=" md:w-full self-stretch flex-col justify-start gap-1.5 inline-flex">
                                    <div className="relative">
                                        <div className="searchBox relative w-full bg-white rounded-lg ">
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div >

                    <div className='flex justify-end w-[400px] gap-8 items-center'>
                        <a href="/checkout"
                            className="text-[#475467] text-lg font-semibold font-['Inter'] leading-7 flex items-center">
                            <Image src="/assets/images/cart.gif" height={30} width={30} className="h-[30px] w-[30px]" alt="" />
                        </a>

                        <a href="/login" className="text-[#475467] text-lg font-semibold font-['Inter'] leading-7">Log in</a>

                        <div
                            className="px-4 py-2.5 bg-[#2970fe] rounded-[28px] shadow-[inset_0px_0px_0px_1px_rgba(16,24,40,0.18)] border-2 border-white justify-center items-center gap-1.5 flex overflow-hidden">
                            <div className="px-0.5 justify-center items-center flex">
                                <a href="/register" className="text-white text-lg font-semibold font-['Inter'] leading-7">Create
                                    profile</a>
                            </div>
                        </div>
                    </div>
                </nav >
            </header >

            <section className="border-b border-gray-300">
                <div className="container mx-auto">
                    <div className="h-[72px] px-8 mt-4 justify-center items-center">
                        <div className="justify-center items-center gap-4 flex">
                            <div className="justify-center items-center gap-6 flex">
                                <div
                                    className="px-3 py-2 bg-white rounded-md justify-center items-center gap-2 flex overflow-hidden">
                                    <div className="justify-start items-center gap-3 flex">
                                        <a href="/course-catalog"
                                            className="justify-start text-Colors-Text-text-secondary_hover text-lg font-semibold font-['Inter'] leading-normal">Course
                                            Catalogue</a>
                                    </div>
                                </div>
                                <div
                                    className="px-3 py-2 bg-white rounded-md justify-start items-center gap-2 flex overflow-hidden">
                                    <div className="justify-start items-center gap-3 flex">
                                        <a href="/bundle-and-subscription"
                                            className="justify-start text-Colors-Text-text-secondary_hover text-lg font-semibold font-['Inter'] leading-normal">Bundles
                                            & Subcriptions</a>
                                    </div>
                                </div>
                                <div className="h-10 px-3 py-2 rounded-md justify-start items-center gap-2 flex overflow-hidden">
                                    <div className="grow shrink basis-0 h-6 justify-start items-center gap-3 flex">
                                        <div className="justify-start text-Colors-Text-text-secondary_hover text-lg font-semibold font-['Inter'] leading-normal">CPE Forums</div>
                                    </div>
                                </div>
                                <div
                                    className="h-11 px-3 py-2  rounded-md justify-start items-center gap-2 flex overflow-hidden">
                                    <div className="grow shrink basis-0 h-7 justify-center items-center gap-3 flex">
                                        <a href="/about-us"
                                            className="justify-start text-Colors-Text-text-secondary_hover text-lg font-semibold font-['Inter'] leading-normal">About</a>
                                    </div>
                                </div>
                            </div>
                        </div >
                    </div >
                </div >
            </section >

        </div>
    )
}
