import { Clock2, Mail, Phone } from 'lucide-react'
import Image from 'next/image'
import ContactForm from './contact-form'

const page = () => {
    return (
        <>
            <ContactForm />
            <section className="bg-[#eef4ff] py-16">
                <div className="w-[90%] mx-auto space-y-12">
                    <div className="grid gap-12 grid-col-1 items-start">
                        <div className="space-y-4">
                            <p className="text-2xl font-semibold text-slate-950">Loop us in</p>
                            <p className="max-w-2xl leading-7 text-slate-600">
                                Our team is always here to chat from Monday to Friday <span className="font-semibold text-slate-900">8am to 5pm ET</span>.
                                We are closed on <span className="font-semibold text-slate-900">US Holidays and weekends</span> but don&apos;t worry our bots don&apos;t sleep.
                            </p>
                        </div>

                        <div className="grid gap-5 sm:grid-cols-3">
                            <div className="rounded-[24px] border border-white bg-white/90 p-6 shadow-[0_12px_40px_-20px_rgba(15,23,42,0.2)]">
                                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-sm">
                                    <Clock2 className="h-5 w-5" />
                                </div>
                                <p className="mt-6 text-xl font-semibold text-slate-950">Social Media</p>
                                <p className="mt-2 text-sm text-slate-500">Connect with us</p>
                                <div className="mt-4 flex items-center gap-3 text-slate-700">
                                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">in</span>
                                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">IG</span>
                                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">f</span>
                                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">x</span>
                                </div>
                            </div>

                            <div className="rounded-[24px] border border-white bg-white/90 p-6 shadow-[0_12px_40px_-20px_rgba(15,23,42,0.2)]">
                                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-sm">
                                    <Mail className="h-5 w-5" />
                                </div>
                                <p className="mt-6 text-xl font-semibold text-slate-950">Email us</p>
                                <p className="mt-2 text-sm text-slate-500">The carrier pigeons are idle</p>
                                <p className="mt-4 text-sm font-semibold text-slate-900">cpe@cpewarehouse.com</p>
                            </div>

                            <div className="rounded-[24px] border border-white bg-white/90 p-6 shadow-[0_12px_40px_-20px_rgba(15,23,42,0.2)]">
                                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-sm">
                                    <Phone className="h-5 w-5" />
                                </div>
                                <p className="mt-6 text-xl font-semibold text-slate-950">Call us</p>
                                <p className="mt-2 text-sm text-slate-500">Speak to a human</p>
                                <p className="mt-4 text-sm font-semibold text-slate-900">+1 (437) 291-1446</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-5 xl:grid-cols-2">
                        <div className="group relative overflow-hidden border border-white bg-white shadow-[0_20px_60px_-20px_rgba(15,23,42,0.2)]">
                            <Image
                                src="/assets/images/about-banner-1.jpg"
                                alt="Washington DC headquarters"
                                width={1200}
                                height={760}
                                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-x-0 bottom-0 bg-slate-950/30 backdrop-blur border-t border-white/20 px-8 py-10 text-white">
                                <p className="text-xl font-semibold">Washington DC</p>
                                <p className="mt-3 text-sm text-slate-200">1717 Pennsylvania Ave NW Suite</p>
                                <p className="text-sm text-slate-200">1025 Washington, DC 20006, USA</p>
                            </div>
                        </div>

                        <div className="group relative overflow-hidden border border-white bg-white shadow-[0_20px_60px_-20px_rgba(15,23,42,0.2)]">
                            <Image
                                src="/assets/images/about-banner-2.jpg"
                                alt="Toronto headquarters"
                                width={1200}
                                height={760}
                                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-x-0 bottom-0 bg-slate-950/30 backdrop-blur border-t border-white/20 px-8 py-10 text-white">
                                <p className="text-xl font-semibold">Toronto - Headquarters</p>
                                <p className="mt-3 text-sm text-slate-200">Suite 207, 180 John st Toronto,</p>
                                <p className="text-sm text-slate-200">ON M5T 1X5, Canada</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="bg-white py-16">
                <div className="w-[90%] mx-auto rounded-[10px] bg-slate-100 p-16 text-center shadow-[0_20px_60px_-20px_rgba(15,23,42,0.18)]">
                    <h2 className="text-4xl font-semibold text-slate-950">Tongue-tied?</h2>
                    <p className="mt-4 text-lg leading-8 text-slate-600">
                        Ask us about creating a customized/tailored CPE Solution for your firm
                    </p>
                    <p className="mt-6 text-lg font-medium text-slate-900">
                        Call Us at <span className="font-semibold text-slate-950">+1 (437) 291-1446</span>
                    </p>
                </div>
            </section>
        </>
    )
}

export default page