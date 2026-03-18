import NewsLetter from '@/components/shared/NewsLetter';
import Testimonial from '@/components/testimonials/Testimonial';
import { imageUrl } from '@/lib/constants';
import { getHomePageSection } from '@/services/common';
import { getInstructorsForHome } from '@/services/faculty';
import { Metadata } from 'next'
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'

export const metadata: Metadata = {
  title: 'Home',
};

export default async function page() {
  const res: any = await getHomePageSection()

  const homepagefacultymembers = await getInstructorsForHome()

  let partners: any;
  let latestnews: any;
  let feature: any;
  let testimonials: any;
  let highlightsimple: any;
  let coursedata: any;
  let InstructorData: any;
  let rssFeed: any;
  let frontPageBanner: any;

  let freeCourseBanner: any;
  let liveWebinarPass: any;
  let achivements: any;
  let approval: any;
  let getInTouch: any;

  if (res) {
    rssFeed = res?.data?.attributes?.RssFeedUrl;
    partners = res?.data?.attributes?.blocks.filter((x: { __component: string; }) => x.__component === 'blocks.partner-section')[0];
    latestnews = res?.data?.attributes?.blocks.filter((x: { __component: string; }) => x.__component === 'blocks.latest-news')[0];
    feature = res?.data?.attributes?.blocks.filter((x: { __component: string; }) => x.__component === 'blocks.feature-image-bullet-list')[0];
    testimonials = res?.data?.attributes?.blocks.filter((x: { __component: string; }) => x.__component === 'blocks.testimonial')[0];
    highlightsimple = res?.data?.attributes?.blocks.filter((x: { __component: string; }) => x.__component === 'blocks.page-highlight-simple')[0];
    coursedata = res?.data?.attributes?.blocks.filter((x: { __component: string, Index: String }) => x.__component === 'blocks.api-section' && x.Index === 'Home>Courses')[0];
    InstructorData = res?.data?.attributes?.blocks.filter((x: { __component: string, Index: String }) => x.__component === 'blocks.api-section' && x.Index === 'Home>Instructor')[0];
    frontPageBanner = res?.data?.attributes?.blocks.filter((x: { __component: string; }) => x.__component === 'blocks.front-page-banner')[0];
    freeCourseBanner = res?.data?.attributes?.blocks.filter((x: { __component: string; }) => x.__component === 'blocks.free-course-banner')[0];
    liveWebinarPass = res?.data?.attributes?.blocks.filter((x: { __component: string; }) => x.__component === 'blocks.live-webinar-passout')[0];
    achivements = res?.data?.attributes?.blocks.filter((x: { __component: string; }) => x.__component === 'blocks.achievement')[0];
    approval = res?.data?.attributes?.blocks.filter((x: { __component: string; }) => x.__component === 'blocks.approval')[0];
    getInTouch = res?.data?.attributes?.blocks.filter((x: { __component: string; }) => x.__component === 'blocks.get-in-touch')[0];
  }

  return (
    <>
      <section className="mt-16 w-[90%] mx-auto">
        <div className="grid md:grid-cols-2 grid-cols-1 gap-8">
          <div className="grow shrink basis-0 flex-col justify-start items-start md:mb-20">
            <div className="flex-col justify-start items-start gap-12 flex mb-8">
              <div className="self-stretch text-[#101828] text-5xl font-semibold font-['Inter'] leading-[50px]">{frontPageBanner?.title}</div>
              <div className="self-stretch h-[268px] pl-4 flex-col justify-start items-start gap-5 flex">

                {
                  frontPageBanner.list.length > 0 && frontPageBanner.list.map((item: any, index: number) => (
                    <div className="self-stretch justify-start items-start gap-3 inline-flex" key={index}>
                      <div className="w-7 h-7 rounded-full justify-center items-center flex overflow-hidden">
                        <div className="w-7 h-7 relative flex-col justify-start items-start flex overflow-hidden">
                          <Image src="/assets/images/check-icon.png" fill className="h-6 mr-2" alt="" />
                        </div>
                      </div>
                      <div className="grow shrink basis-0 flex-col justify-start items-start inline-flex">
                        <div className="self-stretch text-[#475467] text-lg font-normal font-['Inter'] leading-7">
                          {item.value}
                        </div>
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>
            <div className="justify-start items-start gap-3 inline-flex">
              <div className="px-[18px] py-3 bg-[#2970fe] rounded-[28px] shadow-[inset_0px_0px_0px_1px_rgba(16,24,40,0.18)] border-2 border-white justify-center items-center gap-1.5 flex overflow-hidden">
                <div className="px-0.5 justify-center items-center flex">
                  <Link href={frontPageBanner.catalog_button.href ?? ""} className="text-white text-base font-semibold font-['Inter'] leading-normal">
                    {frontPageBanner.catalog_button.label}</Link>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full h-full">
            <Image alt='' src={imageUrl + frontPageBanner?.image?.data?.attributes?.url} height={800} width={800} />
          </div>
        </div>
      </section>

      <div className="grid sm:grid-cols-2 grid-cols-1 mt-16 w-[90%] mx-auto">
        <div className="grow shrink basis-0 flex-col justify-start items-start gap-5 inline-flex">
          <div className="text-[#101828] text-4xl font-semibold font-['Inter'] leading-[44px]">{highlightsimple?.title}</div>
          <div className="text-[#475467] text-xl font-normal font-['Inter'] leading-[30px]">{highlightsimple?.description}</div>
        </div>
        <div className="grow shrink basis-0 flex-col justify-start items-start gap-12 inline-flex">
          {
            highlightsimple?.list.length > 0 && highlightsimple.list.map((list: any, index: number) => (
              <div className="flex justify-start items-start gap-4" key={index}>
                <div className="w-12 h-12 p-3 bg-[#6071f3] rounded-[10px] shadow-[inset_0px_0px_0px_1px_rgba(16,24,40,0.18)] border border-white justify-center items-center flex overflow-hidden">
                  <div dangerouslySetInnerHTML={{ __html: list?.icon }} className="w-6 h-6 relative flex-col justify-start items-start flex overflow-hidden">
                  </div>
                </div>
                <div className="grow shrink basis-0 flex-col justify-start items-start gap-5 inline-flex">
                  <div className="h-[120px] pt-2.5 flex-col justify-start items-start gap-2 flex">
                    <div className="text-[#101828] text-xl font-semibold font-['Inter'] leading-[30px]">
                      {list?.title}
                    </div>
                    <div className="text-[#475467] text-base font-normal font-['Inter'] leading-normal">
                      {list?.description}
                    </div>
                  </div>
                </div>
              </div>
            ))
          }
        </div>
      </div>

      <div className="relative w-[90%] mx-auto h-[600px] mt-16 ">
        <Image src={imageUrl + highlightsimple?.image?.data?.attributes?.url} alt="" fill className="object-cover" />
      </div>

      <section className="bg-[#eef4ff] mt-10">
        <div className="w-[90%] mx-auto">
          <div className="h-[592px] flex-col justify-center items-center gap-16 inline-flex overflow-hidden">
            <div className="self-stretch px-8 justify-center items-center inline-flex">
              <div className="grow shrink basis-0 h-[400px] bg-[#6071f3] rounded-3xl shadow-[0px_20px_24px_-4px_rgba(16,24,40,0.08)] justify-start items-center flex overflow-hidden">
                <div className="grow shrink basis-0 p-16 flex-col justify-center items-start gap-12 inline-flex">
                  <div className="self-stretch h-[156px] flex-col justify-start items-start gap-5 flex">
                    <div className="self-stretch text-white text-3xl font-semibold font-['Inter'] leading-[38px]">{liveWebinarPass.title}</div>
                    <div className="self-stretch text-white text-xl font-normal font-['Inter'] leading-[30px]">{liveWebinarPass.sub_title}</div>
                  </div>
                  <div className="justify-start items-start gap-3 inline-flex">
                    <div className="px-[22px] py-4 bg-white rounded-[28px] shadow-[inset_0px_0px_0px_1px_rgba(16,24,40,0.18)] border-2 border-white justify-center items-center gap-2.5 flex overflow-hidden">
                      <div className="px-0.5 justify-center items-center flex">
                        <Link href={liveWebinarPass.button.href} className="text-[#18212f] text-lg font-semibold font-['Inter'] leading-7">
                          {liveWebinarPass.button.label}
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-[480px] h-[400px] relative">
                  <Image fill alt='' src={imageUrl + liveWebinarPass.image.data.attributes.url} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className='w-[90%] mx-auto mt-16'>
        <div className="rounded-[10px] inline-flex flex-col justify-start items-center gap-16 overflow-hidden">
          <div className="w-full  px-8 bg-white flex flex-col justify-start items-start gap-8">
            <div className="self-stretch flex flex-col justify-start items-center gap-8">
              <div className="w-full max-w-[768px] flex flex-col justify-start items-center gap-5">
                <div className="self-stretch flex flex-col justify-start items-start gap-3">
                  <div className="self-stretch text-center justify-start text-Colors-Text-text-primary-(900) text-4xl font-semibold font-['Inter'] leading-10">{approval.title}</div>
                </div>
                <div className="self-stretch text-center justify-start text-Colors-Text-text-tertiary-(600) text-xl font-normal font-['Inter'] leading-loose">{approval.sub_title}</div>
              </div>
            </div>
          </div>
          <div className="w-full  px-8 flex flex-col justify-start items-start gap-16">
            <div className="self-stretch inline-flex justify-center items-start gap-8 flex-wrap content-start">
              {
                approval.list.length > 0 && approval.list.map((list: any, index: number) => (
                  <div key={index} className="flex-1 h-[560px] min-w-80 rounded-[10px] solid border border-[#dadee3]  inline-flex flex-col justify-start items-start gap-5">
                    <div className="self-stretch h-48 relative bg-gradient-to-b from-Colors-Cyan-25 to-gray-300 rounded-tr-[10px] rounded-br-[10px]">
                      <div className="w-44 h-36 pt-2 left-[97px] top-[29px] absolute inline-flex justify-center items-start">
                        <Image alt='' className="w-full h-full object-contain" fill src={imageUrl + list.image.data.attributes.url} />
                      </div>
                    </div>
                    <div className="self-stretch p-4 flex flex-col justify-start items-start gap-6">
                      <div className="self-stretch flex flex-col justify-start items-start gap-2">
                        <div className="self-stretch inline-flex justify-start items-start gap-4">
                          <div className="flex-1 justify-start text-Colors-Text-text-primary-(900) text-2xl font-semibold font-['Inter'] leading-loose">{list.title}</div>
                        </div>
                        <div className="self-stretch justify-start text-[#475467] text-base font-normal leading-normal" dangerouslySetInnerHTML={{ __html: list.description }}></div>
                      </div>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
        </div >
      </section>

      <Testimonial />

      <section className="bg-[#f9fafb] py-24 h-auto ">
        <div className="w-[90%] mx-auto">
          <div className="self-stretch h-[94px] mb-12 flex-col justify-start items-start gap-8 flex">
            <div className="self-stretch h-[94px] flex-col justify-start items-center gap-8 flex">
              <div className="self-stretch h-[94px] flex-col justify-start items-center gap-5 flex">
                <div className="self-stretch h-11 justify-between items-start gap-3 flex">
                  <div className="self-stretch text-left text-[#101828] text-4xl font-semibold font-['Inter'] leading-[44px]">
                    {InstructorData?.title}
                  </div>
                  <div className=" px-[18px] py-3  bg-[#2970fe] rounded-[28px] shadow-[inset_0px_0px_0px_1px_rgba(16,24,40,0.18)] border-2 border-white justify-center items-center">
                    <div className="px-0.5 justify-center items-center flex">
                      <Link href={InstructorData?.button?.href} className="text-white text-base font-semibold font-['Inter'] leading-normal">
                        {InstructorData?.button?.label}</Link>
                    </div>
                  </div>
                </div>
                <div className="self-stretch text-left text-[#475467] text-xl font-normal font-['Inter'] leading-[30px]">
                  Hear from some of our amazing customers who are automating their finances.</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4">
            {
              homepagefacultymembers.data.length > 0 && homepagefacultymembers.data.map((faculty: any, index: number) => (
                <div key={index} className="self-stretch h-96 min-w-80 relative" style={
                  {
                    backgroundImage: `url(${imageUrl + faculty.attributes.image.data.attributes.url})`,
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center"
                  }}>
                  <div className="w-full h-10 left-0 bottom-0 absolute bg-gradient-to-b from-black/0 to-black/40 inline-flex flex-col justify-end items-center">
                    <div className="self-stretch px-5 py-2 bg-Component-colors-Alpha-alpha-white-30/30  outline-Component-colors-Alpha-alpha-white-30/30 backdrop-blur-md flex flex-col justify-start items-start gap-3">
                      <div className="self-stretch flex flex-col justify-start items-start gap-4">
                        <div className="self-stretch justify-start text-Colors-Text-text-white text-2xl font-semibold font-['Inter'] leading-9 text-white">
                          {faculty.attributes?.firstName}
                          {faculty.attributes?.lastName}
                        </div>
                      </div>
                      <div className="self-stretch flex flex-col justify-start items-start gap-0.5">
                        <div className="self-stretch justify-start text-Colors-Text-text-white text-[12px] font-semibold font-['Inter'] leading-7 text-white">
                          {faculty.attributes?.shortDesc}
                        </div>
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
        <div className="h-[704px] py-24 bg-white flex-col justify-center items-center gap-16 inline-flex overflow-hidden">
          <div className="self-stretch px-8 justify-center items-center gap-16 inline-flex overflow-hidden">
            <div className="grow shrink basis-0 flex-col justify-start items-start gap-12 inline-flex">
              <div className="self-stretch h-[174px] flex-col justify-start items-start gap-6 flex">
                <div className="self-stretch text-[#101828] text-5xl font-semibold font-['Inter'] leading-[60px]">{getInTouch.title}</div>
                <div className="self-stretch text-[#475467] text-xl font-normal font-['Inter'] leading-[30px]">{getInTouch.sub_title}</div>
              </div>
              <div className="self-stretch justify-start items-start gap-4 inline-flex">
                <div className="px-[18px] py-3 bg-[#2970fe] rounded-[28px]  shadow-[inset_0px_0px_0px_1px_rgba(16,24,40,0.18)] border-2 border-white justify-center items-center gap-1.5 flex overflow-hidden">
                  <div className="px-0.5 justify-center items-center flex">
                    <Link href={getInTouch.button.href } className="text-white text-base font-semibold font-['Inter'] leading-normal">
                      {getInTouch.button.label}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <img className="h-[512px] relative" src={imageUrl + getInTouch.image.data.attributes.url } />
          </div>
        </div>
      </section>

      <NewsLetter />
    </>
  )
}
