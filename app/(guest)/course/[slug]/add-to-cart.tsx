"use client";

import EnrollNowCart from '@/components/courses/enroll-now';
import { imageUrl } from '@/lib/constants';
import { checkAlreadyCoursePurchased, getCart } from '@/services/cart';
import { ChevronRight } from 'lucide-react';
import moment from 'moment-timezone'
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

const AddToCardComponent = ({ courseData, instructor, slug }: any) => {
    console.log(courseData);
    
    const timezone = moment.tz.guess();
    const timezoneAbbrv = moment().tz(timezone).format('z');
    const firstLetter = timezoneAbbrv.charAt(0);
    const lastLetter = timezoneAbbrv.charAt(timezoneAbbrv.length - 1);
    const twoLettertimezone = firstLetter + lastLetter;

    const router = useRouter()

    const [seats, setSeats] = useState(1)
    const [addItems, setAddItems] = useState(1)

    const getcardCount = async (cartId: number) => {
        if (cartId > 0) {
            let resp = await getCart(cartId);
        }
    }

    const updateTotal = () => {
        let total = 0;
        let cartData: any;
        cartData.data.CartItem.map((ci: any, index: any) => {
            if (ci.course != undefined) {

                if (ci.courseId > 0) {
                    total += (ci.course.discount || ci.course.discountPrice ) > 0 ? (ci.course.discount * ci.qty || ci.course.discountPrice * ci.qty || ci.course.discountPrice * ci.qty) : (ci.course.price * ci.qty)
                } else {
                    if (ci.course.discountPrice != null && ci.course.discountPrice > 0) {
                        total += ci.course.discountPrice * ci.qty;
                    } else if (ci.course.price != null && ci.course.price >= 0) {
                        total += ci.course.price * ci.qty;
                    } else {
                        total += ci.course.includedCoursePrice * ci.qty;
                    }
                }
            }
        });

        cartData.data.total = total
        cartData.data.finalPrice = total;
    }

    const updateCart = async (cartId: any, cartData: any) => {
        const token = localStorage.getItem('token') || ''

        let response = await fetch(process.env.NEXT_PUBLIC_API_BASE_URL + `/api/carts/${cartId}`, {
            method: "POST",
            body: JSON.stringify(cartData),
            headers: {
                "Authorization": `Bearer ${token}`,
                "content-type": "application/json"
            },
        })

        let resp = await response.json();
        getcardCount(cartId);
        router.push('/learner/shopping-cart');

    }

    return (
        <div className="w-full mt-10 pb-8 bg-white grid grid-cols-6 gap-2">

            <div className="col-span-4 grid grid-cols-2 flex-col justify-start items-start gap-12 inline-flex w-full">
                <div className="flex-col justify-start items-start gap-6 flex">
                    <div className="self-stretch  flex-col justify-start items-start gap-4 flex">
                        <div className="justify-start items-center gap-3 inline-flex">
                            <div className="justify-center items-center flex">
                                <Link href="/course-catalog"
                                    className="text-[#475467] text-sm font-medium font-['Inter'] leading-tight">Course catalogue</Link>
                            </div>
                            <div className="relative  overflow-hidden">
                                <ChevronRight className='w-4 h-4' />
                            </div>
                            <div className="justify-center items-center flex">
                                <div className="text-sm font-semibold font-['Inter'] leading-tight">
                                    {courseData?.category?.data?.attributes?.title === 'Recorded' ? 'Self Study' :
                                        courseData?.category?.data?.attributes?.title}
                                </div>
                            </div>
                             <div className="relative  overflow-hidden">
                                <ChevronRight className='w-4 h-4' />
                            </div>
                            <div className="justify-center items-center flex">
                                <div className="text-[#088ab2] text-sm font-semibold font-['Inter'] leading-tight">
                                    {courseData?.fieldOfStudy}
                                </div>
                            </div>
                        </div>
                        <div className="self-stretch text-[#101828] text-3xl font-semibold font-['Inter'] leading-[38px]">
                            {courseData?.title}
                        </div>
                        <div className="pl-1 pr-2.5 py-1 rounded-full justify-start items-center gap-3 inline-flex">
                            <div className="justify-start text-gray-500 text-base font-semibold font-['Inter'] line-through leading-9">
                                US {courseData?.price}
                            </div>
                            <div className="text-[#0e9384] text-[32px] font-semibold font-['Inter'] leading-[38px]">US
                                {(courseData?.price - (courseData?.discount ?? 0)) * seats}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="relative self-stretch h-6 flex-col justify-start items-start gap-5 flex">
                    <div className="self-stretch h-6 flex-col justify-start items-start gap-8 flex">
                        <div className="self-stretch justify-start items-center gap-5 inline-flex">
                            <div className="justify-start items-center gap-2 flex">
                                <div className="w-24 h-24 relative  overflow-hidden rounded-[50%]">
                                    <img src={imageUrl + instructor?.image?.data?.attributes?.url} alt="" />
                                </div>
                                <div className="text-[#344054] text-base font-semibold font-['Inter'] leading-normal">
                                    {instructor?.firstName + " " + instructor?.lastName}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="self-stretch h-[30px]"></div>
            </div>
            <div className="col-span-2 justify-start items-start gap-4 inline-flex">
                <div
                    className="h-[412px] w-full rounded-xl  shadow-[0px_20px_24px_-4px_rgba(16,24,40,0.08)] flex-col justify-start items-end flex overflow-hidden">

                    <div className="w-full flex justify-between p-2">
                        <div className="self-stretch h-12 px-6 pt-8 flex-col justify-start items-start gap-5 flex">
                            {
                                courseData?.category?.data?.attributes?.title !== 'Recorded' &&
                                courseData?.category?.data?.attributes?.title !== 'eBook' && <div className="self-stretch h-7 flex-col justify-start items-start gap-1 flex">
                                    <div className="self-stretch text-[#101828] text-lg font-semibold font-['Inter'] leading-7">
                                        Available Date(s)
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                    <div className="w-full flex content-between flex-col">
                        {
                            courseData?.category?.data?.attributes?.title !== 'Recorded' &&
                            courseData?.category?.data?.attributes?.title !== 'eBook' && <div className="self-stretch pt-2 flex-col justify-center items-end flex">
                                <div className="self-stretch pb-6 flex-col justify-start items-start flex"></div>
                                <div className="self-stretch px-6 pb-6 justify-start items-center gap-3">
                                    <div className="w-full self-stretch flex-col justify-start items-start gap-5">
                                        <div className="self-stretch flex-col justify-start items-start gap-4 flex">
                                            <div className="h-6 flex-col justify-start items-start gap-[11px] flex">
                                                <div className="justify-start items-center gap-3 inline-flex">
                                                    <div className="justify-center items-center flex">
                                                        <div
                                                            className="w-5 h-5 p-[3px] bg-[#155dee] rounded-md  shadow-[0px_0px_0px_2px_rgba(255,255,255,1.00)] justify-center items-center flex overflow-hidden">
                                                            <div className="w-3.5 h-3.5 relative flex-col justify-start items-start flex overflow-hidden">
                                                            </div>
                                                            <input type="checkbox" name="" id="" />
                                                        </div>
                                                    </div>
                                                    <div className="justify-start items-center gap-3 flex">
                                                        <div className="flex-col justify-start items-start inline-flex">
                                                            <div className="text-[#475467] text-base font-normal font-['Inter'] leading-normal w-full">
                                                                {moment(courseData?.startDate.replace("Z", "")).format("dddd MMM d YYYY")} |
                                                                {moment(courseData?.startDate.replace("Z", "")).format("h:mm a")} -
                                                                {moment(courseData?.endDate).format("h:mm a")} {twoLettertimezone || ''}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        }

                        <div
                            className="self-stretch w-full bg-white rounded-xl pt-2 flex-col justify-start items-center flex overflow-hidden">

                            {
                                courseData?.category?.data?.attributes?.title !== 'Recorded' &&
                                courseData?.category?.data?.attributes?.title !== 'eBook' && <div className="self-stretch h-[69px] px-6 pt-3 flex-col justify-start items-start gap-5 flex">
                                    <div className="self-stretch flex-col justify-start items-start gap-3 flex">
                                        <div className="self-stretch justify-center items-center gap-6 inline-flex">
                                            <div onClick={() => setSeats(seats - 1)} className="p-3 bg-white cursor-pointer rounded-lg  shadow-[inset_0px_0px_0px_1px_rgba(16,24,40,0.18)] border border-[#d0d5dd] justify-center items-center gap-2 flex overflow-hidden">
                                                <div className="w-5 h-5 relative  overflow-hidden">

                                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <g id="minus">
                                                            <path id="Icon" d="M4.16602 10H15.8327" stroke="#344054" strokeWidth="1.66667"
                                                                strokeLinecap="round" strokeLinejoin="round" />
                                                        </g>
                                                    </svg>

                                                </div>
                                            </div>
                                            <div className="text-center text-[#101828] text-2xl font-bold font-['Inter'] leading-loose">
                                                <div
                                                    className="text-center justify-start text-Colors-Text-text-primary-(900) text-2xl font-bold font-['Inter'] w-[20px] leading-loose">
                                                    <input type="text" disabled className="form-control" value={seats} onChange={() => { }} />
                                                </div>
                                            </div>
                                            <div onClick={() => setSeats(seats + 1)} className="p-3 bg-white cursor-pointer rounded-lg shadow-[inset_0px_0px_0px_1px_rgba(16,24,40,0.18)] border border-[#d0d5dd] justify-center items-center gap-2 flex overflow-hidden">
                                                <div className="w-5 h-5 relative  overflow-hidden">
                                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <g id="plus">
                                                            <path id="Icon" d="M9.99935 4.16675V15.8334M4.16602 10.0001H15.8327" stroke="#344054"
                                                                strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                                                        </g>
                                                    </svg>

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            }

                            <EnrollNowCart course={courseData} quantity={seats} />
                            <div
                                className="w-full px-[22px] py-4 rounded-[10px]  justify-center items-center gap-2.5 inline-flex overflow-hidden">
                                <div className="px-0.5 justify-start items-center flex">
                                    <div><span className="text-[#475467] text-xl font-normal font-['Inter'] leading-[30px] mr-2">For
                                        Group Enrollments</span><span className="text-[#18212f] text-xl font-['Inter'] leading-[30px]">
                                        </span>
                                        <Link href="/contact-us" target="_blank"
                                            className="text-[#db6803] text-xl font-bold font-['Inter'] leading-[30px]">Contact us</Link>

                                        <svg className="inline ml-2" width="24" height="24" viewBox="0 0 24 24" fill="none"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <g id="phone-call-01">
                                                <path id="Icon"
                                                    d="M14.0497 6C15.0264 6.19057 15.924 6.66826 16.6277 7.37194C17.3314 8.07561 17.8091 8.97326 17.9997 9.95M14.0497 2C16.0789 2.22544 17.9713 3.13417 19.4159 4.57701C20.8606 6.01984 21.7717 7.91101 21.9997 9.94M10.2266 13.8631C9.02506 12.6615 8.07627 11.3028 7.38028 9.85323C7.32041 9.72854 7.29048 9.66619 7.26748 9.5873C7.18576 9.30695 7.24446 8.96269 7.41447 8.72526C7.46231 8.65845 7.51947 8.60129 7.63378 8.48698C7.98338 8.13737 8.15819 7.96257 8.27247 7.78679C8.70347 7.1239 8.70347 6.26932 8.27247 5.60643C8.15819 5.43065 7.98338 5.25585 7.63378 4.90624L7.43891 4.71137C6.90747 4.17993 6.64174 3.91421 6.35636 3.76987C5.7888 3.4828 5.11854 3.4828 4.55098 3.76987C4.2656 3.91421 3.99987 4.17993 3.46843 4.71137L3.3108 4.86901C2.78117 5.39863 2.51636 5.66344 2.31411 6.02348C2.08969 6.42298 1.92833 7.04347 1.9297 7.5017C1.93092 7.91464 2.01103 8.19687 2.17124 8.76131C3.03221 11.7947 4.65668 14.6571 7.04466 17.045C9.43264 19.433 12.295 21.0575 15.3284 21.9185C15.8928 22.0787 16.1751 22.1588 16.588 22.16C17.0462 22.1614 17.6667 22 18.0662 21.7756C18.4263 21.5733 18.6911 21.3085 19.2207 20.7789L19.3783 20.6213C19.9098 20.0898 20.1755 19.8241 20.3198 19.5387C20.6069 18.9712 20.6069 18.3009 20.3198 17.7333C20.1755 17.448 19.9098 17.1822 19.3783 16.6508L19.1835 16.4559C18.8339 16.1063 18.6591 15.9315 18.4833 15.8172C17.8204 15.3862 16.9658 15.3862 16.3029 15.8172C16.1271 15.9315 15.9523 16.1063 15.6027 16.4559C15.4884 16.5702 15.4313 16.6274 15.3644 16.6752C15.127 16.8453 14.7828 16.904 14.5024 16.8222C14.4235 16.7992 14.3612 16.7693 14.2365 16.7094C12.7869 16.0134 11.4282 15.0646 10.2266 13.8631Z"
                                                    stroke="#6941C6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </g>
                                        </svg>
                                    </div>
                                </div>
                                <div className="w-6 h-6 relative  overflow-hidden"></div>
                            </div>
                            <div className="flex  justify-center items-center">
                                <div className="mr-2 cursor-pointer">
                                    <svg fill="#000000" width="24" height="24" version="1.1" id="XMLID_274_"
                                        xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"
                                        enableBackground="new 0 0 24 24" xmlSpace="preserve">
                                        <g id="share">
                                            <g>
                                                <path
                                                    d="M20,24H0V4h11v2H2v16h16v-9h2V24z M12.7,12.7l-1.4-1.4L20.6,2H14V0h10v10h-2V3.4L12.7,12.7z" />
                                            </g>
                                        </g>
                                    </svg>
                                </div>
                                <p>Share with Colleague</p>
                            </div>
                        </div>
                    </div>
                </div >
            </div >
        </div >
    )
}

export default AddToCardComponent