"use client";

import React, { useEffect, useMemo, useState } from 'react'
import FilterCourse from './FilterCourse';
import { getAllCourseForEbook, getAllCoursesForLive, getAllCoursesForRecorded } from '@/services/course';
import LiveCourseCard from './LiveCourseCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import SelfStudyCard from './SelfStudyCard';
import EbookCard from './EbookCard';
import LoadingUI from '../ui/loading';
import { useRouter, useSearchParams } from 'next/navigation';

const tabOptions = [
    'Live Webinar',
    'Self-Study',
    'eBook',
    'Free CPE'
] as const;

const tabConfig = tabOptions.map((tab) => ({
    value: tab,
    label: tab,
}));

const normalizeTabValue = (value: string) => value.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const CourseCatalog = () => {

    const router = useRouter();
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(false);

    const [course, setCourses] = useState<any>(
        {
            liveCourseListing: [],
            freeCourseListing: [],
            selfStudyCourseListing: [],
            ebookCourseListing: []
        }
    )

    const [filterValue, setFilterValue] = useState<any>({})

    const activeTab = useMemo(() => {
        const tabParam = searchParams.get('tab');

        if (!tabParam) {
            return 'Live Webinar';
        }

        const normalizedParam = normalizeTabValue(tabParam);
        const matchedTab = tabConfig.find(({ value, label }) => {
            const tabValues = [value, label].map(normalizeTabValue);
            return tabValues.includes(normalizedParam)
                || tabValues.some((tabValue) => tabValue.startsWith(normalizedParam) || normalizedParam.startsWith(tabValue));
        })?.value;

        return matchedTab ?? 'Live Webinar';
    }, [searchParams]);

    const handleTabChange = (value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('tab', value);
        router.replace(`?${params.toString()}`, { scroll: false });
    };

    function setFilterValues(values: any) {
        setFilterValue(values)
    }

    function getFilterValues(values: any) {
        setFilterValue(values)
    }

    async function getCourse() {
        setLoading(true);

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

        setLoading(false)
    }

    useEffect(() => {
        getCourse();
    }, [])

    if(loading) {
        return <LoadingUI />
    }

    return (
        <section className="container mx-auto my-6 flex w-full flex-col gap-5 px-2 sm:my-10 sm:gap-6 sm:px-4 lg:flex-row lg:gap-8 max-[500px]:px-3">

            <div className="w-full lg:hidden">
                <details className="rounded-lg border border-[#e4e7ec] bg-white">
                    <summary className="cursor-pointer px-4 py-3 text-base font-semibold text-[#101828]">Filter courses</summary>
                    <div className="border-t border-[#e4e7ec] p-3">
                        <FilterCourse getFilterValues={getFilterValues} setFilterValues={setFilterValues} />
                    </div>
                </details>
            </div>

            <div className="hidden w-full shrink-0 lg:block lg:w-1/5">
                <FilterCourse getFilterValues={getFilterValues} setFilterValues={setFilterValues} />
            </div>

            <div className="min-w-0 w-full mx-auto lg:w-4/5">
                <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full bg-transparent border-b border-[#dee1e9]">
                    <TabsList variant="line" className='w-full justify-start gap-0 overflow-x-auto bg-transparent border-b border-[#dee1e9] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'>
                        {tabConfig.map((tab) => (
                            <TabsTrigger
                                key={tab.value}
                                value={tab.value}
                                className="shrink-0 px-3 text-sm font-bold cursor-pointer hover:text-blue-500 hover:after:bg-blue-500 hover:after:opacity-100 font-['Inter'] leading-loose sm:px-4 sm:text-2xl data-[state=active]:text-blue-500 data-[state=active]:after:bg-blue-500"
                            >
                                {tab.label}
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    {tabConfig.map((tab) => (
                        <TabsContent key={tab.value} value={tab.value}>
                            {tab.value === 'Live Webinar' && <LiveCourseCard courses={course.liveCourseListing} filterValue={filterValue} />}
                            {tab.value === 'Self-Study' && <SelfStudyCard courses={course.selfStudyCourseListing} filterValue={filterValue} />}
                            {tab.value === 'eBook' && <EbookCard courses={course.ebookCourseListing} filterValue={filterValue} />}
                            {tab.value === 'Free CPE' && <LiveCourseCard courses={course.freeCourseListing} filterValue={filterValue} />}
                        </TabsContent>
                    ))}
                </Tabs>
            </div >
        </section >
    )
}

export default CourseCatalog