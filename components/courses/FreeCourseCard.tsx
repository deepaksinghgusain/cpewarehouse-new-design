"use client";

import { imageUrl } from '@/lib/constants'
import { getAllCoursesForLive } from '@/services/course';
import { toUserTZ } from '@/lib/dates';
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import PaginationComponent from './PaginationComponent';
import AddToCart from './add-to-cart';

const FreeCourseCard = ({ courses, filterValue }: { courses: any, filterValue: any }) => {

    const [filterCourse, setFilterCourse] = useState<any>([]);

    const itemsPerPage = 9;

    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)

    async function getDataByFilterValueChanges() {
        const list = courses || [];

        const deriveKeyMap = (sampleCourse: any, filters: any) => {
            const attrKeys = sampleCourse?.attributes ? Object.keys(sampleCourse.attributes) : [];
            const map: any = {};
            if (!filters) return map;
            Object.keys(filters).forEach((k) => {
                const camel = k.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
                const pascal = camel.charAt(0).toUpperCase() + camel.slice(1);
                const candidates = [camel, pascal, k];
                const found = candidates.find(c => attrKeys.includes(c));
                map[k] = found ?? camel;
            });
            return map;
        }

        const keyMap: any = deriveKeyMap(list[0] ?? {}, filterValue);

        function matches(course: any, filters: any) {
            if (!filters || Object.keys(filters).length === 0) return true;

            return Object.entries(filters).every(([key, value]) => {
                if (value === null || value === undefined || value === '') return true;

                const attrKey = keyMap[key] ?? key.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
                let attrVal = course.attributes?.[attrKey];

                // fallback: try original key if camelCase mapping failed
                if (attrVal === undefined) attrVal = course.attributes?.[key];

                // Special handling for credit ranges
                if (key === 'cpe_credit') {
                    const credit = '' + value;
                    const parts = credit.split('-').map((p: string) => parseInt(p));
                    const start = parts[0] ?? 0;
                    const end = parts[1] ?? start + 1;
                    const courseCredit = parseInt(course.attributes?.credit || 0);
                    return courseCredit >= start && courseCredit < end;
                }

                // If filter is an array, check inclusion
                if (Array.isArray(value)) {
                    return value.map((v: any) => ('' + v).toLowerCase()).includes(('' + attrVal).toLowerCase());
                }

                // If filter is a numeric range like "1-3"
                if (typeof value === 'string' && value.includes('-') && !isNaN(Number(value.split('-')[0]))) {
                    const parts = value.split('-').map((p: string) => parseInt(p));
                    const start = parts[0];
                    const end = parts[1];
                    const num = parseInt(attrVal || 0);
                    return num >= start && num < end;
                }

                // Booleans or numbers
                if (typeof value === 'boolean' || typeof value === 'number') {
                    return String(attrVal) === String(value);
                }

                // Default: case-insensitive string match
                return ('' + attrVal).toLowerCase() === ('' + value).toLowerCase();
            })
        }

        const filtered = list.filter((course: any) => matches(course, filterValue));

        setFilterCourse(filtered)
        setTotalPages(Math.ceil(filtered.length / itemsPerPage));
    }

    useEffect(() => {
        getDataByFilterValueChanges();
    }, [courses.length, JSON.stringify(filterValue)])

    return (

        <div className="flex gap-5 ml-1 mt-6">

            <div className="w-full flex  content-start flex-wrap gap-2">

                <section className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 ml-4 mb-5 gap-6">
                    {
                        filterCourse.length > 0 ? filterCourse.slice((page - 1) * itemsPerPage, (page - 1) * itemsPerPage + itemsPerPage).map((course: any, index: number) => (
                            <div
                                key={index}
                                className="course-container flex flex-col w-full h-full relative rounded-[10px] outline-1 outline-offset-[-1px] outline-sky-300 shadow shadow-sky-500">
                                <div
                                    className="w-full min-h-[128px] relative bg-gradient-to-t from-cyan-300 to-indigo-600 rounded-[10px] overflow-hidden">
                                    <div className="h-6 w-full  flex-col justify-center items-center inline-flex bg-[#8078d4]">
                                        <div
                                            className="w-full h-14 p-4 bg-white/30 border-t border-white/30 backdrop-blur-xl flex-col justify-start items-start gap-6 flex">
                                            <div className="w-full justify-start items-start gap-6 inline-flex">
                                                <div className="flex-col justify-start items-center inline-flex mt-2">
                                                    <div className="text-white text-[14px] text-base font-bold font-['Inter'] leading-normal">Credits:
                                                        {course.attributes?.credit} |
                                                        {course.attributes?.sub_title}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="ml-4 mt-4 pb-2">
                                        <div className="flex">

                                            {
                                                course.attributes?.instructors.data.length > 0 && course.attributes?.instructors.data.map((instructor: any, index: number) => (
                                                    <img key={index} className="w-12 h-12 mr-2 rounded-[684px] ml[-10px]" src={imageUrl + instructor?.attributes?.image?.data?.attributes?.url} />
                                                ))
                                            }


                                        </div>
                                        <div className="w-[280px] mt-2 justify-start">
                                            <div className="flex-col justify-start items-start">
                                                <div className="text-white text-sm font-semibold font-['Inter'] leading-tight">
                                                    {
                                                        course.attributes?.instructors.data.length > 0 && course.attributes?.instructors.data.map((instructor: any, index: number) => (
                                                            <span key={index}>{instructor?.attributes?.firstName} {instructor?.attributes?.lastName}</span>
                                                        ))
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>

                                <div className="px-5 pb-6 my-4 h-min-70 flex-col justify-start items-start gap-[18px] inline-flex">
                                    <div className="self-stretch justify-start items-start gap-2 inline-flex">

                                        {
                                            course.attributes?.category?.data?.attributes?.title === "Live" && <div
                                                className="pl-2 pr-2.5 py-0.5 bg-[#ecfcf2] rounded-full border border-[#aaefc6] justify-start items-center gap-1.5 flex">
                                                <div className="w-2 h-2 relative">
                                                    <div className="w-1.5 h-1.5 left-[1px] top-[1px] absolute bg-[#17b169] rounded-full"></div>
                                                </div>
                                                <div className="text-center text-[#057647] text-sm font-medium font-['Inter'] leading-tight">Live webinar</div>
                                            </div>
                                        }

                                        <div
                                            className="px-2.5 py-0.5 bg-pink-50 rounded-full  outline-1 outline-offset-[-1px] outline-pink-200 inline-flex justify-start items-center">
                                            <div
                                                className="text-center justify-start text-pink-700 text-sm font-medium font-['Inter'] leading-tight">
                                                {course?.attributes?.fieldOfStudy}</div>
                                        </div>

                                    </div>
                                    <div className="self-stretch h-56 flex-col justify-start items-start gap-2 flex">
                                        <Link href={`/course/${course.attributes?.slug}`}>
                                            <div className="self-stretch text-[#101828] text-lg font-semibold font-['Inter'] leading-7">{course.attributes?.title}</div>
                                        </Link>
                                        {
                                            course.attributes?.category?.data?.attributes?.title !== "Recorded" && <div
                                                className="self-stretch justify-start text-Colors-Text-text-tertiary-(600) text-sm font-normal font-['Inter'] leading-normal">
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
                                        }
                                    </div>

                                </div>
                                <AddToCart course={course} quantity={1} />
                            </div>
                        )) : <div>No Record</div>
                    }

                </section >
                <PaginationComponent
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={setPage}
                />
            </div>
        </div >

    )
}

export default FreeCourseCard