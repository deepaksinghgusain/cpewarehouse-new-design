"use client";

import { GetUserSubscribedCourses } from '@/services/course';
import moment from 'moment';
import React, { useState } from 'react'
import CertificateDatatable from './certificate-table';


function Navigation() {
    const items = ["About", "Course Catalogue", "Self-Study", "CPE Forums"]
    const active = "Course Catalogue"

    return (
        <div className="flex justify-between items-center max-w-6xl w-full">

            <div className="flex gap-2">

                {items.map((item) => (
                    <button
                        key={item}
                        className={`px-3 py-2 rounded-md font-semibold text-sm ${item === active
                            ? "bg-indigo-50 text-indigo-700"
                            : "text-gray-600 hover:bg-gray-100"
                            }`}
                    >
                        {item}
                    </button>
                ))}

            </div>

            <button className="border rounded-lg px-4 py-2 shadow-sm font-semibold">
                Dashboard
            </button>

        </div>
    )
}


function CourseRow({ course }: any) {
    return (
        <tr className="border-t">

            <td className="px-6 py-4 text-sm text-gray-900 uppercase">
                {course.name}
            </td>

            <td className="px-6 py-4 text-sm text-gray-600">
                {course.date}
            </td>

            <td className="px-6 py-4">
                <span className="text-xs font-medium px-2 py-1 bg-blue-50 text-blue-700 rounded-full border border-blue-200">
                    {course.format}
                </span>
            </td>

        </tr>
    )
}

const page = () => {

    const [year, setYear] = useState("2024")

    const courses = [
        {
            name: "2024 FINCEN BENEFICIAL OWNERSHIP INTEREST (BOI) REPORTING",
            subject: "Tax Compliance",
            date: "Jan 6, 2024",
            format: "Live Webinar",
            credits: 1,
            certificate: "/certificates/cert1.pdf",
        },
        {
            name: "Form 1041 Preparation - Understanding the Entities and the Law",
            subject: "Tax Law",
            date: "Jan 6, 2024",
            format: "Live Webinar",
            credits: 2,
            certificate: "/certificates/cert2.pdf",
        },
        {
            name: "INV-Tax Research Part 1 - Fundamentals",
            subject: "Tax Research",
            date: "Jan 5, 2024",
            format: "Self Study",
            credits: 3,
            certificate: "/certificates/cert3.pdf",
        },
        {
            name: "Corporate Tax Planning",
            subject: "Finance",
            date: "Jan 4, 2024",
            format: "Live Webinar",
            credits: 2,
            certificate: "/certificates/cert4.pdf",
        },
        {
            name: "Audit Documentation",
            subject: "Audit",
            date: "Jan 3, 2024",
            format: "Self Study",
            credits: 1,
            certificate: "/certificates/cert5.pdf",
        },
    ]


    const [currentPage, setCurrentPage] = useState(1)

    const rowsPerPage = 3

    const totalPages = Math.ceil(courses.length / rowsPerPage)

    const startIndex = (currentPage - 1) * rowsPerPage
    const paginatedCourses = courses.slice(startIndex, startIndex + rowsPerPage)


    return (
        <>
            <div className="bg-white py-8 px-8 flex flex-col gap-8">
                <h1 className="text-3xl font-semibold text-gray-900">Certificate(s)</h1>

                {/* PAGE TITLE */}
                <div className="flex gap-4 justify-end bg-[#eee] py-4 items-center max-w-6xl w-full">

                    <select
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        className="border rounded-lg px-4 py-2"
                    >
                        <option>2024</option>
                        <option>2023</option>
                    </select>
                </div>
            </div>

            <div className="px-8 py-6">

                <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">

                    {/* TABLE */}

                    <table className="w-full">

                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                                    Course Name
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                                    Subject
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                                    Date
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                                    Format
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                                    Credits
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                                    Certificate
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {paginatedCourses.map((course, index) => (
                                <tr key={index} className="border-t hover:bg-gray-50">

                                    <td className="px-6 py-4 text-sm text-gray-900">
                                        {course.name}
                                    </td>

                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {course.subject}
                                    </td>

                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {course.date}
                                    </td>

                                    <td className="px-6 py-4">
                                        <span
                                            className={`px-2 py-1 text-xs font-medium rounded-full border ${course.format === "Live Webinar"
                                                ? "bg-blue-50 text-blue-700 border-blue-200"
                                                : "bg-pink-50 text-pink-700 border-pink-200"
                                                }`}
                                        >
                                            {course.format}
                                        </span>
                                    </td>

                                    <td className="px-6 py-4">
                                        <span className="px-2.5 py-0.5 text-sm font-medium rounded-full border bg-green-50 text-green-700 border-green-200">
                                            {course.credits}
                                        </span>
                                    </td>

                                    <td className="px-6 py-4 flex">

                                        <a
                                            href={course.certificate}
                                            download
                                            className="px-3 py-1.5 flex items-center gap-2 text-xs font-medium text-indigo-600"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                                <path d="M17.5 17.5H2.5M15 9.16667L10 14.1667M10 14.1667L5 9.16667M10 14.1667V2.5" stroke="#444CE7" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" />
                                            </svg>

                                            Download
                                        </a>
                                    </td>

                                </tr>
                            ))}
                        </tbody>

                    </table>

                    {/* PAGINATION */}

                    <div className="flex items-center justify-between px-6 py-4 border-t bg-gray-50">

                        <button
                            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                            className="px-3 py-1 text-sm border rounded-md hover:bg-gray-100"
                        >
                            Previous
                        </button>

                        <div className="flex gap-2">

                            {Array.from({ length: totalPages }, (_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentPage(i + 1)}
                                    className={`px-3 py-1 text-sm rounded-md border ${currentPage === i + 1
                                        ? "bg-indigo-600 text-white"
                                        : "hover:bg-gray-100"
                                        }`}
                                >
                                    {i + 1}
                                </button>
                            ))}

                        </div>

                        <button
                            onClick={() =>
                                setCurrentPage((p) => Math.min(p + 1, totalPages))
                            }
                            className="px-3 py-1 text-sm border rounded-md hover:bg-gray-100"
                        >
                            Next
                        </button>

                    </div>

                </div>

            </div>

        </>
    )
}

export default page