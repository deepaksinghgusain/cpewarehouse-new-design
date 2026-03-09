"use client";

import React, { useEffect, useState } from 'react'
import { imageUrl } from '@/lib/constants';
import Link from 'next/link';
import PaginationComponent from './PaginationComponent';

const EbookCard = ({ courses, filterValue }: { courses: any, filterValue: any }) => {
    const [filterCourse, setFilterCourse] = useState<any>([]);

    const itemsPerPage = 9;
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)

    async function getDataByFilterValueChanges() {

        const filterCourse = courses.filter((course: any) => {

            if (filterValue?.cpe_credit !== null && filterValue?.field_of_study !== null) {

                let credit: string = "" + filterValue?.cpe_credit;

                let startCreditPoint = parseInt(credit.split("-")[0]);
                let endCreditPoint = parseInt(credit.split("-")[1]);

                if (
                    parseInt(course.attributes.credit) >= startCreditPoint &&
                    parseInt(course.attributes.credit) < endCreditPoint &&
                    filterValue?.field_of_study.toLowerCase() === course.attributes.fieldOfStudy?.toLowerCase()) {
                    return course
                }
            } else if (filterValue?.cpe_credit !== null) {

                let credit: string = "" + filterValue?.cpe_credit;

                let startCreditPoint = parseInt(credit.split("-")[0]);
                let endCreditPoint = parseInt(credit.split("-")[1]);

                if (
                    parseInt(course.attributes.credit) >= startCreditPoint &&
                    parseInt(course.attributes.credit) < endCreditPoint) {
                    return course
                }
            } else if (filterValue.field_of_study !== null) {

                if (filterValue.field_of_study && filterValue?.field_of_study?.toString().toLowerCase() === course.attributes?.fieldOfStudy?.toLowerCase()) {
                    return course
                }
            } else {
                return course
            }
        })

        setFilterCourse(filterCourse)

        setTotalPages(Math.ceil(filterCourse.length / itemsPerPage));
    }

    useEffect(() => {
        getDataByFilterValueChanges();
    }, [courses.length, filterCourse.length, filterValue.field_of_study, filterValue.cpe_credit])

    return (
        <div className="flex gap-5 ml-1 mt-6">

            <div className="w-full flex  content-start flex-wrap gap-2">

                <section className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 ml-4 mb-5 gap-6">
                    {
                        filterCourse.length > 0 ? filterCourse.slice((page - 1) * itemsPerPage, (page - 1) * itemsPerPage + itemsPerPage).map((course: any, index: number) => (
                            <div
                                key={index}
                                className="course-container flex flex-col w-full h-full relative rounded-[10px] outline-1 outline-offset-[-1px] outline-sky-300 shadow shadow-gray-500">

                                <div className="w-full h-32 relative bg-gradient-to-t from-purple-300 to-blue-300 rounded-[10px] overflow-hidden">
                                    <div className="ml-4 mt-4">
                                        <div className="flex">
                                            {
                                                course.attributes?.instructors.data.length > 0 && course.attributes?.instructors.data.map((instructor: any, index: number) => (
                                                    <img key={index} className="w-12 h-12 mr-2 rounded-[684px] ml[-10px]" src={imageUrl + instructor?.attributes?.image?.data?.attributes?.url} />
                                                ))
                                            }
                                        </div>
                                        <div className="w-[280px] mt-2 justify-start items-center gap-2.5 inline-flex">
                                            <div className="flex-col justify-start items-start inline-flex">
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

                                <div className="px-5 h-56 pb-6 mt-4 flex-col justify-start items-start gap-[18px] inline-flex">
                                    <div className="self-stretch justify-start items-start gap-2 inline-flex">

                                        <div
                                            className="pl-2 pr-2.5 py-0.5 bg-orange-100 rounded-full outline-1 outline-offset-[-1px] outline-orange-400 inline-flex justify-start items-center gap-1.5">
                                            <div className="text-center justify-start text-orange-400 text-sm font-medium font-['Inter'] leading-tight">
                                                E-Book</div>
                                        </div>

                                        {
                                            course?.attributes?.fieldOfStudy && <div
                                                className="px-2.5 py-0.5 bg-pink-50 rounded-full  outline-1 outline-offset-[-1px] outline-pink-200 inline-flex justify-start items-center">
                                                <div className="text-center justify-start text-pink-700 text-sm font-medium font-['Inter'] leading-tight">
                                                    {course?.attributes?.fieldOfStudy}</div>
                                            </div>
                                        }

                                    </div>
                                    <div className="self-stretch flex-col justify-start items-start gap-2 flex">
                                        <Link href={`/course/${course?.attributes?.slug}`}>
                                            <div className="self-stretch text-[#101828] text-lg font-semibold font-['Inter'] leading-7">
                                                {course?.attributes?.title}</div>
                                        </Link>
                                    </div>
                                </div>
                                <div className="absolute bottom-5 ml-2 add-to-card flex flex-col justify-start items-center gap-2 overflow-hidden">
                                    <div className="flex w-full">
                                        <div className="justify-start text-[#156fee] text-base font-semibold font-['Inter'] leading-normal z-10 ">Add to
                                            cart
                                        </div>
                                        <div className="w-5 h-5 relative overflow-hidden">
                                            <div className=" h-full w-full absolute">
                                                <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M6.33398 14.1667L14.6673 5.83337M14.6673 5.83337H6.33398M14.6673 5.83337V14.1667"
                                                        stroke="#155EEF" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <img src="/assets/images/bar-code-image.png" alt="" />
                                    </div>
                                </div>
                            </div>
                        )) : <div>No Record</div>
                    }
                </section>
                <PaginationComponent
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={setPage}
                />
            </div>
        </div>
    )
}

export default EbookCard