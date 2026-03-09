"use client";

import React, { useEffect, useState } from 'react'
import FilterCourse from './FilterCourse';
import { getAllCourseForEbook, getAllCoursesForLive, getAllCoursesForRecorded } from '@/services/course';
import LiveCourseCard from './LiveCourseCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import SelfStudyCard from './SelfStudyCard';
import EbookCard from './EbookCard';

const CourseCatalog = () => {

    const [course, setCourses] = useState<any>(
        {
            liveCourseListing: [],
            freeCourseListing: [],
            selfStudyCourseListing: [],
            ebookCourseListing: []
        }
    )


    let [filterValue, setFilterValue] = useState<any>({
        cpe_credit: null,
        field_of_study: null
    })

    function getFilterValues(values: any) {
        setFilterValue(values)
    }

    async function getCourse() {
        let resCourse: any = await getAllCoursesForLive();

        let liveCourse: any = [];
        let freeCourse: any = [];
        let ebookCourse: any = [];
        let selfStudy: any = [];

        const courseListing = resCourse.data;

        courseListing.forEach((element: any) => {
            let data = element?.attributes?.category?.data?.attributes?.title
            let priceCheck = element?.attributes?.price;
            let forTaxLawCheck = element?.attributes?.forTaxLaw;
            let isActiveCheck = element?.attributes?.isActive;

            if ((data != null || data != undefined) && data === 'Live' && priceCheck > 0 && forTaxLawCheck === true && isActiveCheck === true) {
                liveCourse.push(element)
            }
            if (priceCheck < 1 && forTaxLawCheck === true && isActiveCheck === true) {
                freeCourse.push(element)
            }
        });

        resCourse = await getAllCoursesForRecorded();
        selfStudy = resCourse.data

        resCourse = await getAllCourseForEbook();
        ebookCourse = resCourse.data

        setCourses({
            liveCourseListing: liveCourse,
            freeCourseListing: freeCourse,
            ebookCourseListing: ebookCourse,
            selfStudyCourseListing: selfStudy
        })
    }

    useEffect(() => {
        getCourse();
    }, [])

    return (
        <section className="container mx-auto my-10 flex">

            <div className="w-1/5">
                <FilterCourse getFilterValues={getFilterValues} />
            </div>

            <div className="w-4/5">
                <Tabs defaultValue="Live Webinar" className="w-full bg-transparent border-b border-[#dee1e9]">
                    <TabsList variant="line" className='w-full bg-transparent  border-b border-[#dee1e9]'>
                        <TabsTrigger value="Live Webinar" className="text-2xl font-bold cursor-pointer hover:text-blue-500 hover:after:bg-blue-500 hover:after:opacity-100 font-['Inter'] leading-loose  data-[state=active]:text-blue-500 data-[state=active]:after:bg-blue-500">Live Webinar</TabsTrigger>
                        <TabsTrigger value="Self-Study" className="text-2xl font-bold cursor-pointer hover:text-blue-500 hover:after:bg-blue-500 hover:after:opacity-100 font-['Inter'] leading-loose  data-[state=active]:text-blue-500 data-[state=active]:after:bg-blue-500">Self-Study</TabsTrigger>
                        <TabsTrigger value="eBook" className="text-2xl font-bold cursor-pointer hover:text-blue-500 hover:after:bg-blue-500 hover:after:opacity-100 font-['Inter'] leading-loose  data-[state=active]:text-blue-500 data-[state=active]:after:bg-blue-500">eBook</TabsTrigger>
                        <TabsTrigger value="Free CPE" className="text-2xl font-bold cursor-pointer hover:text-blue-500 hover:after:bg-blue-500 hover:after:opacity-100 font-['Inter'] leading-loose  data-[state=active]:text-blue-500 data-[state=active]:after:bg-blue-500">Free CPE</TabsTrigger>
                    </TabsList>
                    <TabsContent value="Live Webinar">
                        <LiveCourseCard courses={course.liveCourseListing} filterValue={filterValue} />
                    </TabsContent>
                    <TabsContent value="Self-Study">
                        <SelfStudyCard courses={course.selfStudyCourseListing} filterValue={filterValue} />
                    </TabsContent>
                    <TabsContent value="eBook">
                        <EbookCard courses={course.ebookCourseListing} filterValue={filterValue} />
                    </TabsContent>
                    <TabsContent value="Free CPE">
                        <LiveCourseCard courses={course.freeCourseListing} filterValue={filterValue} />
                    </TabsContent>
                </Tabs>
            </div >
        </section >
    )
}

export default CourseCatalog