"use client"

import { GetUserSubscribedCourses } from "@/services/course"
import { useEffect, useState } from "react"
import jsPDF from "jspdf";
import moment from "moment";
import html2canvas from "html2canvas";

export default function CertificateDataTable() {
  const [selectedYear, setSelectedYear] = useState(2024)
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    company: "",
    ptin: "",
    state: "",
    country: "",
    phone: "",
    imgUrl: "",
  })

  const [availableYears, setAvailableYears] = useState<any>([])
  const [certificates, setCertificates] = useState<any>([])

  const [filteredCertificates, setFilteredCertificates] = useState<any>([])
  const [itemsPerPage, setItemsPerPage] = useState(5)
  let [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)

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

    extractYears(); // Extract available years

    // Select the latest year if availableYears has elements
    if (availableYears.length > 0) {
      selectedYear = availableYears[0];
    } else {
      selectedYear = new Date().getFullYear(); // Fallback to current year if no certificates
    }

    setSelectedYear(selectedYear)

    filterCertificates(); // Initial filtering
  }

  const extractYears = () => {
    let availableYears = Array.from(new Set(certificates.map((cert: any) => {
      console.log(cert);

      return new Date(cert.completedOn).getFullYear()
    })));
    availableYears.sort((a: any, b: any) => b - a);

    setAvailableYears(availableYears)
  }

  const filterCertificates = () => {
    let filteredCertificates = certificates.filter((cert: any) => {
      const certificateYear = moment(cert.completedOn).year();
      console.log('Certificate Year:', certificateYear);
      console.log('Comparison:', certificateYear === Number(selectedYear)); // Convert to number
      return certificateYear === Number(selectedYear);
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

  const downloadCertificate = async (certificate: any) => {

    console.log("Download button clicked!");

    if (!certificate) {
      console.error("No certificate data provided.");
      return;
    }

    const course = certificate?.course ?? {};

    const url = certificate?.course?.certificateTemplate?.data?.attributes?.url;

    if (!url) {
      console.error("Certificate URL missing.");
      return;
    }

    const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

    const fileUrl = url.startsWith("http") ? url : `${baseURL}${url}`;

    const title = course.title || "";
    const credit = course.credit || "";
    const medium = course.medium || "";
    const fieldStudy = course.fieldOfStudy || "";
    const program = course.programNumber || "";

    let datecompleted = certificate.completedOn || "";

    if (datecompleted !== "") {
      datecompleted = moment(datecompleted).format("MMMM DD, YYYY");
    }

    try {

      const response = await fetch(fileUrl);
      const htmlTemplate = await response.text();

      let html = htmlTemplate
        .replace("{{username}}", profileData.firstName + " " + profileData.lastName)
        .replace("{{course}}", title)
        .replace("{{credit}}", credit)
        .replace("{{medium}}", medium)
        .replace("{{fieldStudy}}", fieldStudy)
        .replace("{{completedOn}}", datecompleted)
        .replace("{{program}}", program);

      const container = document.createElement("div");
      container.innerHTML = html;
      container.style.width = "745px";
      container.style.position = "absolute";
      container.style.left = "-9999px";

      document.body.appendChild(container);

      const canvas = await html2canvas(container);

      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "pt", [745, 745]);

      pdf.addImage(imgData, "PNG", 0, 0, 745, 745);

      pdf.save(`certificate_${title}.pdf`);

      document.body.removeChild(container);

    } catch (error) {
      console.error("Certificate generation failed", error);
    }
  };

  useEffect(() => {
    getUserData()
    getEventlist();

    console.log(filteredCertificates);

  }, [certificates.length, filteredCertificates.length])


  return (
    <>
      <div className="bg-white py-8 px-8 flex flex-col gap-8">
        <h1 className="text-3xl font-semibold text-gray-900">Certificate(s)</h1>

        {/* PAGE TITLE */}
        <div className="flex gap-4 justify-end bg-[#eee] py-4 items-center max-w-6xl w-full">

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
                <tr key={index} className="border-t hover:bg-gray-50">

                  <td className="px-6 py-4 text-sm text-gray-900">
                    {course.course.title}
                  </td>



                  <td className="px-6 py-4 text-sm text-gray-600">
                    {course.completedOn}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full border ${course.category === "Live"
                        ? "bg-blue-50 text-blue-700 border-blue-200"
                        : "bg-pink-50 text-pink-700 border-pink-200"
                        }`}
                    >
                      {course.category}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <span className="px-2.5 py-0.5 text-sm font-medium rounded-full border bg-green-50 text-green-700 border-green-200">
                      {course.course.credit ?? 0}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-600">
                    {course.fieldOfStudy}
                  </td>

                  <td className="px-6 py-4 flex">

                    <span
                      onClick={() => downloadCertificate(course)}
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