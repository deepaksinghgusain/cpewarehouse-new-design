"use client"

import { contactUs } from '@/services/contact-us'
import Image from 'next/image'
import React, { useState } from 'react'
import { z } from 'zod'
import { Check, X } from 'lucide-react'

// Zod validation schema
const contactFormSchema = z.object({
    firstName: z.string().trim().min(1, "First name is required"),
    lastName: z.string().trim().min(1, "Last name is required"),
    email: z.string().trim().min(1, "Email is required").email("Please enter a valid email address"),
    countryCode: z.string().trim().min(1, "Country code is required"),
    phoneNumber: z.string().trim().min(1, "Phone number is required").refine(
        (val) => !val || /^[\d\s\-\+\(\)]+$/.test(val),
        "Please enter a valid phone number"
    ),
    qType: z.string().trim().min(1, "Please select a category"),
    message: z.string().trim().min(1, "Message is required").min(10, "Message must be at least 10 characters"),
    agreeToPrivacy: z.boolean().refine((val) => val === true, "You must agree to the Privacy Policy"),
})

type ContactFormData = z.infer<typeof contactFormSchema>

// Success Modal Component
const SuccessModal = ({ onClose }: { onClose: () => void }) => {
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-300">
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 cursor-pointer text-gray-400 hover:text-gray-600 transition"
                >
                    <X className="w-6 h-6" />
                </button>

                <div className="flex flex-col items-center text-center space-y-6">
                    <div className="relative w-20 h-20 animate-in scale-in duration-500 delay-200">
                        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
                            <Check className="w-10 h-10 text-white" strokeWidth={3} />
                        </div>
                    </div>

                    <div className="space-y-3 animate-in fade-in duration-500 delay-300">
                        <h2 className="text-3xl font-bold text-gray-900">THANK YOU</h2>
                        <p className="text-lg font-semibold text-indigo-600">
                            WE WILL GET BACK TO YOU WITHIN 1 BUSINESS DAY!
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="w-full bg-indigo-700 hover:bg-indigo-800 text-white font-bold py-3 rounded-lg transition duration-200 animate-in fade-in duration-500 delay-400"
                    >
                        CLOSE
                    </button>
                </div>
            </div>
        </div>
    )
}

// Error Modal Component
const ErrorModal = ({ message, onClose }: { message: string; onClose: () => void }) => {
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-300">
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 cursor-pointer text-gray-400 hover:text-gray-600 transition"
                >
                    <X className="w-6 h-6" />
                </button>

                <div className="flex flex-col items-center text-center space-y-6">
                    <div className="relative w-20 h-20 animate-in scale-in duration-500 delay-200">
                        <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center">
                            <X className="w-10 h-10 text-white" strokeWidth={3} />
                        </div>
                    </div>

                    <div className="space-y-3 animate-in fade-in duration-500 delay-300">
                        <h2 className="text-2xl font-bold text-gray-900">ERROR</h2>
                        <p className="text-base text-gray-600">
                            {message}
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="w-full bg-red-600 hover:bg-red-700 cursor-pointer text-white font-bold py-3 rounded-lg transition duration-200 animate-in fade-in duration-500 delay-400"
                    >
                        CLOSE
                    </button>
                </div>
            </div>
        </div>
    )
}

const ContactForm = () => {
    const [formData, setFormData] = useState<Partial<ContactFormData>>({
        countryCode: 'US'
    })
    const [errors, setErrors] = useState<Partial<Record<keyof ContactFormData, string>>>({})
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [showSuccessModal, setShowSuccessModal] = useState(false)
    const [showErrorModal, setShowErrorModal] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.currentTarget
        const fieldValue = type === 'checkbox' ? (e.currentTarget as HTMLInputElement).checked : value
        
        setFormData(prev => ({
            ...prev,
            [name]: fieldValue
        }))
        
        // Clear error for this field when user starts typing
        if (errors[name as keyof ContactFormData]) {
            setErrors(prev => ({
                ...prev,
                [name]: undefined
            }))
        }
    }

    const handleCloseSuccessModal = () => {
        setShowSuccessModal(false)
        // Reset form after closing success modal
        setFormData({ countryCode: 'US' })
    }

    const handleCloseErrorModal = () => {
        setShowErrorModal(false)
        setErrorMessage("")
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setErrors({})
        setIsSubmitting(true)

        try {
            const normalizedData = {
                firstName: formData.firstName ?? "",
                lastName: formData.lastName ?? "",
                email: formData.email ?? "",
                countryCode: formData.countryCode ?? "",
                phoneNumber: formData.phoneNumber ?? "",
                qType: formData.qType ?? "",
                message: formData.message ?? "",
                agreeToPrivacy: Boolean(formData.agreeToPrivacy),
            }

            // Validate form data against schema
            const validatedData = contactFormSchema.parse(normalizedData)
            
            // If validation passes, submit the form
            const res = await contactUs(validatedData)
            
            if (res.success || res.data) {
                setShowSuccessModal(true)
            } else {
                setErrorMessage(res.message || "Failed to send message. Please try again.")
                setShowErrorModal(true)
            }

        } catch (error) {
            if (error instanceof z.ZodError) {
                // Convert Zod errors to a more usable format
                const formattedErrors: Partial<Record<keyof ContactFormData, string>> = {}
                error.issues.forEach(err => {
                    const path = err.path[0] as keyof ContactFormData
                    formattedErrors[path] = err.message
                })
                setErrors(formattedErrors)
                
                // Show first error in modal
                const firstError = Object.values(formattedErrors)[0]
                if (firstError) {
                    setErrorMessage(firstError)
                    setShowErrorModal(true)
                }
            } else if (error instanceof Error) {
                setErrorMessage(error.message)
                setShowErrorModal(true)
            }
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <section className="w-[90%] mx-auto">
            <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] items-center">
                <div className="rounded-[32px] bg-white p-8">
                    <div className="">
                        <p className="text-lg font-bold text-slate-900 text-[36px]">Contact us</p>
                        <h1 className="mt-3 text-slate-950">Our team would love to hear from you.</h1>
                    </div>

                    <form className="mt-4 space-y-6" onSubmit={handleSubmit}>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">
                                    First name *
                                </label>
                                <input
                                    type="text"
                                    name="firstName"
                                    placeholder="First name"
                                    value={formData.firstName || ""}
                                    onChange={handleInputChange}
                                    className={`w-full rounded-2xl border bg-white px-4 py-3 text-base text-slate-900 outline-none transition ${
                                        errors.firstName
                                            ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                                            : "border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    }`}
                                />
                                {errors.firstName && (
                                    <p className="text-sm text-red-600">{errors.firstName}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">
                                    Last name *
                                </label>
                                <input
                                    type="text"
                                    name="lastName"
                                    placeholder="Last name"
                                    value={formData.lastName || ""}
                                    onChange={handleInputChange}
                                    className={`w-full rounded-2xl border bg-white px-4 py-3 text-base text-slate-900 outline-none transition ${
                                        errors.lastName
                                            ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                                            : "border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    }`}
                                />
                                {errors.lastName && (
                                    <p className="text-sm text-red-600">{errors.lastName}</p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">
                                Email *
                            </label>
                            <input
                                type="email"
                                name="email"
                                placeholder="you@company.com"
                                value={formData.email || ""}
                                onChange={handleInputChange}
                                className={`w-full rounded-2xl border bg-white px-4 py-3 text-base text-slate-900 outline-none transition ${
                                    errors.email
                                        ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                                        : "border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                }`}
                            />
                            {errors.email && (
                                <p className="text-sm text-red-600">{errors.email}</p>
                            )}
                        </div>

                        <div className="grid gap-4 mt-4 space-y-2">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">
                                    Phone Number *
                                </label>
                                <div className={`flex items-center gap-3 rounded-2xl border bg-white px-3 py-2 ${
                                    errors.phoneNumber ? "border-red-500" : "border-slate-300"
                                }`}>
                                    {/* <select
                                        name="countryCode"
                                        value={formData.countryCode || "US"}
                                        onChange={handleInputChange}
                                        className="w-18 rounded-xl border border-transparent bg-transparent text-sm text-slate-900 outline-none focus:border-transparent focus:outline-none"
                                    >
                                        <option value="US">US</option>
                                        <option value="CA">CA</option>
                                        <option value="UK">UK</option>
                                    </select> */}
                                    <input
                                        type="tel"
                                        name="phoneNumber"
                                        placeholder="+1 (555) 000-0000"
                                        value={formData.phoneNumber || ""}
                                        onChange={handleInputChange}
                                        className="flex-1 bg-transparent text-base text-slate-900 outline-none"
                                    />
                                </div>
                                {errors.phoneNumber && (
                                    <p className="text-sm text-red-600">{errors.phoneNumber}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">
                                    Select the question category *
                                </label>
                                <select
                                    name="qType"
                                    value={formData.qType || ""}
                                    onChange={handleInputChange}
                                    className={`w-full rounded-2xl border bg-white px-4 py-3 text-base text-slate-900 outline-none transition ${
                                        errors.qType
                                            ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                                            : "border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    }`}
                                >
                                    <option value="">Select a category</option>
                                    {
                                        ['Registration issues or questions',
                                            'Question about a Self Study course',
                                            'Enquire about hosting a CPE Forum',
                                            'Question about CPE',
                                            'Topic suggestions',
                                            'Interested in being a CPE Warehouse faculty or author',
                                            'General Comment or suggestion for CPE Warehouse',
                                            'Other'
                                        ].map((option, index) => (
                                            <option key={index} value={option}>{option}</option>
                                        ))
                                    }
                                </select>
                                {errors.qType && (
                                    <p className="text-sm text-red-600">{errors.qType}</p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">
                                Message *
                            </label>
                            <textarea
                                name="message"
                                placeholder="Leave us a message..."
                                rows={6}
                                value={formData.message || ""}
                                onChange={handleInputChange}
                                className={`w-full resize-none rounded-2xl border bg-white px-4 py-3 text-base text-slate-900 outline-none transition ${
                                    errors.message
                                        ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                                        : "border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                }`}
                            />
                            {errors.message && (
                                <p className="text-sm text-red-600">{errors.message}</p>
                            )}
                        </div>

                        <div className="flex flex-col gap-4 items-center justify-start">
                            <label className="flex items-center gap-3 text-sm text-slate-700">
                                <input
                                    type="checkbox"
                                    name="agreeToPrivacy"
                                    checked={formData.agreeToPrivacy || false}
                                    onChange={handleInputChange}
                                    className={`h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 ${
                                        errors.agreeToPrivacy ? "border-red-500" : ""
                                    }`}
                                />
                                <span>
                                    You agree to CPE Warehouse&apos;s{' '}
                                    <a href="#" className="font-semibold text-blue-600 underline">
                                        Privacy Policy
                                    </a>
                                </span>
                            </label>
                            <br />
                            {errors.agreeToPrivacy && (
                                <p className="text-sm text-red-600">{errors.agreeToPrivacy}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`inline-flex h-12 w-full items-center justify-center cursor-pointer rounded-2xl px-8 text-base font-semibold text-white transition ${
                                isSubmitting
                                    ? "bg-blue-400 cursor-not-allowed opacity-60"
                                    : "bg-blue-600 hover:bg-blue-700"
                            }`}
                        >
                            {isSubmitting ? "Sending..." : "Send message"}
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

            {/* Success Modal */}
            {showSuccessModal && <SuccessModal onClose={handleCloseSuccessModal} />}

            {/* Error Modal */}
            {showErrorModal && <ErrorModal message={errorMessage} onClose={handleCloseErrorModal} />}
        </section>
    )
}

export default ContactForm