"use client"
import { getInvoicetemplate, getOrderDetailByUserEmail, GetUserSubscribedCourses } from "@/services/course"
import { useEffect, useState } from "react"
import jsPDF from "jspdf";
import moment from "moment";
import html2canvas from "html2canvas";

export default function InvoiceDataTable() {
  let [selectedYear, setSelectedYear] = useState(2024)
  let [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    company: "",
    ptin: "",
    state: "",
    country: "",
    phone: "",
    imgUrl: "",
  })

  let [availableYears, setAvailableYears] = useState<any>([])
  let [filteredInvoices, setFilteredInvoices] = useState<any>([])
  let [allInvoices, setAllInvoices] = useState<any>([])
  let [invoicesTem, setInvoicesTem] = useState<any>([])

  let [itemsPerPage, setItemsPerPage] = useState(5)
  let [currentPage, setCurrentPage] = useState(1)
  let [totalPages, setTotalPages] = useState(0)

  const getUserData = async () => {
    const token = localStorage.getItem("token")

    if (!token) return;

    let response = await fetch(process.env.NEXT_PUBLIC_API_BASE_URL + "/api/users/me", {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    let res = await response.json();

    setProfileData(res)
  }

  const getEventlist = async () => {
    const email = localStorage.getItem('email')?.toString() || '';
    let res = await GetUserSubscribedCourses(email)
    let IDarray = [];
    res.data.forEach((element: any) => {

      if (element?.attributes?.course?.data != null) {
        IDarray.push(parseInt(element?.attributes?.course?.data?.id))
      }
    })

    let invoicesTem = [];
    let resp = await getInvoicetemplate()
    if (res.data) {
      invoicesTem = resp.data?.global?.data;
      setInvoicesTem(invoicesTem)
    }


    if (res?.data?.length == 0) {
      let message = 'You have not purchased any course. Please purchase a course to access this information';
    }

    const coursesPurchased: any = []
    const localTime = moment().format('YYYY-MM-DD') + 'T00:00:00.000Z'; // store localTime
    res.data.forEach((element: any) => {
      const course = element?.attributes?.course?.data?.attributes;
      const usercourse = element.attributes;
      if (course != undefined) {
        coursesPurchased.push({
          'course': course,
          'startDate': course?.startDate,
          'category': course?.category?.data?.attributes?.title,
          'webinarId': course?.webinarId || '',
          'joinUrl': usercourse?.joinUrl,
          'status': usercourse?.status,
          'completedOn': usercourse?.completedOn,
          'watchRecording': course?.category?.data?.attributes?.title.toLowerCase() == 'recorded',
          'purchasedOn': usercourse?.purchasedOn,

        })
      }
    })
  }

  const calculateTotalPages = (allInvoices: any) => {
    let totalPages = Math.ceil(allInvoices.length / itemsPerPage);
    setTotalPages(totalPages)
  }

  const downloadInvoice = async (
    invoice: any
  ) => {
    const InvoiceNo = invoice?.id;

    const lastname =
      typeof window !== "undefined" ? localStorage.getItem("lastname") : "";

    let invoiceDate = invoice?.attributes?.createdAt || "";

    if (invoiceDate !== "") {
      invoiceDate = moment(invoice?.attributes?.createdAt).format(
        "MMMM DD, YYYY"
      );
    }

    const url =
      invoicesTem?.attributes?.invoiceTemplate?.data?.attributes?.url;


    const orderItems = invoice?.attributes?.OrderItems || [];

    const totalDiscount = (
      parseInt(invoice?.attributes?.totalPrice) -
      parseInt(invoice?.attributes?.finalPrice)
    ).toString();

    let htmlContentforInvoiceItems = "";
    let totalQty: any = 0;
    let totalItems = 0;

    orderItems.forEach((orderItemH: any) => {
      const coursePrice = orderItemH?.price ?? 0;
      const courseNetPrice = orderItemH?.finalPrice ?? 0;

      const discount = (
        parseInt(coursePrice) - parseInt(courseNetPrice)
      ).toString();

      totalQty += Number(orderItemH?.qty ?? 0);
      totalItems++;

      htmlContentforInvoiceItems += `
      <tr style="font-weight: bold; font-size: 10px;">
        <td style="text-align:left;padding:6px 4px;">${orderItemH?.title}</td>
        <td style="padding:6px;">${orderItemH?.qty}</td>
        <td style="padding:6px;">$ ${coursePrice}</td>
        <td style="padding:6px;">$ ${discount}</td>
        <td style="padding:6px;">$ ${courseNetPrice}</td>
      </tr>
    `;
    });

    try {
      const response = await fetch(process.env.NEXT_PUBLIC_API_URL + url);
      const template = await response.text();

      let html = template
        .replace(
          "{{userName}}",
          profileData.firstName + " " + profileData.lastName
        )
        .replace("{{invoiceNo}}", InvoiceNo)
        .replace(
          "{{address}}",
          profileData.state + ", " + profileData.country
        )
        .replace("{{invoiceDate}}", invoiceDate)
        .replace("{{htmlContentforInvoiceItems}}", htmlContentforInvoiceItems)
        .replace("{{totalQty}}", totalQty)
        .replace("{{totalPrice}}", invoice?.attributes?.totalPrice ?? 0)
        .replace("{{totalDiscount}}", totalDiscount)
        .replace("{{finalPrice}}", invoice?.attributes?.finalPrice ?? 0);

      const doc = new jsPDF("p", "pt", [595, 841.89]);

      doc.html(html, {
        callback: function (doc) {
          let rectX = 210;
          let rectYFix = 229 + totalItems * 30;
          let rectY = 267 + totalItems * 30;
          let rectW = 100;
          let rectH = 12;

          doc.link(rectX, rectY, rectW, rectH, {
            url: "https://cpewarehouse.com/learner/dashboard",
          });

          doc.link(rectX - 168, rectY + 153, rectW, rectH, {
            url: "https://cpewarehouse.com/learner/dashboard",
          });

          doc.link(rectX + 43, rectY + 247, rectW, rectH, {
            url: "https://cpewarehouse.com/learner/dashboard",
          });

          doc.link(rectX - 14, rectYFix + 422, rectW + 120, rectH + 18, {
            url: "https://cpewarehouse.com/learner/dashboard",
          });

          doc.link(rectX - 210, rectYFix + 484, rectW + 50, rectH + 10, {
            url: "https://www.linkedin.com/company/cpewarehouse",
          });

          doc.link(rectX - 40, rectYFix + 484, rectW - 5, rectH + 10, {
            url: "https://twitter.com/cpe4cpa",
          });

          doc.link(rectX + 68, rectYFix + 484, rectW + 45, rectH + 10, {
            url: "https://www.facebook.com/cpewarehouse",
          });

          doc.link(rectX + 235, rectYFix + 484, rectW + 50, rectH + 10, {
            url: "https://instagram.com/cpe_warehouse",
          });

          doc.save(`invoice_${InvoiceNo}.pdf`);

          console.log("invoice downloaded successfully");
        },
      });
    } catch (error) {
      console.error("Error generating invoice:", error);
    }
  };

  const getinvoiceList = async () => {

    const email = localStorage.getItem('email')?.toString() || '';

    let allInvoices = [];

    let res = await getOrderDetailByUserEmail(email);
    allInvoices = res.data;
    setAllInvoices(allInvoices);

    // Extract all unique years from invoice list
    const yearsSet = new Set<number>();
    allInvoices.forEach((invoice: any) => {
      const year = new Date(invoice.attributes.createdAt).getFullYear();
      yearsSet.add(year);
    });

    let years = Array.from(yearsSet).sort((a, b) => b - a); // Sort descending
    if (years.includes(selectedYear)) {
      selectedYear = selectedYear;
    } else if (years.length > 0) {
      selectedYear = years[0];
    }

    setAvailableYears(years)

    setSelectedYear(selectedYear)

    filterInvoicesByYear(allInvoices); // Initially show invoices for current year
  }

  function filterInvoicesByYear(allInvoices: any) {

    let invoices = allInvoices.filter((invoice: any) => {

      const createdAt = invoice?.attributes?.createdAt;
      if (createdAt) {
        const invoiceYear = new Date(createdAt).getFullYear();

        return invoiceYear === +selectedYear;
      }
      return false;
    });

    setFilteredInvoices(invoices)
    calculateTotalPages(allInvoices);
  }

  useEffect(() => {
    getUserData()
    getEventlist();
    getinvoiceList();
  }, [])

  return (
    <>
      <div className="bg-white py-8 px-8 flex flex-col gap-8">
        <h1 className="text-3xl font-semibold text-gray-900">Invoice(s)</h1>

        <h2 className="font-semibold text-gray-900">Asterid Group Inc., (dba CPE Warehouse) is a registered corporation inToronto, ON, Canada with an EIN #:98-1551198</h2>

        {/* PAGE TITLE */}
        <div className="flex gap-10 justify-end bg-[#eee] py-4 px-4 items-center max-w-6xl w-full">

          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="border rounded-lg px-4 py-2"
          > {
              availableYears.map((year: number, index: number) => (
                <option key={index}>{year}</option>
              ))
            }
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
                  Invoice
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                  Proof of Purchase
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredInvoices.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((invoice: any, index: number) => (
                <tr key={index} className="border-t hover:bg-gray-50">

                  <td className="px-6 py-4 text-sm text-gray-900">
                    {invoice.id}
                  </td>



                  <td className="px-6 py-4 text-sm text-gray-600">
                    {moment(invoice.attributes.createdAt).format("MMMM DD,YYYY")}
                  </td>

                  <td className="px-6 py-4 flex">

                    <span
                      onClick={() => downloadInvoice(invoice)}
                      className="px-3 py-1.5 flex cursor-pointer items-center gap-2 text-xs font-medium text-indigo-600"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M17.5 17.5H2.5M15 9.16667L10 14.1667M10 14.1667L5 9.16667M10 14.1667V2.5" stroke="#444CE7" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>

                      Download
                    </span>
                  </td>

                </tr>
              ))}
            </tbody>

          </table>

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
                setCurrentPage((p: any) => Math.min(p + 1, totalPages))
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