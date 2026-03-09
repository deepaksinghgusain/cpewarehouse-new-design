"use client";

import { imageUrl } from '@/lib/constants'
import { getAllCoursesForLive } from '@/services/course';
import moment from "moment-timezone";
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

const FreeCourseCard = ({ filterValue }: { filterValue: any }) => {
    const timezone = moment.tz.guess();
    const timezoneAbbrv = moment().tz(timezone).format('z');
    const firstLetter = timezoneAbbrv.charAt(0);
    const lastLetter = timezoneAbbrv.charAt(timezoneAbbrv.length - 1);
    const twoLettertimezone = firstLetter + lastLetter;

    const [courses, setCourses] = useState<any>([]);
    const [filterCourse, setFilterCourse] = useState<any>([]);

    async function getCourse() {
        let resCourse: any = await getAllCoursesForLive();

        let freeCourse: any = [];

        const courseListing = resCourse.data;

        courseListing.forEach((element: any) => {
            let priceCheck = element?.attributes?.price;
            let forTaxLawCheck = element?.attributes?.forTaxLaw;
            let isActiveCheck = element?.attributes?.isActive;
            if (priceCheck < 1 && forTaxLawCheck === true && isActiveCheck === true) {
                freeCourse.push(element)
            }
        });

        setCourses([...freeCourse])
        setFilterCourse([...freeCourse])
    }

    function getDataByFilterValueChanges() {
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
    }

    useEffect(() => {
        if (filterValue.cpe_credit !== null || filterValue.field_of_study !== null) {
            getDataByFilterValueChanges();
        }

        if (courses.length === 0) {
            getCourse();
        }

    }, [filterCourse.length, filterValue.field_of_study, filterValue.cpe_credit])

    return (

        <div className="flex gap-5 ml-1 mt-6">

            <div className="w-full flex  content-start flex-wrap gap-2">

                <section className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 ml-4 mb-5 gap-6">
                    {
                        filterCourse.length > 0 ? filterCourse.map((course: any, index: number) => (
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

                                <div className="px-5 h-56 pb-6 mt-4 flex-col justify-start items-start gap-[18px] inline-flex">
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
                                    <div className="self-stretch flex-col justify-start items-start gap-2 flex">
                                        <Link href={`/course/${course.attributes?.slug}`}>
                                            <div className="self-stretch text-[#101828] text-lg font-semibold font-['Inter'] leading-7">{course.attributes?.title}</div>
                                        </Link>
                                        {
                                            course.attributes?.category?.data?.attributes?.title !== "Recorded" && <div
                                                className="self-stretch justify-start text-Colors-Text-text-tertiary-(600) text-sm font-normal font-['Inter'] leading-normal">
                                                {moment(course.attributes?.startDate.replace("Z", "")).format("dddd MMM d YYYY")} |
                                                {moment(course.attributes?.startDate.replace("Z", "")).format("h:mm a").toUpperCase()} -
                                                {moment(course.attributes?.endDate).format("h:mm a").toUpperCase()} {twoLettertimezone || ''}
                                            </div>
                                        }
                                    </div>

                                </div>
                                <div className="absolute bottom-1 h-10 ml-2 add-to-card inline-flex justify-center items-center gap-2 overflow-hidden">
                                    <div className="justify-start text-[#156fee] text-base font-semibold font-['Inter'] leading-normal z-10 ">Add to cart
                                    </div>
                                    <div className="w-5 h-5 relative overflow-hidden">
                                        <div className=" h-full w-full absolute">
                                            <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M6.33398 14.1667L14.6673 5.83337M14.6673 5.83337H6.33398M14.6673 5.83337V14.1667" stroke="#155EEF"
                                                    strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )) : <div>No Record</div>
                    }

                </section >
            </div>
        </div >

    )
}

export default FreeCourseCard