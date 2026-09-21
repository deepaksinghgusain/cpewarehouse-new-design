"use client"

import { GetUserSubscribedCourses } from "@/services/course"
import { useEffect, useState } from "react"
import moment from "moment";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader } from "lucide-react";
import { downloadCertificatePdf } from "@/lib/certificate";

function CertificateCard({ data }: any) {
  const [err, setErr] = useState("");
  const [isDownloadingCertificate, setIsDownloadingCertificate] = useState(false);
  const [courseCompletedOn, setCourseCompletedOn] = useState<string | null>(null);
  const user = useSelector((state: RootState) => state.user.user as any) || {};

  const downloadCertificate = async () => {

    setIsDownloadingCertificate(true);
    try {
      const courseResult = data;
      const course = courseResult?.course;
      const completedOn = courseResult?.completedOn || courseCompletedOn;

      if (!course) {
        setErr("Course details are not available for certificate download.");
        return;
      }

      const usernameFromStorage = localStorage.getItem("username") || "";
      const firstName = user?.firstName || "";
      const lastName = user?.lastName || "";
      const fullName = `${firstName} ${lastName}`.trim() || usernameFromStorage;
      await downloadCertificatePdf(course, completedOn, fullName);
    } catch (error) {
      console.error("Certificate download failed", error);
      setErr("Unable to download certificate right now. Please try again.");
    } finally {
      setIsDownloadingCertificate(false);
    }
  };

  return (
    <>
      <tr className="border-t border-t-gray-200 hover:bg-gray-50">

        <td className="px-6 py-4 text-sm text-gray-900">
          {data?.course?.title}
        </td>

        <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
          {data?.completedOn}
        </td>

        <td className="px-6 py-4 whitespace-nowrap">
          <span
            className={`inline-block whitespace-nowrap px-2 py-1 text-xs font-medium rounded-full border ${data?.course?.category === "Live"
              ? "bg-blue-50 text-blue-700 border-blue-200"
              : "bg-pink-50 text-pink-700 border-pink-200"
              }`}
          >
            {data?.category === "Live" ? "Live Webinar" : data?.category === "Recorded" ? "Self-Study" : data?.category}
          </span>
        </td>

        <td className="px-6 py-4">
          <span className="px-2.5 py-0.5 text-sm font-medium rounded-full border bg-green-50 text-green-700 border-green-200">
            {data?.course?.credit ?? 0}
          </span>
        </td>

        <td className="px-6 py-4 text-sm text-gray-600">
          {data?.course?.fieldOfStudy}
        </td>

        <td className="px-6 py-4 flex">

          <span
            onClick={() => downloadCertificate()}
            className="flex cursor-pointer items-center gap-2 whitespace-nowrap px-3 py-1.5 text-xs font-medium text-indigo-600"
          >
            {isDownloadingCertificate ? (
              <Loader className="h-5 w-5 text-amber-300 animate-spin" />
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M17.5 17.5H2.5M15 9.16667L10 14.1667M10 14.1667L5 9.16667M10 14.1667V2.5" stroke="#444CE7" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
            {isDownloadingCertificate ? "Downloading..." : "Download"}
          </span>
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

export default function CertificateDataTable() {
  const [loading, setLoading] = useState(true)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [availableYears, setAvailableYears] = useState<any>([])
  const [certificates, setCertificates] = useState<any>([])
  const [filteredCertificates, setFilteredCertificates] = useState<any>([])
  const [itemsPerPage, setItemsPerPage] = useState(5)
  let [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)

  const getEventlist = async () => {
    setLoading(true)
    const email = localStorage.getItem('email')?.toString() || '';
    let certificates = [];
    let selectedYear;

    let res = await GetUserSubscribedCourses(email)


    const coursesPurchased: any[] = [];
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
          'courseType': course?.category?.data?.attributes?.title.toLowerCase() == 'recorded'
            ? 'Self-Study'
            : 'Live',
          'completionPercentage': usercourse?.completionPercentage || 0 // Assuming this property exists
        });
      }
    });

    // Filter for completed live events
    const completedLiveCertificates = coursesPurchased.filter(
      (item: any) => item.status.toLowerCase() === 'completed' && item.category.toLowerCase() === 'live'
    );

    // Filter for self-study courses that are completed AND have 70% or more completion
    const completedSelfStudyCourses = coursesPurchased.filter(
      (item: any) => item.courseType === 'Self-Study' &&
        (item.status.toLowerCase() === 'completed' || item.completionPercentage >= 70)
    );

    // Combine the two filtered arrays
    certificates = [...completedLiveCertificates, ...completedSelfStudyCourses];
    certificates = certificates.sort((a: any, b: any) =>
      Date.parse(a.startDate) < Date.parse(b.startDate) ? 1 : -1
    );


    setCertificates(certificates)

    const years: number[] = extractYears(certificates);
    selectedYear = years[0] || new Date().getFullYear();
    setSelectedYear(selectedYear)
    setLoading(false)
  }

  const extractYears = (certificateList = certificates): number[] => {
    const availableYears: number[] = Array.from(new Set(
      certificateList
        .filter((cert: any) => cert?.completedOn && !Number.isNaN(new Date(cert.completedOn).getTime()))
        .map((cert: any) => new Date(cert.completedOn).getFullYear())
    ));
    availableYears.sort((a, b) => b - a);

    setAvailableYears(availableYears)
    return availableYears;
  }

  const filterCertificates = (certificateList = certificates, year = selectedYear) => {
    let filteredCertificates = certificateList.filter((cert: any) => {
      if (!cert?.completedOn || Number.isNaN(new Date(cert.completedOn).getTime())) return false;
      const certificateYear = moment(cert.completedOn).year();
      return certificateYear === Number(year);
    });

    setFilteredCertificates(filteredCertificates)
    calculateTotalPages();
  }

  const onPageChange = (event: number) => {
    if (event >= 1 && event <= totalPages) {
      currentPage = event;
      window.scrollTo(0, 830);
    }
  }

  const calculateTotalPages = () => {
    let totalPages = Math.ceil(filteredCertificates.length / itemsPerPage);
    setTotalPages(totalPages)
  }

  useEffect(() => {
    getEventlist();
  }, [])

  useEffect(() => {
    filterCertificates();
  }, [certificates, selectedYear])

  return (
    <>
      <div className="flex flex-col gap-6 bg-white px-4 py-6 sm:gap-8 sm:px-6 sm:py-8 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-900 sm:text-3xl">Certificate(s)</h1>

        {/* PAGE TITLE */}
        <div className="flex w-full max-w-6xl items-center justify-end bg-[#eee] px-4 py-4">

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

      <div className="px-4 py-6 sm:px-6 lg:px-8">

        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">


          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-4">
              {/* Spinner */}

              <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>

              <p className="text-gray-500 text-sm">
                Loading certificates...
              </p>
            </div>

          ) : (
            <>
              <div className="w-full overflow-x-auto">
              <table className="w-full min-w-[820px]">

                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                      Course Name
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
                      Subject
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                      Certificate
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredCertificates.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((course: any, index: number) => (
                    <CertificateCard key={index} data={course} />
                  ))}
                </tbody>

              </table>
              </div>

              <div className="flex items-center justify-between gap-3 overflow-x-auto border-t border-t-gray-200 bg-gray-50 px-4 py-4 sm:px-6">

                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  className="px-3 py-1 text-sm border rounded-md hover:bg-gray-100"
                >
                  Previous
                </button>

                <div className="flex shrink-0 gap-2">
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