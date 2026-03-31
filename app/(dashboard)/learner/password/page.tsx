"use client"
import React, { useState } from 'react'

const Password = () => {
    const [form, setForm] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    })

    const handleChange = (e: any) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        })
    }

    const handleSubmit = (e: any) => {
        e.preventDefault()

        if (form.newPassword !== form.confirmPassword) {
            alert("Passwords do not match")
            return
        }

        console.log(form)
    }
    return (
        <div className="w-full bg-white py-8">

            <div className="w-full mx-auto px-8">

                {/* Page Title */}
                <h1 className="text-3xl font-semibold text-gray-900 mb-10">
                    Change Password
                </h1>

                {/* Section Header */}
                <div className="flex justify-between items-start pb-5 border-b">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">
                            Password
                        </h2>

                        <p className="text-sm text-gray-600">
                            Please enter your current password to change your password.
                        </p>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="mt-6 space-y-8 w-full">

                    {/* Current Password */}
                    <div className="grid grid-cols-3 gap-8 items-center">

                        <label className="text-sm font-semibold text-gray-700">
                            Current password *
                        </label>

                        <div className="col-span-2">
                            <input
                                type="password"
                                name="currentPassword"
                                value={form.currentPassword}
                                onChange={handleChange}
                                required
                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none"
                                placeholder="••••••••"
                            />
                        </div>

                    </div>

                    <div className="border-b"></div>

                    {/* New Password */}
                    <div className="grid grid-cols-3 gap-8 items-center">

                        <label className="text-sm font-semibold text-gray-700">
                            New password *
                        </label>

                        <div className="col-span-2">
                            <input
                                type="password"
                                name="newPassword"
                                value={form.newPassword}
                                onChange={handleChange}
                                required
                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none"
                                placeholder="••••••••"
                            />
                        </div>

                    </div>

                    <div className="border-b"></div>

                    {/* Confirm Password */}
                    <div className="grid grid-cols-3 gap-8 items-center">

                        <label className="text-sm font-semibold text-gray-700">
                            Confirm new password *
                        </label>

                        <div className="col-span-2">
                            <input
                                type="password"
                                name="confirmPassword"
                                value={form.confirmPassword}
                                onChange={handleChange}
                                required
                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none"
                                placeholder="••••••••"
                            />
                        </div>

                    </div>

                    {/* Footer */}
                    <div className="border-t pt-6 flex justify-end">

                        <button
                            type="submit"
                            className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
                        >
                            Change password
                        </button>

                    </div>

                </form>

            </div>

        </div>
    )
}

export default Password