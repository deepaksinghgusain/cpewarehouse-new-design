"use client"

import { getHomePageSection } from '@/services/common';
import { addNewLetter } from '@/services/newsletter';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';

const NewsLetter = () => {
    const [newsLetter, setNewsLetter] = useState<any>(null);
    const [email, setEmail] = useState("");

    useEffect(() => {
        getHomePageSection().then((res) => {
            if (res) {
                setNewsLetter(res?.data?.attributes?.blocks.filter((x: { __component: string; }) => x.__component === 'blocks.subscription')[0])
            }
        })
    }, []);


    const submit = async (event: any) => {

        event.preventDefault();

        try {
            await addNewLetter({
                data: { email }
            })

            toast.success("Thank you for subscribing to our newsletter! You'll start receiving the latest updates and exclusive offers soon.")

            setEmail("")
        } catch (error) {
            toast.error("Something went wrong")
        }

    }

    return (
        <section className="container mx-auto px-4 sm:px-6">
            <div className="bg-white py-10 sm:py-24">
                <div className="w-full">
                    <div className="flex flex-col items-center gap-8 rounded-2xl bg-gray-50 p-6 sm:p-16">
                        <div className="flex w-full flex-col items-center gap-5">
                            <div className="w-full text-center text-2xl font-semibold leading-tight text-[#101828] sm:text-4xl sm:leading-[44px]">{newsLetter?.title}</div>
                            <div className="w-full text-center text-lg font-normal leading-7 text-[#475467] sm:text-xl sm:leading-[30px]">{newsLetter?.sub_title}</div>
                        </div>
                        <form onSubmit={submit} className="w-full max-w-2xl">
                            <div className="flex w-full flex-col items-stretch gap-3 sm:flex-row sm:items-start sm:gap-4">
                                <div className="min-w-0 flex-1">
                                    <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Enter your email" className="h-12 w-full rounded-lg border border-[#d0d5dd] bg-white px-3.5 py-3 shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] focus:outline-gray-500" />
                                </div>
                                <div className="flex justify-center rounded-[28px] border-2 border-white bg-[#2970fe] px-[18px] py-3 shadow-[inset_0px_0px_0px_1px_rgba(16,24,40,0.18)] sm:shrink-0">
                                    <div className="px-0.5">
                                        <button type='submit' className="w-full cursor-pointer text-base font-semibold leading-normal text-white">Subscribe</button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section >
    )
}

export default NewsLetter