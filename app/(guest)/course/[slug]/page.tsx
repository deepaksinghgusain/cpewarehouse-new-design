import React from 'react'
import moment from "moment-timezone";
import Link from 'next/link';
import { imageUrl } from '@/lib/constants';
import { getAllCourses, getCourseDetailPage, getcoursesBySlug } from '@/services/course';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import CourseCard from '@/components/courses/CourseCard';
import { getPageContent } from '@/services/common';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const CourseLandingPage = async () => {
    const timezone = moment.tz.guess();
    const timezoneAbbrv = moment().tz(timezone).format('z');
    const firstLetter = timezoneAbbrv.charAt(0);
    const lastLetter = timezoneAbbrv.charAt(timezoneAbbrv.length - 1);
    const twoLettertimezone = firstLetter + lastLetter;

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

    let coursesDetail = await getcoursesBySlug("deconstructing-physician-supervision-for-provider-based-clinics");
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
                    <div className="h-[530px] w-full pb-8 bg-white justify-start items-center gap-16 inline-flex">

                        <div className="grid grid-cols-2 flex-col justify-start items-start gap-12 inline-flex">
                            <div className="flex-col justify-start items-start gap-6 flex">
                                <div className="self-stretch  flex-col justify-start items-start gap-4 flex">
                                    <div className="justify-start items-center gap-3 inline-flex">
                                        <div className="justify-center items-center flex">
                                            <Link href="/course-catalog"
                                                className="text-[#475467] text-sm font-medium font-['Inter'] leading-tight">Course catalogue</Link>
                                        </div>
                                        <div>
                                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M6 12L10 8L6 4" stroke="#D0D5DD" strokeWidth="1.33333" strokeLinecap="round"
                                                    strokeLinejoin="round" />
                                            </svg>

                                        </div>
                                        <div className="justify-center items-center flex">
                                            <div className="text-[#088ab2] text-sm font-semibold font-['Inter'] leading-tight">
                                                {courseData?.category?.data?.attributes?.title === 'Recorded' ? 'Self Study' :
                                                    courseData?.category?.data?.attributes?.title}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="self-stretch text-[#101828] text-3xl font-semibold font-['Inter'] leading-[38px]">
                                        {courseData?.title}
                                    </div>
                                    <div className="pl-1 pr-2.5 py-1 rounded-full justify-start items-center gap-3 inline-flex">
                                        <div className="justify-start text-gray-500 text-base font-semibold font-['Inter'] line-through leading-9">
                                            US {courseData?.price}
                                        </div>
                                        <div className="text-[#0e9384] text-[32px] font-semibold font-['Inter'] leading-[38px]">US
                                            {(courseData?.price - (courseData?.discount ?? 0)) * seats}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="relative self-stretch h-6 flex-col justify-start items-start gap-5 flex">
                                <div className="self-stretch h-6 flex-col justify-start items-start gap-8 flex">
                                    <div className="self-stretch justify-start items-center gap-5 inline-flex">
                                        <div className="justify-start items-center gap-2 flex">
                                            <div className="w-24 h-24 relative  overflow-hidden rounded-[50%]">
                                                <img src={imageUrl + instructor?.image?.data?.attributes?.url} alt="" />
                                            </div>
                                            <div className="text-[#344054] text-base font-semibold font-['Inter'] leading-normal">
                                                {instructor?.firstName + " " + instructor?.lastName}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="self-stretch h-[30px]"></div>
                        </div>
                        <div className="h-[434px] w-1/2 flex-col justify-start items-start gap-4 inline-flex">
                            <div
                                className="h-[412px] w-full rounded-xl  shadow-[0px_20px_24px_-4px_rgba(16,24,40,0.08)] flex-col justify-start items-end flex overflow-hidden">

                                <div className="w-full flex justify-between p-2">
                                    <div className="self-stretch h-12 px-6 pt-8 flex-col justify-start items-start gap-5 flex">
                                        {
                                            courseData?.category?.data?.attributes?.title !== 'Recorded' &&
                                            courseData?.category?.data?.attributes?.title !== 'eBook' && <div className="self-stretch h-7 flex-col justify-start items-start gap-1 flex">
                                                <div className="self-stretch text-[#101828] text-lg font-semibold font-['Inter'] leading-7">
                                                    Available Date(s)
                                                </div>
                                            </div>
                                        }
                                    </div>
                                </div>
                                <div className="w-full flex content-between flex-col">
                                    {
                                        courseData?.category?.data?.attributes?.title !== 'Recorded' &&
                                        courseData?.category?.data?.attributes?.title !== 'eBook' && <div className="self-stretch pt-2 flex-col justify-center items-end flex">
                                            <div className="self-stretch h-[25px] pb-6 flex-col justify-start items-start flex"></div>
                                            <div className="self-stretch px-6 pb-6 justify-start items-center gap-3">
                                                <div className="w-full self-stretch flex-col justify-start items-start gap-5">
                                                    <div className="self-stretch flex-col justify-start items-start gap-4 flex">
                                                        <div className="h-6 flex-col justify-start items-start gap-[11px] flex">
                                                            <div className="justify-start items-center gap-3 inline-flex">
                                                                <div className="justify-center items-center flex">
                                                                    <div
                                                                        className="w-5 h-5 p-[3px] bg-[#155dee] rounded-md  shadow-[0px_0px_0px_2px_rgba(255,255,255,1.00)] justify-center items-center flex overflow-hidden">
                                                                        <div className="w-3.5 h-3.5 relative flex-col justify-start items-start flex overflow-hidden">
                                                                        </div>
                                                                        <input type="checkbox" name="" id=""/>
                                                                    </div>
                                                                </div>
                                                                <div className="justify-start items-center gap-3 flex">
                                                                    <div className="flex-col justify-start items-start inline-flex">
                                                                        <div className="text-[#475467] text-base font-normal font-['Inter'] leading-normal w-full">
                                                                            {moment(courseData?.startDate.replace("Z", "")).format("dddd MMM d YYYY")} |
                                                                            {moment(courseData?.startDate.replace("Z", "")).format("h:mm a")} -
                                                                            {moment(courseData?.endDate).format("h:mm a")} {twoLettertimezone || ''}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="w-[173px]"></div>
                                            </div>
                                        </div>
                                    }

                                    <div
                                        className="self-stretch h-[207px] w-full bg-white rounded-xl pt-2 flex-col justify-start items-center flex overflow-hidden">

                                        {
                                            courseData?.category?.data?.attributes?.title !== 'Recorded' &&
                                            courseData?.category?.data?.attributes?.title !== 'eBook' && <div className="self-stretch h-[69px] px-6 pt-3 flex-col justify-start items-start gap-5 flex">
                                                <div className="self-stretch h-[57px] flex-col justify-start items-start gap-3 flex">
                                                    <div className="self-stretch justify-center items-center gap-6 inline-flex">
                                                        <div className="p-3 bg-white cursor-pointer rounded-lg  shadow-[inset_0px_0px_0px_1px_rgba(16,24,40,0.18)] border border-[#d0d5dd] justify-center items-center gap-2 flex overflow-hidden">
                                                            <div className="w-5 h-5 relative  overflow-hidden">

                                                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <g id="minus">
                                                                        <path id="Icon" d="M4.16602 10H15.8327" stroke="#344054" strokeWidth="1.66667"
                                                                            strokeLinecap="round" strokeLinejoin="round" />
                                                                    </g>
                                                                </svg>

                                                            </div>
                                                        </div>
                                                        <div className="text-center text-[#101828] text-2xl font-bold font-['Inter'] leading-loose">
                                                            <div
                                                                className="text-center justify-start text-Colors-Text-text-primary-(900) text-2xl font-bold font-['Inter'] w-[20px] leading-loose">
                                                                <input type="text" disabled className="form-control" />
                                                            </div>
                                                        </div>
                                                        <div className="p-3 bg-white cursor-pointer rounded-lg shadow-[inset_0px_0px_0px_1px_rgba(16,24,40,0.18)] border border-[#d0d5dd] justify-center items-center gap-2 flex overflow-hidden">
                                                            <div className="w-5 h-5 relative  overflow-hidden">
                                                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <g id="plus">
                                                                        <path id="Icon" d="M9.99935 4.16675V15.8334M4.16602 10.0001H15.8327" stroke="#344054"
                                                                            strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                                                                    </g>
                                                                </svg>

                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        }

                                        <div className="self-stretch h-[76px] pt-3 flex-col justify-start items-start flex">
                                            <div className="self-stretch px-6 pb-3 justify-start items-start gap-3 inline-flex" style={{ width: "100%", margin: "auto" }}>
                                                <div
                                                    className="grow cursor-pointer shrink basis-0 h-[40px]  px-[18px] py-3 bg-[#2970fe] rounded-[28px]  shadow-[inset_0px_0px_0px_1px_rgba(16,24,40,0.18)] border-2 border-white justify-center items-center gap-1.5 flex overflow-hidden">
                                                    <div className="px-0.5 justify-center items-center flex">
                                                        <div className="text-white  font-bold font-['Inter'] leading-7" style={{ fontSize: "18px" }}>
                                                            {courseData?.category?.data?.attributes?.title == 'eBook' ? 'GET ACCESS' : 'Enroll now'}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div
                                            className="w-full px-[22px] py-4 rounded-[10px] justify-center items-center gap-2.5 inline-flex overflow-hidden">
                                            <div className="px-0.5 justify-start items-center flex">
                                                <div><span className="text-[#475467] text-xl font-normal font-['Inter'] leading-[30px] mr-2">For
                                                    Group Enrollments</span><span className="text-[#18212f] text-xl font-['Inter'] leading-[30px]">
                                                    </span>
                                                    <Link href="/contact-us" target="_blank"
                                                        className="text-[#db6803] text-xl font-bold font-['Inter'] leading-[30px]">Contact us</Link>

                                                    <svg className="inline ml-2" width="24" height="24" viewBox="0 0 24 24" fill="none"
                                                        xmlns="http://www.w3.org/2000/svg">
                                                        <g id="phone-call-01">
                                                            <path id="Icon"
                                                                d="M14.0497 6C15.0264 6.19057 15.924 6.66826 16.6277 7.37194C17.3314 8.07561 17.8091 8.97326 17.9997 9.95M14.0497 2C16.0789 2.22544 17.9713 3.13417 19.4159 4.57701C20.8606 6.01984 21.7717 7.91101 21.9997 9.94M10.2266 13.8631C9.02506 12.6615 8.07627 11.3028 7.38028 9.85323C7.32041 9.72854 7.29048 9.66619 7.26748 9.5873C7.18576 9.30695 7.24446 8.96269 7.41447 8.72526C7.46231 8.65845 7.51947 8.60129 7.63378 8.48698C7.98338 8.13737 8.15819 7.96257 8.27247 7.78679C8.70347 7.1239 8.70347 6.26932 8.27247 5.60643C8.15819 5.43065 7.98338 5.25585 7.63378 4.90624L7.43891 4.71137C6.90747 4.17993 6.64174 3.91421 6.35636 3.76987C5.7888 3.4828 5.11854 3.4828 4.55098 3.76987C4.2656 3.91421 3.99987 4.17993 3.46843 4.71137L3.3108 4.86901C2.78117 5.39863 2.51636 5.66344 2.31411 6.02348C2.08969 6.42298 1.92833 7.04347 1.9297 7.5017C1.93092 7.91464 2.01103 8.19687 2.17124 8.76131C3.03221 11.7947 4.65668 14.6571 7.04466 17.045C9.43264 19.433 12.295 21.0575 15.3284 21.9185C15.8928 22.0787 16.1751 22.1588 16.588 22.16C17.0462 22.1614 17.6667 22 18.0662 21.7756C18.4263 21.5733 18.6911 21.3085 19.2207 20.7789L19.3783 20.6213C19.9098 20.0898 20.1755 19.8241 20.3198 19.5387C20.6069 18.9712 20.6069 18.3009 20.3198 17.7333C20.1755 17.448 19.9098 17.1822 19.3783 16.6508L19.1835 16.4559C18.8339 16.1063 18.6591 15.9315 18.4833 15.8172C17.8204 15.3862 16.9658 15.3862 16.3029 15.8172C16.1271 15.9315 15.9523 16.1063 15.6027 16.4559C15.4884 16.5702 15.4313 16.6274 15.3644 16.6752C15.127 16.8453 14.7828 16.904 14.5024 16.8222C14.4235 16.7992 14.3612 16.7693 14.2365 16.7094C12.7869 16.0134 11.4282 15.0646 10.2266 13.8631Z"
                                                                stroke="#6941C6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                        </g>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="w-6 h-6 relative  overflow-hidden"></div>
                                        </div>
                                        <div className="flex h-20 mt-2 justify-center items-center">
                                            <div className="mr-2 cursor-pointer">
                                                <svg fill="#000000" width="24" height="24" version="1.1" id="XMLID_274_"
                                                    xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"
                                                    enableBackground="new 0 0 24 24" xmlSpace="preserve">
                                                    <g id="share">
                                                        <g>
                                                            <path
                                                                d="M20,24H0V4h11v2H2v16h16v-9h2V24z M12.7,12.7l-1.4-1.4L20.6,2H14V0h10v10h-2V3.4L12.7,12.7z" />
                                                        </g>
                                                    </g>
                                                </svg>
                                            </div>
                                            <p>Share with Colleague</p>
                                        </div>
                                    </div>
                                </div>
                            </div >
                        </div >
                    </div >
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
                                            coursesDetail?.data[0]?.attributes?.outline.length > 0 && coursesDetail?.data[0]?.attributes?.outline.map((outline: any, index: number) => (
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
                                                            {coursesDetail?.data[0]?.attributes?.faqs.title}
                                                        </div>
                                                    </div>
                                                    <div className="self-stretch justify-start"><span
                                                        className="text-Colors-Text-text-tertiary-(600) text-lg font-normal font-['Inter'] leading-7"
                                                        dangerouslySetInnerHTML={{ __html: coursesDetail?.data[0]?.attributes?.faqs.description }}></span></div>
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
                                                                coursesDetail?.data[0]?.attributes?.faqs.list.length > 0 && coursesDetail?.data[0]?.attributes?.faqs.list.map((faq: any, index: number) => (
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

                </section>

                <section className="border-b border-[#45a7c5] mt-8">
                    <div className="w-[90%] mx-auto">
                        <div className=" h-auto  flex-col justify-start items-center gap-16 inline-flex overflow-hidden">

                            <div className="grid grid-cols-2 gap-4">
                                <div>
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
                                <div className="py-8">
                                    <div className="mx-auto self-stretch px-8 justify-start items-start gap-8 inline-flex">
                                        <div
                                            className="w-full h-[442px] bg-white rounded-xl shadow-[0px_20px_24px_-4px_rgba(16,24,40,0.08)] flex-col justify-start items-end inline-flex overflow-hidden">
                                            <div className="self-stretch px-6 pt-6 flex-col justify-start items-center gap-5 flex">
                                                <div className="pr-[9px] pb-1 justify-center items-center inline-flex overflow-hidden">
                                                    <div className="w-full bg-red-950">
                                                        <img className="object-contain" src="/assets/images/package-icon.png" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="self-stretch  flex-col justify-start items-center flex">
                                                <div className="self-stretch  px-6 pt-2 flex-col justify-start items-center gap-4 flex">
                                                    <div className="self-stretch h-[114px] flex-col justify-start items-center gap-1 flex">
                                                        <div className="self-stretch text-center text-[#101828] text-lg font-semibold font-['Inter'] leading-7">
                                                            Explore Our Unlimited CPE Package</div>
                                                        <div className="self-stretch text-center"><span
                                                            className="text-[#344054] text-lg font-normal font-['Inter'] leading-7">This course is part of the
                                                            CPE
                                                            Warehouse Pass. Subscribe today for</span><span
                                                                className="text-black text-lg font-normal font-['Inter'] leading-7"> </span><span
                                                                    className="text-[#667084] text-lg font-medium font-['Inter'] line-through leading-7">$1200</span><span
                                                                        className="text-[#7e56d8] text-2xl font-bold font-['Inter'] leading-7"> $999</span></div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="self-stretch h-[100px] pt-2 flex-col justify-start items-start flex">
                                                <div className="self-stretch px-6 pb-6 justify-start items-start gap-3 inline-flex">
                                                    <div
                                                        className="grow shrink basis-0 h-11 px-4 py-2.5 bg-[#2970fe] rounded-[28px] shadow-[inset_0px_0px_0px_1px_rgba(16,24,40,0.18)] border-2 border-white justify-center items-center gap-1.5 flex overflow-hidden">
                                                        <div className="px-0.5 justify-center items-center flex">
                                                            <div className="text-white text-base font-semibold font-['Inter'] leading-normal">Explore now</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
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