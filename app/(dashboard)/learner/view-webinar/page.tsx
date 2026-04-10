import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { imageUrl } from '@/lib/constants';
import { ArrowLeft, Award, BadgeCheck, Bell, Check, Download, FileText, Mail, Monitor, Phone, Play, Settings, Star, ThumbsUp } from 'lucide-react'
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaXTwitter } from 'react-icons/fa6'
import React from 'react'

const ViewWebinar = () => {
    const materials = [
        "Handout",
        "Forms (if applicable)",
        "Glossary of Terms",
        "Table of Contents",
    ];
    const programMaterials = [
        "CPE Certificate",
        "Forms (if applicable)",
        "Glossary of Terms",
        "Table Of Contents",
    ];
    const faqItems = [
        "What is this service about?",
        "How can I sign up?",
        "What payment methods are accepted?",
        "Can I cancel my subscription anytime?",
    ];

    return (
        <div className='mx-8'>
            <div className="inline-flex items-center border w-full bg-violet-100 px-4 py-2 gap-2 text-violet-700 font-semibold text-base cursor-pointer">
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Dashboard</span>
            </div>
            <div className="flex flex-col gap-5 w-full mt-4">
                <div className="flex flex-col gap-4">
                    <div className="flex items-start gap-4">
                        <div className="flex-1">
                            <h1 className="text-gray-900 text-xl font-semibold leading-8">
                                Self-Study
                            </h1>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-4 flex gap-6 text-lg font-semibold w-full">
                <Tabs defaultValue="overview" className=" bg-transparent w-full">
                    <TabsList variant="line" className='w-1/3 bg-transparent'>
                        <TabsTrigger value="overview" className="text-xl  font-bold cursor-pointer hover:text-blue-500 hover:after:bg-blue-500 hover:after:opacity-100 font-['Inter'] leading-loose  data-[state=active]:text-blue-500 data-[state=active]:after:bg-blue-500">Overview</TabsTrigger>
                        <TabsTrigger value="final-exam" className="text-xl font-bold cursor-pointer hover:text-blue-500 hover:after:bg-blue-500 hover:after:opacity-100 font-['Inter'] leading-loose  data-[state=active]:text-blue-500 data-[state=active]:after:bg-blue-500">Final Exam</TabsTrigger>
                        <TabsTrigger value="faq" className="text-xl font-bold cursor-pointer hover:text-blue-500 hover:after:bg-blue-500 hover:after:opacity-100 font-['Inter'] leading-loose  data-[state=active]:text-blue-500 data-[state=active]:after:bg-blue-500">Faq</TabsTrigger>
                    </TabsList>
                    <TabsContent value="overview">
                        <div className="w-full rounded-2xl bg-gray-100 p-6 shadow-sm">
                            <div className="flex flex-col gap-5 md:flex-row md:items-center">
                                <div className="w-full max-w-[210px] rounded-2xl border-[6px] border-violet-300 bg-white p-2 shadow-[0_10px_24px_rgba(148,107,255,0.28)]">
                                    <img
                                        src="https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=600&q=80"
                                        alt="Taxation of Canadians in the U.S.A webinar"
                                        className="h-[120px] w-full rounded-xl object-cover"
                                    />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <h3 className="text-2xl font-bold leading-tight text-slate-900">
                                        Taxation Of Canadians In The U.S.A
                                    </h3>
                                    <p className="font-semibold leading-none text-amber-600">
                                        1.03 % Complete...keep it going!
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                            <div className="rounded-2xl bg-gray-100 px-8 py-7 shadow-sm ring-1 ring-black/5">
                                <div className="flex h-full gap-5">
                                    <Bell className="h-30 w-30 text-fuchsia-400 -rotate-10" strokeWidth={1.6} />
                                    <div className="space-y-3">
                                        <h3 className="text-xl font-semibold leading-none text-slate-900">
                                            Enable Popup
                                        </h3>
                                        <p className="text-slate-700">
                                            Please enable pop-ups in your browser when watching this program.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-2xl bg-gray-100 px-8 py-7 shadow-sm ring-1 ring-black/5">
                                <div className="flex h-full gap-5">
                                    <FileText className="h-30 w-30 text-fuchsia-400" strokeWidth={1.6} />
                                    <div className="space-y-3">
                                        <h3 className="text-xl font-semibold leading-none text-slate-900">
                                            Taking the Test
                                        </h3>
                                        <p className="text-slate-700">
                                            You must score at least 70% on the final exam to obtain a CPE certificate.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-2xl bg-gray-100 px-8 py-7 shadow-sm ring-1 ring-black/5">
                                <div className="flex h-full gap-5">
                                    <BadgeCheck className="h-30 w-30 text-fuchsia-400" strokeWidth={1.6} />
                                    <div className="space-y-3">
                                        <h3 className="text-xl font-semibold leading-none text-slate-900">
                                            CPE Certificate
                                        </h3>
                                        <p className="text-slate-700">
                                            Once you complete the final exam, your CPE certificate will be available for download.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <section className="mt-8 rounded-2xl border border-gray-200 bg-gray-100 p-4 shadow-sm md:p-6">
                            <div className="grid gap-6 xl:grid-cols-[1.7fr_0.8fr]">
                                <div className="overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-400 via-violet-300 to-pink-200 p-1.5 shadow-sm">
                                    <div className="h-full rounded-xl bg-black/80 p-0.5">
                                        <div className="grid h-full grid-cols-[84px_1fr]">
                                            <div className="border-r border-black bg-black">
                                                <div className="h-[110px] border-b border-zinc-800 bg-zinc-900"></div>
                                                <div className="h-[110px] border-b border-zinc-800 bg-zinc-900"></div>
                                                <div className="h-[110px] bg-zinc-900"></div>
                                            </div>

                                            <div className="bg-white/95">
                                                <div className="h-9 bg-black"></div>
                                                <div className="relative h-[330px] overflow-hidden bg-slate-100">
                                                    <div className="absolute left-0 top-0 h-full w-[38%] bg-[#314886]"></div>
                                                    <div className="absolute left-[20%] top-0 h-full w-[16%] -skew-x-[20deg] bg-[#5f7fd1]"></div>
                                                    <div className="absolute right-[15%] top-0 h-full w-[45%] -skew-x-[22deg] bg-gray-200"></div>

                                                    <button className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-2xl border-2 border-white/80 bg-slate-600/30 px-7 py-5 text-white backdrop-blur-sm">
                                                        <Play className="h-7 w-7 fill-white text-white" />
                                                    </button>

                                                    <div className="absolute left-1/2 top-[53%] -translate-x-1/2 text-center">
                                                        <p className="text-[22px] font-semibold leading-tight text-[#344d84]">
                                                            Taxation of Canadians
                                                        </p>
                                                        <p className="text-[22px] font-semibold leading-tight text-[#344d84]">
                                                            in America
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="h-9 bg-black"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <aside className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                                    <div className="mb-5 flex items-center justify-between gap-1">
                                        <h3 className="font-semibold text-slate-900">Program Material</h3>
                                        <button className="inline-flex items-center gap-2 rounded-full border border-indigo-300 px-4 py-2 font-medium text-indigo-600 hover:bg-indigo-50">
                                            <Download className="h-5 w-5" />
                                            Download
                                        </button>
                                    </div>

                                    <div className="space-y-4">
                                        {programMaterials.map((item) => (
                                            <div key={item} className="flex items-center gap-3 rounded-xl bg-gray-100 p-4">
                                                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400 text-white">
                                                    <Check className="h-4 w-4" />
                                                </span>
                                                <span className="text-slate-700">{item}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <button className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-slate-400 px-6 py-4 font-semibold text-white hover:bg-slate-500">
                                        <Download className="h-5 w-5 text-amber-300" />
                                        Download Certificate
                                    </button>
                                </aside>
                            </div>
                        </section>

                        <section className="mt-8 mb-4 rounded-none bg-[#e9ecf6] px-6 py-10 md:px-12">
                            <div className="mx-auto max-w-7xl">
                                <div className="mx-auto max-w-4xl text-center">
                                    <h2 className="text-2xl font-bold text-slate-900">Loop us in</h2>
                                    <p className="mt-4 leading-relaxed text-slate-700">
                                        Our team is here to chat from Monday to Friday <strong>8am to 5pm</strong> ET. Closed on <strong>US Holidays and weekends.</strong>
                                    </p>
                                </div>

                                <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
                                    <div className="rounded-2xl bg-white text-center p-8 shadow-sm ring-1 ring-black/5">
                                        <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500 text-white">
                                            <Settings className="h-6 w-6" />
                                        </span>
                                        <h3 className="mt-5 text-xl font-bold text-slate-900">Social Media</h3>
                                        <p className="mt-2 text-slate-700">Connect with us</p>
                                        <div className="mt-4 flex justify-center items-center gap-4 text-indigo-600">
                                            <FaLinkedinIn className="h-8 w-8 text-white bg-indigo-500 p-2" />
                                            <FaInstagram className="h-5 w-5" />
                                            <FaFacebookF className="h-8 w-8 text-white bg-indigo-500 p-2 rounded-full" />
                                            <FaXTwitter className="h-5 w-5" />
                                        </div>
                                    </div>

                                    <div className="rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-black/5">
                                        <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500 text-white">
                                            <Mail className="h-6 w-6" />
                                        </span>
                                        <h3 className="mt-5 text-xl font-bold text-slate-900">Email us</h3>
                                        <p className="mt-2  text-slate-700">The carrier pigeons are idle</p>
                                        <p className="mt-3  font-semibold text-slate-700">cpe@cpewarehouse.com</p>
                                    </div>

                                    <div className="rounded-2xl bg-white text-center p-8 shadow-sm ring-1 ring-black/5">
                                        <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500 text-white">
                                            <Phone className="h-6 w-6" />
                                        </span>
                                        <h3 className="mt-5 text-xl font-bold text-slate-900">Call us</h3>
                                        <p className="mt-2 text-slate-700">speak to a human</p>
                                        <p className="mt-3 font-semibold text-slate-700">+1(437)291-1446</p>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </TabsContent>
                    <TabsContent value="final-exam">
                        <section className="mt-8 border-t border-gray-300 px-4 pt-2 pb-8 md:px-6">
                            <div className="mx-auto">
                                <div className="text-center">
                                    <h2 className="text-2xl font-bold text-slate-900">Final Exam</h2>
                                    <p className="mt-2 font-semibold text-slate-800">10 Questions</p>
                                </div>

                                <div className="mt-7 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                                    <p className="font-semibold leading-snug text-slate-900">
                                        While preparing for US Tax, the speaker suggested eliminating assets that require onerous US reporting, which of the following was NOT discussed as an example?
                                    </p>

                                    <div className="mt-4 space-y-3">
                                        <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-300 bg-gray-100 px-3 py-3">
                                            <input type="radio" name="final-exam-question-1" defaultChecked className="h-5 w-5 accent-blue-500" />
                                            <span className="font-normal">TFSA</span>
                                        </label>

                                        <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-300 bg-gray-100 px-3 py-3">
                                            <input type="radio" name="final-exam-question-1" className="h-5 w-5 accent-blue-500" />
                                            <span className="font-normal">RESP</span>
                                        </label>

                                        <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-300 bg-gray-100 px-3 py-3">
                                            <input type="radio" name="final-exam-question-1" className="h-5 w-5 accent-blue-500" />
                                            <span className="font-normal">Mutual Funds of $800k and above</span>
                                        </label>

                                        <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-300 bg-gray-100 px-3 py-3">
                                            <input type="radio" name="final-exam-question-1" className="h-5 w-5 accent-blue-500" />
                                            <span className="font-normal">PFIC</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </TabsContent>
                    <TabsContent value="faq" className=' mb-4 '>
                        <section className="mt-8bg-gray-100 px-6 py-12 md:px-10">
                            <div className="mx-auto max-w-6xl">
                                <div className="text-center">
                                    <h2 className="text-2xl font-bold text-slate-900">Frequently Asked Questions</h2>
                                    <p className="mt-2 text-base text-slate-600">Find answers to common questions below.</p>
                                </div>

                                <div className="mx-auto mt-10 max-w-[980px] space-y-4">
                                    <Accordion type="single" collapsible className="space-y-4">
                                        {faqItems.map((item, index) => (
                                            <AccordionItem
                                                key={item}
                                                value={`faq-item-${index}`}
                                                className="rounded-xl border border-gray-300 bg-white px-4 shadow-sm"
                                            >
                                                <AccordionTrigger className="py-4 text-xl font-bold text-slate-900 hover:no-underline">
                                                    {item}
                                                </AccordionTrigger>
                                                <AccordionContent className="text-slate-600">
                                                    We are happy to help. Please contact support if you need more details about this question.
                                                </AccordionContent>
                                            </AccordionItem>
                                        ))}
                                    </Accordion>
                                </div>
                            </div>
                        </section>

                        <section className="mt-8 border border-gray-200 bg-gray-100 p-6 shadow-sm md:p-10">
                            <div className="grid items-center gap-8 lg:grid-cols-2">
                                <div>
                                    <h2 className="text-4xl font-bold leading-tight text-slate-900">We&apos;re here to help</h2>
                                    <p className="mt-4 max-w-xl leading-relaxed text-slate-700">
                                        <strong>Questions? Feedback?</strong> Our ears and eyes are always open. We are closed on <strong>US Holidays and weekends</strong>, but don&apos;t worry, our bots don&apos;t sleep.
                                    </p>

                                    <form className="mt-6 flex w-full max-w-xl flex-col gap-3 sm:flex-row sm:items-center">
                                        <input
                                            type="email"
                                            placeholder="Enter your email"
                                            className="h-12 w-full rounded-full border border-gray-300 bg-white px-5 text-lg text-slate-700 outline-none transition focus:border-indigo-500"
                                        />
                                        <button
                                            type="button"
                                            className="h-12 rounded-full bg-indigo-600 px-8 text-base font-semibold text-white shadow-sm transition hover:bg-indigo-700"
                                        >
                                            Submit
                                        </button>
                                    </form>
                                </div>

                                <div className="relative mx-auto w-full">
                                    <div className="absolute h-[400px] w-[400px] inset-8 rounded-full bg-indigo-200/70"></div>
                                    <img
                                        src={imageUrl + "/uploads/banner_4_a2ad80fae0.png"}
                                        alt="Customer support illustration"
                                        className="relative z-10 w-full object-contain"
                                    />
                                </div>
                            </div>
                        </section>
                    </TabsContent>
                </Tabs>
            </div>






        </div>
    )
}

export default ViewWebinar