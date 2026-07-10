import EnrollNowCart from '@/components/courses/enroll-now';
import LiveCourseCard from '@/components/courses/LiveCourseCard';
import PackageTabs from '@/components/packages/package-tab';
import { imageUrl } from '@/lib/constants';
import { getAllCourses } from '@/services/course';
import { getPackageDetailbByGql, packageDetailPage } from '@/services/package';
import { ArrowBigRight, ChevronRight, MoveRight } from 'lucide-react';
import moment from "moment-timezone";
import Link from 'next/link';

const PackageDetail = async ({ params }: { params: Promise<{ slug: string }> }) => {

    const { slug } = await params;

    let heroImageSection: any;
    let accreditedPartners: any;
    let sponsorship: any;
    let packageContact: any;
    let relatedBlock: any;
    let packageData: any;
    let PackageCourses: any = [];
    let relatedCourses: any = []
    let courseId: string = "";
    let packageOutline: any;
    let faq: any;
    let packageId: string = "";
    let courseCount: number = 0;
    let totalCoursePrice: number = 0;
    let actualPrice: number = 0;
    let hasExpiredCourses: boolean = false;
    let isEmptyPackage: boolean = false;

    const timezone = moment.tz.guess();
    const timezoneAbbrv = moment().tz(timezone).format('z');
    const firstLetter = timezoneAbbrv.charAt(0);
    const lastLetter = timezoneAbbrv.charAt(timezoneAbbrv.length - 1);
    const twoLettertimezone = firstLetter + lastLetter;

    let res = await packageDetailPage()


    function getInstructorName(instructors: any) {
        const name: string[] = []
        instructors.data.forEach((element: any, index: number) => {
            name.push(element?.attributes?.firstName + ' ' + element?.attributes.lastName)
        })

        return name.join(',');
    }

    function emptyPackageCheck() {
        if (courseCount == 0)
            isEmptyPackage = true;
    }

    function getTotalPrice() {
        packageData?.courses?.data?.forEach((element: any) => {
            courseCount = courseCount + 1
            const price = Number(element?.attributes?.discount) > 0 ? Number(element?.attributes?.discount) : element?.attributes?.price
            totalCoursePrice = totalCoursePrice + price
        });
        return totalCoursePrice
    }

    function priceGetter() {
        if (packageData && packageData.price != null && packageData.price != undefined && packageData.price >= 0) {
            actualPrice = packageData.price
        }
        else {
            actualPrice = totalCoursePrice
        }
    }

    function packageExpirationCheck() {
        const filteredArray = packageData?.courses?.data.filter((element: any) => {
            const endDate = new Date(element.attributes.endDate).getTime()
            const currDate = Date.now()

            return (element.attributes?.category?.data?.attributes?.title).toLowerCase() == 'live' && endDate < currDate
        })

        if (filteredArray.length > 0) {
            hasExpiredCourses = true;
        }
    }

    async function getAllRelatedCourses(keywords: string[]) {
        relatedCourses = []

        let res = await getAllCourses();

        console.log(res)

        const coursesArray = res.data.courses.data;

        if (keywords) {
            keywords?.forEach((element: any) => {
                const filteredResult = coursesArray.filter((item: any) => (item?.attributes?.title?.toString().toLowerCase().includes(element.toString().toLowerCase())))

                filteredResult.forEach((element: any, index: number) => {
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
                        }
                    })
                })

                if (filteredResult) {
                    relatedCourses = relatedCourses.filter((item: any, index: number) => relatedCourses.indexOf(item) === index)

                    if (courseId)
                        relatedCourses = relatedCourses.filter((item: any) => item.id != courseId)
                }

            });

        } else {
            relatedCourses = [];
        }
    }

    if (res) {
        heroImageSection = res?.data[0]?.attributes?.blocks.filter((res: { __component: string; }) => res.__component === 'blocks.hero-image-with-button')[0];
        accreditedPartners = res?.data[0]?.attributes?.blocks.filter((res: { __component: string; }) => res.__component === 'blocks.accredited-partners')[0];
        sponsorship = res?.data[0]?.attributes?.blocks.filter((res: { __component: string; }) => res.__component === 'blocks.sponsorship')[0];
        packageContact = res?.data[0]?.attributes?.blocks.filter((res: { __component: string; }) => res.__component === 'blocks.package-contact')[0];
        relatedBlock = res?.data[0]?.attributes?.blocks.filter((res: { __component: string; }) => res.__component === 'blocks.related-block')[0];
    }

    res = await getPackageDetailbByGql(slug);

    if (res?.packages?.data[0]) {
        packageData = res.packages.data[0].attributes;

        if (packageData.keywords) {
            let keywordsArray = packageData.keywords.split(",");

            getAllRelatedCourses(keywordsArray)
        }

        let name = ''
        packageData?.courses?.data.forEach((element: any) => {
            const facultyname = getInstructorName(element?.attributes?.instructors)
            PackageCourses.push(element);
        });
        packageOutline = packageData?.outline
        faq = packageData?.faqs?.faq[0]?.answer
        packageId = res?.packages?.data[0]?.id
    }

    getTotalPrice()
    priceGetter()
    packageExpirationCheck()
    emptyPackageCheck()

    return (
        <>
            <section className="w-[90%] mx-auto">
                <div className="h-[530px] pt-16 pb-8 justify-center items-center gap-24 inline-flex">
                    <div className="w-full grid grid-cols-3 gap-30">
                        <div className="flex-col justify-start items-start gap-12 col-span-2">
                            <div className="flex-col justify-start items-start gap-6 flex">
                                <div className=" flex-col justify-start items-start gap-4 flex">
                                    <div className="justify-start items-center gap-3 inline-flex">
                                        <div className="justify-center items-center flex">
                                            <Link href="/course-catalog"
                                                className="text-[#344054] text-sm font-medium font-['Inter'] leading-tight">Course Catalog</Link>
                                        </div>
                                        <div className="relative  overflow-hidden">
                                            <ChevronRight className='w-4 h-4' />
                                        </div>
                                        <div className="justify-center items-center flex">
                                            <Link href="/bundle-and-subscription"
                                                className="text-[#344054] text-sm font-medium font-['Inter'] leading-tight">Bundles and Subcriptions</Link>
                                        </div>
                                        <div className="relative  overflow-hidden">
                                            <ChevronRight className='w-4 h-4' />
                                        </div>
                                        <div className="justify-center items-center flex">
                                            <div className="text-[#088ab2] text-sm font-semibold font-['Inter'] leading-tight">Tax</div>
                                        </div>
                                    </div>
                                    <div className="self-stretch text-[#101828] text-3xl font-semibold font-['Inter'] leading-[38px]">
                                        {packageData?.title}</div>
                                    <div className="pl-1 pr-2.5 py-1 rounded-full justify-start items-center gap-3 inline-flex">
                                        <div className="text-[#667084] text-base font-semibold font-['Inter'] line-through leading-[38px]">
                                            US${packageData?.price}</div>
                                        <div className="text-[#057647] text-[32px] font-semibold font-['Inter'] leading-[38px]">
                                            US${packageData?.discountedPrice ?? packageData?.price}</div>
                                    </div>
                                </div>
                            </div>
                             <EnrollNowCart
                              course={{ ...packageData, id: packageId }}
                              quantity={1}
                              type="package"
                            />

                            {/* <div className="mt-4 flex-col justify-start items-start gap-3 flex">
                                <div className="justify-start items-center gap-6 inline-flex">
                                    <div className="justify-start items-start gap-3 flex">
                                        <div
                                            className="h-[52px] px-[18px] py-3 bg-[#2970fe] rounded-[28px] border-2 border-white justify-center items-center gap-1.5 flex overflow-hidden">
                                            <div className="px-0.5 justify-center items-center flex">
                                                <button
                                                    className="text-white text-lg cursor-pointer font-semibold font-['Inter'] leading-7">
                                                    {heroImageSection?.button[0]?.label}</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div> */}
                            <div className="self-stretch mt-10 flex-col justify-start items-start gap-5 flex">
                                <div className="self-stretch  flex-col justify-start items-start gap-8 flex">
                                    <div className="self-stretch justify-start items-center gap-5 inline-flex">
                                        <div className="justify-start items-center gap-2 flex">
                                            <div><span className="text-[#475467] text-xl font-normal font-['Inter'] leading-[30px]">
                                                Questions?  </span><span
                                                    className="text-[#db6803] text-xl font-bold font-['Inter'] leading-[30px]">
                                                    <Link href="/contact-us">Contact Us</Link>
                                                </span></div>
                                            <div className=" relative  overflow-hidden">
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
                                        <div></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div
                            className="h-[442px] bg-white rounded-xl shadow-[0px_20px_24px_-4px_rgba(16,24,40,0.08)] flex-col justify-start items-end inline-flex overflow-hidden">
                            <div className="self-stretch h-[147px] px-6 pt-6 flex-col justify-start items-center gap-5 flex">
                                <div className="pr-[9px] pb-1 justify-start items-center inline-flex overflow-hidden">
                                    <div className="w-[343px] h-[119px] border border-[#175cd3]">
                                        <img src={imageUrl + heroImageSection?.backgroundImage?.data?.attributes.url} />
                                    </div>
                                </div>
                            </div>
                            <div className="self-stretch h-60 px-6 pt-6 flex-col justify-start items-center gap-4 flex">
                                <div className="self-stretch h-[216px] flex-col justify-start items-start gap-4 flex">
                                    {
                                        packageData?.key_features.length > 0 && packageData?.key_features.map((list: any, index: number) => (
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
                                                    <div className="self-stretch text-[#475467] text-base font-normal font-['Inter'] leading-normal">
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
            </section>

            <div className='w-[90%] mx-auto mt-10'>
                <PackageTabs packageData={packageData} packageContact={packageContact} />
            </div>

            {accreditedPartners &&
                <section>
                    <div
                        className="w-full py-12 bg-white flex-col justify-start items-center gap-[38px] inline-flex overflow-hidden">
                        <div className="self-stretch h-11 px-8 flex-col justify-start items-start gap-8 flex">
                            <div className="self-stretch h-11 flex-col justify-start items-start gap-8 flex">
                                <div className="self-stretch h-11 flex-col justify-start items-start gap-5 flex">
                                    <div className="container mx-auto">
                                        <div className="self-stretch h-11 flex-col justify-start items-start gap-3 flex">
                                            <div className="self-stretch text-[#101828] text-4xl font-semibold font-['Inter'] leading-[44px]">
                                                {accreditedPartners.title} </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="w-full"
                            style={{
                                backgroundImage: `url( ${imageUrl + accreditedPartners.bg_image.data.attributes.url} )`,
                                backgroundSize: "cover"
                            }}>
                            <div className="h-80 w-full px-1 flex-col justify-start items-center gap-16 flex">
                                <div className="self-stretch h-80 p-16 justify-center items-start gap-8 inline-flex">
                                    {
                                        accreditedPartners.list.length > 0 && accreditedPartners.list.map((list: any, index: number) => (
                                            <div
                                                key={index}
                                                className="w-[180px] h-[142px] px-6 py-8 bg-white/30 rounded-2xl border border-white/30 backdrop-blur-xl flex-col justify-start items-center gap-5 inline-flex">
                                                <img className="self-stretch grow shrink basis-0 w-[100%] h-[100%] object-scale-down"
                                                    src={imageUrl + list.image.data.attributes.url} />
                                            </div>
                                        ))
                                    }

                                </div>
                            </div>
                        </div>

                        {sponsorship &&
                            <div className="w-[80%] mx-auto">
                                <div className="grid grid-cols-6 gap-4">
                                    <div className="py-5  gap-8 col-span-4">
                                        <div className="self-stretch text-[#101828] text-lg font-semibold font-['Inter'] leading-7">{sponsorship.title}
                                        </div>
                                        <div className="self-stretch h-20 px-1 flex-col justify-start items-start gap-8 flex">
                                            <div className=" justify-start items-start inline-flex">
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
                                                                    <div className="self-stretch text-[#475467] text-lg font-normal font-['Inter'] leading-7">{list.value}
                                                                    </div>
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
                                    <div className=" col-span-2 self-stretch px-8 flex-col justify-start items-start gap-8 inline-flex">
                                        <div className="self-stretch justify-center items-start gap-8 inline-flex">
                                            <div
                                                className="grow shrink basis-0 bg-white rounded-2xl  border border-[#e4e7ec] flex-col justify-start items-start inline-flex">
                                                <div className="self-stretch h-[284px] px-8 pt-8 pb-10 flex-col justify-start items-start gap-6 flex">
                                                    <div className="self-stretch h-[212px] flex-col justify-start items-start gap-4 flex">
                                                        {
                                                            sponsorship.features.length > 0 && sponsorship.features.map((feature: any, index: number) => (
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
                                                                        <div className="self-stretch text-[#344054] text-lg font-semibold font-['Inter'] leading-7">
                                                                            {feature.value}
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
                                </div>
                            </div>
                        }

                    </div>
                </section>
            }

            <section className="w-[90%] mx-auto">
                <div className=" py-10 bg-white w-full flex-col justify-start items-center gap-16 inline-flex overflow-hidden">
                    <div className="self-stretch h-[130px] px-8 flex-col justify-start items-start gap-8 flex">
                        <div className="self-stretch h-[130px] flex-col justify-start items-start gap-8 flex">
                            <div className="self-stretch h-[130px] flex-col justify-start items-start gap-5 flex">
                                <div className="self-stretch h-20 flex-col justify-start items-start gap-3 flex">
                                    <div className="self-stretch text-[#6840c6] text-base font-semibold font-['Inter'] leading-normal">Pricing</div>
                                    <div className="self-stretch text-[#101828] text-4xl font-semibold font-['Inter'] leading-[44px]">Your CPE, in
                                        your pocket</div>
                                </div>
                                <div className="self-stretch text-[#475467] text-xl font-normal font-['Inter'] leading-[30px]">Risk free. No
                                    complicated Terms and Conditions</div>
                            </div>
                        </div>
                    </div>
                    <div className="self-stretch h-[530px] px-8 flex-col justify-start items-start gap-8 flex">
                        <div className="self-stretch justify-center items-start gap-8 inline-flex">
                            <div
                                className="grow shrink basis-0 bg-white rounded-2xl  shadow-[0px_12px_16px_-4px_rgba(16,24,40,0.08)] border border-[#e4e7ec] flex-col justify-start items-start inline-flex">
                                <div className="self-stretch h-[174px] px-8 pt-10 flex-col justify-start items-start gap-4 flex">

                                    <div className="text-center text-[#101828] text-5xl font-semibold font-['Inter'] leading-[60px]">$999/Annually
                                    </div>
                                    <div className="self-stretch h-[58px] flex-col justify-start items-start gap-1 flex">
                                        <div className="text-center text-[#101828] text-xl font-semibold font-['Inter'] leading-[30px]"> 2024 Live
                                            Webinar CPE Warehouse Pass</div>
                                        <div className="text-center text-[#475467] text-base font-normal font-['Inter'] leading-normal">Billed
                                            annually.</div>
                                    </div>
                                </div>
                                <div className="self-stretch h-[276px] px-8 pt-8 pb-10 flex-col justify-start items-start gap-6 flex">
                                    <div className="self-stretch h-[204px] flex-col justify-start items-start gap-4 flex">
                                        <div className="self-stretch justify-start items-start gap-3 inline-flex">
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
                                                <div className="self-stretch text-[#475467] text-lg font-normal font-['Inter'] leading-7">One-Year
                                                    All-Access Pass: Full year of access from the date of purchase.</div>
                                            </div>
                                        </div>
                                        <div className="self-stretch justify-start items-start gap-3 inline-flex">
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
                                                <div className="self-stretch text-[#475467] text-lg font-normal font-['Inter'] leading-7">Bundle Bargains:
                                                    Save with bundle deals on multiple courses.</div>
                                            </div>
                                        </div>
                                        <div className="self-stretch justify-start items-start gap-3 inline-flex">
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
                                                <div className="self-stretch text-[#475467] text-lg font-normal font-['Inter'] leading-7">Learn Anytime,
                                                    Anywhere: Courses available 24/7.</div>
                                            </div>
                                        </div>
                                        <div className="self-stretch justify-start items-start gap-3 inline-flex">
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
                                                <div className="self-stretch text-[#475467] text-lg font-normal font-['Inter'] leading-7">Risk-Free
                                                    Investment: Full refund if you're not satisfied.</div>
                                            </div>
                                        </div>
                                        <div className="self-stretch justify-start items-start gap-3 inline-flex">
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
                                                <div className="self-stretch text-[#475467] text-lg font-normal font-['Inter'] leading-7">Lorem Ipsum
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                                <div className="self-stretch h-20 px-8 pb-8 flex-col justify-start items-start gap-6 flex">
                                    <div className="flex-col justify-start items-start gap-3 flex">
                                        <div
                                            className="px-[18px] py-3 bg-[#2970fe] rounded-[28px] shadow-[inset_0px_0px_0px_1px_rgba(16,24,40,0.18)] border-2 border-white justify-center items-center gap-1.5 inline-flex overflow-hidden">
                                            <div className="px-0.5 justify-center items-center flex">
                                                <div className="text-white text-base font-semibold font-['Inter'] leading-normal">Enroll now</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>


            {PackageCourses.length > 0 &&
                <section className="bg-[#f9fafb] py-10">
                    <div className="container w-[90%] mx-auto">

                        <div className="flex-col justify-start items-center gap-8 flex">
                            <div className="flex-col justify-start items-center gap-5 flex">
                                <div className="h-11 flex-col justify-start items-start gap-3 flex">
                                    <div className="text-left text-[#101828] text-4xl font-semibold font-['Inter'] leading-[44px]">
                                        Course Included</div>
                                </div>

                            </div>
                        </div>

                        <div className="w-full my-8">
                            <div className="grid grid-cols-4 gap-6">
                                {
                                    PackageCourses.map((course: any, index: number) => (
                                        <div
                                            key={index}
                                            className="course-container flex flex-col w-full h-full relative rounded-[10px] outline-1 outline-offset-[-1px] outline-sky-300 shadow shadow-sky-500">
                                            <div
                                                className="w-full min-h-[128px] relative bg-gradient-to-t from-cyan-300 to-indigo-600 rounded-[10px] overflow-hidden">
                                                <div className="h-6 w-full  flex-col justify-center items-center inline-flex bg-[#8078d4]">
                                                    <div
                                                        className="w-full h-14 p-4 bg-white/30 border-t border-white/30 backdrop-blur-xl flex-col justify-start items-start gap-6 flex">
                                                        <div className="w-full justify-start items-start gap-6 inline-flex">
                                                            <div className="flex-col justify-start items-center inline-flex mt-2">
                                                                <div className="text-white text-[14px] text-base font-bold font-['Inter'] leading-normal">Credits:
                                                                    {course.attributes?.credit} |
                                                                    {course.attributes?.sub_title}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="ml-4 mt-4 pb-2">
                                                    <div className="flex">

                                                        {
                                                            course.attributes?.instructors.data.length > 0 && course.attributes?.instructors.data.map((instructor: any, index: number) => (
                                                                <img key={index} className="w-12 h-12 mr-2 rounded-[684px] ml[-10px]" src={imageUrl + instructor?.attributes?.image?.data?.attributes?.url} />
                                                            ))
                                                        }


                                                    </div>
                                                    <div className="w-[280px] mt-2 justify-start">
                                                        <div className="flex-col justify-start items-start">
                                                            <div className="text-white text-sm font-semibold font-['Inter'] leading-tight">
                                                                {
                                                                    course.attributes?.instructors.data.length > 0 && course.attributes?.instructors.data.map((instructor: any, index: number) => (
                                                                        <span key={index}>{instructor?.attributes?.firstName} {instructor?.attributes?.lastName}</span>
                                                                    ))
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>

                                            <div className="px-5 h-56 pb-6 mt-4 flex-col justify-start items-start gap-[18px] inline-flex">
                                                <div className="self-stretch justify-start items-start gap-2 inline-flex">

                                                    {
                                                        course.attributes?.category?.data?.attributes?.title === "Live" && <div
                                                            className="pl-2 pr-2.5 py-0.5 bg-[#ecfcf2] rounded-full border border-[#aaefc6] justify-start items-center gap-1.5 flex">
                                                            <div className="w-2 h-2 relative">
                                                                <div className="w-1.5 h-1.5 left-[1px] top-[1px] absolute bg-[#17b169] rounded-full"></div>
                                                            </div>
                                                            <div className="text-center text-[#057647] text-sm font-medium font-['Inter'] leading-tight">Live webinar</div>
                                                        </div>
                                                    }

                                                    <div
                                                        className="px-2.5 py-0.5 bg-pink-50 rounded-full  outline-1 outline-offset-[-1px] outline-pink-200 inline-flex justify-start items-center">
                                                        <div
                                                            className="text-center justify-start text-pink-700 text-sm font-medium font-['Inter'] leading-tight">
                                                            {course?.attributes?.fieldOfStudy}</div>
                                                    </div>

                                                </div>
                                                <div className="self-stretch flex-col justify-start items-start gap-2 flex">
                                                    <Link href={`/course/${course.attributes?.slug}`}>
                                                        <div className="self-stretch text-[#101828] text-lg font-semibold font-['Inter'] leading-7">{course.attributes?.title}</div>
                                                    </Link>
                                                    {
                                                        course.attributes?.category?.data?.attributes?.title !== "Recorded" && <div
                                                            className="self-stretch justify-start text-Colors-Text-text-tertiary-(600) text-sm font-normal font-['Inter'] leading-normal">
                                                            {moment(course.attributes?.startDate.replace("Z", "")).format("dddd MMM d YYYY")} |
                                                            {moment(course.attributes?.startDate.replace("Z", "")).format("h:mm a").toUpperCase()} -
                                                            {moment(course.attributes?.endDate).format("h:mm a").toUpperCase()} {twoLettertimezone || ''}
                                                        </div>
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                </section >
            }
        </>
    )
}

export default PackageDetail