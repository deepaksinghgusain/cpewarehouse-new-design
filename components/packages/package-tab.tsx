import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { imageUrl } from '@/lib/constants'
import Link from 'next/link'
import { Accordion } from '../ui/accordion'
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { PlusCircle, MinusCircle } from "lucide-react";


const PackageTabs = ({ packageData, packageContact }: any) => {
    return (
        <Tabs defaultValue="Inclusions" className="w-full bg-transparent ">
            <TabsList variant="line" className='w-full bg-transparent '>
                <TabsTrigger value="Inclusions" className="text-2xl font-bold cursor-pointer hover:text-blue-500 hover:after:bg-blue-500 hover:after:opacity-100 font-['Inter'] leading-loose  data-[state=active]:text-blue-500 data-[state=active]:after:bg-blue-500">Inclusions</TabsTrigger>
                <TabsTrigger value="CPE Info" className="text-2xl font-bold cursor-pointer hover:text-blue-500 hover:after:bg-blue-500 hover:after:opacity-100 font-['Inter'] leading-loose  data-[state=active]:text-blue-500 data-[state=active]:after:bg-blue-500">CPE Info</TabsTrigger>
                <TabsTrigger value="FAQ" className="text-2xl font-bold cursor-pointer hover:text-blue-500 hover:after:bg-blue-500 hover:after:opacity-100 font-['Inter'] leading-loose  data-[state=active]:text-blue-500 data-[state=active]:after:bg-blue-500">FAQ</TabsTrigger>
            </TabsList>
            <TabsContent value="Inclusions">
                <div className=" w-full mt-10 bg-white flex-col justify-start items-center gap-16 inline-flex overflow-hidden">
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

                                {
                                    packageData.inclusion[0].list.length && packageData.inclusion[0].list.map((list: any, index: number) => (
                                        <div className="self-stretch justify-start items-start gap-4 inline-flex" key={index}>
                                            <div
                                                className="w-12 h-12 p-3  justify-center items-center flex overflow-hidden">
                                                <div className="w-6 h-6 relative flex-col justify-start items-start flex overflow-hidden">
                                                    <img src={imageUrl + list.icon.data.attributes.url} alt="" />
                                                </div>
                                            </div>
                                            <div className="grow shrink basis-0 flex-col justify-start items-start gap-5 inline-flex">
                                                <div className="self-stretch h-[188px] pt-2.5 flex-col justify-start items-start gap-2 flex">
                                                    <div className="self-stretch text-[#101828] text-xl font-semibold font-['Inter'] leading-[30px] ">
                                                        {list.title}
                                                    </div>
                                                    <div className="self-stretch">
                                                        <ul
                                                            className="text-[#475467] self-stretch justify-start text-Colors-Text-text-tertiary-(600) text-lg font-normal font-['Inter'] leading-7 decoration-dotted">

                                                            {
                                                                list.item.length > 0 && list.item.map((item: any, index: number) => (
                                                                    <li key={index}>{item.value}</li>
                                                                ))
                                                            }


                                                        </ul>

                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                }

                            </div>
                        </div>
                        <div className="pl-16 justify-end items-center flex col-span-2">
                            <div
                                className="w-[1024px] h-[682px] relative rounded-xl border-4 border-[#101828] flex-col justify-start items-start flex">
                                <img className="w-[1024px] h-[682px] relative rounded-xl"
                                    src={imageUrl + packageData.inclusion[0].image.data.attributes.url} />
                            </div>
                        </div>
                    </div>
                </div>
            </TabsContent>
            <TabsContent value="CPE Info">
                <div
                    className="w-full py-24 bg-Colors-Background-bg-primary inline-flex flex-col justify-start items-center gap-16 overflow-hidden text-[#475467]">
                    <div className="w-full  px-8 inline-flex justify-start items-start gap-16 flex-wrap content-start">
                        <div className="flex-1 inline-flex flex-col justify-start items-start gap-8">
                            <div className="w-full flex flex-col justify-start items-start gap-5" dangerouslySetInnerHTML={{ __html: packageData.cpe_info }}>

                            </div>
                        </div>
                    </div>
                </div>
            </TabsContent>
            <TabsContent value="FAQ">
                <section className="container mx-auto">
                    <div className="w-full py-10 bg-white flex-col justify-start items-center gap-16 inline-flex overflow-hidden">
                        <div className="self-stretch h-[94px] px-8 flex-col justify-start items-start gap-8 flex">
                            <div className="self-stretch h-[94px] flex-col justify-start items-center gap-8 flex">
                                <div className="self-stretch h-[94px] flex-col justify-start items-center gap-5 flex">
                                    <div className="self-stretch text-center text-[#101828] text-4xl font-semibold font-['Inter'] leading-[44px]">
                                        {packageData.faqs.title}</div>
                                    <div className="self-stretch text-center text-[#475467] text-xl font-normal font-['Inter'] leading-[30px]">
                                        {packageData.faqs?.sub_title}</div>
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

                                    {
                                        packageData?.faqs.faq.length > 0 && packageData?.faqs.faq.map((faq: any, index: number) => (
                                            <AccordionPrimitive.Item
                                                key={index}
                                                value={`item-${index}`}
                                                className="border-b border-gray-200 last:border-b-0"
                                            >
                                                <AccordionPrimitive.Header className="w-full">
                                                    <AccordionPrimitive.Trigger
                                                        className="group flex w-full items-center justify-between  py-2 text-left hover:no-underline"
                                                    >
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

                                        ))
                                    }
                                </Accordion>
                            </div>
                        </div>

                        {
                            packageContact && <div className="self-stretch h-[306px] px-8 flex-col justify-start items-start gap-8 flex">
                                <div
                                    className="self-stretch h-[306px] px-8 pt-8 pb-10 bg-gray-50 rounded-2xl flex-col justify-start items-center gap-8 flex">
                                    <div className="w-[120px] h-14 relative">
                                        {
                                            packageContact?.images.length > 0 && <>
                                                <div
                                                    className="w-12 h-12 left-0 top-[8px] absolute rounded-full border border-white justify-center items-center inline-flex">
                                                    <div className="w-12 h-12 relative rounded-full border border-black/10">
                                                        <img src={imageUrl + packageContact?.images[0]?.image?.data?.attributes.url} alt="" />
                                                    </div>
                                                </div>
                                                <div
                                                    className="w-12 h-12 left-[72px] top-[8px] absolute rounded-full border border-white justify-center items-center inline-flex">
                                                    <div className="w-12 h-12 relative rounded-full border border-black/10">
                                                        <img src={imageUrl + packageContact?.images[1]?.image?.data?.attributes.url} alt="" />
                                                    </div>
                                                </div>
                                                <div
                                                    className="w-14 h-14 left-[32px] top-0 absolute rounded-full border border-white justify-center items-center inline-flex">
                                                    <div className="w-14 h-14 relative rounded-full border border-black/10">
                                                        <img src={imageUrl + packageContact?.images[2]?.image?.data?.attributes.url} alt="" />
                                                    </div>
                                                </div>
                                            </>
                                        }

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
                                        <div
                                            className="px-[18px] py-3 bg-[#2970fe] rounded-[28px] shadow-[inset_0px_0px_0px_1px_rgba(16,24,40,0.18)] border-2 border-white justify-center items-center gap-1.5 flex overflow-hidden">
                                            <div className="px-0.5 justify-center items-center flex">
                                                <Link href={packageContact.button.href}
                                                    className="text-white text-base font-semibold font-['Inter'] leading-normal">
                                                    {packageContact.button.label}
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        }

                    </div>
                </section>
            </TabsContent>
        </Tabs >
    )
}

export default PackageTabs