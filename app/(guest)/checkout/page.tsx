import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import React from 'react'

const CheckoutPage = () => {
    return (
        <>
            <section className="container mx-auto ">
                <div className="justify-center flex py-20">
                    <div className="flex">
                        <div className="flex-col justify-start items-center gap-4 inline-flex">
                            <div className="w-8 h-8 bg-[#f9f5ff] rounded-full justify-center items-center inline-flex overflow-hidden">
                                <div className="w-8 h-8 relative bg-[#15b69e] rounded-2xl flex-col justify-start items-start flex">

                                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <g id="Content">
                                            <path
                                                d="M0 16C0 7.16344 7.16344 0 16 0C24.8366 0 32 7.16344 32 16C32 24.8366 24.8366 32 16 32C7.16344 32 0 24.8366 0 16Z"
                                                fill="#15B79E" />
                                            <path id="Tick" fillRule="evenodd" clipRule="evenodd"
                                                d="M22.7934 9.85346L13.2467 19.0668L10.7134 16.3601C10.2467 15.9201 9.51339 15.8935 8.98005 16.2668C8.46005 16.6535 8.31338 17.3335 8.63338 17.8801L11.6334 22.7601C11.9267 23.2135 12.4334 23.4935 13.0067 23.4935C13.5534 23.4935 14.0734 23.2135 14.3667 22.7601C14.8467 22.1335 24.0067 11.2135 24.0067 11.2135C25.2067 9.9868 23.7534 8.9068 22.7934 9.84013V9.85346Z"
                                                fill="white" />
                                        </g>
                                    </svg>

                                </div>
                            </div>
                            <div className="self-stretch h-6 flex-col justify-start items-center gap-0.5 flex">
                                <div className="self-stretch text-center text-[#344054] text-base font-semibold font-['Inter'] leading-normal">
                                    Enrollment</div>
                            </div>
                        </div>

                        <div className="w-[400px] h-0.5 mt-4 bg-[#155dee]" style={{ marginLeft: "-25px", marginRight: "-50px" }}></div>

                        <div className="flex-col justify-start items-center gap-4 inline-flex">
                            <div className="w-8 h-8 bg-[#f9f5ff] rounded-full justify-center items-center inline-flex overflow-hidden">
                                <div className="w-8 h-8 relative bg-[#15b69e] rounded-2xl flex-col justify-start items-start flex">
                                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <g id="Content">
                                            <path
                                                d="M0 16C0 7.16344 7.16344 0 16 0C24.8366 0 32 7.16344 32 16C32 24.8366 24.8366 32 16 32C7.16344 32 0 24.8366 0 16Z"
                                                fill="#15B79E" />
                                            <circle id="Dot" cx="16" cy="16" r="5" fill="white" />
                                        </g>
                                    </svg>
                                </div>
                            </div>
                            <div className="self-stretch h-6 flex-col justify-start items-center gap-0.5 flex">
                                <div className="self-stretch text-center text-[#344054] text-base font-semibold font-['Inter'] leading-normal">
                                    Participants details</div>
                            </div>
                        </div>

                        <div className="w-[400px] h-0.5 mt-4 bg-[#e4e7ec]" style={{ marginLeft: "-50px", marginRight: "-25px" }}></div>

                        <div className="flex-col justify-start items-center gap-4 inline-flex">
                            <div className="w-8 h-8 bg-[#f9f5ff] rounded-full justify-center items-center inline-flex overflow-hidden">
                                <div className="w-8 h-8 relative rounded-2xl flex-col justify-start items-start flex">

                                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <g id="Content">
                                            <path
                                                d="M1 16C1 7.71573 7.71573 1 16 1C24.2843 1 31 7.71573 31 16C31 24.2843 24.2843 31 16 31C7.71573 31 1 24.2843 1 16Z"
                                                stroke="#E4E7EC" strokeWidth="2" />
                                            <circle id="Dot" cx="16" cy="16" r="5" fill="#D0D5DD" />
                                        </g>
                                    </svg>


                                </div>
                            </div>
                            <div className="self-stretch h-6 flex-col justify-start items-center gap-0.5 flex">
                                <div className="self-stretch text-center text-[#344054] text-base font-semibold font-['Inter'] leading-normal">
                                    Paymment</div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            <section className="mb-20">

                <div className="px-1 h-auto rounded-lg justify-start items-start">
                    <div className="mb-12 px-8 flex-col justify-start items-start gap-6 inline-flex">
                        <div className="justify-center items-center gap-3 inline-flex overflow-hidden">
                            <div className="w-6 h-6 relative  overflow-hidden">

                                <Link href="/course-catalog">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <g id="arrow-circle-left">
                                            <path id="Icon"
                                                d="M12 8L8 12M8 12L12 16M8 12H16M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
                                                stroke="#004EEB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </g>
                                    </svg>
                                </Link>
                            </div>
                            <div className="text-[#475467] text-lg font-semibold font-['Inter'] leading-7">Back to Catalogue</div>
                        </div>
                        <div className="self-stretch h-[38px] flex-col justify-start items-start gap-5 flex">
                            <div className="self-stretch justify-start items-start gap-4 inline-flex">
                                <div className="grow shrink basis-0 flex-col justify-start items-start gap-1 inline-flex">
                                    <div className="self-stretch text-[#101828] text-3xl font-semibold font-['Inter'] leading-[38px]">Checkout</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="px-4 flex-col justify-start items-start inline-flex">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="w-full">
                            <table className="w-full">
                                <thead className="self-stretch h-11 px-6 py-3 bg-[#eff4ff] border-b border-[#e4e7ec]">
                                    <th
                                        className="text-[#101828] text-lg font-semibold font-['Inter'] leading-7 text-left w-[60%] border-r-4 border-white pl-4">
                                        Order Summary</th>
                                    <th className="text-[#101828] text-lg font-semibold font-['Inter'] leading-7 text-left pl-4">Enrollments</th>
                                    <th className="text-[#101828] text-lg font-semibold font-['Inter'] leading-7 text-left pl-4">Price</th>
                                </thead>
                                <tbody>
                                    <tr className="border-b border-[#e4e7ec]">
                                        <td>
                                            <div className="self-stretch h-[194px] px-6 py-4 flex-col justify-start items-start gap-2 flex">
                                                <div className="self-stretch justify-start items-start gap-2 inline-flex">
                                                    <div
                                                        className="pl-2 pr-2.5 py-0.5 bg-[#ecfcf2] rounded-full border border-[#aaefc6] justify-start items-center gap-1.5 flex">
                                                        <div className="w-2 h-2 relative">
                                                            <div className="w-1.5 h-1.5 left-[1px] top-[1px] absolute bg-[#17b169] rounded-full"></div>
                                                        </div>
                                                        <div className="text-center text-[#057647] text-sm font-medium font-['Inter'] leading-tight">Live
                                                            webinar
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="self-stretch h-[88px] flex-col justify-start items-start gap-2 flex">
                                                    <div className="self-stretch text-[#101828] text-lg font-semibold font-['Inter'] leading-7">Mastering
                                                        Charitable
                                                        Remainder Trusts – Planning and Compliance with Form 5227 </div>
                                                    <div className="self-stretch text-[#475467] text-sm font-normal font-['Inter'] leading-normal">Tue Oct
                                                        22
                                                        2024 |
                                                        1:00 PM - 4:00 PM ET</div>
                                                </div>
                                                <div className="justify-center items-center gap-2 inline-flex overflow-hidden">
                                                    <div className="text-[#156fee] text-base font-semibold font-['Inter'] leading-normal">Add to my
                                                        Calendar
                                                    </div>
                                                    <div className="w-5 h-5 relative  overflow-hidden">
                                                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path
                                                                d="M17.5 6.66675H2.5M13.3333 1.66675V4.16675M6.66667 1.66675V4.16675M10 15.0001V10.0001M7.5 12.5001H12.5M6.5 18.3334H13.5C14.9001 18.3334 15.6002 18.3334 16.135 18.0609C16.6054 17.8212 16.9878 17.4388 17.2275 16.9684C17.5 16.4336 17.5 15.7335 17.5 14.3334V7.33342C17.5 5.93328 17.5 5.23322 17.2275 4.69844C16.9878 4.22803 16.6054 3.84558 16.135 3.6059C15.6002 3.33341 14.9001 3.33341 13.5 3.33341H6.5C5.09987 3.33341 4.3998 3.33341 3.86502 3.6059C3.39462 3.84558 3.01217 4.22803 2.77248 4.69844C2.5 5.23322 2.5 5.93328 2.5 7.33341V14.3334C2.5 15.7335 2.5 16.4336 2.77248 16.9684C3.01217 17.4388 3.39462 17.8212 3.86502 18.0609C4.3998 18.3334 5.09987 18.3334 6.5 18.3334Z"
                                                                stroke="#155EEF" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" />
                                                        </svg>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="self-stretch h-[194px] px-6 py-4 flex-col justify-center items-start gap-2 flex">
                                                <div className="self-stretch h-[57px] py-3 flex-col justify-center items-start gap-5 flex">
                                                    <div className="grow shrink basis-0 flex-col justify-start items-start gap-3 flex">
                                                        <div className="self-stretch grow shrink basis-0 justify-center items-center gap-4 inline-flex">
                                                            <div
                                                                className="w-[26px] h-[26px] bg-white rounded shadow-[inset_0px_0px_0px_1px_rgba(16,24,40,0.18)] justify-center items-center gap-2 flex overflow-hidden">
                                                                <div className="w-5 h-5 relative bg-[#f4f8ff]  overflow-hidden">
                                                                    <svg width="20" height="21" viewBox="0 0 20 21" fill="none"
                                                                        xmlns="http://www.w3.org/2000/svg">
                                                                        <g id="minus">
                                                                            <path id="Icon" d="M4.16797 10.5H15.8346" stroke="#2970FF" stroke-width="1.66667"
                                                                                stroke-linecap="round" stroke-linejoin="round" />
                                                                        </g>
                                                                    </svg>
                                                                </div>
                                                            </div>
                                                            <div className="text-center text-[#101828] text-base font-bold font-['Inter'] leading-loose">01
                                                            </div>
                                                            <div
                                                                className="w-[26px] h-[26px] bg-[#f4f8ff] rounded shadow-[inset_0px_0px_0px_1px_rgba(16,24,40,0.18)] justify-center items-center gap-2 flex overflow-hidden">
                                                                <div className="w-5 h-5 relative  overflow-hidden">
                                                                    <svg width="20" height="20" viewBox="0 0 20 21" fill="none"
                                                                        xmlns="http://www.w3.org/2000/svg">
                                                                        <g id="plus">
                                                                            <rect width="20" height="20" transform="translate(0 0.5)" fill="#F5F8FF" />
                                                                            <path id="Icon" d="M10.0013 4.66675V16.3334M4.16797 10.5001H15.8346" stroke="#2970FF"
                                                                                stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" />
                                                                        </g>
                                                                    </svg>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="self-stretch h-6 py-3 justify-start items-center gap-2 inline-flex">
                                                    <div className="w-5 h-5 relative  overflow-hidden"></div>
                                                    <div className="text-[#475467] text-base font-semibold font-['Inter'] leading-normal">Remove</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="self-stretch py-2 justify-start items-center gap-4 inline-flex">
                                                <div className="grow shrink basis-0 h-[38px] justify-start items-center gap-4 flex">
                                                    <div className="grow shrink basis-0 flex-col justify-start items-start gap-0.5 inline-flex"></div>
                                                </div>
                                                <div className="justify-end items-center gap-4 flex">
                                                    <div className="justify-end flex-col items-center gap-1.5 flex overflow-hidden">
                                                        <div className="text-right text-[#0d9383] text-lg font-medium font-['Inter']  leading-7">
                                                            US$2199
                                                        </div>
                                                        <div
                                                            className="justify-start text-[#667085] text-xl font-normal font-['Inter'] line-through leading-9">
                                                            US$298
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr className="border-b border-[#e4e7ec]">
                                        <td>
                                            <div className="self-stretch h-[194px] px-6 py-4 flex-col justify-start items-start gap-2 flex">
                                                <div className="self-stretch justify-start items-start gap-2 inline-flex">
                                                    <div
                                                        className="px-2.5 py-0.5 bg-[#fdf1f9] rounded-full border border-[#fbceee] justify-start items-center flex">
                                                        <div className="text-center text-[#c01573] text-sm font-medium font-['Inter'] leading-tight">Self
                                                            Study </div>
                                                    </div>
                                                </div>
                                                <div className="self-stretch h-[88px] flex-col justify-start items-start gap-2 flex">
                                                    <div className="self-stretch text-[#101828] text-lg font-semibold font-['Inter'] leading-7">Mastering
                                                        Charitable
                                                        Remainder Trusts – Planning and Compliance with Form 5227 </div>
                                                    <div className="self-stretch text-[#475467] text-sm font-normal font-['Inter'] leading-normal">Tue Oct
                                                        22
                                                        2024 |
                                                        1:00 PM - 4:00 PM ET</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="self-stretch h-[194px] px-6 py-4 flex-col justify-center items-start gap-2 flex">
                                                <div className="self-stretch h-[57px] py-3 flex-col justify-center items-start gap-5 flex">
                                                    <div className="grow shrink basis-0 flex-col justify-start items-start gap-3 flex">
                                                        <div className="self-stretch grow shrink basis-0 justify-center items-center gap-4 inline-flex">
                                                            <div
                                                                className="w-[26px] h-[26px] bg-white rounded shadow-[inset_0px_0px_0px_1px_rgba(16,24,40,0.18)] justify-center items-center gap-2 flex overflow-hidden">
                                                                <div className="w-5 h-5 relative bg-[#f4f8ff]  overflow-hidden">
                                                                    <svg width="20" height="21" viewBox="0 0 20 21" fill="none"
                                                                        xmlns="http://www.w3.org/2000/svg">
                                                                        <g id="minus">
                                                                            <path id="Icon" d="M4.16797 10.5H15.8346" stroke="#2970FF" stroke-width="1.66667"
                                                                                stroke-linecap="round" stroke-linejoin="round" />
                                                                        </g>
                                                                    </svg>
                                                                </div>
                                                            </div>
                                                            <div className="text-center text-[#101828] text-base font-bold font-['Inter'] leading-loose">01
                                                            </div>
                                                            <div
                                                                className="w-[26px] h-[26px] bg-[#f4f8ff] rounded shadow-[inset_0px_0px_0px_1px_rgba(16,24,40,0.18)] justify-center items-center gap-2 flex overflow-hidden">
                                                                <div className="w-5 h-5 relative  overflow-hidden">
                                                                    <svg width="20" height="20" viewBox="0 0 20 21" fill="none"
                                                                        xmlns="http://www.w3.org/2000/svg">
                                                                        <g id="plus">
                                                                            <rect width="20" height="20" transform="translate(0 0.5)" fill="#F5F8FF" />
                                                                            <path id="Icon" d="M10.0013 4.66675V16.3334M4.16797 10.5001H15.8346" stroke="#2970FF"
                                                                                stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" />
                                                                        </g>
                                                                    </svg>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="self-stretch h-6 py-3 justify-start items-center gap-2 inline-flex">
                                                    <div className="w-5 h-5 relative  overflow-hidden"></div>
                                                    <div className="text-[#475467] text-base font-semibold font-['Inter'] leading-normal">Remove</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="self-stretch py-2 justify-start items-center gap-4 inline-flex">
                                                <div className="grow shrink basis-0 h-[38px] justify-start items-center gap-4 flex">
                                                    <div className="grow shrink basis-0 flex-col justify-start items-start gap-0.5 inline-flex"></div>
                                                </div>
                                                <div className="justify-end items-center gap-4 flex-col flex">
                                                    <div className="justify-end items-center gap-1.5 flex overflow-hidden">
                                                        <div className="text-right text-[#0d9383] text-lg font-medium font-['Inter']  leading-7">
                                                            US$2199
                                                        </div>
                                                    </div>
                                                    <div className="justify-start text-[#667085] text-xl font-normal font-['Inter'] line-through leading-9">
                                                        US$298
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>

                                    <tr className="border-b border-[#e4e7ec]">
                                        <td>
                                            <div className="self-stretch h-[194px] px-6 py-4 flex-col justify-start items-start gap-2 flex">
                                                <div className="self-stretch justify-start items-start gap-2 inline-flex">
                                                    <div
                                                        className="pl-2 pr-2.5 py-0.5 bg-[#ecfcf2] rounded-full border border-[#aaefc6] justify-start items-center gap-1.5 flex">
                                                        <div className="w-2 h-2 relative">
                                                            <div className="w-1.5 h-1.5 left-[1px] top-[1px] absolute bg-[#17b169] rounded-full"></div>
                                                        </div>
                                                        <div className="text-center text-[#057647] text-sm font-medium font-['Inter'] leading-tight">Live
                                                            webinar
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="self-stretch h-[88px] flex-col justify-start items-start gap-2 flex">
                                                    <div className="self-stretch text-[#101828] text-lg font-semibold font-['Inter'] leading-7">Mastering
                                                        Charitable
                                                        Remainder Trusts – Planning and Compliance with Form 5227 </div>
                                                    <div className="self-stretch text-[#475467] text-sm font-normal font-['Inter'] leading-normal">Tue Oct
                                                        22
                                                        2024 |
                                                        1:00 PM - 4:00 PM ET</div>
                                                </div>
                                                <div className="justify-center items-center gap-2 inline-flex overflow-hidden">
                                                    <div className="text-[#156fee] text-base font-semibold font-['Inter'] leading-normal">Add to my
                                                        Calendar
                                                    </div>
                                                    <div className="w-5 h-5 relative  overflow-hidden">
                                                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path
                                                                d="M17.5 6.66675H2.5M13.3333 1.66675V4.16675M6.66667 1.66675V4.16675M10 15.0001V10.0001M7.5 12.5001H12.5M6.5 18.3334H13.5C14.9001 18.3334 15.6002 18.3334 16.135 18.0609C16.6054 17.8212 16.9878 17.4388 17.2275 16.9684C17.5 16.4336 17.5 15.7335 17.5 14.3334V7.33342C17.5 5.93328 17.5 5.23322 17.2275 4.69844C16.9878 4.22803 16.6054 3.84558 16.135 3.6059C15.6002 3.33341 14.9001 3.33341 13.5 3.33341H6.5C5.09987 3.33341 4.3998 3.33341 3.86502 3.6059C3.39462 3.84558 3.01217 4.22803 2.77248 4.69844C2.5 5.23322 2.5 5.93328 2.5 7.33341V14.3334C2.5 15.7335 2.5 16.4336 2.77248 16.9684C3.01217 17.4388 3.39462 17.8212 3.86502 18.0609C4.3998 18.3334 5.09987 18.3334 6.5 18.3334Z"
                                                                stroke="#155EEF" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" />
                                                        </svg>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="self-stretch h-[194px] px-6 py-4 flex-col justify-center items-start gap-2 flex">
                                                <div className="self-stretch h-[57px] py-3 flex-col justify-center items-start gap-5 flex">
                                                    <div className="grow shrink basis-0 flex-col justify-start items-start gap-3 flex">
                                                        <div className="self-stretch grow shrink basis-0 justify-center items-center gap-4 inline-flex">
                                                            <div
                                                                className="w-[26px] h-[26px] bg-white rounded shadow-[inset_0px_0px_0px_1px_rgba(16,24,40,0.18)] justify-center items-center gap-2 flex overflow-hidden">
                                                                <div className="w-5 h-5 relative bg-[#f4f8ff]  overflow-hidden">
                                                                    <svg width="20" height="21" viewBox="0 0 20 21" fill="none"
                                                                        xmlns="http://www.w3.org/2000/svg">
                                                                        <g id="minus">
                                                                            <path id="Icon" d="M4.16797 10.5H15.8346" stroke="#2970FF" stroke-width="1.66667"
                                                                                stroke-linecap="round" stroke-linejoin="round" />
                                                                        </g>
                                                                    </svg>
                                                                </div>
                                                            </div>
                                                            <div className="text-center text-[#101828] text-base font-bold font-['Inter'] leading-loose">01
                                                            </div>
                                                            <div
                                                                className="w-[26px] h-[26px] bg-[#f4f8ff] rounded shadow-[inset_0px_0px_0px_1px_rgba(16,24,40,0.18)] justify-center items-center gap-2 flex overflow-hidden">
                                                                <div className="w-5 h-5 relative  overflow-hidden">
                                                                    <svg width="20" height="20" viewBox="0 0 20 21" fill="none"
                                                                        xmlns="http://www.w3.org/2000/svg">
                                                                        <g id="plus">
                                                                            <rect width="20" height="20" transform="translate(0 0.5)" fill="#F5F8FF" />
                                                                            <path id="Icon" d="M10.0013 4.66675V16.3334M4.16797 10.5001H15.8346" stroke="#2970FF"
                                                                                stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" />
                                                                        </g>
                                                                    </svg>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="self-stretch h-6 py-3 justify-start items-center gap-2 inline-flex">
                                                    <div className="w-5 h-5 relative  overflow-hidden"></div>
                                                    <div className="text-[#475467] text-base font-semibold font-['Inter'] leading-normal">Remove</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="self-stretch py-2 justify-start items-center gap-4 inline-flex">
                                                <div className="grow shrink basis-0 h-[38px] justify-start items-center gap-4 flex">
                                                    <div className="grow shrink basis-0 flex-col justify-start items-start gap-0.5 inline-flex"></div>
                                                </div>
                                                <div className="justify-end items-center gap-4 flex">
                                                    <div className="justify-end flex-col items-center gap-1.5 flex overflow-hidden">
                                                        <div className="text-right text-[#0d9383] text-lg font-medium font-['Inter']  leading-7">
                                                            US$2199
                                                        </div>
                                                        <div
                                                            className="justify-start text-[#667085] text-xl font-normal font-['Inter'] line-through leading-9">
                                                            US$298
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr className="border-b border-[#e4e7ec]">
                                        <td>
                                            <div className="self-stretch h-[194px] px-6 py-4 flex-col justify-start items-start gap-2 flex">
                                                <div className="self-stretch justify-start items-start gap-2 inline-flex">
                                                    <div
                                                        className="px-2.5 py-0.5 bg-[#fdf1f9] rounded-full border border-[#fbceee] justify-start items-center flex">
                                                        <div className="text-center text-[#c01573] text-sm font-medium font-['Inter'] leading-tight">Self
                                                            Study </div>
                                                    </div>
                                                </div>
                                                <div className="self-stretch h-[88px] flex-col justify-start items-start gap-2 flex">
                                                    <div className="self-stretch text-[#101828] text-lg font-semibold font-['Inter'] leading-7">Mastering
                                                        Charitable
                                                        Remainder Trusts – Planning and Compliance with Form 5227 </div>
                                                    <div className="self-stretch text-[#475467] text-sm font-normal font-['Inter'] leading-normal">Tue Oct
                                                        22
                                                        2024 |
                                                        1:00 PM - 4:00 PM ET</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="self-stretch h-[194px] px-6 py-4 flex-col justify-center items-start gap-2 flex">
                                                <div className="self-stretch h-[57px] py-3 flex-col justify-center items-start gap-5 flex">
                                                    <div className="grow shrink basis-0 flex-col justify-start items-start gap-3 flex">
                                                        <div className="self-stretch grow shrink basis-0 justify-center items-center gap-4 inline-flex">
                                                            <div
                                                                className="w-[26px] h-[26px] bg-white rounded shadow-[inset_0px_0px_0px_1px_rgba(16,24,40,0.18)] justify-center items-center gap-2 flex overflow-hidden">
                                                                <div className="w-5 h-5 relative bg-[#f4f8ff]  overflow-hidden">
                                                                    <svg width="20" height="21" viewBox="0 0 20 21" fill="none"
                                                                        xmlns="http://www.w3.org/2000/svg">
                                                                        <g id="minus">
                                                                            <path id="Icon" d="M4.16797 10.5H15.8346" stroke="#2970FF" stroke-width="1.66667"
                                                                                stroke-linecap="round" stroke-linejoin="round" />
                                                                        </g>
                                                                    </svg>
                                                                </div>
                                                            </div>
                                                            <div className="text-center text-[#101828] text-base font-bold font-['Inter'] leading-loose">01
                                                            </div>
                                                            <div
                                                                className="w-[26px] h-[26px] bg-[#f4f8ff] rounded shadow-[inset_0px_0px_0px_1px_rgba(16,24,40,0.18)] justify-center items-center gap-2 flex overflow-hidden">
                                                                <div className="w-5 h-5 relative  overflow-hidden">
                                                                    <svg width="20" height="20" viewBox="0 0 20 21" fill="none"
                                                                        xmlns="http://www.w3.org/2000/svg">
                                                                        <g id="plus">
                                                                            <rect width="20" height="20" transform="translate(0 0.5)" fill="#F5F8FF" />
                                                                            <path id="Icon" d="M10.0013 4.66675V16.3334M4.16797 10.5001H15.8346" stroke="#2970FF"
                                                                                stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" />
                                                                        </g>
                                                                    </svg>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="self-stretch h-6 py-3 justify-start items-center gap-2 inline-flex">
                                                    <div className="w-5 h-5 relative  overflow-hidden"></div>
                                                    <div className="text-[#475467] text-base font-semibold font-['Inter'] leading-normal">Remove</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="self-stretch py-2 justify-start items-center gap-4 inline-flex">
                                                <div className="grow shrink basis-0 h-[38px] justify-start items-center gap-4 flex">
                                                    <div className="grow shrink basis-0 flex-col justify-start items-start gap-0.5 inline-flex"></div>
                                                </div>
                                                <div className="justify-end items-center gap-4 flex-col flex">
                                                    <div className="justify-end items-center gap-1.5 flex overflow-hidden">
                                                        <div className="text-right text-[#0d9383] text-lg font-medium font-['Inter']  leading-7">
                                                            US$2199
                                                        </div>
                                                    </div>
                                                    <div className="justify-start text-[#667085] text-xl font-normal font-['Inter'] line-through leading-9">
                                                        US$298
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>

                                </tbody>
                            </table>
                            <div className="py-1 justify-start items-start gap-6 inline-flex">
                                <div className=" px-6 py-4 flex-col justify-start items-start gap-2 inline-flex">
                                    <div className="py-2.5 rounded-lg justify-center items-center gap-1.5 inline-flex overflow-hidden">
                                        <div className="px-0.5 justify-center items-center flex">
                                            <div className="text-[#475467] text-base font-semibold font-['Inter'] leading-normal">Apply Coupon Code
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-[361px] justify-start items-start gap-4 inline-flex">
                                        <div className="w-[253px] flex-col justify-start items-start gap-1.5 inline-flex">
                                            <div className="self-stretch h-12 flex-col justify-start items-start gap-1.5 flex">
                                                <div className="self-stretch py-3 bg-white rounded-lg gap-2 inline-flex">
                                                    <div className="grow shrink basis-0 h-6 justify-start items-center gap-2 flex">
                                                        <Input />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="px-4 py-2.5 bg-[#7f98f9] rounded-lg  gap-1.5 flex overflow-hidden">
                                            <div className="px-0.5 justify-center items-center flex">
                                                <div className="text-white text-base font-semibold font-['Inter'] leading-normal">Apply</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                            <div className="px-6 py-4 flex-col justify-start items-start gap-1 flex">
                                <div className="self-stretch py-2 border-b border-[#e4e7ec] justify-start items-center gap-4 inline-flex">
                                    <div className="grow shrink basis-0 h-[38px] justify-start items-center gap-4 flex">
                                        <div className="grow shrink basis-0 flex-col justify-start items-start gap-0.5 inline-flex"></div>
                                    </div>
                                    <div className="justify-end items-center gap-4 flex">
                                        <div className="justify-end items-center gap-1.5 flex overflow-hidden">
                                            <div className="text-right text-[#0d9383] text-lg font-medium font-['Inter']  leading-7">
                                                US$2199
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="self-stretch py-2 border-b border-[#e4e7ec] justify-start items-center gap-4 inline-flex">
                                    <div className="grow shrink basis-0 h-[38px] justify-start items-center gap-4 flex">
                                        <div className="grow shrink basis-0 flex-col justify-start items-start gap-0.5 inline-flex">
                                            <div className="self-stretch text-[#101828] text-3xl font-bold font-['Inter'] leading-[38px]">Total</div>
                                        </div>
                                    </div>
                                    <div className="justify-start items-center gap-4 flex">
                                        <div className="justify-center items-center gap-1.5 flex overflow-hidden">
                                            <div className="text-[#101828] text-3xl font-bold font-['Inter'] leading-[38px]">US$1799</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="self-stretch justify-center items-center gap-2 inline-flex overflow-hidden">
                                    <div className="justify-center items-center flex">
                                        <Checkbox className="w-5 h-5 border-2 border-blue-500 accent-blue-600 text-white rounded-[#30px]" />
                                    </div>
                                    <div className="grow shrink basis-0"><span
                                        className="text-[#475467] text-base font-normal font-['Inter'] leading-normal">By placing this order, I
                                        acknowledge that I have read and agree to the </span><span
                                            className="text-[#475467] text-base font-normal font-['Inter'] underline leading-normal">purchase terms
                                            and
                                            conditions</span></div>
                                </div>
                            </div>
                            <div className=" w-full px-6 py-4 flex-col justify-start items-start gap-1 flex">
                                <div className="self-stretch  pt-3 flex-col justify-start items-start flex">
                                    <div className="self-stretch px-6 pb-3 justify-start items-start gap-3 inline-flex">
                                        <div
                                            className="grow shrink basis-0 px-[18px] py-3 bg-[#2970fe] rounded-[28px] shadow-[inset_0px_0px_0px_1px_rgba(16,24,40,0.18)] border-2 border-white justify-center items-center gap-1.5 flex overflow-hidden">
                                            <div className="px-0.5 justify-center items-center flex">
                                                <div className="text-white text-lg font-semibold font-['Inter'] leading-7">Pay Now</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="min-w-[480px] px-8 pb-8 inline-flex flex-col justify-start items-center gap-3">
                                <div className="self-stretch flex flex-col justify-start items-start gap-6">
                                    <div className="self-stretch h-16 px-8 flex flex-col justify-start items-start gap-6">
                                        <div className="self-stretch flex flex-col justify-start items-start gap-5">
                                            <div className="self-stretch inline-flex justify-start items-start gap-4 flex-wrap content-start">
                                                <div className="flex-1 min-w-80 inline-flex flex-col justify-start items-start gap-1">
                                                    <div className="self-stretch justify-start"><span
                                                        className="text-Colors-Text-text-primary-(900) text-lg font-bold font-['Inter'] leading-7">Add
                                                        participants details </span><span
                                                            className="text-Colors-Text-text-primary-(900) text-lg font-medium font-['Inter'] leading-7">(Enrollments
                                                            6)</span></div>
                                                    <div
                                                        className="self-stretch justify-start text-Colors-Text-text-tertiary-(600) text-base font-normal font-['Inter'] leading-normal">
                                                        First & last name will appear on CPE certificate.</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div
                                    className="h-72 rounded-xl outline-1 outline-offset-[-1px] outline-[#D0D5DD] flex flex-col justify-start items-start overflow-hidden">
                                    <div className=" h-16 px-6 py-4 inline-flex justify-start items-center">
                                        <div className="flex-1 justify-start text-[#101828] text-base font-medium font-['Inter'] leading-normal">
                                            S and C Corporations : Officer Reasonable Compensation - Regulations, Risks and Defense</div>
                                    </div>
                                    <div className="self-stretch h-52 p-6 flex flex-col justify-start items-start gap-6">
                                        <div className="justify-start text-[#101828] text-base font-medium font-['Inter'] leading-normal">
                                            1</div>
                                        <div className="h-11 grid grid-cols-2 w-full gap-6">
                                            <div className="flex-1 self-stretch inline-flex flex-col justify-start items-start gap-1.5">
                                                <div className="self-stretch flex-1 flex flex-col justify-start items-start gap-1.5">
                                                    <div
                                                        className="self-stretch flex-1 border-b border-[#D0D5DD] inline-flex justify-start items-start gap-0.5">
                                                        <div className="justify-start text-[#344054] text-sm font-medium font-['Inter'] leading-tight">
                                                            Chenise</div>
                                                        <div className="justify-start text-[#7E56D8] text-sm font-medium font-['Inter'] leading-tight">
                                                            *</div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex-1 self-stretch inline-flex flex-col justify-start items-start gap-1.5">
                                                <div
                                                    className="self-stretch flex-1 border-b border-[#D0D5DD] inline-flex justify-start items-start gap-0.5">
                                                    <div className="justify-start text-[#344054] text-sm font-medium font-['Inter'] leading-tight">
                                                        Marks</div>
                                                    <div className="justify-start text-[#7E56D8] text-sm font-medium font-['Inter'] leading-tight">
                                                        *</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="h-11  grid grid-cols-2 w-full gap-6">
                                            <div className="flex-1 self-stretch inline-flex flex-col justify-start items-start gap-1.5">
                                                <div className="self-stretch flex-1 flex flex-col justify-start items-start gap-1.5">
                                                    <div
                                                        className="self-stretch flex-1 border-b border-[#D0D5DD] inline-flex justify-start items-start gap-0.5">
                                                        <div className="justify-start text-[#344054] text-sm font-medium font-['Inter'] leading-tight">
                                                            connect@asterid.com</div>
                                                        <div className="justify-start text-[#7E56D8] text-sm font-medium font-['Inter'] leading-tight">
                                                            *</div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex-1 self-stretch inline-flex flex-col justify-start items-start gap-1.5">
                                                <div
                                                    className="self-stretch flex-1 border-b border-[#D0D5DD] inline-flex justify-start items-start gap-0.5">
                                                    <div className="justify-start text-[#344054] text-sm font-medium font-['Inter'] leading-tight">
                                                        1111111111</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div
                                    className=" max-w-[720px] min-w-[560px] rounded-xl shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] outline-1 outline-offset-[-1px] outline-[#D0D5DD] flex flex-col justify-start items-start overflow-hidden">
                                    <div className=" h-16 px-6 py-4 inline-flex justify-start items-center">
                                        <div className="flex-1 justify-start text-[#101828] text-base font-medium font-['Inter'] leading-normal">
                                            S and C Corporations : Officer Reasonable Compensation - Regulations, Risks and Defense</div>
                                    </div>
                                    <div className="self-stretch h-52 p-6 flex flex-col justify-start items-start gap-6">
                                        <div className="justify-start text-[#101828] text-base font-medium font-['Inter'] leading-normal">
                                            1</div>
                                        <div className="grid grid-cols-2 h-11 w-full gap-6">
                                            <div className="flex-1 self-stretch inline-flex flex-col justify-start items-start gap-1.5">
                                                <div className="self-stretch flex-1 flex flex-col justify-start items-start gap-1.5">
                                                    <div
                                                        className="self-stretch flex-1 border-b border-[#D0D5DD] inline-flex justify-start items-start gap-0.5">
                                                        <div className="justify-start text-[#344054] text-sm font-medium font-['Inter'] leading-tight">
                                                            First name</div>
                                                        <div className="justify-start text-[#7E56D8] text-sm font-medium font-['Inter'] leading-tight">
                                                            *</div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex-1 self-stretch inline-flex flex-col justify-start items-start gap-1.5">
                                                <div
                                                    className="self-stretch flex-1 border-b border-[#D0D5DD] inline-flex justify-start items-start gap-0.5">
                                                    <div className="justify-start text-[#344054] text-sm font-medium font-['Inter'] leading-tight">
                                                        Last name</div>
                                                    <div className="justify-start text-[#7E56D8] text-sm font-medium font-['Inter'] leading-tight">
                                                        *</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="h-11 grid grid-cols-2 w-full gap-6">
                                            <div className="flex-1 self-stretch inline-flex flex-col justify-start items-start gap-1.5">
                                                <div className="self-stretch flex-1 flex flex-col justify-start items-start gap-1.5">
                                                    <div
                                                        className="self-stretch flex-1 border-b border-[#D0D5DD] inline-flex justify-start items-start gap-0.5">
                                                        <div className="justify-start text-[#344054] text-sm font-medium font-['Inter'] leading-tight">
                                                            Email address</div>
                                                        <div className="justify-start text-[#7E56D8] text-sm font-medium font-['Inter'] leading-tight">
                                                            *</div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex-1 self-stretch inline-flex flex-col justify-start items-start gap-1.5">
                                                <div
                                                    className="self-stretch flex-1 border-b border-[#D0D5DD] inline-flex justify-start items-start gap-0.5">
                                                    <div className="justify-start text-[#344054] text-sm font-medium font-['Inter'] leading-tight">
                                                        PTIN (If applicable)</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="self-stretch h-52 p-6 flex flex-col justify-start items-start gap-6">
                                        <div className="justify-start text-[#101828] text-base font-medium font-['Inter'] leading-normal">
                                            2</div>
                                        <div className="grid grid-cols-2 w-full h-11 gap-6">
                                            <div className="flex-1 self-stretch inline-flex flex-col justify-start items-start gap-1.5">
                                                <div className="self-stretch flex-1 flex flex-col justify-start items-start gap-1.5">
                                                    <div
                                                        className="self-stretch flex-1 border-b border-[#D0D5DD] inline-flex justify-start items-start gap-0.5">
                                                        <div className="justify-start text-[#344054] text-sm font-medium font-['Inter'] leading-tight">
                                                            First name</div>
                                                        <div className="justify-start text-[#7E56D8] text-sm font-medium font-['Inter'] leading-tight">
                                                            *</div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex-1 self-stretch inline-flex flex-col justify-start items-start gap-1.5">
                                                <div
                                                    className="self-stretch flex-1 border-b border-[#D0D5DD] inline-flex justify-start items-start gap-0.5">
                                                    <div className="justify-start text-[#344054] text-sm font-medium font-['Inter'] leading-tight">
                                                        Last name</div>
                                                    <div className="justify-start text-[#7E56D8] text-sm font-medium font-['Inter'] leading-tight">
                                                        *</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 h-11 w-full gap-6">
                                            <div className="flex-1 self-stretch inline-flex flex-col justify-start items-start gap-1.5">
                                                <div className="self-stretch flex-1 flex flex-col justify-start items-start gap-1.5">
                                                    <div
                                                        className="self-stretch flex-1 border-b border-[#D0D5DD] inline-flex justify-start items-start gap-0.5">
                                                        <div className="justify-start text-[#344054] text-sm font-medium font-['Inter'] leading-tight">
                                                            Email address</div>
                                                        <div className="justify-start text-[#7E56D8] text-sm font-medium font-['Inter'] leading-tight">
                                                            *</div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex-1 self-stretch inline-flex flex-col justify-start items-start gap-1.5">
                                                <div
                                                    className="self-stretch flex-1 border-b border-[#D0D5DD] inline-flex justify-start items-start gap-0.5">
                                                    <div className="justify-start text-[#344054] text-sm font-medium font-['Inter'] leading-tight">
                                                        PTIN (If applicable)</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section >
        </>
    )
}

export default CheckoutPage