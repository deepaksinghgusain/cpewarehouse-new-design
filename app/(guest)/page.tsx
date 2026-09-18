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
      <section className="mx-auto w-[calc(100%-1rem)] h-auto mt-4 sm:mt-[-60px] sm:w-[90%]">
        <div className="grid grid-cols-1 items-center md:grid-cols-2">
          <div className="grow shrink basis-0 flex-col justify-start items-start">
            <div className="flex-col justify-start items-start gap-6 flex mb-4">
              <div className="self-stretch text-3xl font-semibold leading-tight text-[#101828] sm:text-5xl sm:leading-[50px]">{frontPageBanner?.title}</div>
              <div className="flex flex-col items-start gap-3 pl-0 sm:pl-2">

                {
                  frontPageBanner.list.length > 0 && frontPageBanner.list.map((item: any, index: number) => (
                    <div className="self-stretch justify-start items-start gap-3 inline-flex" key={index}>
                      <div className="w-7 h-7 rounded-full justify-center items-center flex overflow-hidden">
                        <div className="w-7 h-7 relative flex-col justify-start items-start flex overflow-hidden">
                          <Image src="/assets/images/check-icon.png" fill sizes="28px" className="h-6 mr-2" alt="" />
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
          <div className="relative aspect-square h-full">
            <Image alt='' src={imageUrl + frontPageBanner?.image?.data?.attributes?.url} fill sizes="(max-width: 900px) 100vw, 50vw" className="object-contain" loading="eager" />
          </div>
        </div>
      </section>

      <div className="mx-auto grid w-[calc(100%-1rem)] grid-cols-1 gap-10 sm:mt-0 sm:w-[90%] md:grid-cols-2">
        <div className="grow shrink basis-0 flex-col justify-start items-start gap-5 inline-flex">
          <div className="text-3xl font-semibold leading-tight text-[#101828] sm:text-4xl sm:leading-[44px]">{highlightsimple?.title}</div>
          <div className="text-lg font-normal leading-7 text-[#475467] sm:text-xl sm:leading-[30px]">{highlightsimple?.description}</div>
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
                  <div className="flex flex-col items-start gap-2 pt-2.5">
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

      <div className="relative mx-auto mt-12 h-[240px] w-[calc(100%-1rem)] sm:mt-16 sm:h-[400px] sm:w-[90%] lg:h-[600px]">
        <Image src={imageUrl + highlightsimple?.image?.data?.attributes?.url} alt="" fill sizes="(max-width: 768px) 100vw, 90vw" className="object-cover" />
      </div>

      <section className="bg-[#eef4ff] mt-10">
        <div className="mx-auto w-[calc(100%-1rem)] sm:w-[90%]">
          <div className="flex flex-col items-center justify-center gap-10 py-10 sm:gap-16 sm:py-16">
            <div className="w-full px-0 sm:px-8">
              <div className="flex w-full flex-col items-stretch overflow-hidden rounded-3xl bg-[#6071f3] shadow-[0px_20px_24px_-4px_rgba(16,24,40,0.08)] lg:flex-row">
                <div className="flex flex-1 flex-col items-start justify-center gap-8 p-6 sm:gap-12 sm:p-16">
                  <div className="flex flex-col items-start gap-5">
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
                <div className="relative h-[260px] w-full shrink-0 sm:h-[360px] lg:h-[400px] lg:w-[480px]">
                  <Image fill alt='' sizes="(max-width: 768px) 100vw, 480px" src={imageUrl + liveWebinarPass.image.data.attributes.url} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-12 w-[calc(100%-1rem)] sm:mt-16 sm:w-[90%]">
        <div className="flex w-full flex-col gap-10 overflow-hidden rounded-[10px] sm:gap-16">
          <div className="w-full bg-white px-0 sm:px-8">
            <div className="flex flex-col items-center gap-8">
              <div className="flex w-full max-w-[768px] flex-col items-center gap-5">
                <div className="flex w-full flex-col items-start gap-3">
                  <div className="w-full text-center text-3xl font-semibold leading-tight text-Colors-Text-text-primary-(900) sm:text-4xl sm:leading-10">{approval.title}</div>
                </div>
                <div className="w-full text-center text-lg font-normal leading-7 text-Colors-Text-text-tertiary-(600) sm:text-xl sm:leading-loose">{approval.sub_title}</div>
              </div>
            </div>
          </div>
          <div className="w-full px-0 sm:px-8">
            <div className="grid w-full grid-cols-1 items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {
                approval.list.length > 0 && approval.list.map((list: any, index: number) => (
                  <div key={index} className="flex min-w-0 flex-col overflow-hidden rounded-[10px] border border-[#dadee3]">
                    <div className="relative h-50 w-full rounded-t-[10px] bg-gradient-to-b from-Colors-Cyan-25 to-gray-300">
                      <div className="absolute h-25 mt-5 inset-0 p-3 sm:p-4">
                        <Image alt={list.title || "Approval logo"} className="object-contain" fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" src={imageUrl + list.image.data.attributes.url} />
                      </div>
                    </div>
                    <div className="flex h-full flex-col items-start gap-6 p-4">
                      <div className="flex w-full flex-col items-start gap-2">
                        <div className="w-full text-xl font-semibold leading-8 text-Colors-Text-text-primary-(900) sm:text-2xl sm:leading-loose">{list.title}</div>
                        <div className="w-full text-base font-normal leading-normal text-[#475467]" dangerouslySetInnerHTML={{ __html: list.description }}></div>
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

      <section className="h-auto bg-[#f9fafb] py-12 sm:py-24">
        <div className="mx-auto w-[calc(100%-1rem)] sm:w-[90%]">
          <div className="mb-10 flex flex-col gap-8 sm:mb-12">
            <div className="flex flex-col items-center gap-5">
                <div className="flex w-full flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                  <div className="text-left text-3xl font-semibold leading-tight text-[#101828] sm:text-4xl sm:leading-[44px]">
                    {InstructorData?.title}
                  </div>
                  <div className="rounded-[28px] border-2 border-white bg-[#2970fe] px-[18px] py-3 shadow-[inset_0px_0px_0px_1px_rgba(16,24,40,0.18)]">
                    <div className="px-0.5 justify-center items-center flex">
                      <Link href={InstructorData?.button?.href} className="text-white text-base font-semibold font-['Inter'] leading-normal">
                        {InstructorData?.button?.label}</Link>
                    </div>
                  </div>
                </div>
                <div className="w-full text-left text-lg font-normal leading-7 text-[#475467] sm:text-xl sm:leading-[30px]">
                  Hear from some of our amazing customers who are automating their finances.</div>
              </div>
            </div>

          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4">
            {
              homepagefacultymembers.data.length > 0 && homepagefacultymembers.data.slice(0, 3).map((faculty: any, index: number) => (
                <div key={index} className="relative h-96 min-w-0" style={
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

      <section className="mx-auto w-[calc(100%-1rem)] sm:w-[90%]">
        <div className="flex flex-col items-center justify-center gap-10 overflow-hidden bg-white py-12 sm:gap-16 sm:py-24">
          <div className="flex w-full flex-col items-center gap-10 px-0 sm:px-8 lg:flex-row lg:gap-16">
            <div className="flex flex-1 flex-col items-start gap-8 sm:gap-12">
              <div className="flex flex-col items-start gap-6">
                <div className="text-3xl font-semibold leading-tight text-[#101828] sm:text-5xl sm:leading-[60px]">{getInTouch.title}</div>
                <div className="text-lg font-normal leading-7 text-[#475467] sm:text-xl sm:leading-[30px]">{getInTouch.sub_title}</div>
              </div>
              <div className="self-stretch justify-start items-start gap-4 inline-flex">
                <div className="px-[18px] py-3 bg-[#2970fe] rounded-[28px]  shadow-[inset_0px_0px_0px_1px_rgba(16,24,40,0.18)] border-2 border-white justify-center items-center gap-1.5 flex overflow-hidden">
                  <div className="px-0.5 justify-center items-center flex">
                    <Link href={getInTouch.button.href} className="text-white text-base font-semibold font-['Inter'] leading-normal">
                      {getInTouch.button.label}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <img className="h-auto max-h-[420px] w-full max-w-[512px] object-contain" src={imageUrl + getInTouch.image.data.attributes.url} alt="" />
          </div>
        </div>
      </section>

      <NewsLetter />
    </>
  )
}
