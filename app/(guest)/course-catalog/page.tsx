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
            <section className="mx-auto w-[calc(100%-1rem)] sm:w-[90%]">
                <div className="grid grid-cols-1 items-center gap-8  md:grid-cols-2">
                    <div className="flex min-w-0 flex-col items-start gap-8 md:gap-12">
                        <div className="flex w-full flex-col items-start gap-6">
                            <div className="flex w-full flex-col items-start gap-4">
                                <div className="w-full text-3xl font-semibold leading-tight text-[#101828] sm:text-5xl sm:leading-[72px]">{heroImageSection?.title}</div>
                                <div className="w-full text-lg font-medium leading-7 text-[#0f1728] sm:text-xl sm:leading-[30px]">{heroImageSection?.services}</div>
                            </div>
                            <div className="w-full text-lg font-normal leading-7 text-[#667085] sm:text-xl">{heroImageSection?.description}</div>
                        </div>
                    </div>
                    <div className="flex w-full justify-center overflow-hidden">
                        <div className="w-full max-w-3xl bg-gradient-to-b pt-8 sm:pt-[61px]">
                            <div className="p-4 sm:p-8">
                                <img src={imageUrl + heroImageSection?.image?.data?.attributes?.url} className="h-auto w-full rounded-2xl object-contain" alt="" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="mx-auto w-[calc(100%)] sm:w-[90%]"><CourseCatalog /></section>

            <section className="mx-auto w-[calc(100%)] sm:w-[90%]">
                <div className="flex w-full flex-col items-center gap-10 overflow-hidden bg-white py-10 sm:gap-[38px] sm:py-12">
                    <div className="w-full px-0 sm:px-8">
                        <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-3">
                            <div className="w-full text-center text-3xl font-semibold leading-tight text-[#101828] sm:text-4xl sm:leading-[44px]">{accreditedPartners?.title}</div>
                            <div className="w-full text-center text-lg font-normal leading-7 text-[#667085] sm:text-xl">{accreditedPartners?.description}</div>
                        </div>
                    </div>
                    <div className="w-full bg-cover bg-center" style={{ backgroundImage: `url('${imageUrl + accreditedPartners?.bg_image?.data?.attributes?.url}')` }}>
                        <div className="w-full px-4 py-8 sm:px-8 sm:py-12">
                            <div className="grid w-full grid-cols-2 items-center justify-items-center gap-4 sm:grid-cols-3 sm:gap-8 lg:flex lg:justify-center">
                                {accreditedPartners?.list.length > 0 && accreditedPartners.list.map((l: any, index: number) => (
                                    <div className="flex h-28 w-full max-w-[180px] items-center justify-center rounded-2xl border border-white/30 bg-white/30 p-4 backdrop-blur-xl sm:h-[142px] sm:p-6" key={index}>
                                        <img className="h-full w-full object-contain" src={imageUrl + l?.image?.data.attributes?.url} alt="" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="mx-auto w-[calc(100%)] sm:w-[90%]">
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

export default CourseCatalogPage