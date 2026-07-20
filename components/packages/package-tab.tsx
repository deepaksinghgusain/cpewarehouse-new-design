import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { imageUrl } from "@/lib/constants";
import Link from "next/link";
import { Accordion } from "../ui/accordion";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { PlusCircle, MinusCircle } from "lucide-react";
import moment from "moment";

const PackageTabs = ({
  packageData,
  packageContact,
  PackageCourses,
  twoLettertimezone,
}: any) => {

    console.log("packageData", packageData);
  return (
    <Tabs defaultValue="outline" className="w-full bg-transparent ">
      <TabsList variant="line" className="w-full bg-transparent ">
        <TabsTrigger
          value="outline"
          className="text-2xl font-bold cursor-pointer hover:text-blue-500 hover:after:bg-blue-500 hover:after:opacity-100 font-['Inter'] leading-loose  data-[state=active]:text-blue-500 data-[state=active]:after:bg-blue-500"
        >
          Outline
        </TabsTrigger>
        <TabsTrigger
          value="CPE Info"
          className="text-2xl font-bold cursor-pointer hover:text-blue-500 hover:after:bg-blue-500 hover:after:opacity-100 font-['Inter'] leading-loose  data-[state=active]:text-blue-500 data-[state=active]:after:bg-blue-500"
        >
          CPE Info
        </TabsTrigger>
        <TabsTrigger
          value="FAQ"
          className="text-2xl font-bold cursor-pointer hover:text-blue-500 hover:after:bg-blue-500 hover:after:opacity-100 font-['Inter'] leading-loose  data-[state=active]:text-blue-500 data-[state=active]:after:bg-blue-500"
        >
          FAQ
        </TabsTrigger>
      </TabsList>
      <TabsContent value="outline">
        <div className="px-8 mt-8 rounded-xl justify-start gap-8 inline-flex border-b border-[#e4e7ec]">
          {packageData?.packege_outlines &&
            packageData?.packege_outlines.length > 0 &&
            packageData?.packege_outlines.map((outline: any, index: number) => (
              <div
                className="w-[592px] rounded-2xl flex-col justify-start items-start inline-flex overflow-hidden"
                key={index}
              >
                <div className="self-stretch h-[88px] px-8 pt-8 pb-6 border-b border-[#e4e7ec] flex-col justify-start items-start gap-8 flex">
                  <div className="self-stretch justify-start items-start gap-8 inline-flex">
                    <div className="grow shrink basis-0 flex-col justify-start items-start gap-1 inline-flex">
                      <div className="justify-start items-center gap-2 inline-flex">
                        <div className="text-[#101828] text-2xl font-semibold font-['Inter']  leading-loose">
                          {outline.title}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-[592px] px-8 pt-8 pb-10  flex-col justify-start items-start gap-6 flex">
                  <div className="self-stretch  justify-start items-start gap-8">
                    {outline.list.length > 0 &&
                      outline.list.map((item: any, index: number) => (
                        <div
                          className="grow shrink basis-0 h-12 justify-start items-start gap-3 flex mb-4"
                          key={index}
                        >
                          <div className="w-6 h-6 relative bg-[#dbf9e6] rounded-full  overflow-hidden">
                            <svg
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <g id="Check icon">
                                <path
                                  d="M0 12C0 5.37258 5.37258 0 12 0C18.6274 0 24 5.37258 24 12C24 18.6274 18.6274 24 12 24C5.37258 24 0 18.6274 0 12Z"
                                  fill="#DCFAE6"
                                />
                                <path
                                  id="Icon"
                                  fillRule="evenodd"
                                  clipRule="evenodd"
                                  d="M17.096 7.39016L9.93602 14.3002L8.03602 12.2702C7.68602 11.9402 7.13602 11.9202 6.73602 12.2002C6.34602 12.4902 6.23602 13.0002 6.47602 13.4102L8.72602 17.0702C8.94602 17.4102 9.32601 17.6202 9.75601 17.6202C10.166 17.6202 10.556 17.4102 10.776 17.0702C11.136 16.6002 18.006 8.41016 18.006 8.41016C18.906 7.49016 17.816 6.68016 17.096 7.38016V7.39016Z"
                                  fill="#079455"
                                />
                              </g>
                            </svg>
                          </div>
                          <div className="grow shrink basis-0 flex-col justify-start items-start inline-flex">
                            <div className="self-stretch text-[#475467] text-base font-normal font-['Inter'] leading-normal">
                              {item.value}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            ))}
        </div>

        <section className="border-b border-[#45a7c5] mt-8">
          <div className="w-[90%] mx-auto">
            <div className="">
              <div className="grid grid-cols-6 gap-30">
                <div className="col-span-3">
                  {packageData?.package_includes && (
                    <div className=" mt-8">
                      <div className="text-[#101828] text-lg font-semibold font-['Inter'] leading-7 my-8">
                        {packageData?.package_includes.title}
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        {packageData?.package_includes.list.length > 0 &&
                          packageData?.package_includes.list.map(
                            (list: any, index: number) => (
                              <div key={index}>
                                <div className="justify-start items-center gap-2 flex">
                                  <div className="w-6 h-6 relative  overflow-hidden">
                                    <img
                                      src={
                                        imageUrl +
                                        list?.image?.data?.attributes?.url
                                      }
                                      alt=""
                                    />
                                  </div>
                                  <div className="text-[#344054] text-lg font-semibold font-['Inter'] leading-7">
                                    {list.title}
                                  </div>
                                </div>
                              </div>
                            ),
                          )}
                      </div>
                    </div>
                  )}

                  <div>
                    {packageData?.package_attend && (
                      <>
                        <div className="text-[#101828] text-lg font-semibold font-['Inter'] leading-7 my-8">
                          {packageData?.package_attend.title}
                        </div>
                        {packageData?.package_attend.list.length > 0 && (
                          <div className="grid grid-cols-3 gap-4">
                            {packageData?.package_attend.list.map(
                              (list: any, index: number) => (
                                <div className="text-center" key={index}>
                                  <div className="px-3 py-1 bg-gray-50 rounded-full border border-[#e4e7ec] justify-center items-center flex">
                                    <div className="text-center text-[#344054] text-sm font-medium font-['Inter'] leading-tight">
                                      {list.value}
                                    </div>
                                  </div>
                                </div>
                              ),
                            )}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
                <div className="col-span-1"></div>
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
                        This course is part of the CPE Warehouse Pass. Subscribe
                        today for{" "}
                        <span className="line-through text-gray-400">
                          $1200
                        </span>{" "}
                        <span className="text-purple-600 text-2xl font-bold">
                          $999
                        </span>
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

        {PackageCourses.length > 0 && (
          <section className="bg-[#f9fafb] py-10">
            <div className="container w-[90%] mx-auto">
              <div className="flex-col justify-start items-center gap-8 flex">
                <div className="flex-col justify-start items-center gap-5 flex">
                  <div className="h-11 flex-col justify-start items-start gap-3 flex">
                    <div className="text-left text-[#101828] text-4xl font-semibold font-['Inter'] leading-[44px]">
                      Course Included
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full my-8">
                <div className="grid grid-cols-4 gap-6">
                  {PackageCourses.map((course: any, index: number) => (
                    <div
                      key={index}
                      className="course-container flex flex-col w-full h-full relative rounded-[10px] outline-1 outline-offset-[-1px] outline-sky-300 shadow shadow-sky-500"
                    >
                      <div className="w-full min-h-[128px] relative bg-gradient-to-t from-cyan-300 to-indigo-600 rounded-[10px] overflow-hidden">
                        <div className="h-6 w-full  flex-col justify-center items-center inline-flex bg-[#8078d4]">
                          <div className="w-full h-14 p-4 bg-white/30 border-t border-white/30 backdrop-blur-xl flex-col justify-start items-start gap-6 flex">
                            <div className="w-full justify-start items-start gap-6 inline-flex">
                              <div className="flex-col justify-start items-center inline-flex mt-2">
                                <div className="text-white text-[14px] text-base font-bold font-['Inter'] leading-normal">
                                  Credits:
                                  {course.attributes?.credit} |
                                  {course.attributes?.sub_title}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="ml-4 mt-4 pb-2">
                          <div className="flex">
                            {course.attributes?.instructors.data.length > 0 &&
                              course.attributes?.instructors.data.map(
                                (instructor: any, index: number) => (
                                  <img
                                    key={index}
                                    className="w-12 h-12 mr-2 rounded-[684px] ml[-10px]"
                                    src={
                                      imageUrl +
                                      instructor?.attributes?.image?.data
                                        ?.attributes?.url
                                    }
                                  />
                                ),
                              )}
                          </div>
                          <div className="w-[280px] mt-2 justify-start">
                            <div className="flex-col justify-start items-start">
                              <div className="text-white text-sm font-semibold font-['Inter'] leading-tight">
                                {course.attributes?.instructors.data.length >
                                  0 &&
                                  course.attributes?.instructors.data.map(
                                    (instructor: any, index: number) => (
                                      <span key={index}>
                                        {instructor?.attributes?.firstName}{" "}
                                        {instructor?.attributes?.lastName}
                                      </span>
                                    ),
                                  )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="px-5 h-56 pb-6 mt-4 flex-col justify-start items-start gap-[18px] inline-flex">
                        <div className="self-stretch justify-start items-start gap-2 inline-flex">
                          {course.attributes?.category?.data?.attributes
                            ?.title === "Live" && (
                            <div className="pl-2 pr-2.5 py-0.5 bg-[#ecfcf2] rounded-full border border-[#aaefc6] justify-start items-center gap-1.5 flex">
                              <div className="w-2 h-2 relative">
                                <div className="w-1.5 h-1.5 left-[1px] top-[1px] absolute bg-[#17b169] rounded-full"></div>
                              </div>
                              <div className="text-center text-[#057647] text-sm font-medium font-['Inter'] leading-tight">
                                Live webinar
                              </div>
                            </div>
                          )}

                          <div className="px-2.5 py-0.5 bg-pink-50 rounded-full  outline-1 outline-offset-[-1px] outline-pink-200 inline-flex justify-start items-center">
                            <div className="text-center justify-start text-pink-700 text-sm font-medium font-['Inter'] leading-tight">
                              {course?.attributes?.fieldOfStudy}
                            </div>
                          </div>
                        </div>
                        <div className="self-stretch flex-col justify-start items-start gap-2 flex">
                          <Link href={`/course/${course.attributes?.slug}`}>
                            <div className="self-stretch text-[#101828] text-lg font-semibold font-['Inter'] leading-7">
                              {course.attributes?.title}
                            </div>
                          </Link>
                          {course.attributes?.category?.data?.attributes
                            ?.title !== "Recorded" && (
                            <div className="self-stretch justify-start text-Colors-Text-text-tertiary-(600) text-sm font-normal font-['Inter'] leading-normal">
                              {moment(
                                course.attributes?.startDate.replace("Z", ""),
                              ).format("dddd MMM d YYYY")}{" "}
                              |
                              {moment(
                                course.attributes?.startDate.replace("Z", ""),
                              )
                                .format("h:mm a")
                                .toUpperCase()}{" "}
                              -
                              {moment(course.attributes?.endDate)
                                .format("h:mm a")
                                .toUpperCase()}{" "}
                              {twoLettertimezone || ""}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* <div className=" w-full mt-10 bg-white flex-col justify-start items-center gap-16 inline-flex overflow-hidden">
          <div className="self-stretch w-2/3 h-[190px] px-8 flex-col justify-start items-start gap-8 flex">
            <div className="self-stretch h-[190px] flex-col justify-start items-start gap-8 flex">
              <div className="self-stretch h-[190px] flex-col justify-start items-start gap-5 flex">
                <div className="self-stretch h-20 flex-col justify-start items-start gap-3 flex">
                  <div className="self-stretch text-[#6840c6] text-base font-semibold font-['Inter'] leading-normal">
                    {packageData?.inclusion[0].heading}
                  </div>
                  <div className="self-stretch text-[#101828] text-4xl font-semibold font-['Inter'] leading-[44px]">
                    {packageData?.inclusion[0].title}
                  </div>
                </div>
                <div className="self-stretch text-[#475467] text-xl font-normal font-['Inter'] leading-[30px]">
                  {packageData?.inclusion[0].sub_title}
                </div>
              </div>
            </div>
          </div>
          <div className="self-stretch px-8 grid grid-cols-3 gap-4">
            <div className="grow shrink basis-0 h-[604px] justify-start items-start gap-8 flex">
              <div className="grow shrink basis-0 flex-col justify-start items-start gap-12 inline-flex">
                {packageData.inclusion[0].list.length &&
                  packageData.inclusion[0].list.map(
                    (list: any, index: number) => (
                      <div
                        className="self-stretch justify-start items-start gap-4 inline-flex"
                        key={index}
                      >
                        <div className="w-12 h-12 p-3  justify-center items-center flex overflow-hidden">
                          <div className="w-6 h-6 relative flex-col justify-start items-start flex overflow-hidden">
                            <img
                              src={imageUrl + list.icon.data.attributes.url}
                              alt=""
                            />
                          </div>
                        </div>
                        <div className="grow shrink basis-0 flex-col justify-start items-start gap-5 inline-flex">
                          <div className="self-stretch h-[188px] pt-2.5 flex-col justify-start items-start gap-2 flex">
                            <div className="self-stretch text-[#101828] text-xl font-semibold font-['Inter'] leading-[30px] ">
                              {list.title}
                            </div>
                            <div className="self-stretch">
                              <ul className="text-[#475467] self-stretch justify-start text-Colors-Text-text-tertiary-(600) text-lg font-normal font-['Inter'] leading-7 decoration-dotted">
                                {list.item.length > 0 &&
                                  list.item.map((item: any, index: number) => (
                                    <li key={index}>{item.value}</li>
                                  ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    ),
                  )}
              </div>
            </div>
            <div className="pl-16 justify-end items-center flex col-span-2">
              <div className="w-[1024px] h-[682px] relative rounded-xl border-4 border-[#101828] flex-col justify-start items-start flex">
                <img
                  className="w-[1024px] h-[682px] relative rounded-xl"
                  src={
                    imageUrl +
                    packageData.inclusion[0].image.data.attributes.url
                  }
                />
              </div>
            </div>
          </div>
        </div> */}
      </TabsContent>
      <TabsContent value="CPE Info">
        <div className="w-full py-24 bg-Colors-Background-bg-primary inline-flex flex-col justify-start items-center gap-16 overflow-hidden text-[#475467]">
          <div className="w-full  px-8 inline-flex justify-start items-start gap-16 flex-wrap content-start">
            <div className="flex-1 inline-flex flex-col justify-start items-start gap-8">
              <div
                className="w-full flex flex-col justify-start items-start gap-5"
                dangerouslySetInnerHTML={{ __html: packageData.cpe_info }}
              ></div>
            </div>
          </div>
        </div>

        {packageData?.accredited_partners && (
          <section>
            <div className="w-full py-12 bg-white flex-col justify-start items-center gap-[38px] inline-flex overflow-hidden">
              <div className="self-stretch h-11 px-8 flex-col justify-start items-start gap-8 flex">
                <div className="self-stretch h-11 flex-col justify-start items-start gap-8 flex">
                  <div className="self-stretch h-11 flex-col justify-start items-start gap-5 flex">
                    <div className="container mx-auto">
                      <div className="self-stretch h-11 flex-col justify-start items-start gap-3 flex">
                        <div className="self-stretch text-[#101828] text-4xl font-semibold font-['Inter'] leading-[44px]">
                          {packageData?.accredited_partners.title}{" "}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="w-full"
                style={{
                  backgroundImage: `url( ${imageUrl + packageData?.accredited_partners.bg_image.data.attributes.url} )`,
                  backgroundSize: "cover",
                }}
              >
                <div className="h-80 w-full px-1 flex-col justify-start items-center gap-16 flex">
                  <div className="self-stretch h-80 p-16 justify-center items-start gap-8 inline-flex">
                    {packageData?.accredited_partners.list.length > 0 &&
                      packageData?.accredited_partners.list.map(
                        (list: any, index: number) => (
                          <div
                            key={index}
                            className="w-[180px] h-[142px] px-6 py-8 bg-white/30 rounded-2xl border border-white/30 backdrop-blur-xl flex-col justify-start items-center gap-5 inline-flex"
                          >
                            <img
                              className="self-stretch grow shrink basis-0 w-[100%] h-[100%] object-scale-down"
                              src={imageUrl + list.image.data.attributes.url}
                            />
                          </div>
                        ),
                      )}
                  </div>
                </div>
              </div>

              {packageData?.package_sponser && (
                <div className="mx-auto">
                  <div className="grid grid-cols-6 gap-4">
                    <div className="py-5  gap-8 col-span-4">
                      <div className="self-stretch text-[#101828] text-lg font-semibold font-['Inter'] leading-7">
                        {packageData?.package_sponser.title}
                      </div>
                      <div className="self-stretch h-20 px-1 flex-col justify-start items-start gap-8 flex">
                        <div className=" justify-start items-start inline-flex">
                          {packageData?.package_sponser.list.length > 0 &&
                            packageData?.package_sponser.list.map((list: any, index: number) => (
                              <div
                                className="grow shrink basis-0 px-4 pt-6 flex-col justify-start items-center gap-5 inline-flex"
                                key={index}
                              >
                                <div className="self-stretch justify-start items-start gap-3 inline-flex">
                                  <div className="w-7 h-7 rounded-full justify-center items-center flex overflow-hidden">
                                    <div className="w-7 h-7 relative flex-col justify-start items-start flex overflow-hidden">
                                      <svg
                                        width="28"
                                        height="28"
                                        viewBox="0 0 28 28"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <g id="check-circle">
                                          <path
                                            id="Icon"
                                            d="M8.75065 14.0002L12.2507 17.5002L19.2507 10.5002M25.6673 14.0002C25.6673 20.4435 20.444 25.6668 14.0007 25.6668C7.55733 25.6668 2.33398 20.4435 2.33398 14.0002C2.33398 7.55684 7.55733 2.3335 14.0007 2.3335C20.444 2.3335 25.6673 7.55684 25.6673 14.0002Z"
                                            stroke="#7F56D9"
                                            strokeWidth="2.33333"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                          />
                                        </g>
                                      </svg>
                                    </div>
                                  </div>
                                  <div className="grow shrink basis-0 flex-col justify-start items-start inline-flex">
                                    <div className="self-stretch text-[#475467] text-lg font-normal font-['Inter'] leading-7">
                                      {list.value}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                      <div className="self-stretch h-[200px] py-4 flex-col justify-start items-start gap-5 flex">
                        <div className="self-stretch h-[168px] flex-col justify-start items-center gap-2 flex">
                          <div className="self-stretch text-[#475467] text-lg font-normal font-['Inter'] leading-7">
                            {packageData?.package_sponser.description}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-span-2 self-stretch flex-col justify-start items-start gap-8 inline-flex">
                      <div className="self-stretch justify-center items-start gap-8 inline-flex">
                        <div className="grow shrink basis-0 bg-white rounded-2xl  border border-[#e4e7ec] flex-col justify-start items-start inline-flex">
                          <div className="self-stretch  px-8 pt-8 pb-10 flex-col justify-start items-start gap-6 flex">
                            <div className="self-stretch flex-col justify-start items-start gap-4 flex">
                              {packageData?.package_sponser.features.length > 0 &&
                                packageData?.package_sponser.features.map(
                                  (feature: any, index: number) => (
                                    <div
                                      className="self-stretch justify-start items-start gap-3 inline-flex"
                                      key={index}
                                    >
                                      <div className="w-6 h-6 relative bg-[#dbf9e6] rounded-full  overflow-hidden">
                                        <svg
                                          width="24"
                                          height="24"
                                          viewBox="0 0 24 24"
                                          fill="none"
                                          xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <g id="Check icon">
                                            <path
                                              d="M0 12C0 5.37258 5.37258 0 12 0C18.6274 0 24 5.37258 24 12C24 18.6274 18.6274 24 12 24C5.37258 24 0 18.6274 0 12Z"
                                              fill="#DCFAE6"
                                            />
                                            <path
                                              id="Icon"
                                              fillRule="evenodd"
                                              clipRule="evenodd"
                                              d="M17.096 7.39016L9.93602 14.3002L8.03602 12.2702C7.68602 11.9402 7.13602 11.9202 6.73602 12.2002C6.34602 12.4902 6.23602 13.0002 6.47602 13.4102L8.72602 17.0702C8.94602 17.4102 9.32601 17.6202 9.75601 17.6202C10.166 17.6202 10.556 17.4102 10.776 17.0702C11.136 16.6002 18.006 8.41016 18.006 8.41016C18.906 7.49016 17.816 6.68016 17.096 7.38016V7.39016Z"
                                              fill="#079455"
                                            />
                                          </g>
                                        </svg>
                                      </div>
                                      <div className="grow shrink basis-0 flex-col justify-start items-start inline-flex">
                                        <div className="self-stretch text-[#344054] text-lg font-semibold font-['Inter'] leading-7">
                                          {feature.value}
                                        </div>
                                      </div>
                                    </div>
                                  ),
                                )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}
      </TabsContent>
      <TabsContent value="FAQ">
        <section className="container mx-auto">
          <div className="w-full py-10 bg-white flex-col justify-start items-center gap-16 inline-flex overflow-hidden">
            <div className="self-stretch h-[94px] px-8 flex-col justify-start items-start gap-8 flex">
              <div className="self-stretch h-[94px] flex-col justify-start items-center gap-8 flex">
                <div className="self-stretch h-[94px] flex-col justify-start items-center gap-5 flex">
                  <div className="self-stretch text-center text-[#101828] text-4xl font-semibold font-['Inter'] leading-[44px]">
                    {packageData.faqs.title}
                  </div>
                  <div className="self-stretch text-center text-[#475467] text-xl font-normal font-['Inter'] leading-[30px]">
                    {packageData.faqs?.sub_title}
                  </div>
                </div>
              </div>
            </div>

            <div className="self-stretch w-[70%] mx-auto px-8 flex-col justify-start items-center gap-16 flex">
              <div className="self-stretch w-full flex-col justify-start items-start gap-8 flex">
                <Accordion
                  type="single"
                  collapsible
                  className="w-full overflow-hidden px-4"
                >
                  {packageData?.faqs.faq.length > 0 &&
                    packageData?.faqs.faq.map((faq: any, index: number) => (
                      <AccordionPrimitive.Item
                        key={index}
                        value={`item-${index}`}
                        className="border-b border-gray-200 last:border-b-0"
                      >
                        <AccordionPrimitive.Header className="w-full">
                          <AccordionPrimitive.Trigger className="group flex w-full items-center justify-between  py-2 text-left hover:no-underline">
                            <span className="text-[#101828] text-lg font-medium leading-7">
                              {faq?.question}
                            </span>

                            <div className="shrink-0">
                              <PlusCircle className="h-6 w-6 text-[#98A2B3] group-data-[state=open]:hidden" />

                              <MinusCircle className="hidden h-6 w-6 text-[#155EEF] group-data-[state=open]:block" />
                            </div>
                          </AccordionPrimitive.Trigger>
                        </AccordionPrimitive.Header>

                        <AccordionPrimitive.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                          <div
                            className="pb-2 text-base font-normal leading-normal text-gray-600"
                            dangerouslySetInnerHTML={{
                              __html: faq?.answer,
                            }}
                          />
                        </AccordionPrimitive.Content>
                      </AccordionPrimitive.Item>
                    ))}
                </Accordion>
              </div>
            </div>

            {packageContact && (
              <div className="self-stretch h-[306px] px-8 flex-col justify-start items-start gap-8 flex">
                <div className="self-stretch h-[306px] px-8 pt-8 pb-10 bg-gray-50 rounded-2xl flex-col justify-start items-center gap-8 flex">
                  <div className="w-[120px] h-14 relative">
                    {packageContact?.images.length > 0 && (
                      <>
                        <div className="w-12 h-12 left-0 top-[8px] absolute rounded-full border border-white justify-center items-center inline-flex">
                          <div className="w-12 h-12 relative rounded-full border border-black/10">
                            <img
                              src={
                                imageUrl +
                                packageContact?.images[0]?.image?.data
                                  ?.attributes.url
                              }
                              alt=""
                            />
                          </div>
                        </div>
                        <div className="w-12 h-12 left-[72px] top-[8px] absolute rounded-full border border-white justify-center items-center inline-flex">
                          <div className="w-12 h-12 relative rounded-full border border-black/10">
                            <img
                              src={
                                imageUrl +
                                packageContact?.images[1]?.image?.data
                                  ?.attributes.url
                              }
                              alt=""
                            />
                          </div>
                        </div>
                        <div className="w-14 h-14 left-[32px] top-0 absolute rounded-full border border-white justify-center items-center inline-flex">
                          <div className="w-14 h-14 relative rounded-full border border-black/10">
                            <img
                              src={
                                imageUrl +
                                packageContact?.images[2]?.image?.data
                                  ?.attributes.url
                              }
                              alt=""
                            />
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="self-stretch h-[66px] flex-col justify-start items-center gap-2 flex">
                    <div className="self-stretch text-center text-[#101828] text-xl font-semibold font-['Inter'] leading-[30px]">
                      {packageContact.title}
                    </div>
                    <div className="self-stretch text-center text-[#475467] text-lg font-normal font-['Inter'] leading-7">
                      {packageContact.sub_title}
                    </div>
                  </div>
                  <div className="justify-start items-start gap-3 inline-flex">
                    <div className="px-[18px] py-3 bg-[#2970fe] rounded-[28px] shadow-[inset_0px_0px_0px_1px_rgba(16,24,40,0.18)] border-2 border-white justify-center items-center gap-1.5 flex overflow-hidden">
                      <div className="px-0.5 justify-center items-center flex">
                        <Link
                          href={packageContact.button.href}
                          className="text-white text-base font-semibold font-['Inter'] leading-normal"
                        >
                          {packageContact.button.label}
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </TabsContent>
    </Tabs>
  );
};

export default PackageTabs;
