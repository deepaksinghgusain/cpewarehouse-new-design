import AddToCart from '@/components/courses/add-to-cart'
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
            <section className="mx-auto w-[calc(100%-2rem)] max-w-7xl sm:w-[90%]">
                <div className="grid grid-cols-1 items-center gap-8 py-8 md:grid-cols-2 md:py-12">
                    <div className="flex min-w-0 flex-col items-start gap-8 md:gap-12">
                        <div className="flex w-full flex-col items-start gap-6">
                            <div className="flex w-full flex-col items-start gap-4">
                                <div className="w-full text-3xl font-semibold leading-tight text-[#101828] sm:text-6xl sm:leading-[72px]">
                                    {heroImageSection.title}
                                </div>
                                <div className="w-full text-lg font-medium leading-7 text-[#0f1728] sm:text-xl sm:leading-[30px]">
                                    {heroImageSection.subtititle}
                                </div>
                            </div>
                            <div className="w-full text-lg font-normal leading-7 text-[#667085] sm:text-xl">
                                {heroImageSection.description}
                            </div>
                        </div>
                    </div>
                    <div className="flex w-full justify-center overflow-hidden">
                        <div className="w-full max-w-xl bg-gradient-to-b pt-8 sm:pt-[61px]">
                            <div className="p-4 sm:p-8">
                                <img src="/assets/images/sign-up-banner.jpg" className="h-auto w-full rounded-2xl object-contain" alt="" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="mx-auto my-8 w-[calc(100%-2rem)] max-w-7xl sm:my-10 sm:w-[90%]">
                <div className="w-full flex justify-between">
                    <div className="inline-flex border-b-2 border-[#155dee] px-1 pb-3">
                        <div className="text-xl font-semibold leading-loose text-[#155dee] sm:text-2xl">Bundle & Subscriptions
                        </div>
                    </div>
                </div>

                <div className="w-full mx-auto flex content-start flex-wrap">

                    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
                        {
                            packagedealData.length > 0 && packagedealData.map((course: any, index: number) => (
                                <div key={index} className="course-container h-full relative flex flex-col rounded-[10px] border-[#d4d5d6] border-2">
                                    <div className="relative flex-col justify-start items-start inline-flex overflow-hidden">
                                        <div className="w-full self-stretch flex-col justify-start items-center gap-5 flex">
                                            <div className="pb-1 justify-start items-center inline-flex overflow-hidden w-full">
                                                <div className="h-40 w-full sm:h-[119px]">
                                                    <img src={imageUrl + course.attributes?.image?.data?.attributes?.url} className="h-full w-full object-cover" alt="" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-4 flex flex-col items-start gap-4 px-4 pb-6 sm:px-5 sm:pb-10">
                                        <div className="flex w-full flex-wrap items-start gap-2">
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
                                    <AddToCart course={{...course, id: course.id}} type="package" quantity={1} absolute={false} />
                                </div>
                            ))
                        }

                    </div>

                </div>
            </section>

            <section className="mx-auto w-[calc(100%-2rem)] max-w-7xl sm:w-[90%]">
                <div className="flex w-full flex-col items-center gap-10 overflow-hidden bg-white py-10 sm:gap-[38px] sm:py-12">
                    <div className="w-full px-0 sm:px-8">
                        <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-3">
                            <div className="w-full text-center text-3xl font-semibold leading-tight text-[#101828] sm:text-4xl sm:leading-[44px]">{accreditedPartners?.title}</div>
                            <div className="w-full text-center text-lg font-normal leading-7 text-[#667085] sm:text-xl">{accreditedPartners?.description}</div>
                        </div>
                    </div>
                    <div className="w-full bg-cover bg-center" style={{ backgroundImage: `url(${imageUrl + accreditedPartners?.bg_image?.data?.attributes?.url})` }}>
                        <div className="w-full px-4 py-8 sm:px-8 sm:py-12">
                            <div className="grid w-full grid-cols-2 items-center justify-items-center gap-4 sm:grid-cols-3 sm:gap-8 lg:flex lg:justify-center">
                                {accreditedPartners?.list?.length > 0 && accreditedPartners.list.map((l: any, index: number) => (
                                    <div key={index} className="flex h-28 w-full max-w-[180px] items-center justify-center rounded-2xl border border-white/30 bg-white/30 p-4 backdrop-blur-xl sm:h-[142px] sm:p-6">
                                        <img className="h-full w-full object-contain" alt="" src={imageUrl + l?.image?.data?.attributes?.url} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="w-full bg-white py-10 sm:py-12">
                    <div className="flex w-full flex-col items-start gap-8 rounded-2xl bg-gradient-to-tr from-[#a6c0fe] to-[#ffeaf6] p-6 sm:p-16 lg:flex-row lg:items-center">
                        <div className="flex min-w-0 flex-1 flex-col items-start gap-4">
                            <div className="w-full text-2xl font-semibold leading-tight text-[#101828] sm:text-3xl sm:leading-[38px]">{otherCourseBanner?.title}</div>
                            <div className="w-full text-lg font-normal leading-7 text-[#475467] sm:text-xl sm:leading-[30px]">{otherCourseBanner?.description}</div>
                        </div>
                        <div className="flex w-full justify-start gap-3 lg:w-auto">
                            <div className="rounded-lg border border-[#155dee] bg-white px-[18px] py-3 shadow-[inset_0px_0px_0px_1px_rgba(16,24,40,0.18)]">
                                <Link href={otherCourseBanner?.button?.href} className="text-lg font-semibold leading-7 text-[#155dee]">{otherCourseBanner?.button?.label}</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default page