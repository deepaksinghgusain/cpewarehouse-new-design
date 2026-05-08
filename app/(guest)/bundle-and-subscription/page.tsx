import { imageUrl } from '@/lib/constants'
import { getPageContent } from '@/services/common'
import { getAllPackages } from '@/services/course'
import Link from 'next/link'
import React from 'react'

const page = async () => {

    // let res : any;

    const res = await getPageContent('bundle-and-subscription');
    let heroImageSection: any;
    let accreditedPartners: any;
    let otherCourseBanner: any;
  
    if (res) {
        heroImageSection = res?.data[0]?.attributes?.blocks.filter((res: { __component: string; }) => res.__component === 'blocks.bundle-and-subscription')[0];
        accreditedPartners = res?.data[0]?.attributes?.blocks.filter((res: { __component: string; }) => res.__component === 'blocks.accredited-partners')[0];
        otherCourseBanner = res?.data[0]?.attributes?.blocks.filter((res: { __component: string; }) => res.__component === 'blocks.other-course-banner')[0];
    }
    
    const result = await getAllPackages();
    
    
    let packagedealData: any;

    if(result) {
        packagedealData = result.data;
    }    

    return (
        <>
            <section className="w-[90%] mx-auto">
                <div className="justify-center items-center gap-8 inline-flex">
                    <div className="grow shrink basis-0 flex-col justify-start items-start gap-12 inline-flex">
                        <div className="self-stretch flex-col justify-start items-start gap-6 flex">
                            <div className="self-stretch  flex-col justify-start items-start gap-4 flex">
                                <div className="self-stretch text-[#101828] text-6xl font-semibold font-['Inter'] leading-[72px]">
                                    {heroImageSection.title}
                                </div>
                                <div className="self-stretch h-[60px] text-[#0f1728] text-xl font-medium font-['Inter'] leading-[30px]">
                                    {heroImageSection.subtititle}
                                </div>
                            </div>
                            <div className="self-stretch text-[#667085] text-xl font-normal font-['Inter'] leading-normal">
                                {heroImageSection.description}
                            </div>
                        </div>
                    </div>
                    <div className="justify-center items-center flex overflow-hidden">
                        <div className="self-stretch pt-[61px] bg-gradient-to-b flex-col justify-center items-center inline-flex">
                            <div className="p-8">
                                <img src="/assets/images/sign-up-banner.jpg" className="rounded-2xl " alt="" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="w-[90%] mx-auto my-10">
                <div className="w-full flex justify-between">
                    <div className="h-9 px-1 pb-3 border-b-2 border-[#155dee] justify-center items-center gap-2 inline-flex">
                        <div className="text-[#155dee] text-2xl font-semibold font-['Inter'] leading-loose">Bundle & Subscriptions
                        </div>
                    </div>
                </div>

                <div className="w-full mx-auto flex content-start flex-wrap">

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                        {
                            packagedealData.length > 0 && packagedealData.map((course: any, index: number) => (
                                <div key={index} className="course-container h-full relative flex flex-col rounded-[10px] border-[#d4d5d6] border-2">
                                    <div className="relative flex-col justify-start items-start inline-flex overflow-hidden">
                                        <div className="w-full self-stretch flex-col justify-start items-center gap-5 flex">
                                            <div className="pb-1 justify-start items-center inline-flex overflow-hidden w-full">
                                                <div className="w-full h-[119px]">
                                                    <img src={imageUrl + course.attributes?.image?.data?.attributes?.url} className="w-[100%]" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="px-5 pb-10 mt-4 flex-col justify-start items-start gap-[18px] inline-flex">
                                        <div className="self-stretch justify-start items-start gap-2 inline-flex">
                                            {
                                                course.attributes?.category?.data?.attributes?.title === "Live" && <div
                                                    className="pl-2 pr-2.5 py-0.5 bg-[#ecfcf2] rounded-full border border-[#aaefc6] justify-start items-center gap-1.5 flex">
                                                    <div className="w-2 h-2 relative">
                                                        <div className="w-1.5 h-1.5 left-[1px] top-[1px] absolute bg-[#17b169] rounded-full"></div>
                                                    </div>
                                                    <div className="text-center text-[#057647] text-sm font-medium font-['Inter'] leading-tight">
                                                        Live webinar
                                                    </div>
                                                </div>
                                            }

                                            {
                                                course.attributes?.category?.data?.attributes1?.title === "Tax" && <div
                                                    className="px-2.5 py-0.5 bg-[#fdf1f9] rounded-full border border-[#fbceee] justify-start items-center flex">
                                                    <div className="text-center text-[#c01573] text-sm font-medium font-['Inter'] leading-tight">
                                                        Tax
                                                    </div>
                                                </div>
                                            }

                                            {
                                                course.attributes?.category?.data?.attributes?.title === "Recorded" && <div
                                                    className="h-6 px-2.5 py-0.5 bg-[#f8f8fb] rounded-full border border-[#d5d8eb] justify-start items-center inline-flex">
                                                    <div className="text-center text-[#353e72] text-sm font-medium font-['Inter'] leading-tight">
                                                        Recorded
                                                    </div>
                                                </div>
                                            }

                                        </div>
                                        <div className="self-stretch flex-col justify-start items-start gap-2 mb-0 flex">
                                            <Link href={`/package/${course.attributes.slug}`}
                                                className="self-stretch text-[#101828] text-lg font-semibold font-['Inter'] leading-7">
                                                {course.attributes.title}
                                            </Link>
                                        </div>
                                        <div className="text-[#667085] text-base mt-0 font-normal font-['Inter'] leading-normal">
                                            {course.attributes.valid_till}
                                        </div>

                                    </div>
                                    <div
                                        className="absolute bottom-1 left-2 h-10 ml-2 add-to-card inline-flex justify-center items-center gap-2 overflow-hidden">
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
                                </div>
                            ))
                        }

                    </div>

                </div>
            </section>

            <section className="w-[90%] mx-auto">
                <div className="w-full py-12  bg-white flex-col justify-start items-center gap-[38px] inline-flex overflow-hidden">
                    <div className="self-stretch h-11 px-8 flex-col justify-start items-start gap-8 flex mb-8">
                        <div className="self-stretch h-11 flex-col justify-start items-start gap-8 flex">
                            <div className="self-stretch h-11 flex-col justify-start items-start gap-5 flex">
                                <div className="container mx-auto">
                                    <div className="self-stretch h-11 flex-col justify-start items-start gap-3 flex">
                                        <div className="self-stretch text-[#101828] text-4xl text-center font-semibold font-['Inter'] leading-[44px]">
                                            {accreditedPartners?.title}</div>
                                        <div className="self-stretch text-[#667085] text-center text-xl font-normal font-['Inter'] leading-normal">
                                            {accreditedPartners?.description}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="w-full"
                        style={{
                            backgroundImage: `url(${imageUrl + accreditedPartners?.bg_image?.data?.attributes?.url})`,
                            backgroundSize: "cover"
                        }}>
                        <div className="h-80 w-full px-1 flex-col justify-start items-center gap-16 flex">
                            <div className="self-stretch h-80 p-16 justify-center items-start gap-8 inline-flex">
                                {
                                    accreditedPartners.list.length > 0 && accreditedPartners.list.map((l: any, index: number) => (
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

                <div className="h-[338px] w-full pb-24 bg-white flex-col justify-center items-center inline-flex overflow-hidden">
                    <div className="self-stretch h-[242px] flex-col justify-start items-start gap-8 flex">
                        <div
                            className="self-stretch p-16 bg-gradient-to-tr from-[#a6c0fe] to-[#ffeaf6] rounded-2xl justify-start items-start gap-8 inline-flex">
                            <div className="grow shrink  basis-0 flex-col justify-start items-start gap-4 inline-flex">
                                <div className="self-stretch text-[#101828] text-3xl font-semibold font-['Inter'] leading-[38px]">
                                    {otherCourseBanner?.title}
                                </div>
                                <div className="self-stretch text-[#475467] text-xl font-normal font-['Inter'] leading-[30px]">
                                    {otherCourseBanner?.description}
                                </div>
                            </div>
                            <div className="justify-start items-start gap-3 flex">
                                <div
                                    className="px-[18px] py-3 bg-white rounded-lg shadow-[inset_0px_0px_0px_1px_rgba(16,24,40,0.18)] border border-[#155dee] justify-center items-center gap-1.5 flex overflow-hidden">
                                    <div className="px-0.5 justify-center items-center flex">
                                        <Link href={otherCourseBanner?.button?.href}
                                            className="text-[#155dee] text-lg font-semibold font-['Inter'] leading-7">
                                            {otherCourseBanner?.button?.label}</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default page