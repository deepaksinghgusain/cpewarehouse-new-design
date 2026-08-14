"use client"

import React, { useState } from 'react'
import { z } from 'zod'
import { Check, X } from 'lucide-react'

// Zod validation schema
const shareFormSchema = z.object({
    colleague_first_name: z.string().min(1, "Colleague's First Name is required").min(2, "First name must be at least 2 characters"),
    colleague_last_name: z.string().min(1, "Colleague's Last Name is required").min(2, "Last name must be at least 2 characters"),
    colleague_email_id: z.string().email("Please enter a valid email address"),
    firm_name: z.string().min(1, "Firm name is required").min(2, "Firm name must be at least 2 characters"),
    sender_first_name: z.string().min(1, "Your First Name is required").min(2, "First name must be at least 2 characters"),
    sender_last_name: z.string().min(1, "Your Last Name is required").min(2, "Last name must be at least 2 characters"),
    message: z.string().min(1, "Message is required").min(10, "Message must be at least 10 characters"),
})

type ShareFormData = z.infer<typeof shareFormSchema>

// Success Modal Component
const SuccessModal = ({ onClose }: { onClose: () => void }) => {
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-300">
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition"
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
                        <h2 className="text-3xl font-bold text-gray-900">SUCCESS!</h2>
                        <p className="text-lg font-semibold text-indigo-600">
                            The course has been shared with your colleague successfully!
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
                    className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition"
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
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition duration-200 animate-in fade-in duration-500 delay-400"
                    >
                        CLOSE
                    </button>
                </div>
            </div>
        </div>
    )
}

interface ShareWithColleagueProps {
    courseId?: string
    courseTitle?: string
    isOpen: boolean
    onClose: () => void
    onSuccess?: () => void
}

const ShareWithColleague: React.FC<ShareWithColleagueProps> = ({ courseId, courseTitle = "Course", isOpen, onClose, onSuccess }) => {
    const [formData, setFormData] = useState<Partial<ShareFormData>>({})
    const [errors, setErrors] = useState<Partial<Record<keyof ShareFormData, string>>>({})
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [showSuccessModal, setShowSuccessModal] = useState(false)
    const [showErrorModal, setShowErrorModal] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.currentTarget

        setFormData(prev => ({
            ...prev,
            [name]: value
        }))

        // Clear error for this field when user starts typing
        if (errors[name as keyof ShareFormData]) {
            setErrors(prev => ({
                ...prev,
                [name]: undefined
            }))
        }
    }

    const handleCloseSuccessModal = () => {
        setShowSuccessModal(false)
        // Reset form after closing success modal
        setFormData({})
        onClose()
        if (onSuccess) {
            onSuccess()
        }
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
            // Validate form data against schema
            const validatedData = shareFormSchema.parse(formData)

            // Prepare data for API with courseId
            const submitData = {
                ...validatedData,
                courseId,
                courseTitle
            }

            console.log("Form submitted successfully:", submitData)

            // TODO: Replace with actual API call
            // const res = await shareWithColleague(submitData)

            // Simulate API call success
            setShowSuccessModal(true)

        } catch (error) {
            if (error instanceof z.ZodError) {
                // Convert Zod errors to a more usable format
                const formattedErrors: Partial<Record<keyof ShareFormData, string>> = {}
                error.issues.forEach(err => {
                    const path = err.path[0] as keyof ShareFormData
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

    if (!isOpen) return null

    return (
        <>
            {/* Modal Backdrop and Container */}
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
                <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto">
                    {/* Close Button */}
                    <div className="sticky top-0 right-0 flex justify-end py-4 px-4  bg-white border-b border-b-gray-200">

                        <div className="mb-8">
                            <h2 className="text-3xl font-bold text-gray-900">Share with Colleague</h2>
                            <p className="mt-2 text-gray-600">
                                Share <span className="font-semibold text-indigo-600">{courseTitle}</span> with your colleague
                            </p>
                        </div>

                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Modal Content */}
                    <div className="p-8">

                        <form className="space-y-6" onSubmit={handleSubmit}>
                            {/* Colleague Information Section */}
                            <div className="border-b border-b-gray-200 pb-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Colleague Information</h3>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">
                                            Colleague's First Name *
                                        </label>
                                        <input
                                            type="text"
                                            name="colleague_first_name"
                                            placeholder="First Name"
                                            value={formData.colleague_first_name || ""}
                                            onChange={handleInputChange}
                                            className={`w-full rounded-lg border bg-white px-4 py-3 text-base text-slate-900 outline-none transition ${errors.colleague_first_name
                                                    ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                                                    : "border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                                }`}
                                        />
                                        {errors.colleague_first_name && (
                                            <p className="text-sm text-red-600">{errors.colleague_first_name}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">
                                            Colleague's Last Name *
                                        </label>
                                        <input
                                            type="text"
                                            name="colleague_last_name"
                                            placeholder="Last Name"
                                            value={formData.colleague_last_name || ""}
                                            onChange={handleInputChange}
                                            className={`w-full rounded-lg border bg-white px-4 py-3 text-base text-slate-900 outline-none transition ${errors.colleague_last_name
                                                    ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                                                    : "border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                                }`}
                                        />
                                        {errors.colleague_last_name && (
                                            <p className="text-sm text-red-600">{errors.colleague_last_name}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="mt-4 space-y-2">
                                    <label className="text-sm font-medium text-slate-700">
                                        Colleague's Email Address *
                                    </label>
                                    <input
                                        type="email"
                                        name="colleague_email_id"
                                        placeholder="colleague@example.com"
                                        value={formData.colleague_email_id || ""}
                                        onChange={handleInputChange}
                                        className={`w-full rounded-lg border bg-white px-4 py-3 text-base text-slate-900 outline-none transition ${errors.colleague_email_id
                                                ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                                                : "border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                            }`}
                                    />
                                    {errors.colleague_email_id && (
                                        <p className="text-sm text-red-600">{errors.colleague_email_id}</p>
                                    )}
                                </div>

                                <div className="mt-4 space-y-2">
                                    <label className="text-sm font-medium text-slate-700">
                                        Firm Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="firm_name"
                                        placeholder="Your Firm Name"
                                        value={formData.firm_name || ""}
                                        onChange={handleInputChange}
                                        className={`w-full rounded-lg border bg-white px-4 py-3 text-base text-slate-900 outline-none transition ${errors.firm_name
                                                ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                                                : "border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                            }`}
                                    />
                                    {errors.firm_name && (
                                        <p className="text-sm text-red-600">{errors.firm_name}</p>
                                    )}
                                </div>
                            </div>

                            {/* Your Information Section */}
                            <div className="border-b border-b-gray-200 pb-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Information</h3>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">
                                            Your First Name *
                                        </label>
                                        <input
                                            type="text"
                                            name="sender_first_name"
                                            placeholder="First Name"
                                            value={formData.sender_first_name || ""}
                                            onChange={handleInputChange}
                                            className={`w-full rounded-lg border bg-white px-4 py-3 text-base text-slate-900 outline-none transition ${errors.sender_first_name
                                                    ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                                                    : "border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                                }`}
                                        />
                                        {errors.sender_first_name && (
                                            <p className="text-sm text-red-600">{errors.sender_first_name}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">
                                            Your Last Name *
                                        </label>
                                        <input
                                            type="text"
                                            name="sender_last_name"
                                            placeholder="Last Name"
                                            value={formData.sender_last_name || ""}
                                            onChange={handleInputChange}
                                            className={`w-full rounded-lg border bg-white px-4 py-3 text-base text-slate-900 outline-none transition ${errors.sender_last_name
                                                    ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                                                    : "border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                                }`}
                                        />
                                        {errors.sender_last_name && (
                                            <p className="text-sm text-red-600">{errors.sender_last_name}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Message Section */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">
                                    Message *
                                </label>
                                <textarea
                                    name="message"
                                    placeholder="Add a personal message to your colleague..."
                                    rows={5}
                                    value={formData.message || ""}
                                    onChange={handleInputChange}
                                    className={`w-full resize-none rounded-lg border bg-white px-4 py-3 text-base text-slate-900 outline-none transition ${errors.message
                                            ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                                            : "border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                        }`}
                                />
                                {errors.message && (
                                    <p className="text-sm text-red-600">{errors.message}</p>
                                )}
                                <p className="text-xs text-gray-500">Minimum 10 characters required</p>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition duration-200 ${isSubmitting
                                        ? "bg-blue-400 cursor-pointer opacity-60"
                                        : "bg-blue-600 hover:bg-blue-700 cursor-pointer active:bg-blue-800"
                                    }`}
                            >
                                {isSubmitting ? "Sharing..." : "Share with Colleague"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Success Modal */}
            {showSuccessModal && <SuccessModal onClose={handleCloseSuccessModal} />}

            {/* Error Modal */}
            {showErrorModal && <ErrorModal message={errorMessage} onClose={handleCloseErrorModal} />}
        </>
    )
}

export default ShareWithColleague
