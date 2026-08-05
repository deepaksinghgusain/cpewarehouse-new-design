import { Clock2, Mail, Phone } from 'lucide-react'
import Image from 'next/image'

const page = () => {
    return (
        <>
            <section className="w-[90%] mx-auto">
                <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] items-center">
                    <div className="rounded-[32px] bg-white p-8">
                        <div className="">
                            <p className="text-lg font-bold text-slate-900 text-[36px]">Contact us</p>
                            <h1 className="mt-3 text-slate-950">Our team would love to hear from you.</h1>
                        </div>

                        <form className="mt-4 space-y-6">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <label className="space-y-2 text-sm font-medium text-slate-700">
                                    First name *
                                    <input
                                        type="text"
                                        placeholder="First name"
                                        className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    />
                                </label>
                                <label className="space-y-2 text-sm font-medium text-slate-700">
                                    Last name *
                                    <input
                                        type="text"
                                        placeholder="Last name"
                                        className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    />
                                </label>
                            </div>

                            <label className="space-y-2 text-sm font-medium text-slate-700">
                                Email *
                                <input
                                    type="email"
                                    placeholder="you@company.com"
                                    className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                />
                            </label>

                            <div className="grid gap-4 mt-4 space-y-2">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">
                                        Phone Number
                                    </label>
                                    <div className="flex items-center gap-3 rounded-2xl border border-slate-300 bg-white px-3 py-2">
                                        <select className="w-18 rounded-xl border border-transparent bg-transparent text-sm text-slate-900 outline-none focus:border-transparent focus:outline-none">
                                            <option>US</option>
                                            <option>CA</option>
                                            <option>UK</option>
                                        </select>
                                        <input
                                            type="tel"
                                            placeholder="+1 (555) 000-0000"
                                            className="flex-1 bg-transparent text-base text-slate-900 outline-none"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">
                                        Select the question category
                                    </label>
                                    <select className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
                                        <option>Question about a self-study course</option>
                                        <option>Question about bundle and subscription</option>
                                        <option>Question about instructor</option>
                                        <option>Other</option>
                                    </select>
                                </div>
                            </div>

                            <label className="space-y-2 text-sm font-medium text-slate-700">
                                Message *
                                <textarea
                                    placeholder="Leave us a message..."
                                    rows={6}
                                    className="w-full resize-none rounded-2xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                />
                            </label>

                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <label className="flex items-center gap-3 text-sm text-slate-700">
                                    <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                                    <span>
                                        You agree to CPE Warehouse&apos;s{' '}
                                        <a href="#" className="font-semibold text-blue-600 underline">
                                            Privacy Policy
                                        </a>
                                    </span>
                                </label>
                            </div>
                            <button
                                type="submit"
                                className="inline-flex h-12 w-full items-center justify-center rounded-2xl bg-blue-600 px-8 text-base font-semibold text-white transition hover:bg-blue-700"
                            >
                                Send message
                            </button>
                        </form>
                    </div>

                    <div className="relative h-[580px] overflow-hidden rounded-[32px] bg-slate-50 shadow-[0_20px_60px_-20px_rgba(15,23,42,0.08)] lg:h-[680px]">
                        <Image
                            src="/assets/images/contact-banner-1.png"
                            alt="Contact support illustration"
                            fill
                            sizes="(max-width: 1024px) 100vw, 560px"
                            className="object-cover"
                        />
                    </div>
                </div>
            </section>
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