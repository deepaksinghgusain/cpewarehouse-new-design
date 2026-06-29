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
        <section className="container mx-auto">
            <div className="h-[444px] pb-24 bg-white flex-col justify-center items-center overflow-hidden">
                <div className="self-stretch h-[348px] px-8 flex-col justify-start items-start gap-8 flex">
                    <div className="self-stretch h-[348px] p-16 bg-gray-50 rounded-2xl flex-col justify-start items-center gap-8 flex">
                        <div className="self-stretch h-[94px] flex-col justify-start items-center gap-5 flex">
                            <div className="self-stretch text-center text-[#101828] text-4xl font-semibold font-['Inter'] leading-[44px]">{newsLetter?.title}</div>
                            <div className="self-stretch text-center text-[#475467] text-xl font-normal font-['Inter'] leading-[30px]">{newsLetter?.sub_title}</div>
                        </div>
                        <form onSubmit={submit}>
                            <div className="justify-center items-start gap-4 inline-flex">
                                <div className="grow shrink basis-0 flex-col justify-center inline-flex">
                                    <div className="self-stretch h-12 flex-col justify-start items-start gap-1.5 flex w-[400px]">
                                        <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Enter your email" className="self-stretch px-3.5 py-3 bg-white rounded-lg shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] border border-[#d0d5dd] focus:outline-gray-500 justify-start items-center gap-2 inline-flex" />
                                    </div>
                                </div>
                                <div className="px-[18px] py-3 bg-[#2970fe] rounded-[28px] shadow-[inset_0px_0px_0px_1px_rgba(16,24,40,0.18)] border-2 border-white justify-center items-center gap-1.5 flex overflow-hidden">
                                    <div className="px-0.5 justify-center items-center flex">
                                        <button type='submit' className="text-white cursor-pointer text-base font-semibold font-['Inter'] leading-normal">Subscribe</button>
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