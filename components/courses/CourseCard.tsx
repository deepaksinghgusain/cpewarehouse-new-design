"use client";

import { imageUrl } from '@/lib/constants'
import { getAllCoursesForLive } from '@/services/course';
import { toUserTZ } from '@/lib/dates';
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import AddToCart from './add-to-cart';

const CourseCard = ({ course }: { course: any }) => {

    // use toUserTZ when rendering dates

    return (
        <div className="w-full">
            <div className="course-container relative flex h-full w-full flex-col overflow-hidden rounded-[10px] border border-sky-300/80 shadow shadow-sky-500/30">
                <div className="relative min-h-[128px] overflow-hidden rounded-t-[10px] bg-gradient-to-t from-cyan-300 to-indigo-600">
                    <div className="flex h-6 w-full items-center justify-center bg-[#8078d4]">
                        <div className="flex h-14 w-full items-start justify-start border-t border-white/30 bg-white/30 p-4 backdrop-blur-xl">
                            <div className="mt-2 text-[14px] text-base font-bold leading-normal text-white">
                                Credits: {course.attributes?.credit} | {course.attributes?.sub_title}
                            </div>
                        </div>
                    </div>

                    <div className="ml-4 mt-4 pb-2">
                        <div className="flex">
                            {course.attributes?.instructors?.data?.length > 0 && course.attributes.instructors.data.map((instructor: any, index: number) => (
                                <img
                                    key={index}
                                    className="mr-2 h-12 w-12 rounded-full border border-white/50 object-cover"
                                    src={imageUrl + instructor?.attributes?.image?.data?.attributes?.url}
                                    alt={instructor?.attributes?.firstName || 'Instructor'}
                                />
                            ))}
                        </div>

                        <div className="mt-2 max-w-full pr-2">
                            <div className="text-sm font-semibold leading-tight text-white">
                                {course.attributes?.instructors?.data?.length > 0 &&
                                    course.attributes.instructors.data
                                        .map((instructor: any) => `${instructor?.attributes?.firstName ?? ''} ${instructor?.attributes?.lastName ?? ''}`.trim())
                                        .filter(Boolean)
                                        .join(' | ')}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-4 flex h-full flex-col gap-[18px] px-5 pb-6">
                    <div className="flex flex-wrap items-center gap-2">
                        {course.attributes?.category?.data?.attributes?.title === "Live" && (
                            <div className="flex items-center gap-1.5 rounded-full border border-[#aaefc6] bg-[#ecfcf2] px-2.5 py-0.5">
                                <div className="relative h-2 w-2">
                                    <div className="absolute left-[1px] top-[1px] h-1.5 w-1.5 rounded-full bg-[#17b169]"></div>
                                </div>
                                <div className="text-center text-sm font-medium leading-tight text-[#057647]">Live webinar</div>
                            </div>
                        )}

                        <div className="inline-flex items-center rounded-full bg-pink-50 px-2.5 py-0.5 outline outline-1 outline-offset-[-1px] outline-pink-200">
                            <div className="text-center text-sm font-medium leading-tight text-pink-700">
                                {course?.attributes?.fieldOfStudy}
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col items-start gap-2">
                        <Link href={`/course/${course.attributes?.slug}`}>
                            <div className="self-stretch text-lg font-semibold leading-7 text-[#101828]">
                                {course.attributes?.title}
                            </div>
                        </Link>

                        {course.attributes?.category?.data?.attributes?.title !== "Recorded" && (
                            <div className="self-stretch text-sm font-normal leading-normal text-Colors-Text-text-tertiary-(600)">
                                {(() => {
                                    const s = toUserTZ(course.attributes?.startDate);
                                    const e = toUserTZ(course.attributes?.endDate);
                                    return (
                                        <>
                                            {s ? s.format('dddd MMM D YYYY') : ''} |
                                            {s ? ` ${s.format('h:mm a').toUpperCase()}` : ''} -
                                            {e ? ` ${e.format('h:mm a').toUpperCase()}` : ''}
                                            {s ? ` ${s.format('z')}` : ''}
                                        </>
                                    )
                                })()}
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-4">
                    <AddToCart course={course} quantity={1} />
                </div>
            </div>
        </div>
    )



}

export default CourseCard