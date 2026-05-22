import React from 'react'
import moment from "moment-timezone";
import Link from 'next/link';
import { imageUrl } from '@/lib/constants';
import { getAllCourses, getCourseDetailPage, getcoursesBySlug } from '@/services/course';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import CourseCard from '@/components/courses/CourseCard';
import { getPageContent } from '@/services/common';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AddToCardComponent from './add-to-cart';

const CourseLandingPage = async ({ params }: { params: Promise<{ slug: string }> }) => {

    const { slug } = await params;

    let heroImageSection: any;
    let apiSection: any;
    let backGroundImageUrl: any;
    let relatedBlock: any;
    let accreditedPartners: any;
    let sponsorship: any;
    let relatedCourses: any = [];

    let seats = 1;

    let res = await getCourseDetailPage()

    if (res) {
        heroImageSection = res?.data[0]?.attributes?.blocks.filter((res: { __component: string; }) => res.__component === 'blocks.hero-image-with-button')[0];
        apiSection = res?.data[0]?.attributes?.blocks.filter((res: { __component: string; }) => res.__component === 'blocks.api-section')[0];
        backGroundImageUrl = imageUrl + heroImageSection?.ackgroundImage?.data?.attributes?.formats?.large?.url
        relatedBlock = res?.data[0]?.attributes?.blocks.filter((res: { __component: string; }) => res.__component === 'blocks.related-block')[0];
    }

    let coursesDetail = await getcoursesBySlug(slug);

    let courseId = coursesDetail?.data[0]?.id;
    let courseData = coursesDetail?.data[0]?.attributes;
    let instructor = courseData.instructors.data[0]?.attributes;
    let courseTabs = courseData?.tabs
    let creditAndInfo = courseTabs?.find((item: any) => item?.index === "Other") || {};
    let keywords = courseData?.keywords === null ? '' : courseData?.keywords?.split(',') || '';
    let courseCategory = coursesDetail?.data[0]?.attributes?.category?.data?.attributes?.title;

    res = await getPageContent('course-detail');

    if (res) {
        accreditedPartners = res?.data[0]?.attributes?.blocks.filter((res: { __component: string; }) => res.__component === 'blocks.accredited-partners')[0];
        sponsorship = res?.data[0]?.attributes?.blocks.filter((res: { __component: string; }) => res.__component === 'blocks.sponsorship')[0];
    }

    res = await getAllCourses();

    relatedCourses = []
    if (res) {
        const coursesArray = res?.data?.courses?.data;

        if (keywords) {
            keywords?.forEach((element: any) => {
                const filteredResult = coursesArray?.filter((item: any) => {

                    return (item?.attributes?.title?.toString().toLowerCase().includes(element.toString().toLowerCase()))
                        && (item.attributes?.category?.data?.attributes?.title == courseCategory)
                })

                filteredResult?.forEach((element: any) => {
                    const facultyname = getInstructorName(element?.attributes?.instructors)
                    relatedCourses.push({
                        attributes: {
                            'title': element?.attributes?.title,
                            'startDate': element?.attributes?.startDate,
                            'endDate': element?.attributes?.endDate,
                            'image': element?.attributes?.image?.data?.attributes?.url,
                            'shortDesc': element?.attributes?.shortDesc,
                            'credit': element?.attributes?.credit,
                            'slug': element?.attributes?.slug,
                            'price': element?.attributes?.price,
                            'instructors': element?.attributes?.instructors,
                            'category': element?.attributes.category
                        }
                    })
                })

                if (filteredResult) {

                    relatedCourses = relatedCourses.filter((item: any, index: number) =>
                        relatedCourses.indexOf(item) === index)
                    relatedCourses = relatedCourses.filter((item: any) => item.id != courseId)
                }
            });

        } else {
            relatedCourses = [];
        }


        function getInstructorName(instructors: any) {
            const name: string[] = []
            instructors.data.forEach((element: any, index: number) => {

                name.push(element?.attributes?.firstName + ' ' + element?.attributes.lastName)
            })

            return name.join(',');
        }

        return (
            <>
                <section className="w-[90%] mx-auto">
                    <AddToCardComponent courseData={{...courseData, id: courseId}} instructor={instructor} />
                </section >

                <section className="mt-20 ">
                    <div
                        className="w-[90%] mx-auto self-stretch border-b border-[#dee1e9] flex flex-col justify-start items-start gap-2">
                        <Tabs defaultValue="Course Outline" className="w-full bg-transparent border-b border-[#dee1e9]">
                            <TabsList variant="line" className='w-full bg-transparent  border-b border-[#dee1e9]'>
                                <TabsTrigger value="Course Outline" className="text-2xl font-bold cursor-pointer hover:text-blue-500 hover:after:bg-blue-500 hover:after:opacity-100 font-['Inter'] leading-loose  data-[state=active]:text-blue-500 data-[state=active]:after:bg-blue-500">Course Outline</TabsTrigger>
                                <TabsTrigger value="CPE Info" className="text-2xl font-bold cursor-pointer hover:text-blue-500 hover:after:bg-blue-500 hover:after:opacity-100 font-['Inter'] leading-loose  data-[state=active]:text-blue-500 data-[state=active]:after:bg-blue-500">CPE Info</TabsTrigger>
                                <TabsTrigger value="FAQ" className="text-2xl font-bold cursor-pointer hover:text-blue-500 hover:after:bg-blue-500 hover:after:opacity-100 font-['Inter'] leading-loose  data-[state=active]:text-blue-500 data-[state=active]:after:bg-blue-500">FAQ</TabsTrigger>
                                <TabsTrigger value="Review" className="text-2xl font-bold cursor-pointer hover:text-blue-500 hover:after:bg-blue-500 hover:after:opacity-100 font-['Inter'] leading-loose  data-[state=active]:text-blue-500 data-[state=active]:after:bg-blue-500">Review</TabsTrigger>
                                <TabsTrigger value="Faculty" className="text-2xl font-bold cursor-pointer hover:text-blue-500 hover:after:bg-blue-500 hover:after:opacity-100 font-['Inter'] leading-loose  data-[state=active]:text-blue-500 data-[state=active]:after:bg-blue-500">Faculty</TabsTrigger>
                            </TabsList>
                            <TabsContent value="Course Outline">
                                <div className="">
                                    <div className="mt-6 flex-col justify-start items-center gap-16 inline-flex overflow-hidden">
                                        <div className="self-stretch h-11 px-8 flex-col justify-start items-start gap-8 flex">
                                            <div className="self-stretch h-11 flex-col justify-start items-start gap-8 flex">
                                                <div className="self-stretch h-11 flex-col justify-start items-start gap-5 flex">
                                                    <div className="self-stretch h-11 flex-col justify-start items-start gap-3 flex">
                                                        <div className="self-stretch text-[#101828] text-4xl font-semibold font-['Inter'] leading-[44px]">About this
                                                            course</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="self-stretch px-8 justify-start items-start gap-8 inline-flex">
                                            <div className="w-full flex-col justify-start items-start gap-8 inline-flex">
                                                <div className="self-stretch flex-col justify-start items-start gap-5 flex">
                                                    <div className="self-stretch flex-col justify-start items-center gap-2 flex">
                                                        <div className="self-stretch text-[#475467] font-normal font-['Inter'] leading-[30px]"
                                                            dangerouslySetInnerHTML={{ __html: courseData?.shortDesc }} ></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="px-8 mt-8 rounded-xl justify-start gap-8 inline-flex border-b border-[#e4e7ec]">

                                        {
                                            coursesDetail?.data[0]?.attributes?.outline && coursesDetail?.data[0]?.attributes?.outline.length > 0 && coursesDetail?.data[0]?.attributes?.outline.map((outline: any, index: number) => (
                                                <div className="w-[592px] rounded-2xl flex-col justify-start items-start inline-flex overflow-hidden" key={index}>
                                                    <div
                                                        className="self-stretch h-[88px] px-8 pt-8 pb-6 border-b border-[#e4e7ec] flex-col justify-start items-start gap-8 flex">
                                                        <div className="self-stretch justify-start items-start gap-8 inline-flex">
                                                            <div className="grow shrink basis-0 flex-col justify-start items-start gap-1 inline-flex">
                                                                <div className="justify-start items-center gap-2 inline-flex">
                                                                    <div className="text-[#101828] text-2xl font-semibold font-['Inter']  leading-loose">{outline.title}</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="w-[592px] px-8 pt-8 pb-10  flex-col justify-start items-start gap-6 flex">
                                                        <div className="self-stretch  justify-start items-start gap-8">
                                                            {
                                                                outline.list.length > 0 && outline.list.map((item: any, index: number) => (
                                                                    <div className="grow shrink basis-0 h-12 justify-start items-start gap-3 flex mb-4" key={index}>
                                                                        <div className="w-6 h-6 relative bg-[#dbf9e6] rounded-full  overflow-hidden">
                                                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                <g id="Check icon">
                                                                                    <path
                                                                                        d="M0 12C0 5.37258 5.37258 0 12 0C18.6274 0 24 5.37258 24 12C24 18.6274 18.6274 24 12 24C5.37258 24 0 18.6274 0 12Z"
                                                                                        fill="#DCFAE6" />
                                                                                    <path id="Icon" fillRule="evenodd" clipRule="evenodd"
                                                                                        d="M17.096 7.39016L9.93602 14.3002L8.03602 12.2702C7.68602 11.9402 7.13602 11.9202 6.73602 12.2002C6.34602 12.4902 6.23602 13.0002 6.47602 13.4102L8.72602 17.0702C8.94602 17.4102 9.32601 17.6202 9.75601 17.6202C10.166 17.6202 10.556 17.4102 10.776 17.0702C11.136 16.6002 18.006 8.41016 18.006 8.41016C18.906 7.49016 17.816 6.68016 17.096 7.38016V7.39016Z"
                                                                                        fill="#079455" />
                                                                                </g>
                                                                            </svg>
                                                                        </div>
                                                                        <div className="grow shrink basis-0 flex-col justify-start items-start inline-flex">
                                                                            <div className="self-stretch text-[#475467] text-base font-normal font-['Inter'] leading-normal">
                                                                                {item.value}</div>
                                                                        </div>
                                                                    </div>
                                                                ))
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div >
                            </TabsContent>
                            <TabsContent value="CPE Info">
                                <div className="">
                                    <div
                                        className="w-full py-8 bg-Colors-Background-bg-primary inline-flex flex-col justify-start items-center gap-16 overflow-hidden text-[#475467]">
                                        <div className="w-full  px-8 inline-flex justify-start items-start gap-16 flex-wrap content-start">
                                            <div className="flex-1 inline-flex flex-col justify-start items-start gap-8">
                                                <div className="w-full flex flex-col justify-start items-start gap-5" dangerouslySetInnerHTML={{ __html: creditAndInfo?.content }} >
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div >
                                <section>
                                    <div
                                        className="h-auto w-full py-12  bg-white flex-col justify-start items-center gap-[38px] inline-flex overflow-hidden">

                                        {
                                            accreditedPartners && <div className="w-full py-12  bg-white flex-col justify-start items-center gap-[38px] inline-flex overflow-hidden">
                                                <div className="self-stretch h-11 px-8 flex-col justify-start items-start gap-8 flex mb-8">
                                                    <div className="self-stretch h-11 flex-col justify-start items-start gap-8 flex">
                                                        <div className="self-stretch h-11 flex-col justify-start items-start gap-5 flex">
                                                            <div className="container mx-auto">
                                                                <div className="self-stretch h-11 flex-col justify-start items-start gap-3 flex">
                                                                    <div className="self-stretch text-[#101828] text-4xl font-semibold font-['Inter'] leading-[44px]">
                                                                        {accreditedPartners?.title}</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="w-full"
                                                    style={{
                                                        backgroundImage: `url('${imageUrl + accreditedPartners?.bg_image?.data?.attributes?.url}')`,
                                                        backgroundSize: "cover"
                                                    }}>
                                                    <div className="h-80 w-full px-1 flex-col justify-start items-center gap-16 flex">
                                                        <div className="self-stretch h-80 p-16 justify-center items-start gap-8 inline-flex">
                                                            {accreditedPartners?.list && accreditedPartners?.list.map((l: any, index: number) => (
                                                                <div
                                                                    key={index}
                                                                    className="w-[180px] h-[142px] px-6 py-8 bg-white/30 rounded-2xl border border-white/30 backdrop-blur-xl flex-col justify-start items-center gap-5 inline-flex">
                                                                    <img className="self-stretch grow shrink basis-0 w-[100%] h-[100%] object-scale-down"
                                                                        src={imageUrl + l?.image?.data?.attributes?.url} />
                                                                </div>
                                                            ))
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        }

                                        <div className="w-[90%] mx-auto">
                                            <div className="self-stretch px-8 justify-between items-start gap-8 inline-flex">
                                                <div className="w-[771px] py-5 flex-col justify-between items-start gap-8 inline-flex">
                                                    <div className="self-stretch text-[#101828] text-lg font-semibold font-['Inter'] leading-7">
                                                        {sponsorship.title}</div>
                                                    <div className="self-stretch h-20 px-1 flex-col justify-start items-start gap-8 flex">
                                                        <div className="w-[794px] justify-start items-start inline-flex">

                                                            {
                                                                sponsorship.list.length > 0 && sponsorship.list.map((list: any, index: number) => (
                                                                    <div className="grow shrink basis-0 px-4 pt-6 flex-col justify-start items-center gap-5 inline-flex" key={index}>
                                                                        <div className="self-stretch justify-start items-start gap-3 inline-flex">
                                                                            <div className="w-7 h-7 rounded-full justify-center items-center flex overflow-hidden">
                                                                                <div className="w-7 h-7 relative flex-col justify-start items-start flex overflow-hidden">
                                                                                    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                        <g id="check-circle">
                                                                                            <path id="Icon"
                                                                                                d="M8.75065 14.0002L12.2507 17.5002L19.2507 10.5002M25.6673 14.0002C25.6673 20.4435 20.444 25.6668 14.0007 25.6668C7.55733 25.6668 2.33398 20.4435 2.33398 14.0002C2.33398 7.55684 7.55733 2.3335 14.0007 2.3335C20.444 2.3335 25.6673 7.55684 25.6673 14.0002Z"
                                                                                                stroke="#7F56D9" strokeWidth="2.33333" strokeLinecap="round" strokeLinejoin="round" />
                                                                                        </g>
                                                                                    </svg>
                                                                                </div>
                                                                            </div>
                                                                            <div className="grow shrink basis-0 flex-col justify-start items-start inline-flex">
                                                                                <div className="self-stretch text-[#475467] text-lg font-normal font-['Inter'] leading-7">
                                                                                    {list.value}</div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                ))
                                                            }

                                                        </div>
                                                    </div>
                                                    <div className="self-stretch h-[200px] py-4 flex-col justify-start items-start gap-5 flex">
                                                        <div className="self-stretch h-[168px] flex-col justify-start items-center gap-2 flex">
                                                            <div className="self-stretch text-[#475467] text-lg font-normal font-['Inter'] leading-7">
                                                                {sponsorship.description}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                                {sponsorship.features.length > 0 &&
                                                    <div className="w-[446px] self-stretch px-8 flex-col justify-start items-start gap-8 inline-flex">
                                                        <div className="self-stretch justify-center items-start gap-8 inline-flex">
                                                            <div
                                                                className="grow shrink basis-0 bg-white rounded-2xl  shadow-[0px_12px_16px_-4px_rgba(16,24,40,0.08)] border border-[#e4e7ec] flex-col justify-start items-start inline-flex">
                                                                <div className="self-stretch h-[284px] px-8 pt-8 pb-10 flex-col justify-start items-start gap-6 flex">
                                                                    <div className="self-stretch h-[212px] flex-col justify-start items-start gap-4 flex">

                                                                        {
                                                                            sponsorship.features.map((list: any, index: number) => (
                                                                                <div className="self-stretch justify-start items-start gap-3 inline-flex" key={index}>
                                                                                    <div className="w-6 h-6 relative bg-[#dbf9e6] rounded-full  overflow-hidden">
                                                                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                            <g id="Check icon">
                                                                                                <path
                                                                                                    d="M0 12C0 5.37258 5.37258 0 12 0C18.6274 0 24 5.37258 24 12C24 18.6274 18.6274 24 12 24C5.37258 24 0 18.6274 0 12Z"
                                                                                                    fill="#DCFAE6" />
                                                                                                <path id="Icon" fillRule="evenodd" clipRule="evenodd"
                                                                                                    d="M17.096 7.39016L9.93602 14.3002L8.03602 12.2702C7.68602 11.9402 7.13602 11.9202 6.73602 12.2002C6.34602 12.4902 6.23602 13.0002 6.47602 13.4102L8.72602 17.0702C8.94602 17.4102 9.32601 17.6202 9.75601 17.6202C10.166 17.6202 10.556 17.4102 10.776 17.0702C11.136 16.6002 18.006 8.41016 18.006 8.41016C18.906 7.49016 17.816 6.68016 17.096 7.38016V7.39016Z"
                                                                                                    fill="#079455" />
                                                                                            </g>
                                                                                        </svg>

                                                                                    </div>
                                                                                    <div className="grow shrink basis-0 flex-col justify-start items-start inline-flex">
                                                                                        <div className="self-stretch text-[#344054] text-lg font-semibold font-['Inter'] leading-7">2 hours
                                                                                            {list.value}
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            ))
                                                                        }

                                                                    </div>
                                                                </div>
                                                                <div className="self-stretch h-20 px-8 pb-8"></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            </TabsContent>
                            <TabsContent value="FAQ">
                                <div className="">
                                    <div
                                        className="w-full py-24 bg-Colors-Background-bg-primary inline-flex flex-col justify-start items-center gap-16 overflow-hidden text-[#475467]">
                                        <div className="w-full  px-8 inline-flex justify-start items-start gap-16 flex-wrap content-start">
                                            <div className="flex-1 inline-flex flex-col justify-start items-start gap-8">
                                                <div className="w-full flex flex-col justify-start items-start gap-5">
                                                    <div className="self-stretch flex flex-col justify-start items-start gap-3">
                                                        <div
                                                            className="self-stretch justify-start text-Colors-Text-text-primary-(900) text-4xl font-semibold font-['Inter'] leading-10">
                                                            {coursesDetail?.data[0]?.attributes?.faqs?.title}
                                                        </div>
                                                    </div>
                                                    {
                                                        coursesDetail?.data[0]?.attributes?.faqs?.description && <div className="self-stretch justify-start"><span
                                                            className="text-Colors-Text-text-tertiary-(600) text-lg font-normal font-['Inter'] leading-7"
                                                            dangerouslySetInnerHTML={{ __html: coursesDetail?.data[0]?.attributes?.faqs?.description }}></span></div>
                                                    }

                                                </div>
                                                <div className="self-stretch min-w-80 flex flex-col justify-start items-center">
                                                    <div className="self-stretch inline-flex justify-start items-start gap-6">

                                                        <Accordion
                                                            type="single"
                                                            collapsible
                                                            defaultValue="shipping"
                                                            className="max-w-lg"
                                                        >
                                                            {
                                                                coursesDetail?.data[0]?.attributes?.faqs?.list.length > 0 && coursesDetail?.data[0]?.attributes?.faqs?.list.map((faq: any, index: number) => (
                                                                    <AccordionItem value={faq?.question} key={index}>
                                                                        <AccordionTrigger>{faq?.question}</AccordionTrigger>
                                                                        <AccordionContent>
                                                                            {faq?.answer}
                                                                        </AccordionContent>
                                                                    </AccordionItem>
                                                                ))}

                                                        </Accordion>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div >
                                </div>
                            </TabsContent>
                            <TabsContent value="Review">
                                <div className="">
                                    <div className="self-stretch py-24 inline-flex flex-col justify-start items-center gap-16 overflow-hidden">
                                        <div className="py-4 bg-Colors-Background-bg-primary flex flex-col justify-start items-center gap-16 overflow-hidden">
                                            <div className="w-full max-w-[1280px] px-8 flex flex-col justify-start items-start gap-8">
                                                <div className="self-stretch flex flex-col justify-start items-start gap-8">
                                                    <div className="w-full max-w-[768px] flex flex-col justify-start items-start gap-5">
                                                        <div className="self-stretch flex flex-col justify-start items-start gap-3">
                                                            <div
                                                                className="self-stretch justify-start text-Colors-Text-text-primary-(900) text-4xl font-semibold font-['Inter'] leading-10">
                                                                {coursesDetail.data[0]?.attributes.reviews?.title}
                                                            </div>
                                                        </div>
                                                        <div
                                                            className="self-stretch justify-start text-Colors-Text-text-tertiary-(600) text-xl font-normal font-['Inter'] leading-loose">
                                                            {coursesDetail.data[0]?.attributes.reviews?.sub_title}</div>
                                                    </div>
                                                </div>
                                            </div>

                                            {
                                                coursesDetail.data[0]?.attributes.reviews?.reviews.length > 0 && coursesDetail.data[0]?.attributes.reviews?.reviews.map((review: any, index: number) => (
                                                    <div className="w-full max-w-[1280px] px-8 border-b border-teal-500 flex flex-col justify-start items-start gap-8" key={index}>
                                                        <div className="self-stretch inline-flex justify-start items-start gap-24">
                                                            <div className="flex-1 pl-16 flex justify-end items-start">
                                                                <div className="w-[1216px] inline-flex flex-col justify-start items-start gap-4">
                                                                    <div className="self-stretch flex flex-col justify-start items-start gap-6">
                                                                        <div className="self-stretch inline-flex justify-start items-start gap-3">
                                                                            <div className="flex justify-start items-center gap-1">
                                                                                <img src="/assets/images/review_icon.png" alt="" className="h-8 w-8" />
                                                                            </div>
                                                                            <div
                                                                                className="w-[768px] self-stretch justify-start text-Colors-Text-text-tertiary-(600) text-base font-normal font-['Inter'] leading-normal">
                                                                                {moment(review.date).format('MMMM D, YYYY')}
                                                                            </div>
                                                                        </div>
                                                                        <div
                                                                            className="self-stretch justify-start text-Colors-Text-text-tertiary-(600) text-base font-normal font-['Inter'] leading-normal"
                                                                            dangerouslySetInnerHTML={{ __html: review.message }}></div>
                                                                    </div>
                                                                    <div className="self-stretch flex flex-col justify-start items-start gap-1">
                                                                        <div className="self-stretch justify-start">
                                                                            <span className="text-Colors-Text-text-primary-(900) text-lg font-semibold font-['Inter'] leading-7">
                                                                                {review.by}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>
                            <TabsContent value="Faculty">
                                <div className="">
                                    <div className="h-[749px] py-12 justify-end items-center gap-16 inline-flex">
                                        <div className="h-[642px] px-8 justify-start items-start flex">
                                            <div className="grow shrink basis-0 pr-8 flex-col justify-start items-start gap-10 inline-flex">
                                                <div className="self-stretch justify-start items-start gap-3 inline-flex">
                                                    <div className="grow shrink basis-0 flex-col justify-start items-start gap-1 inline-flex">
                                                        <div className="self-stretch text-[#101828] text-3xl font-semibold font-['Inter'] leading-[38px]"> Faculty
                                                        </div>
                                                        <div className="self-stretch justify-start items-center gap-5 inline-flex">

                                                        </div>
                                                    </div>
                                                </div>
                                                <div
                                                    className="w-[560px] h-[536px] pt-[335.50px] pb-[24.50px] justify-center items-center bg-no-repeat bg-cover inline-flex"
                                                    style={{ backgroundImage: `url('${imageUrl + instructor?.image?.data?.attributes?.url}')` }}>
                                                    <div
                                                        className="grow shrink basis-0 h-44 px-8 pt-24 pb-8 bg-gradient-to-b flex-col justify-center items-center inline-flex">
                                                        <div
                                                            className="self-stretch h-[158px] px-5 py-6 bg-white/30 border border-white/30 backdrop-blur-xl flex-col justify-start items-start gap-3 flex">
                                                            <div className="self-stretch justify-start items-start gap-4 inline-flex">
                                                                <div className="grow shrink basis-0 text-white text-4xl font-semibold font-['Inter'] leading-[44px]">
                                                                    {instructor?.firstName + " " + instructor?.lastName}
                                                                </div>
                                                            </div>
                                                            <div className="self-stretch h-[54px] flex-col justify-start items-start gap-0.5 flex">
                                                                <div
                                                                    className="self-stretch justify-start text-Colors-Text-text-tertiary-(600) text-xl font-normal font-['Inter'] leading-loose">
                                                                    {instructor?.shortDesc}
                                                                </div>
                                                                <div className="self-stretch"></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="grow shrink basis-0 h-[540px] px-8 justify-start items-start flex">
                                            <div className="grow shrink basis-0 pr-8 flex-col justify-start items-start gap-10 inline-flex">
                                                <div className="self-stretch text-[#475467] font-normal font-['Inter'] leading-[30px]"
                                                    dangerouslySetInnerHTML={{ __html: instructor?.bioData }}></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>

                </section>

                <section className="border-b border-[#45a7c5] mt-8">
                    <div className="w-[90%] mx-auto">
                        <div className="">

                            <div className="grid grid-cols-6 gap-30">
                                <div className='col-span-3'>
                                    {
                                        coursesDetail?.data[0]?.attributes?.includes && <div className=" mt-8">
                                            <div className="text-[#101828] text-lg font-semibold font-['Inter'] leading-7 my-8">
                                                {coursesDetail?.data[0]?.attributes?.includes.title}
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                {
                                                    coursesDetail?.data[0]?.attributes?.includes.list.length > 0 && coursesDetail?.data[0]?.attributes?.includes.list.map((list: any, index: number) => (
                                                        <div key={index}>
                                                            <div className="justify-start items-center gap-2 flex">
                                                                <div className="w-6 h-6 relative  overflow-hidden">
                                                                    <img src={imageUrl + list?.image?.data?.attributes?.url} alt="" />
                                                                </div>
                                                                <div className="text-[#344054] text-lg font-semibold font-['Inter'] leading-7">
                                                                    {list.title}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))
                                                }
                                            </div>


                                        </div>
                                    }

                                    <div>
                                        {
                                            coursesDetail?.data[0]?.attributes?.attend && <>
                                                <div className="text-[#101828] text-lg font-semibold font-['Inter'] leading-7 my-8">
                                                    {coursesDetail?.data[0]?.attributes?.attend.title}
                                                </div>
                                                {
                                                    coursesDetail?.data[0]?.attributes?.attend.list.length > 0 && <div className="grid grid-cols-3 gap-4">
                                                        {
                                                            coursesDetail?.data[0]?.attributes?.attend.list.map((list: any, index: number) => (
                                                                <div className="text-center" key={index}>
                                                                    <div className="px-3 py-1 bg-gray-50 rounded-full border border-[#e4e7ec] justify-center items-center flex">
                                                                        <div className="text-center text-[#344054] text-sm font-medium font-['Inter'] leading-tight">
                                                                            {list.value}</div>
                                                                    </div>
                                                                </div>
                                                            ))
                                                        }

                                                    </div>
                                                }
                                            </>
                                        }
                                    </div>
                                </div>
                                <div className='col-span-1'></div>
                                <div className="py-8 col-span-2">
                                    <div className="w-96 bg-white rounded-xl shadow-lg flex flex-col overflow-hidden">


                                        <div className="px-6 pt-6">
                                            <div className="h-32 overflow-hidden rounded-md">
                                                <video
                                                    src="/assets/images/package-image.mp4"

                                                    className="w-full h-full object-fill border border-blue-600"
                                                ></video>
                                            </div>
                                        </div>

                                        <div className="px-6 pt-6 text-center flex flex-col gap-4">

                                            <h3 className="text-lg font-semibold text-gray-900">
                                                Explore Our Unlimited CPE Package
                                            </h3>

                                            <p className="text-gray-600 text-lg leading-7">
                                                This course is part of the CPE Warehouse Pass. Subscribe today for{" "}
                                                <span className="line-through text-gray-400">$1200</span>{" "}
                                                <span className="text-purple-600 text-2xl font-bold">$999</span>
                                            </p>

                                        </div>

                                        <div className="px-6 py-8">
                                            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-full transition">
                                                Explore now
                                            </button>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="bg-[#f9fafb] py-24">
                    <div className="w-[90%] mx-auto">
                        <div className="self-stretch h-[94px] mb-12 flex-col justify-start items-start gap-8 flex">
                            <div className="self-stretch h-[94px] flex-col justify-start items-center gap-8 flex">
                                <div className="self-stretch h-[94px] flex-col justify-start items-center gap-5 flex">
                                    <div className="self-stretch h-11 flex-col justify-start items-start gap-3 flex">
                                        <div className="self-stretch text-left text-[#101828] text-4xl font-semibold font-['Inter'] leading-[44px]">
                                            {relatedBlock.title}
                                        </div>
                                    </div>
                                    <div className="self-stretch text-left text-[#475467] text-xl font-normal font-['Inter'] leading-[30px]">
                                        {relatedBlock.sub_title}</div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-4 gap-4 border-b border-[#e4e7ec] pb-14">
                            {
                                relatedCourses.length > 0 && relatedCourses.map((course: any, index: number) => (
                                    <CourseCard course={course} key={index} />
                                ))
                            }
                        </div>
                    </div>
                </section >
            </>
        )
    }
}

export default CourseLandingPage