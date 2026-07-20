"use client"
import React, { useState } from 'react'
import EnrollNowCart from '../courses/enroll-now';
import AddToCart from '../courses/add-to-cart';
import Link from 'next/link';
import { imageUrl } from "@/lib/constants";
import { Button } from '../ui/button';
import { Minus, Plus } from 'lucide-react';

const PackageHeader = ({ packageData }: any) => {
    const [seats, setSeats] = useState(1);

    return (
        <div className="w-full h-[500px]  pb-8 grid grid-cols-7 gap-2 items-center"
            style={{
                backgroundImage: `
                    linear-gradient(
                    to bottom,
                    rgba(255, 255, 255, 0.6) 80%,
                    rgba(255, 255, 255, 0.6) 80%,
                    rgba(255, 255, 255, 0.6) 80%
                    ),
                    url(${imageUrl + packageData?.image?.data?.attributes?.url})
                `,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
            }}>
            <div className="col-span-4 grid grid-cols-2 px-10 flex-col justify-start items-start gap-12 inline-flex w-full">
                <div className="flex-col justify-start items-center gap-6 flex">
                    <div className="self-stretch  flex-col justify-start items-start gap-4 flex">

                        <div className="self-stretch text-3xl font-bold font-['Inter'] leading-[38px]">
                            {packageData?.title}
                        </div>

                    </div>
                </div>
            </div>

            <div className="col-span-3 justify-start items-start gap-4 px-10 inline-flex">
                <div className="flex flex-wrap items-start justify-between">
                    {/* Left Section */}
                    <div className="space-y-4">
                        <div className="flex gap-4">
                            <div className="flex overflow-hidden rounded-xl">
                                {/* Price */}
                                <div className="bg-emerald-600 px-4 py-0 text-white flex items-center gap-4">
                                    <span className="font-bold">
                                        ${(packageData?.price - (packageData?.discount ?? 0)) * seats}
                                    </span>

                                    <span className="text-white/70 line-through">
                                        ${packageData?.price * seats}
                                    </span>
                                </div>

                                {/* Quantity */}
                                <div className="flex items-center bg-white">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="rounded-none h-full px-5 cursor-pointer"
                                         onClick={() => setSeats(seats - 1)}
                                    >
                                        <Minus className="h-5 w-5" />
                                    </Button>

                                    <div className="min-w-[70px] text-center text-2xl font-semibold">
                                        {seats}
                                    </div>

                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="rounded-none h-full px-5 cursor-pointer"
                                         onClick={() => setSeats(seats + 1)}
                                    >
                                        <Plus className="h-5 w-5 text-emerald-600" />
                                    </Button>
                                </div>
                            </div>

                            <EnrollNowCart course={packageData} quantity={seats} className="bg-emerald-600 hover:bg-emerald-700 text-white flex item-center rounded-xl px-5 h-10 tracking-wide"
                            />

                        </div>
                    </div>

                    {/* Right Section */}

                    <p className="text-sm text-muted-foreground max-w-md mt-4">
                        If you need to purchase{" "}
                        <span className="font-semibold">10 or more</span> enrollments,
                        please contact us.
                    </p>
                </div>
                {/* <div className="w-full rounded-xl  shadow-[0px_20px_24px_-4px_rgba(16,24,40,0.08)] flex-col justify-start items-end flex overflow-hidden">

                    <div className="w-full flex content-between flex-col">
                        <div className="self-stretch w-full bg-white rounded-xl pt-2 flex-col justify-start items-center flex overflow-hidden">

                            <div className="self-stretch h-[69px] px-6 pt-3 flex-col justify-start items-start gap-5 flex">
                                <div className="self-stretch flex-col justify-start items-start gap-3 flex">
                                    <div className="self-stretch justify-center items-center gap-6 inline-flex">
                                        <div
                                            onClick={() => setSeats(seats - 1)}
                                            className="p-3 bg-white cursor-pointer rounded-lg  shadow-[inset_0px_0px_0px_1px_rgba(16,24,40,0.18)] border border-[#d0d5dd] justify-center items-center gap-2 flex overflow-hidden"
                                        >
                                            <div className="w-5 h-5 relative  overflow-hidden">
                                                <svg
                                                    width="20"
                                                    height="20"
                                                    viewBox="0 0 20 20"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <g id="minus">
                                                        <path
                                                            id="Icon"
                                                            d="M4.16602 10H15.8327"
                                                            stroke="#344054"
                                                            strokeWidth="1.66667"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        />
                                                    </g>
                                                </svg>
                                            </div>
                                        </div>
                                        <div className="text-center text-[#101828] text-2xl font-bold font-['Inter'] leading-loose">
                                            <div className="text-center justify-start text-Colors-Text-text-primary-(900) text-2xl font-bold font-['Inter'] w-[20px] leading-loose">
                                                <input
                                                    type="text"
                                                    disabled
                                                    className="form-control"
                                                    value={seats}
                                                    onChange={() => { }}
                                                />
                                            </div>
                                        </div>
                                        <div
                                            onClick={() => setSeats(seats + 1)}
                                            className="p-3 bg-white cursor-pointer rounded-lg shadow-[inset_0px_0px_0px_1px_rgba(16,24,40,0.18)] border border-[#d0d5dd] justify-center items-center gap-2 flex overflow-hidden"
                                        >
                                            <div className="w-5 h-5 relative  overflow-hidden">
                                                <svg
                                                    width="20"
                                                    height="20"
                                                    viewBox="0 0 20 20"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <g id="plus">
                                                        <path
                                                            id="Icon"
                                                            d="M9.99935 4.16675V15.8334M4.16602 10.0001H15.8327"
                                                            stroke="#344054"
                                                            strokeWidth="1.66667"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        />
                                                    </g>
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>


                            <div className="flex justify-between items-center w-full">
                                <EnrollNowCart course={packageData} quantity={seats} />
                                <AddToCart
                                    course={packageData}
                                    quantity={seats}
                                    absolute={false}
                                />
                            </div>
                        </div>
                    </div>
                </div> */}
            </div>
        </div>
    )
}

export default PackageHeader