"use client";

import { getTestimonial } from '@/services/testimonial';
import { useEffect, useRef, useState } from 'react'
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import { imageUrl } from '@/lib/constants';
import { getHomePageSection } from '@/services/common';

function FullStar() {
    return (
        <div data-color="Yellow" data-fill="100%" className="w-5 h-5 relative overflow-hidden">
            <div className="w-5 h-5 left-0 top-0 absolute overflow-hidden">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g id="Star" clipPath="url(#clip0_2352_13821)">
                        <path id="Star_2" d="M9.53834 1.60996C9.70914 1.19932 10.2909 1.19932 10.4617 1.60996L12.5278 6.57744C12.5998 6.75056 12.7626 6.86885 12.9495 6.88383L18.3123 7.31376C18.7556 7.3493 18.9354 7.90256 18.5976 8.19189L14.5117 11.6919C14.3693 11.8139 14.3071 12.0053 14.3506 12.1876L15.5989 17.4208C15.7021 17.8534 15.2315 18.1954 14.8519 17.9635L10.2606 15.1592C10.1006 15.0615 9.89938 15.0615 9.73937 15.1592L5.14806 17.9635C4.76851 18.1954 4.29788 17.8534 4.40108 17.4208L5.64939 12.1876C5.69289 12.0053 5.6307 11.8139 5.48831 11.6919L1.40241 8.19189C1.06464 7.90256 1.24441 7.3493 1.68773 7.31376L7.05054 6.88383C7.23744 6.86885 7.40024 6.75056 7.47225 6.57744L9.53834 1.60996Z" fill="#FDB022" />
                    </g>
                    <defs>
                        <clipPath id="clip0_2352_13821">
                            <rect width="20" height="20" fill="white" />
                        </clipPath>
                    </defs>
                </svg>
            </div>
        </div>
    )
}

function HalfStar() {
    return (
        <div data-color="Yellow" data-fill="100%" className="w-5 h-5 relative overflow-hidden">
            <div className="w-5 h-5 left-0 top-0 absolute overflow-hidden">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <linearGradient id="halfGradient" x1="0" y1="0" x2="20" y2="0" gradientUnits="userSpaceOnUse">
                            <stop offset="50%" stopColor="#FDB022" />
                            <stop offset="50%" stopColor="#808080" />
                        </linearGradient>
                        <clipPath id="clip0_2352_13821">
                            <rect width="20" height="20" fill="white" />
                        </clipPath>
                    </defs>
                    <g id="Star" clipPath="url(#clip0_2352_13821)">
                        <path id="Star_2" d="M9.53834 1.60996C9.70914 1.19932 10.2909 1.19932 10.4617 1.60996L12.5278 6.57744C12.5998 6.75056 12.7626 6.86885 12.9495 6.88383L18.3123 7.31376C18.7556 7.3493 18.9354 7.90256 18.5976 8.19189L14.5117 11.6919C14.3693 11.8139 14.3071 12.0053 14.3506 12.1876L15.5989 17.4208C15.7021 17.8534 15.2315 18.1954 14.8519 17.9635L10.2606 15.1592C10.1006 15.0615 9.89938 15.0615 9.73937 15.1592L5.14806 17.9635C4.76851 18.1954 4.29788 17.8534 4.40108 17.4208L5.64939 12.1876C5.69289 12.0053 5.6307 11.8139 5.48831 11.6919L1.40241 8.19189C1.06464 7.90256 1.24441 7.3493 1.68773 7.31376L7.05054 6.88383C7.23744 6.86885 7.40024 6.75056 7.47225 6.57744L9.53834 1.60996Z" fill="url(#halfGradient)" />
                    </g>
                </svg>
            </div>
        </div>
    )
}

function BlankStar() {
    return (
        <div data-color="Yellow" data-fill="100%" className="w-5 h-5 relative overflow-hidden">
            <div className="w-5 h-5 left-0 top-0 absolute overflow-hidden">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g id="Star" clipPath="url(#clip0_2352_13821)">
                        <path id="Star_2" d="M9.53834 1.60996C9.70914 1.19932 10.2909 1.19932 10.4617 1.60996L12.5278 6.57744C12.5998 6.75056 12.7626 6.86885 12.9495 6.88383L18.3123 7.31376C18.7556 7.3493 18.9354 7.90256 18.5976 8.19189L14.5117 11.6919C14.3693 11.8139 14.3071 12.0053 14.3506 12.1876L15.5989 17.4208C15.7021 17.8534 15.2315 18.1954 14.8519 17.9635L10.2606 15.1592C10.1006 15.0615 9.89938 15.0615 9.73937 15.1592L5.14806 17.9635C4.76851 18.1954 4.29788 17.8534 4.40108 17.4208L5.64939 12.1876C5.69289 12.0053 5.6307 11.8139 5.48831 11.6919L1.40241 8.19189C1.06464 7.90256 1.24441 7.3493 1.68773 7.31376L7.05054 6.88383C7.23744 6.86885 7.40024 6.75056 7.47225 6.57744L9.53834 1.60996Z" fill="#808080" />
                    </g>
                    <defs>
                        <clipPath id="clip0_2352_13821">
                            <rect width="20" height="20" fill="white" />
                        </clipPath>
                    </defs>
                </svg>
            </div>
        </div>
    )
}

const Testimonial = () => {
    const [testimonials, setTestimonial] = useState([]);
    const [testimonialBanner, setTestimonialBanner] = useState<any>(null);

    const swiperRef = useRef<any>(null);

    useEffect(() => {
        getTestimonial().then((data) => {
            setTestimonial(data.data);
        });

        getHomePageSection().then((res) => {
            if (res) {
                setTestimonialBanner(res?.data?.attributes?.blocks.filter((x: { __component: string; }) => x.__component === 'blocks.testimonial-banner')[0])
            }
        })
    }, []);

    return (
        <section className="bg-[#eef4ff] mt-10  py-24">
            <div className="w-[90%] mx-auto bg-white  px-8">
                <div className='grid md:grid-cols-2 grid-cols-1 items-center'>
                    <div className='relative'>
                        <Swiper
                            modules={[Pagination, Autoplay]}
                            onSwiper={(swiper) => (swiperRef.current = swiper)}
                            spaceBetween={30}
                            slidesPerView={1}
                            slidesPerGroup={1}
                            autoplay={{ delay: 3000 }}
                            loop={testimonials.length > 1}
                            allowTouchMove={testimonials.length > 1}
                        >
                            {testimonials.map((item: any) => (
                                <SwiperSlide key={item.id}>
                                    <div className="w-full flex flex-col">
                                        <div className="inline-flex justify-start items-center gap-1">
                                            {
                                            item.attributes.rating === 5 && <>
                                                <FullStar />
                                                <FullStar />
                                                <FullStar />
                                                <FullStar />
                                                <FullStar />
                                            </>
                                            }

                                            {item.attributes.rating === 4 && <>
                                                <FullStar />
                                                <FullStar />
                                                <FullStar />
                                                <FullStar />
                                                <BlankStar />
                                            </>
                                            }

                                            {item.attributes.rating === 3 && <>
                                                <FullStar />
                                                <FullStar />
                                                <FullStar />
                                                <BlankStar />
                                                <BlankStar />
                                            </>
                                            }

                                            {item.attributes.rating === 2 && <>
                                                <FullStar />
                                                <FullStar />
                                                <BlankStar />
                                                <BlankStar />
                                                <BlankStar />
                                            </>
                                            }

                                            {item.attributes.rating === 1 && <>
                                                <FullStar />
                                                <BlankStar />
                                                <BlankStar />
                                                <BlankStar />
                                                <BlankStar />
                                            </>
                                            }

                                            {
                                                item.attributes.rating > 4 && item.attributes.rating < 5 && <>
                                                    <FullStar />
                                                    <FullStar />
                                                    <FullStar />
                                                    <FullStar />
                                                    <HalfStar />
                                                </>
                                            }

                                            {
                                                item.attributes.rating > 3 && item.attributes.rating < 4 && <>
                                                    <FullStar />
                                                    <FullStar />
                                                    <FullStar />
                                                    <HalfStar />
                                                    <BlankStar />
                                                </>
                                            }

                                            {
                                                item.attributes.rating > 2 && item.attributes.rating < 3 && <>
                                                    <FullStar />
                                                    <FullStar />
                                                    <HalfStar />
                                                    <BlankStar />
                                                    <BlankStar />
                                                </>
                                            }

                                            {
                                                item.attributes.rating > 1 && item.attributes.rating < 2 && <>
                                                    <FullStar />
                                                    <HalfStar />
                                                    <BlankStar />
                                                    <BlankStar />
                                                    <BlankStar />
                                                </>
                                            }

                                            {
                                                item.attributes.rating > 0 && item.attributes.rating < 1 && <>
                                                    <HalfStar />
                                                    <BlankStar />
                                                    <BlankStar />
                                                    <BlankStar />
                                                    <BlankStar />
                                                </>
                                            }
                                        </div>
                                        <div
                                            className="text-Colors-Text-text-primary-(900) text-1xl font-medium font-['Inter'] leading-[20px] p-4"
                                            dangerouslySetInnerHTML={{ __html: item.attributes.message }}></div>
                                        <div className="inline-flex justify-start items-start gap-3">
                                            <div className="flex-1 flex justify-start items-start gap-4">
                                                <div className="w-14 h-14 relative rounded-full">
                                                    <div
                                                        className="w-14 h-14 left-0 top-0 absolute rounded-full border-[0.75px] border-Component-colors-Components-Avatars-avatar-contrast-border/10">
                                                        <img src={imageUrl + item?.attributes.profile_image?.data?.attributes?.url} alt="" />
                                                    </div>
                                                </div>
                                                <div className="flex-1 inline-flex flex-col justify-start items-start gap-0.5">
                                                    <div
                                                        className="text-Colors-Text-text-primary-(900) text-lg font-semibold font-['Inter'] leading-7">
                                                        {item.attributes.name}</div>
                                                    <div
                                                        className="text-Colors-Text-text-tertiary-(600) text-base font-normal font-['Inter'] leading-normal">
                                                        {item.attributes.designation}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>

                        <div className="absolute flex justify-start items-start gap-8 cursor-pointer right-20 top-[200px] bg-white z-10">
                            <div
                                onClick={() => swiperRef.current?.slidePrev()}
                                className="w-10 h-10 rounded-full  outline-1 outline-offset-[-1px] outline-[#667085] flex justify-center items-center gap-3">
                                <div className="w-6 h-6 relative overflow-hidden ">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <g id="arrow-left">
                                            <path id="Icon" d="M19 12H5M5 12L12 19M5 12L12 5" stroke="#667085" strokeWidth="2"
                                                strokeLinecap="round" strokeLinejoin="round" />
                                        </g>
                                    </svg>
                                </div>
                            </div>
                            <div
                                onClick={() => swiperRef.current?.slideNext()}
                                className=" cursor-pointer w-10 h-10 rounded-full outline-1 outline-offset-[-1px] outline-[#667085] flex justify-center items-center gap-3">
                                <div className="w-6 h-6 relative overflow-hidden">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <g id="arrow-right">
                                            <path id="Icon" d="M5 12H19M19 12L12 5M19 12L12 19" stroke="#667085" strokeWidth="2"
                                                strokeLinecap="round" strokeLinejoin="round" />
                                        </g>
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="">
                            <img className="" src={imageUrl + testimonialBanner?.image?.data?.attributes.url} />
                        </div>
                    </div>
                </div>
            </div >
        </section>

    )
}

export default Testimonial