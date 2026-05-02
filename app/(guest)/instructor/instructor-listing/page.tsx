import { imageUrl } from '@/lib/constants'
import { getInstructorsForHome } from '@/services/faculty'
import Link from 'next/link'
import React from 'react'
import FacultySection from './instructor-detail-popup'

const IntructorListingPage = async () => {
    const res = await getInstructorsForHome()

    return (
        <>
            <section className="container mx-auto flex justify-center mt-10">
                <div className="w-1/2 self-stretch inline-flex flex-col justify-start items-center gap-8">
                    <div className="w-full max-w-[768px] flex flex-col justify-start items-center gap-5">
                        <div className="self-stretch flex flex-col justify-start items-start gap-3">
                            <div className="self-stretch text-center justify-start text-[#004EEA] text-base font-semibold font-['Inter'] leading-normal">Faculty</div>
                            <div className="self-stretch text-center justify-start text-Colors-Text-text-primary-(900) text-4xl font-semibold font-['Inter'] leading-10">Meet Our Top-Rated Faculty</div>
                        </div>
                        <div className="self-stretch text-center justify-start text-[#475467] font-normal font-['Inter'] leading-loose">CPE Warehouse is committed to providing a seamless and exceptional continuing education experience for finance and accounting professionals. Our courses are instructed by leading finance professionals across Canada and the U.S.</div>
                    </div>
                    <div className="inline-flex justify-start items-start gap-3">
                        <div className="px-4 py-3 rounded-lg shadow-[inset_0px_0px_0px_1px_rgba(16,24,40,0.18)] outline outline-1 outline-offset-[-1px] outline-[#DOD5DD] flex justify-center items-center gap-1.5 overflow-hidden">
                            <div className="px-0.5 flex justify-center items-center">
                                <Link href="/about-us" className="justify-start text-Component-colors-Components-Buttons-Secondary-button-secondary-fg text-base font-semibold font-['Inter'] leading-normal">About us</Link>
                            </div>
                        </div>
                        <div className="px-4 bg-[#444CE6] text-white py-3 bg-Colors-Indigo-600 rounded-3xl shadow-[inset_0px_0px_0px_1px_rgba(16,24,40,0.18)] outline outline-2 outline-offset-[-2px] outline-white/10 flex justify-center items-center gap-1.5 overflow-hidden">
                            <div className="px-0.5 flex justify-center items-center">
                                <Link href="/course-catalog" className="justify-start text-Component-colors-Components-Buttons-Primary-button-primary-fg text-base font-semibold font-['Inter'] leading-normal">Explore Course Catalouge</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <FacultySection res={res} />
            {/*   <section className="w-[90%] mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-4 py-10">
                   {
                        res.data.length > 0 && res.data.map((faculty: any, index: number) => (
                            <div key={index} className="flex-1 min-w-60 inline-flex flex-col justify-start items-start gap-6">
                                <img className="self-stretch h-72 relative" src={imageUrl + faculty.attributes.image.data.attributes.url} />
                                <div className="self-stretch flex flex-col justify-start items-start gap-6">
                                    <div className="self-stretch flex flex-col justify-start items-start gap-4">
                                        <div className="self-stretch flex flex-col justify-start items-start gap-1">
                                            <div
                                                className="self-stretch justify-start text-Colors-Text-text-primary-(900) text-xl font-semibold font-['Inter'] leading-loose">
                                                {faculty.attributes.firstName}
                                                {faculty.attributes.lastName}
                                            </div>
                                            <div
                                                className="self-stretch justify-start text-Colors-Text-text-brand-secondary-(700) text-lg font-normal font-['Inter'] leading-7">
                                                {faculty.attributes?.shortDesc}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="cursor-pointer inline-flex justify-center items-center gap-2 overflow-hidden">
                                        <div className="justify-start text-[#2970FE] text-base font-semibold font-['Inter'] leading-normal">Read Bio</div>
                                        <div className="w-5 h-5 relative overflow-hidden">

                                            <div>
                                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <g id="arrow-right">
                                                        <path id="Icon"
                                                            d="M4.16797 9.99999H15.8346M15.8346 9.99999L10.0013 4.16666M15.8346 9.99999L10.0013 15.8333"
                                                            stroke="#2970FF" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                                                    </g>
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    } 

                </div>

            </section >
            */}

        </>
    )
}

export default IntructorListingPage