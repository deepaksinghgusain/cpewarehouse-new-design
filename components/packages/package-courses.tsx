"use client"
import React from 'react'
import { toUserTZ } from '@/lib/dates';
import { imageUrl } from "@/lib/constants";
import Link from 'next/link';

const PackageCourses = ({ courses }: any) => {
    // use toUserTZ for timezone-aware formatting

    return (
        <>
            {courses.length > 0 && (
                <section className="bg-[#f9fafb] mb-10">
                    <div className="container">
                        <div className="text-left text-[#101828] text-4xl font-semibold font-['Inter'] leading-[44px]">
                            Course Included
                        </div>

                        <div className="w-full my-8">
                            <div className="grid grid-cols-4 gap-6">
                                {courses.map((course: any, index: number) => (
                                    <div
                                        key={index}
                                        className="course-container flex flex-col w-full h-full relative rounded-[10px] outline-1 outline-offset-[-1px] outline-sky-300 shadow shadow-sky-500"
                                    >
                                        <div className="w-full min-h-[128px] relative bg-gradient-to-t from-cyan-300 to-indigo-600 rounded-[10px] overflow-hidden">
                                            <div className="h-6 w-full  flex-col justify-center items-center inline-flex bg-[#8078d4]">
                                                <div className="w-full h-14 p-4 bg-white/30 border-t border-white/30 backdrop-blur-xl flex-col justify-start items-start gap-6 flex">
                                                    <div className="w-full justify-start items-start gap-6 inline-flex">
                                                        <div className="flex-col justify-start items-center inline-flex mt-2">
                                                            <div className="text-white text-[14px] text-base font-bold font-['Inter'] leading-normal">
                                                                Credits:
                                                                {course.attributes?.credit} |
                                                                {course.attributes?.sub_title}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="ml-4 mt-4 pb-2">
                                                <div className="flex">
                                                    {course.attributes?.instructors.data.length > 0 &&
                                                        course.attributes?.instructors.data.map(
                                                            (instructor: any, index: number) => (
                                                                <img
                                                                    key={index}
                                                                    className="w-12 h-12 mr-2 rounded-[684px] ml[-10px]"
                                                                    src={
                                                                        imageUrl +
                                                                        instructor?.attributes?.image?.data
                                                                            ?.attributes?.url
                                                                    }
                                                                />
                                                            ),
                                                        )}
                                                </div>
                                                <div className="w-[280px] mt-2 justify-start">
                                                    <div className="flex-col justify-start items-start">
                                                        <div className="text-white text-sm font-semibold font-['Inter'] leading-tight">
                                                            {course.attributes?.instructors.data.length >
                                                                0 &&
                                                                course.attributes?.instructors.data.map(
                                                                    (instructor: any, index: number) => (
                                                                        <span key={index}>
                                                                            {instructor?.attributes?.firstName}{" "}
                                                                            {instructor?.attributes?.lastName}
                                                                        </span>
                                                                    ),
                                                                )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="px-5 h-56 pb-6 mt-4 flex-col justify-start items-start gap-[18px] inline-flex">
                                            <div className="self-stretch justify-start items-start gap-2 inline-flex">
                                                {course.attributes?.category?.data?.attributes
                                                    ?.title === "Live" && (
                                                        <div className="pl-2 pr-2.5 py-0.5 bg-[#ecfcf2] rounded-full border border-[#aaefc6] justify-start items-center gap-1.5 flex">
                                                            <div className="w-2 h-2 relative">
                                                                <div className="w-1.5 h-1.5 left-[1px] top-[1px] absolute bg-[#17b169] rounded-full"></div>
                                                            </div>
                                                            <div className="text-center text-[#057647] text-sm font-medium font-['Inter'] leading-tight">
                                                                Live webinar
                                                            </div>
                                                        </div>
                                                    )}

                                                <div className="px-2.5 py-0.5 bg-pink-50 rounded-full  outline-1 outline-offset-[-1px] outline-pink-200 inline-flex justify-start items-center">
                                                    <div className="text-center justify-start text-pink-700 text-sm font-medium font-['Inter'] leading-tight">
                                                        {course?.attributes?.fieldOfStudy}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="self-stretch flex-col justify-start items-start gap-2 flex">
                                                <Link href={`/course/${course.attributes?.slug}`}>
                                                    <div className="self-stretch text-[#101828] text-lg font-semibold font-['Inter'] leading-7">
                                                        {course.attributes?.title}
                                                    </div>
                                                </Link>
                                                {course.attributes?.category?.data?.attributes
                                                    ?.title !== "Recorded" && (
                                                        <div className="self-stretch justify-start text-Colors-Text-text-tertiary-(600) text-sm font-normal font-['Inter'] leading-normal">
                                                            {(() => {
                                                                const s = toUserTZ(course.attributes?.startDate);
                                                                const e = toUserTZ(course.attributes?.endDate);
                                                                return (
                                                                    <>
                                                                        {s ? s.format('dddd MMM D YYYY') : ''} {' '}
                                                                        |
                                                                        {s ? ` ${s.format('h:mm a').toUpperCase()}` : ''} {' '}
                                                                        -
                                                                        {e ? ` ${e.format('h:mm a').toUpperCase()}` : ''} {' '}
                                                                        {s ? ` ${s.format('z')}` : ''}
                                                                    </>
                                                                )
                                                            })()}
                                                        </div>
                                                    )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            )}
        </>
    )
}

export default PackageCourses