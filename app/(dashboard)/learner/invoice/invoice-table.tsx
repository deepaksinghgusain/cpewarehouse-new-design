"use client"
import { getInvoicetemplate, getOrderDetailByUserEmail } from "@/services/course"
import { useEffect, useState } from "react"
import jsPDF from "jspdf";
import moment from "moment";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Button } from "@/components/ui/button";

function InvoiceCard({ invoice, invoicesTem }: any) {
  const [err, setErr] = useState("");
  const [isDownloadingInvoice, setIsDownloadingInvoice] = useState(false);
  const user = useSelector((state: RootState) => state.user.user as any) || {};

  const downloadInvoice = async (
    invoice: any
  ) => {
    setIsDownloadingInvoice(true);

    const InvoiceNo = invoice?.id;

    const lastname =
      typeof window !== "undefined" ? localStorage.getItem("lastname") : "";

    let invoiceDate = invoice?.attributes?.createdAt || "";

    if (invoiceDate !== "") {
      invoiceDate = moment(invoice?.attributes?.createdAt).format(
        "MMMM DD, YYYY"
      );
    }

    const url = invoicesTem?.attributes?.invoiceTemplate?.data?.attributes?.url;

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
      const response = await fetch(process.env.NEXT_PUBLIC_API_BASE_URL + url);
      const template = await response.text();

      let html = template
        .replace(
          "{{userName}}",
          user.firstName + " " + user.lastName
        )
        .replace("{{invoiceNo}}", InvoiceNo)
        .replace(
          "{{address}}",
          user.state + ", " + user.country
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

        },
      });

      setIsDownloadingInvoice(false);
    } catch (error) {
      console.error("Error generating invoice:", error);
    }
  };

  return (
    <>
      <tr className="border-t border-t-gray-200 hover:bg-gray-50">

        <td className="px-6 py-4 text-sm text-gray-900">
          {invoice.id}
        </td>

        <td className="px-6 py-4 text-sm text-gray-600">
          {moment(invoice.attributes.createdAt).format("MMMM DD,YYYY")}
        </td>

        <td className="px-6 py-4 flex">

          <Button
            variant="default"
            onClick={() => downloadInvoice(invoice)}
            className="px-3 py-1.5 flex cursor-pointer items-center gap-2 text-xs font-medium text-indigo-600"
          >

            {isDownloadingInvoice ? (
              <Loader className="h-5 w-5 text-amber-300 animate-spin" />
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M17.5 17.5H2.5M15 9.16667L10 14.1667M10 14.1667L5 9.16667M10 14.1667V2.5" stroke="#444CE7" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
            {isDownloadingInvoice ? "Downloading..." : "Download"}
          </Button>
        </td>

      </tr>

      {
        err && <Dialog open={Boolean(err)} onOpenChange={() => setErr("")}>
          <DialogContent className='bg-white z-100'>
            <DialogHeader>
              <DialogTitle></DialogTitle>
              <DialogDescription>
                {err}
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      }
    </>
  )
}

export default function InvoiceDataTable() {
  const [loading, setLoading] = useState(true)

  let [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  let [availableYears, setAvailableYears] = useState<any>([])
  let [filteredInvoices, setFilteredInvoices] = useState<any>([])
  let [allInvoices, setAllInvoices] = useState<any>([])
  let [invoicesTem, setInvoicesTem] = useState<any>([])
  let [itemsPerPage, setItemsPerPage] = useState(5)
  let [currentPage, setCurrentPage] = useState(1)
  let [totalPages, setTotalPages] = useState(0)
  const user = useSelector((state: RootState) => state.user.user as any) || {};

  const calculateTotalPages = (allInvoices: any) => {
    let totalPages = Math.ceil(allInvoices.length / itemsPerPage);
    setTotalPages(totalPages)
  }

  const getinvoiceList = async () => {
    setLoading(true);

    const email = localStorage.getItem('email')?.toString() || '';

    let allInvoices = [];

    let res = await getOrderDetailByUserEmail(email);
    allInvoices = res.data;

    setAllInvoices(allInvoices);

    let invoicesTem = [];
    let resp = await getInvoicetemplate()

    if (resp) {
      invoicesTem = resp.global?.data;
      setInvoicesTem(invoicesTem)
    }

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
    setLoading(false)
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
    calculateTotalPages(invoices);
  }

  useEffect(() => {
    getinvoiceList();
  }, [allInvoices.length, selectedYear])

  return (
    <>
      <div className="bg-white py-8 px-8 flex flex-col gap-8">
        <h1 className="text-3xl font-semibold text-gray-900">Invoice(s)</h1>

        <h2 className="font-semibold text-gray-900">Asterid Group Inc., (dba CPE Warehouse) is a registered corporation inToronto, ON, Canada with an EIN #:98-1551198</h2>

        {/* PAGE TITLE */}
        <div className="flex gap-10 justify-end bg-[#eee] py-4 px-4 items-center max-w-6xl w-full">

          <Select value={String(selectedYear)} onValueChange={(value) => setSelectedYear(Number(value))}>
            <SelectTrigger className="w-[120px] flex items-center gap-2 px-3.5 py-2.5 text-sm font-semibold text-gray-500 bg-white border border-gray-300 rounded-lg shadow-sm">

              {/* Icon */}
              <span className="flex items-center justify-center w-5 h-5">
                <svg
                  className="w-4 h-4 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 7V3M16 7V3M4 11H20M5 5H19C20.1 5 21 5.9 21 7V19C21 20.1 20.1 21 19 21H5C3.9 21 3 20.1 3 19V7C3 5.9 3.9 5 5 5Z" />
                </svg>
              </span>

              <SelectValue placeholder="Year" />
            </SelectTrigger>

            <SelectContent
              side="bottom"
              align="start"
              sideOffset={4} position="popper" className='border-gray-200 z-50 bg-white'>
              {
                availableYears.length > 0 ? availableYears.map((year: number, index: number) => (
                  <SelectItem value={String(year)} key={index}>{year}</SelectItem>
                )) : <SelectItem value={String(new Date().getFullYear())}>{new Date().getFullYear()}</SelectItem>
              }
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="px-8 py-6">

        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">

          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-4">
              {/* Spinner */}

              <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>

              <p className="text-gray-500 text-sm">
                Loading invoices...
              </p>
            </div>

          ) : (
            <>
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
                    <InvoiceCard key={index} invoice={invoice} invoicesTem={invoicesTem} />
                  ))}
                </tbody>

              </table>

              <div className="flex items-center justify-between px-6 py-4 border-t border-t-gray-200 bg-gray-50">

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
            </>
          )}


        </div>
      </div>

    </>
  )
}