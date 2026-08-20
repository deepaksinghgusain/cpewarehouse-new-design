'use client'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

type FaqItem = { question: string; answer: string }

const faqItems: FaqItem[] = [
    {
        question: 'What is this service about?',
        answer: 'This service provides a platform to manage and streamline your workflow efficiently.',
    },
    {
        question: 'How can I sign up?',
        answer: 'You can sign up by visiting our registration page and following the instructions.',
    },
    {
        question: 'What payment methods are accepted?',
        answer: 'We accept credit cards, PayPal, and bank transfers.',
    },
    {
        question: 'Can I cancel my subscription anytime?',
        answer: 'Yes, you can cancel your subscription at any time from your account settings.',
    },
]

export function WebinarFaq() {
    return (
        <>
            <section className="mt-8 bg-gray-100 px-6 py-12 md:px-10">
                <div className="mx-auto max-w-6xl">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-slate-900">Frequently Asked Questions</h2>
                        <p className="mt-2 text-base text-slate-600">Find answers to common questions below.</p>
                    </div>

                    <div className="mx-auto mt-10 max-w-[980px] space-y-4">
                        <Accordion type="single" collapsible className="space-y-4">
                            {faqItems.map((item, index) => (
                                <AccordionItem key={index} value={`faq-item-${index}`} className="rounded-xl border border-gray-300 bg-white px-4 shadow-sm">
                                    <AccordionTrigger className="py-4 text-xl font-bold text-slate-900 hover:no-underline">{item.question}</AccordionTrigger>
                                    <AccordionContent className="text-slate-600">{item.answer}</AccordionContent>
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
                            <input type="email" placeholder="Enter your email" className="h-12 w-full rounded-full border border-gray-300 bg-white px-5 text-lg text-slate-700 outline-none transition focus:border-indigo-500" />
                            <button type="button" className="h-12 rounded-full bg-indigo-600 px-8 text-base font-semibold text-white shadow-sm transition hover:bg-indigo-700">Submit</button>
                        </form>
                    </div>
                    <div className="relative mx-auto w-full">
                        <div className="absolute inset-8 h-[400px] w-[400px] rounded-full bg-indigo-200/70" />
                        <img src="/assets/images/banner-4.png" alt="Customer support illustration" className="relative z-10 w-full object-contain" />
                    </div>
                </div>
            </section>
        </>
    )
}
