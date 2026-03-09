import CourseCatalog from '@/components/courses/CourseCatalog';
import { imageUrl } from '@/lib/constants';
import { getPageContent } from '@/services/common';
import Link from 'next/link';


const CourseCatalogPage = async () => {

    const res = await getPageContent('course-listing');

    let heroImageSection: any;
    let accreditedPartners: any;
    let otherCourseBanner: any;

    if (res) {
        heroImageSection = res?.data[0]?.attributes?.blocks.filter((res: { __component: string; }) => res.__component === 'blocks.course-catalog-banner')[0];
        accreditedPartners = res?.data[0]?.attributes?.blocks.filter((res: { __component: string; }) => res.__component === 'blocks.accredited-partners')[0];
        otherCourseBanner = res?.data[0]?.attributes?.blocks.filter((res: { __component: string; }) => res.__component === 'blocks.other-course-banner')[0];
    }

    return (
        <>
            <section className="w-[90%] mx-auto">
                <div className="justify-center items-center gap-8 inline-flex">
                    <div className="w-1/2 grow shrink basis-0 flex-col justify-start items-start gap-12 inline-flex">
                        <div className="self-stretch flex-col justify-start items-start gap-6 flex">
                            <div className="self-stretch  flex-col justify-start items-start gap-4 flex">
                                <div className="self-stretch text-[#101828] text-5xl font-semibold font-['Inter'] leading-[72px]">{heroImageSection?.title}</div>
                                <div className="self-stretch  text-[#0f1728] text-xl font-medium font-['Inter'] leading-[30px]">{heroImageSection?.services}</div>
                            </div>
                            <div className="self-stretch text-[#667085] text-xl font-normal font-['Inter'] leading-normal">{heroImageSection?.description}</div>
                        </div>
                    </div>
                    <div className="w-1/2 justify-center items-center flex overflow-hidden">
                        <div className="self-stretch pt-[61px] bg-gradient-to-b flex-col justify-center items-center inline-flex">
                            <div className="p-8">
                                <img src={imageUrl + heroImageSection?.image?.data?.attributes?.url} className="rounded-2xl " alt="" />

                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className='w-[90%] mx-auto'>
                <CourseCatalog />
            </section>

            <section className='w-[90%] mx-auto'>
                <div className="w-full py-12  bg-white flex-col justify-start items-center gap-[38px] inline-flex overflow-hidden">
                    <div className="self-stretch h-11 px-8 flex-col justify-start items-start gap-8 flex mb-8">
                        <div className="self-stretch h-11 flex-col justify-start items-start gap-8 flex">
                            <div className="self-stretch h-11 flex-col justify-start items-start gap-5 flex">
                                <div className="container mx-auto">
                                    <div className="self-stretch h-11 flex-col justify-start items-start gap-3 flex">
                                        <div className="self-stretch text-[#101828] text-4xl text-center font-semibold font-['Inter'] leading-[44px]">{accreditedPartners?.title}</div>
                                        <div className="self-stretch text-[#667085] text-center text-xl font-normal font-['Inter'] leading-normal">{accreditedPartners?.description}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="w-full" style={
                        {
                            backgroundImage: `url('${imageUrl + accreditedPartners?.bg_image?.data?.attributes?.url}')`,
                            backgroundSize: "cover"
                        }
                    }>
                        <div className="h-80 w-full px-1 flex-col justify-start items-center gap-16 flex">
                            <div className="self-stretch h-80 p-16 justify-center items-start gap-8 inline-flex">
                                {
                                    accreditedPartners.list.length > 0 && accreditedPartners.list.map((l: any, index: number) => (
                                        <div className="w-[180px] h-[142px] px-6 py-8 bg-white/30 rounded-2xl border border-white/30 backdrop-blur-xl flex-col justify-start items-center gap-5 inline-flex" key={index}>
                                            <img className="self-stretch grow shrink basis-0 w-[100%] h-[100%] object-scale-down" src={imageUrl + l?.image?.data?.attributes?.url} />
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className='w-[90%] mx-auto'>
                <div className="h-[338px] w-full pb-24 bg-white flex-col justify-center items-center inline-flex overflow-hidden">
                    <div className="self-stretch h-[242px] flex-col justify-start items-start gap-8 flex">
                        <div className="self-stretch p-16 bg-gradient-to-tr from-[#a6c0fe] to-[#ffeaf6] rounded-2xl justify-start items-start gap-8 inline-flex">
                            <div className="grow shrink  basis-0 flex-col justify-start items-start gap-4 inline-flex">
                                <div className="self-stretch text-[#101828] text-3xl font-semibold font-['Inter'] leading-[38px]">
                                    {otherCourseBanner?.title}
                                </div>
                                <div className="self-stretch text-[#475467] text-xl font-normal font-['Inter'] leading-[30px]">
                                    {otherCourseBanner?.description}
                                </div>
                            </div>
                            <div className="justify-start items-start gap-3 flex">
                                <div className="px-[18px] py-3 bg-white rounded-lg shadow-[inset_0px_0px_0px_1px_rgba(16,24,40,0.18)] border border-[#155dee] justify-center items-center gap-1.5 flex overflow-hidden">
                                    <div className="px-0.5 justify-center items-center flex">
                                        <Link href={otherCourseBanner?.button?.href} className="text-[#155dee] text-lg font-semibold font-['Inter'] leading-7">
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

export default CourseCatalogPage