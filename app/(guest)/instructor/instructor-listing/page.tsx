import { getInstructorsForHome } from '@/services/faculty'
import Link from 'next/link'
import FacultySection from './instructor-detail-popup'

const IntructorListingPage = async () => {
    const res = await getInstructorsForHome()

    return (
        <>
            <section className="container mx-auto mt-8 flex justify-center px-4 sm:mt-10 sm:px-6">
                <div className="inline-flex w-full max-w-4xl flex-col items-center justify-start gap-6 sm:gap-8">
                    <div className="flex w-full flex-col items-center justify-start gap-4 sm:gap-5">
                        <div className="self-stretch flex flex-col justify-start items-start gap-3">
                            <div className="self-stretch text-center justify-start text-[#004EEA] text-base font-semibold font-['Inter'] leading-normal">Faculty</div>
                            <div className="self-stretch text-center justify-start text-Colors-Text-text-primary-(900) text-3xl font-semibold font-['Inter'] leading-tight sm:text-4xl sm:leading-10">Meet Our Top-Rated Faculty</div>
                        </div>
                        <div className="self-stretch text-center justify-start text-[#475467] text-base sm:text-lg font-normal font-['Inter'] leading-relaxed sm:leading-loose">CPE Warehouse is committed to providing a seamless and exceptional continuing education experience for finance and accounting professionals. Our courses are instructed by leading finance professionals across Canada and the U.S.</div>
                    </div>
                    <div className="inline-flex w-full flex-col items-stretch justify-start gap-3 sm:w-auto sm:flex-row sm:items-start">
                        <Link href="/about-us" className="inline-flex w-full items-center justify-center rounded-lg px-4 py-3 text-base font-semibold text-Component-colors-Components-Buttons-Secondary-button-secondary-fg shadow-[inset_0px_0px_0px_1px_rgba(16,24,40,0.18)] outline outline-1 outline-offset-[-1px] outline-[#DOD5DD] sm:w-auto">About us</Link>
                        <Link href="/course-catalog" className="inline-flex w-full items-center justify-center rounded-3xl bg-[#444CE6] px-4 py-3 text-base font-semibold text-white shadow-[inset_0px_0px_0px_1px_rgba(16,24,40,0.18)] outline outline-2 outline-offset-[-2px] outline-white/10 sm:w-auto">Explore Course Catalouge</Link>
                    </div>
                </div>
            </section>

            <FacultySection res={res} />
        </>
    )
}

export default IntructorListingPage