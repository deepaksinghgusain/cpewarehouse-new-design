import React from 'react'
import moment from "moment-timezone";
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

    const allCourses = await getAllCourses();

    relatedCourses = []
    if (allCourses) {
        const coursesArray = allCourses;

        if (keywords) {
            keywords?.forEach((element: any) => {
                const filteredResult = coursesArray?.filter((item: any) => {
                    return (item?.attributes?.title?.toString().toLowerCase().includes(element.toString().toLowerCase()))
                        && (item.attributes?.category?.data?.attributes?.title == courseCategory)
                })


                filteredResult?.forEach((element: any) => {
                    relatedCourses.push({
                        id: element?.id,
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

        return (
            <>
                <section className="mx-auto w-[calc(100%-1rem)] sm:w-[90%]">
                    <AddToCardComponent courseData={{...courseData, id: courseId}} instructor={instructor} />
                </section >

                <section className="mt-10 sm:mt-20">
                    <div
                        className="mx-auto flex w-[calc(100%-1rem)] flex-col items-start gap-2 self-stretch border-b border-[#dee1e9] sm:w-[90%]">
                        <Tabs defaultValue="Course Outline" className="w-full bg-transparent border-b border-[#dee1e9]">
                            <TabsList variant="line" className='w-full justify-start overflow-x-auto bg-transparent border-b border-[#dee1e9] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'>
                                <TabsTrigger value="Course Outline" className="shrink-0 px-3 text-sm font-bold leading-loose sm:px-4 sm:text-2xl">Course Outline</TabsTrigger>
                                <TabsTrigger value="CPE Info" className="shrink-0 px-3 text-sm font-bold leading-loose sm:px-4 sm:text-2xl">CPE Info</TabsTrigger>
                                <TabsTrigger value="FAQ" className="shrink-0 px-3 text-sm font-bold leading-loose sm:px-4 sm:text-2xl">FAQ</TabsTrigger>
                                <TabsTrigger value="Review" className="shrink-0 px-3 text-sm font-bold leading-loose sm:px-4 sm:text-2xl">Review</TabsTrigger>
                                <TabsTrigger value="Faculty" className="shrink-0 px-3 text-sm font-bold leading-loose sm:px-4 sm:text-2xl">Faculty</TabsTrigger>
                            </TabsList>
                            <TabsContent value="Course Outline">
                                <div className="">
                                    <div className="mt-6 flex w-full flex-col items-center gap-10 overflow-hidden sm:gap-16">
                                        <div className="w-full px-0 sm:px-8">
                                            <div className="self-stretch h-11 flex-col justify-start items-start gap-8 flex">
                                                <div className="self-stretch h-11 flex-col justify-start items-start gap-5 flex">
                                                    <div className="self-stretch h-11 flex-col justify-start items-start gap-3 flex">
                                                        <div className="self-stretch text-[#101828] text-4xl font-semibold font-['Inter'] leading-[44px]">About this
                                                            course</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="w-full px-0 sm:px-8">
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
                                    <div className="mt-8 grid w-full grid-cols-1 gap-6 rounded-xl border-b border-[#e4e7ec] px-0 sm:px-8 lg:grid-cols-2">

                                        {
                                            coursesDetail?.data[0]?.attributes?.outline && coursesDetail?.data[0]?.attributes?.outline.length > 0 && coursesDetail?.data[0]?.attributes?.outline.map((outline: any, index: number) => (
                                                <div className="w-full min-w-0 overflow-hidden rounded-2xl" key={index}>
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
                                                    <div className="w-full px-4 pb-8 pt-6 sm:px-8 sm:pt-8">
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
                                        className="w-full overflow-hidden bg-Colors-Background-bg-primary py-8 text-[#475467] sm:py-12">
                                        <div className="w-full px-0 sm:px-8">
                                            <div className="flex-1 inline-flex flex-col justify-start items-start gap-8">
                                                <div className="w-full flex flex-col justify-start items-start gap-5" dangerouslySetInnerHTML={{ __html: creditAndInfo?.content ?? '' }} >
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div >
                                <section>
                                    <div
                                        className="flex h-auto w-full flex-col items-center gap-8 overflow-hidden bg-white py-8 sm:gap-[38px] sm:py-12">

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
                                                    <div className="w-full px-4 py-8 sm:px-8 sm:py-12">
                                                        <div className="grid w-full grid-cols-2 items-center justify-items-center gap-4 sm:grid-cols-3 sm:gap-8 lg:flex lg:justify-center">
                                                            {accreditedPartners?.list && accreditedPartners?.list.map((l: any, index: number) => (
                                                                <div
                                                                    key={index}
                                                                    className="flex h-28 w-full max-w-[180px] items-center justify-center rounded-2xl border border-white/30 bg-white/30 p-4 backdrop-blur-xl sm:h-[142px] sm:p-6">
                                                                    <img className="h-full w-full object-contain"
                                                                        src={imageUrl + l?.image?.data?.attributes?.url} />
                                                                </div>
                                                            ))
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        }

                                        <div className="mx-auto w-[calc(100%-2rem)] max-w-7xl sm:w-[90%]">
                                            <div className="flex flex-col items-start gap-8 lg:flex-row">
                                                <div className="w-full py-5 lg:w-2/3">
                                                    <div className="self-stretch text-[#101828] text-lg font-semibold font-['Inter'] leading-7">
                                                        {sponsorship.title}</div>
                                                    <div className="w-full px-1">
                                                        <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">

                                                            {
                                                                sponsorship.list.length > 0 && sponsorship.list.map((list: any, index: number) => (
                                                                    <div className="min-w-0 px-1 pt-4 sm:px-4 sm:pt-6" key={index}>
                                                                        <div className="flex items-start gap-3">
                                                                            <div className="h-7 w-7 shrink-0 rounded-full">
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
                                                    <div className="w-full py-6">
                                                        <div className="w-full">
                                                            <div className="w-full text-base font-normal leading-7 text-[#475467] sm:text-lg">
                                                                {sponsorship.description}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                                {sponsorship.features.length > 0 &&
                                                    <div className="w-full px-0 lg:w-1/3 lg:px-8">
                                                        <div className="self-stretch justify-center items-start gap-8 inline-flex">
                                                            <div className="flex w-full flex-col items-start rounded-2xl border border-[#e4e7ec] bg-white shadow-[0px_12px_16px_-4px_rgba(16,24,40,0.08)]">
                                                                        <div className="w-full px-5 py-6 sm:px-8 sm:py-8">
                                                                            <div className="flex w-full flex-col items-start gap-4">

                                                                        {
                                                                            sponsorship.features.map((list: any, index: number) => (
                                                                                <div className="flex w-full items-start gap-3" key={index}>
                                                                                    <div className="relative h-6 w-6 shrink-0 rounded-full bg-[#dbf9e6]">
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
                                                                                    <div className="min-w-0 flex-1">
                                                                                        <div className="text-base font-semibold leading-7 text-[#344054] sm:text-lg">2 hours
                                                                                            {list.value}
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            ))
                                                                        }

                                                                    </div>
                                                                </div>
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
                                        className="w-full overflow-hidden bg-Colors-Background-bg-primary px-0 py-12 text-[#475467] sm:px-8 sm:py-24">
                                        <div className="w-full">
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
                                                            className="w-full max-w-lg"
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
                                            <div className="w-full max-w-[1280px] px-0 sm:px-8">
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
                                                    <div className="w-full max-w-[1280px] border-b border-teal-500 px-0 sm:px-8" key={index}>
                                                        <div className="w-full">
                                                            <div className="w-full sm:pl-16">
                                                                <div className="flex w-full flex-col items-start gap-4">
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
                                    <div className="flex w-full flex-col items-center gap-10 py-12 lg:flex-row lg:items-start lg:justify-end lg:gap-16">
                                        <div className="w-full px-0 sm:px-8 lg:w-1/2">
                                            <div className="flex flex-col items-start gap-10 lg:pr-8">
                                                <div
                                                    className="flex aspect-[560/536] w-full max-w-[560px] items-end justify-center bg-cover bg-no-repeat"
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
                                        <div className="w-full px-0 sm:px-8 lg:w-1/2">
                                            <div className="flex flex-col items-start gap-10 lg:pr-8">
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

                <section className="mt-8 border-b border-[#45a7c5]">
                    <div className="mx-auto w-[calc(100%-2rem)] max-w-7xl sm:w-[90%]">
                        <div className="">

                            <div className="grid grid-cols-1 gap-8 py-4 lg:grid-cols-[minmax(0,1fr)_minmax(280px,384px)] lg:gap-12">
                                <div className="min-w-0">
                                    {
                                        coursesDetail?.data[0]?.attributes?.includes && <div className=" mt-8">
                                            <div className="text-[#101828] text-lg font-semibold font-['Inter'] leading-7 my-8">
                                                {coursesDetail?.data[0]?.attributes?.includes.title}
                                            </div>
                                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                                                    coursesDetail?.data[0]?.attributes?.attend.list.length > 0 && <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
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
                                <div className="py-4 lg:py-8">
                                    <div className="mx-auto flex w-full max-w-[384px] flex-col overflow-hidden rounded-xl bg-white shadow-lg">


                                        <div className="px-6 pt-6">
                                            <div className="h-32 overflow-hidden rounded-md">
                                                <video
                                                    src="/assets/images/package-image.mp4"

                                                    className="w-full h-full object-fill border border-blue-600"
                                                ></video>
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-4 px-6 pt-6 text-center">

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

                        <div className="w-full grid grid-cols-1 gap-4 border-b border-[#e4e7ec] pb-14 sm:grid-cols-2 lg:grid-cols-4">
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