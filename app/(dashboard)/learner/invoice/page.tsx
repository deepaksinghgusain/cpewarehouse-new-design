"use client";

import React, { useState } from 'react'
import InvoiceDataTable from './invoice-table'

const InvoicePage = () => {
  const [year, setYear] = useState("2024")

  const invoiceData = [
    {
      invoice: "13480",
      subject: "Taxation Fundamentals",
      date: "Aug 6, 2024",
      certificate: "/certificates/certificate1.pdf",
    },
    {
      invoice: "13481",
      subject: "Financial Accounting",
      date: "Jul 6, 2024",
      certificate: "/certificates/certificate2.pdf",
    },
    {
      invoice: "13482",
      subject: "Auditing Basics",
      date: "May 12, 2024",
      certificate: "/certificates/certificate3.pdf",
    },
    {
      invoice: "13483",
      subject: "Corporate Finance",
      date: "Apr 1, 2024",
      certificate: "/certificates/certificate4.pdf",
    },
    {
      invoice: "13484",
      subject: "Management Accounting",
      date: "Mar 6, 2024",
      certificate: "/certificates/certificate5.pdf",
    },
    {
      invoice: "13485",
      subject: "Business Ethics",
      date: "Jan 6, 2024",
      certificate: "/certificates/certificate6.pdf",
    },
    {
      invoice: "13486",
      subject: "Risk Management",
      date: "Dec 6, 2023",
      certificate: "/certificates/certificate7.pdf",
    },
    {
      invoice: "13487",
      subject: "Data Analytics",
      date: "Nov 6, 2023",
      certificate: "/certificates/certificate8.pdf",
    },
  ]

  const [currentPage, setCurrentPage] = useState(1)

  const rowsPerPage = 5

  const totalPages = Math.ceil(invoiceData.length / rowsPerPage)

  const indexOfLast = currentPage * rowsPerPage
  const indexOfFirst = indexOfLast - rowsPerPage

  const currentInvoices = invoiceData.slice(indexOfFirst, indexOfLast)


  return (
    <>
      <div className="bg-white py-8 px-8 flex flex-col gap-8">
        <h1 className="text-3xl font-semibold text-gray-900">Invoice(s)</h1>

        <h3 className="self-stretch justify-start text-gray-900 text-lg font-semibold font-['Inter'] leading-7">Asterid Group Inc., (dba CPE Warehouse) is a registered corporation inToronto, ON, Canada with an EIN #:98-1551198</h3>

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

            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                  Invoice
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                  Subject
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                  Date
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                  Certificate
                </th>
              </tr>
            </thead>

            <tbody>
              {currentInvoices.map((item, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">

                  <td className="px-6 py-4 font-medium text-gray-900">
                    {item.invoice}
                  </td>

                  <td className="px-6 py-4 text-gray-700">
                    {item.subject}
                  </td>

                  <td className="px-6 py-4 text-gray-600">
                    {item.date}
                  </td>

                  <td className="px-6 py-4">
                    <a
                      href={item.certificate}
                      download
                      className="text-indigo-600 font-semibold hover:underline"
                    >
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

export default InvoicePage