import React, { AnyActionArg } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger, } from '../ui/tabs'
import { imageUrl } from '@/lib/constants'
import Image from 'next/image'
import { Button } from '../ui/button'

const PackageTab = ({ packageData }: any) => {

    return (
        <Tabs defaultValue="outline" className="w-full bg-transparent mb-10 ">
            <TabsList variant="line" className="w-[400px] bg-transparent ">
                <TabsTrigger
                    value="outline"
                    className="text-2xl font-bold cursor-pointer hover:text-blue-500 hover:after:bg-blue-500 hover:after:opacity-100 font-['Inter'] leading-loose  data-[state=active]:text-blue-500 data-[state=active]:after:bg-blue-500"
                >
                    Outline
                </TabsTrigger>
                <TabsTrigger
                    value="FAQ"
                    className="text-2xl font-bold cursor-pointer hover:text-blue-500 hover:after:bg-blue-500 hover:after:opacity-100 font-['Inter'] leading-loose  data-[state=active]:text-blue-500 data-[state=active]:after:bg-blue-500"
                >
                    FAQ
                </TabsTrigger>
            </TabsList>
            <TabsContent value="outline">
                <div className="grid grid-cols-2 gap-4 my-10">
                    <div>
                        <h3 >{packageData?.desc}</h3>
                        <div className="mt-4 mb-4">
                            <Image alt="packageimage" src={imageUrl + packageData?.image?.data?.attributes?.url}
                                width={500}
                                height={300}
                            />
                            <Button variant="default" className="bg-green-800 hover:bg-green-800 text-white p-5 mt-10">
                                Package deal
                            </Button>
                        </div>
                    </div>
                    <div>
                        <div className="text-[#475467] text-[18px] font-normal font-['Inter']"
                            dangerouslySetInnerHTML={{ __html: packageData?.outline }} ></div>
                    </div>

                </div>
            </TabsContent>
            <TabsContent value="FAQ">
                <div className="package-course-items padding-distance-md">
                    <h3 className="heading-sm   font-barlow">{packageData?.faqs?.faq[0]?.question}</h3>
                    <div className="row">

                        <div className="col-sm-12 ">
                            <div className="package-deal-right-content">

                                <div className="about-list faq mt-3 ml-5">
                                    <div className="text-[#475467] text-[18px] font-normal font-['Inter']"
                                        dangerouslySetInnerHTML={{ __html: packageData?.faqs?.faq[0]?.answer }} ></div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </TabsContent>
        </Tabs >
    )
}

export default PackageTab