"use client"
import React, { useEffect, useState } from 'react'
import { BookOpen, Calendar, Clock, Download, CheckCircle, Loader } from 'lucide-react';
import { getUpcomingCourse, GetUserSubscribedCourses } from '@/services/course';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { imageUrl } from '@/lib/constants';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toUserTZ } from '@/lib/dates';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { Card } from '@/components/ui/card';
import { jsPDF } from 'jspdf';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { redirect } from 'next/navigation';
import moment from 'moment';

function PastEventCard({ event }: any) {
    const [err, setErr] = useState("");
    const [isDownloadingCertificate, setIsDownloadingCertificate] = useState(false);
    const [courseCompletedOn, setCourseCompletedOn] = useState<string | null>(null);
    const user = useSelector((state: RootState) => state.user.user as any) || {};

    let category = ""

    if (event?.category.toLowerCase() === "live") {
        category = "Live Webinar"
    }

    if (event?.category.toLowerCase() === "recorded") {
        category = "Self Study"
    }

    const getUserCourse = async (courseSlug: string) => {
        const userEmail = localStorage.getItem("email") || "";
        if (!userEmail || !courseSlug) return null;

        const res: any = await GetUserSubscribedCourses(userEmail);

        if (res) {
            const filterCourses = res?.data?.filter((element: any) => {
                return element.attributes?.course?.data?.attributes?.slug === courseSlug;
            });

            if (filterCourses?.length > 0) {
                const selectedCourse = filterCourses[0];
                const viewedTime = Number(selectedCourse?.attributes?.lastVideoView || 0);
                const courseDetails = selectedCourse?.attributes?.course?.data?.attributes || null;

                setCourseCompletedOn(selectedCourse?.attributes?.completedOn || null);

                return {
                    course: courseDetails,
                    completedOn: selectedCourse?.attributes?.completedOn || null,
                };
            }
        }

        return null;
    };

    const formatCompletedDate = (completedOn: string | null) => {
        if (!completedOn) return "";
        const date = new Date(completedOn);
        if (Number.isNaN(date.getTime())) return "";

        return date.toLocaleDateString("en-US", {
            month: "long",
            day: "2-digit",
            year: "numeric",
        });
    };

    const downloadCertificate = async () => {

        setIsDownloadingCertificate(true);
        try {
            const courseResult = await getUserCourse(event.course.slug);
            const course = courseResult?.course;
            const completedOn = courseResult?.completedOn || courseCompletedOn;

            if (!course) {
                setErr("Course details are not available for certificate download.");
                return;
            }

            const templatePath = course?.certificateTemplate?.data?.attributes?.url;
            if (!templatePath) {
                setErr("Certificate template is not configured for this course.");
                return;
            }

            const title = course?.title || "course";
            const credit = String(course?.credit || "");
            const medium = course?.medium || "";
            const fieldStudy = course?.fieldOfStudy || "";
            const program = course?.programNumber || "";
            const usernameFromStorage = localStorage.getItem("username") || "";
            const firstName = user?.firstName || "";
            const lastName = user?.lastName || "";
            const fullName = `${firstName} ${lastName}`.trim() || usernameFromStorage;
            const datecompleted = formatCompletedDate(completedOn);
            const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
            const templateUrl = `${baseUrl}${templatePath}`;

            const response = await fetch(templateUrl);
            const templateHtml = await response.text();

            let html = templateHtml
                .replace(/{{username}}/g, fullName)
                .replace(/{{course}}/g, title)
                .replace(/{{credit}}/g, credit)
                .replace(/{{medium}}/g, medium)
                .replace(/{{fieldStudy}}/g, fieldStudy)
                .replace(/{{completedOn}}/g, datecompleted)
                .replace(/{{program}}/g, program);

            if (usernameFromStorage) {
                html = html.replace(/{{username_alt}}/g, usernameFromStorage);
            }

            const doc = new jsPDF('p', 'pt', [745, 745]);
            doc.html(html, {
                callback: function (pdfDoc: any) {
                    pdfDoc.save(`certificate_${title}.pdf`);
                },
            });
        } catch (error) {
            console.error("Certificate download failed", error);
            setErr("Unable to download certificate right now. Please try again.");
        } finally {
            setIsDownloadingCertificate(false);
        }
    };

    return (
        <>
            <div className="w-full p-4 bg-white rounded-xl shadow-sm border border-gray-200 flex items-center gap-5">

                {/* Course Image */}
                <img
                    src={imageUrl + event.image}
                    alt="course"
                    className="w-48 h-36 object-cover rounded-lg"
                />

                {/* Course Content */}
                <div className="flex-1 flex flex-col gap-4">

                    {/* Title Section */}
                    <div className="flex flex-col gap-1">
                        <span className="text-pink-600 text-sm font-medium">
                            {category}
                        </span>

                        <h3 className="text-gray-900 text-lg font-semibold leading-7">
                            {event.course.title}
                        </h3>
                    </div>

                    {/* Meta Info */}
                    <div className="flex items-center gap-6 flex-wrap">

                        <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
                            <Clock className="w-4 h-4" />
                            Self Paced
                        </div>

                        <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
                            <img src={imageUrl + event.instructors.image.data.attributes.url} height="20" width="20" className='rounded-xl' />
                            {event.instructors?.firstName}
                        </div>

                    </div>
                </div>

                {/* Download Button */}
                <button
                    type="button"
                    onClick={downloadCertificate}
                    disabled={isDownloadingCertificate}
                    className="flex items-center cursor-pointer gap-2 px-4 py-3 bg-indigo-600 text-white rounded-lg shadow-sm hover:bg-indigo-700 transition"
                >
                    {isDownloadingCertificate ? (
                        <Loader className="h-5 w-5 text-amber-300 animate-spin" />
                    ) : (
                        <Download className="h-5 w-5 text-amber-300" />
                    )}
                    {isDownloadingCertificate ? "Downloading..." : "Download"}
                </button>
            </div>

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


function RegisteredEventCard({ event, onLaunch }: any) {
    let category = ""

    if (event?.category.toLowerCase() === "live") {
        category = "Live Webinar"
    }

    if (event?.category.toLowerCase() === "recorded") {
        category = "Self Study"
    }

    const [err, setErr] = useState("");
    const [isDownloadingHandout, setIsDownloadingHandout] = useState(false);
    const [courseCompletedOn, setCourseCompletedOn] = useState<string | null>(null);

    const getUserCourse = async (courseSlug: string) => {
        const userEmail = localStorage.getItem("email") || "";
        if (!userEmail || !courseSlug) return null;

        const res: any = await GetUserSubscribedCourses(userEmail);

        if (res) {
            const filterCourses = res?.data?.filter((element: any) => {
                return element.attributes?.course?.data?.attributes?.slug === courseSlug;
            });

            if (filterCourses?.length > 0) {
                const selectedCourse = filterCourses[0];
                const viewedTime = Number(selectedCourse?.attributes?.lastVideoView || 0);
                const courseDetails = selectedCourse?.attributes?.course?.data?.attributes || null;

                setCourseCompletedOn(selectedCourse?.attributes?.completedOn || null);

                return {
                    course: courseDetails,
                    completedOn: selectedCourse?.attributes?.completedOn || null,
                };
            }
        }

        return null;
    };

    const downloadHandout = async () => {
        setIsDownloadingHandout(true);

        try {
            const courseResult = await getUserCourse(event.course.slug);
            const course = courseResult?.course;

            if (!course) {
                setErr("Course details not available for handout download.");
                return;
            }

            const handoutsData = course?.handout?.data;
            if (!handoutsData || !Array.isArray(handoutsData) || handoutsData.length === 0) {
                setErr("No handouts available for this course.");
                return;
            }


            const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
            let downloadCount = 0;

            for (const handout of handoutsData) {
                const handoutUrl = handout?.attributes?.url;
                if (!handoutUrl) continue;

                const fileUrl = `${baseUrl}${handoutUrl}`;
                const response = await fetch(fileUrl);
                const blob = await response.blob();
                const objectUrl = URL.createObjectURL(blob);

                const link = document.createElement('a');
                link.href = objectUrl;
                link.download = handout?.attributes?.name || `handout-${downloadCount + 1}`;
                link.target = "_blank";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(objectUrl);

                downloadCount++;
            }

            if (downloadCount === 0) {
                setErr("No valid handouts could be downloaded.");
            } else {
                setErr("");
            }
        } catch (error) {
            console.error("Handout download failed", error);
            setErr("Unable to download handouts. Please try again.");
        } finally {
            setIsDownloadingHandout(false);
        }
    };

    return (
        <>
            <div className="flex items-center gap-6 p-4 border border-gray-200 rounded-xl hover:shadow-md transition w-full">

                {/* Image */}
                <img
                    src={imageUrl + event.image}
                    className="w-48 h-36 rounded-lg object-cover"
                    alt=""
                />

                {/* Content */}
                <div className="flex flex-col flex-1 justify-between">

                    <div>
                        <span className="text-pink-600 text-sm font-medium">{category}</span>

                        <h3 className="text-lg font-semibold text-gray-900 mt-1">
                            {event.course.title}
                        </h3>
                    </div>

                    <div className="flex flex-wrap gap-6 text-gray-600 text-sm mt-3">

                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {toUserTZ(event.startDate)?.format("ddd, MMM DD YYYY")}
                        </div>

                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            {toUserTZ(event.startDate)?.format("h:mm A")} - {toUserTZ(event.endDate)?.format("h:mm A")} {toUserTZ(event.startDate)?.format('z')}
                        </div>

                        <div className="flex items-center gap-2">
                            <img src={imageUrl + event.instructors?.image?.data?.attributes?.url} height="20" width="20" className='rounded-xl' />
                            {event.instructors?.firstName} {event.instructors?.lastName}
                        </div>
                    </div>

                    <div className="mt-3 flex items-center gap-4">

                        <button
                            type="button"
                            onClick={downloadHandout}
                            disabled={isDownloadingHandout}
                            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 font-medium transition-all ${isDownloadingHandout
                                ? "border-gray-300 bg-gray-100 text-gray-600 cursor-not-allowed opacity-60"
                                : "border-indigo-300 text-indigo-600 hover:bg-indigo-50 cursor-pointer"
                                }`}
                        >
                            {isDownloadingHandout ? (
                                <Loader className="h-5 w-5 animate-spin" />
                            ) : (
                                <Download className="h-5 w-5" />
                            )}
                            {isDownloadingHandout ? "Downloading..." : "Handouts"}
                        </button>
                    </div>
                </div>

                {/* Action */}
                <button
                    type="button"
                    onClick={() => onLaunch(event)}
                    className="h-fit flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 cursor-pointer"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M9.99967 12.5L7.49967 10M9.99967 12.5C11.1637 12.0573 12.2804 11.499 13.333 10.8334M9.99967 12.5V16.6667C9.99967 16.6667 12.5247 16.2084 13.333 15C14.233 13.65 13.333 10.8334 13.333 10.8334M7.49967 10C7.94313 8.84957 8.50151 7.74676 9.16634 6.70838C10.1373 5.15587 11.4894 3.87758 13.0938 2.99512C14.6983 2.11266 16.5019 1.65535 18.333 1.66671C18.333 3.93338 17.683 7.91671 13.333 10.8334M7.49967 10H3.33301C3.33301 10 3.79134 7.47504 4.99967 6.66671C6.34967 5.76671 9.16634 6.66671 9.16634 6.66671M3.74967 13.75C2.49967 14.8 2.08301 17.9167 2.08301 17.9167C2.08301 17.9167 5.19967 17.5 6.24967 16.25C6.84134 15.55 6.83301 14.475 6.17467 13.825C5.85076 13.5159 5.42409 13.3372 4.97653 13.3234C4.52897 13.3096 4.09207 13.4615 3.74967 13.75Z" stroke="white" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Launch
                </button>
            </div>
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


function RecommendedEventCard({ event }: any) {
    let category = ""

    if (event.attributes.category.data.attributes.title.toLowerCase() === "live") {
        category = "Live Webinar"
    }

    if (event.attributes.category.data.attributes.title.toLowerCase() === "recorded") {
        category = "Self Study"
    }


    return (
        <div className="w-full p-4 bg-white rounded-xl border border-gray-200 shadow-sm flex gap-5 items-center">

            {/* Image */}
            <img
                src={imageUrl + event.attributes.image.data.attributes.url}
                alt="course"
                className="w-48 h-40 object-cover rounded-lg"
            />

            {/* Content */}
            <div className="flex-1 flex flex-col gap-4">

                {/* Title */}
                <div className="flex flex-col gap-1">
                    <span className="text-pink-600 text-sm font-medium">
                        {category}
                    </span>

                    <h3 className="text-gray-900 text-lg font-semibold leading-7">
                        {event.attributes.title}
                    </h3>
                </div>

                {/* Meta */}
                <div className="flex items-center gap-6 flex-wrap text-gray-600 text-sm font-medium">

                    <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {toUserTZ(event.attributes.startDate)?.format("ddd, MMM DD YYYY")}
                    </div>

                    <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {toUserTZ(event.attributes.startDate)?.format("h:mm A")} - {toUserTZ(event.attributes.endDate)?.format("h:mm A")} {toUserTZ(event.attributes.startDate)?.format('z')}
                    </div>

                    <div className="flex items-center gap-2">
                        <img src={imageUrl + event?.attributes?.instructors?.data[0].attributes?.image?.data?.attributes?.url} height="20" width="20" className='rounded-xl' />
                        {event?.attributes.instructors.data[0].attributes.firstName} {event?.attributes.instructors.data[0].attributes.lastName}
                    </div>

                </div>

                {/* Features */}
                <div className="flex items-center gap-8 flex-wrap text-gray-600">

                    <div className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        Recording (via email)
                    </div>

                    <div className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        Handouts
                    </div>

                    <div className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        CPE Certificate
                    </div>

                </div>

            </div>

            {/* Button */}
            <Link href={`/course/${event.attributes?.slug}`} className="px-4 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition">
                Read more
            </Link>
        </div>
    );
}

const BasicDetails = () => {
    const [mounted, setMounted] = useState(false)
    const [isPageLoading, setIsPageLoading] = useState(true)
    const user = useSelector((state: RootState) => state.user.user as any) || {};
    let [certificates, setCertificates] = useState<any>([]);
    let [totalCreditEarned, settTotalCreditEarned] = useState(0);
    let [availableYears, setAvailableYears] = useState<number[]>([]);
    let [certificatesByYear, setCertificatesByYear] = useState<{ [year: number]: { fieldOfStudy: string, credit: number }[] }>({});
    let [pastEvents, setPastEvents] = useState([]);
    let [regEvent, setRegEvent] = useState([]);
    let [upcommingEvent, setUpcommingEvent] = useState([]);
    let [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
    const [isSubscriptionExpired, setIsSubscriptionExpired] = useState(false);
    const [subscriptionExpiredDate, setSubscriptionExpiredDate] = useState("");
    const [isSubscriptionRenewalDue, setIsSubscriptionRenewalDue] = useState(false);
    const registeredEventsForSelectedYear = regEvent.filter((event: any) => {
        const eventDate = new Date(event.startDate);
        return !Number.isNaN(eventDate.getTime()) && eventDate.getFullYear() === selectedYear;
    });
    const pastEventsForSelectedYear = pastEvents.filter((event: any) => {
        const eventDate = new Date(event.startDate);
        return !Number.isNaN(eventDate.getTime()) && eventDate.getFullYear() === selectedYear;
    });

    const gotowebinar = (webinarId?: string, joinUrl?: string) => {
        const webinarLink = joinUrl || (webinarId ? `https://global.gotowebinar.com/join/${webinarId}` : "");
        if (webinarLink) {
            window.open(webinarLink, "_blank");
        }
    };

    const navigateToVideo = (videoUrl?: string, slug?: string, eventImage?: string) => {
        if (!videoUrl) return;

        const baseOrigin = window.location.origin;
        const params = new URLSearchParams();

        // Pass video URL as query parameter to preserve all query params and special characters
        params.append('videoUrl', videoUrl.trim());

        // Add slug if provided
        if (slug) {
            params.append('slug', slug);
        }

        // Add image if provided
        if (eventImage) {
            const absoluteImageUrl = eventImage.startsWith("http") ? eventImage : `${imageUrl}${eventImage}`;
            params.append('image', absoluteImageUrl);
        }

        const targetUrl = `${baseOrigin}/learner/view-webinar?${params.toString()}`;
        redirect(targetUrl);
    };

    const launchEvent = (event: any) => {
        if (event.courseType === 'Live Webinar') {
            gotowebinar(event?.course?.webinarId, event?.joinUrl);
        } else if (event.courseType === 'Self-Study') {
            navigateToVideo(event?.course?.videoUrl, event?.course?.slug, event?.image);
        }
    };

    async function getUserSubscription() {

        const token = localStorage.getItem("token");
        const email = localStorage.getItem("email");

        let response = await fetch(process.env.NEXT_PUBLIC_API_BASE_URL + "/api/annual-pass-subscriptions?populate=user", {
            headers: {
                "Authorization": `Bearer ${token}`,
                "content-type": "application/json"
            },
        })

        let res = await response.json();

        const subscriptions = res.data.filter((d: any) =>
            d.attributes?.user?.data?.attributes?.email === email
        );

        const today = new Date();
        const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const activeSubscriptionEndDates = subscriptions.map((subscription: any) => {
            const endDate = subscription.attributes?.endDate;
            if (!endDate) return null;

            const [year, month, day] = endDate.split('-').map(Number);
            const subscriptionEndDate = new Date(year, month - 1, day);
            return subscriptionEndDate >= todayDate ? subscriptionEndDate : null;
        }).filter((endDate: Date | null): endDate is Date => endDate !== null);

        const latestActiveEndDate = activeSubscriptionEndDates.length > 0
            ? new Date(Math.max(...activeSubscriptionEndDates.map((endDate : any) => endDate.getTime())))
            : null;

        if (latestActiveEndDate) {
            const daysUntilExpiration = Math.floor(
                (latestActiveEndDate.getTime() - todayDate.getTime()) / (1000 * 60 * 60 * 24)
            );

            setSubscriptionExpiredDate(latestActiveEndDate.toISOString().split('T')[0]);
            setIsSubscriptionRenewalDue(daysUntilExpiration <= 15);
        } else {
            setSubscriptionExpiredDate("");
            setIsSubscriptionRenewalDue(false);
        }

        setIsSubscriptionExpired(subscriptions.length > 0 && !latestActiveEndDate);
    }

    async function getEventlist() {
        const email = localStorage.getItem('email')?.toString() || '';

        let availableYears = [];
        let regEvent = []
        const coursesPurchased: any = []
        const todayLocal = new Date();
        const yyyy = todayLocal.getFullYear();
        const mm = String(todayLocal.getMonth() + 1).padStart(2, '0');
        const dd = String(todayLocal.getDate()).padStart(2, '0');
        const localTime = `${yyyy}-${mm}-${dd}T00:00:00.000Z`; // store localTime (based on local date)

        let res = await GetUserSubscribedCourses(email);

        const fieldCreditMapByYear: { [year: number]: Map<string, number> } = {};

        const subscribedCourseIds: number[] = [];

        res.data.forEach((element: any) => {
            const course = element?.attributes?.course?.data?.attributes;
            const usercourse = element.attributes;

            if (element?.attributes?.course?.data != null) {
                subscribedCourseIds.push(parseInt(element?.attributes?.course?.data?.id));
            }

            if (course !== undefined) {
                if (course != undefined) {
                    coursesPurchased.push({
                        'course': course,
                        'startDate': course?.startDate,
                        'image': course?.image?.data?.attributes?.url,
                        'category': course?.category?.data?.attributes?.title,
                        'instructors': course?.instructors?.data?.[0]?.attributes,
                        'webinarId': course?.webinarId || '',
                        'joinUrl': usercourse?.joinUrl,
                        'status': usercourse?.status,
                        'completedOn': usercourse?.completedOn,
                        'watchRecording': course?.category?.data?.attributes?.title.toLowerCase() == 'recorded',
                        'purchasedOn': usercourse?.purchasedOn,
                        'courseType': course?.category?.data?.attributes?.title.toLowerCase() == 'recorded'
                            ? 'Self-Study'
                            : 'Live Webinar' // Determine course type
                    })
                }


                let creditValue = parseFloat(course?.credit) || 0;
                let fieldOfStudy = course?.fieldOfStudy || 'Unknown';
                let completedOn = usercourse?.completedOn;
                let completedYear = completedOn ? new Date(completedOn).getFullYear() : null;
                const categoryLower = course?.category?.data?.attributes?.title.toLowerCase();

                const includeCredit = (categoryLower === 'live' && usercourse?.status?.toLowerCase() === 'completed' && completedYear) || categoryLower === 'recorded';

                if (includeCredit && completedYear) {
                    if (!fieldCreditMapByYear[completedYear]) {
                        fieldCreditMapByYear[completedYear] = new Map<string, number>();
                    }
                    const yearMap = fieldCreditMapByYear[completedYear];
                    yearMap.set(fieldOfStudy, (yearMap.get(fieldOfStudy) || 0) + creditValue);
                }
            }
        });

        const response = await getUpcomingCourse(subscribedCourseIds);
        let upcomingEvents = response.data;
        setUpcommingEvent(upcomingEvents)

        regEvent = coursesPurchased;

        // regEvent.sort((a: any, b: any) => {
        //     if (a.courseType === 'Live Webinar' && b.courseType !== 'Live Webinar') {
        //         return -1;
        //     }
        //     if (a.courseType !== 'Live Webinar' && b.courseType === 'Live Webinar') {
        //         return 1;
        //     }
        //     return (Date.parse(a.startDate) < Date.parse(b.startDate)) ? -1 : 1;
        // });

        setRegEvent(regEvent);

        let pastEvents = coursesPurchased.filter((element: any) => (element.category.toLowerCase() === "live")
            && new Date(element?.course?.endDate) <= new Date(localTime)
        );

        pastEvents = pastEvents.sort((a: any, b: any) => (Date.parse(a.startDate) < Date.parse(b.startDate)) ? 1 : -1);

        setPastEvents(pastEvents)

        availableYears = Object.keys(fieldCreditMapByYear).map(Number).sort((a, b) => b - a);
        setAvailableYears(availableYears);

        const initialYear = availableYears.length > 0 ? availableYears[0] : new Date().getFullYear();
        setSelectedYear(initialYear);

        const nextCertificatesByYear: { [year: number]: { fieldOfStudy: string, credit: number }[] } = {};
        for (const year of availableYears) {
            nextCertificatesByYear[year] = Array.from(fieldCreditMapByYear[year], ([fieldOfStudy, credit]) => ({
                fieldOfStudy,
                credit
            }));
        }

        setCertificatesByYear(nextCertificatesByYear);
    }

    useEffect(() => {
        getUserSubscription();
        const yearCertificates = certificatesByYear[selectedYear] || [];
        setCertificates(yearCertificates);
        settTotalCreditEarned(yearCertificates.reduce((sum: number, c: any) => sum + (c.credit || 0), 0));
    }, [selectedYear, certificatesByYear]);

    useEffect(() => {
        const loadDashboardData = async () => {
            try {
                await getEventlist();
            } finally {
                setMounted(true);
                setIsPageLoading(false);
            }
        };

        loadDashboardData();
    }, [])

    if (isPageLoading) {
        return (
            <div className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-indigo-50 p-8 flex flex-col gap-6">
                <div className="pointer-events-none absolute -top-16 -right-16 h-52 w-52 rounded-full bg-indigo-100/50 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-pink-100/40 blur-3xl" />

                <div className="relative h-10 w-72 overflow-hidden rounded-xl bg-slate-200/80">
                    <div className="h-full w-1/2 animate-pulse bg-gradient-to-r from-transparent via-white/70 to-transparent" />
                </div>

                <div className="grid lg:grid-cols-2 gap-6">
                    <div className="space-y-6">
                        <div className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="h-14 w-14 rounded-full bg-slate-200 animate-pulse" />
                                <div className="space-y-2 w-full">
                                    <div className="h-4 w-48 rounded bg-slate-200 animate-pulse" />
                                    <div className="h-3 w-32 rounded bg-slate-200 animate-pulse" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="h-16 rounded-lg bg-slate-100 animate-pulse" />
                                <div className="h-16 rounded-lg bg-slate-100 animate-pulse" />
                                <div className="h-16 rounded-lg bg-slate-100 animate-pulse" />
                                <div className="h-16 rounded-lg bg-slate-100 animate-pulse" />
                            </div>
                        </div>

                        <div className="h-40 rounded-2xl border border-slate-200 bg-white/90 shadow-sm animate-pulse" />
                    </div>

                    <div className="space-y-4">
                        <div className="h-32 rounded-2xl border border-slate-200 bg-white/90 shadow-sm animate-pulse" />
                        <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm space-y-3">
                            <div className="h-10 w-full rounded-lg bg-slate-100 animate-pulse" />
                            <div className="h-10 w-full rounded-lg bg-slate-100 animate-pulse" />
                            <div className="h-10 w-full rounded-lg bg-slate-100 animate-pulse" />
                            <div className="h-10 w-full rounded-lg bg-slate-100 animate-pulse" />
                            <div className="h-10 w-full rounded-lg bg-slate-100 animate-pulse" />
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm space-y-4">
                    <div className="h-8 w-72 rounded bg-slate-200 animate-pulse" />
                    <div className="h-24 rounded-xl bg-slate-100 animate-pulse" />
                    <div className="h-24 rounded-xl bg-slate-100 animate-pulse" />
                    <div className="h-24 rounded-xl bg-slate-100 animate-pulse" />
                </div>
            </div>
        );
    }

    if (!mounted) {
        return null;
    }

    return (
        <>
            <div className="bg-gray-50 p-8 flex flex-col gap-6">

                {/* Header */}
                <div className="text-3xl font-semibold text-gray-800">
                    Good morning, {user.firstName}
                </div>

                {/* Main Layout */}
                <div className="grid lg:grid-cols-2 gap-6">

                    {/* LEFT SIDE */}
                    <div className="flex flex-col gap-6">

                        {/* Profile Card */}
                        <Card className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex flex-col gap-6">

                            <div className="flex justify-between items-start">

                                {/* User */}
                                <div className="flex items-center gap-4">

                                    <div className="w-14 h-14 rounded-full bg-gray-200">
                                        <img src={imageUrl + user?.profileImage?.url} />
                                    </div>

                                    <div>
                                        <div className="text-xl font-semibold">
                                            {user.firstName} {user.lastName}
                                        </div>

                                        <div className="text-gray-600 text-sm">
                                            {/* CPA, EA, CFA, MBA */}
                                        </div>
                                    </div>
                                </div>


                                {
                                    !isSubscriptionExpired && <div className="px-3 py-1 bg-green-50 border border-green-200 rounded-full text-green-700 text-sm font-medium flex gap-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="21" viewBox="0 0 15 21" fill="none">
                                            <path d="M7.5 14.5C11.366 14.5 14.5 11.366 14.5 7.5C14.5 3.63401 11.366 0.5 7.5 0.5C3.63401 0.5 0.5 3.63401 0.5 7.5C0.5 11.366 3.63401 14.5 7.5 14.5Z" fill="url(#paint0_linear_3165_1965)" />
                                            <path d="M3.46668 13.2219L2.5 20.5L7.0884 17.747C7.23805 17.6572 7.31288 17.6123 7.39276 17.5947C7.46341 17.5792 7.53659 17.5792 7.60724 17.5947C7.68712 17.6123 7.76195 17.6572 7.9116 17.747L12.5 20.5L11.5343 13.2212M14.5 7.5C14.5 11.366 11.366 14.5 7.5 14.5C3.63401 14.5 0.5 11.366 0.5 7.5C0.5 3.63401 3.63401 0.5 7.5 0.5C11.366 0.5 14.5 3.63401 14.5 7.5Z" stroke="url(#paint1_linear_3165_1965)" strokeLinecap="round" strokeLinejoin="round" />
                                            <defs>
                                                <linearGradient id="paint0_linear_3165_1965" x1="0.499782" y1="20.4999" x2="19.2918" y2="7.34543" gradientUnits="userSpaceOnUse">
                                                    <stop stopColor="#FF7A00" />
                                                    <stop offset="1" stopColor="#FFD439" />
                                                </linearGradient>
                                                <linearGradient id="paint1_linear_3165_1965" x1="0.499782" y1="20.4999" x2="19.2918" y2="7.34543" gradientUnits="userSpaceOnUse">
                                                    <stop stopColor="#FF7A00" />
                                                    <stop offset="1" stopColor="#FFD439" />
                                                </linearGradient>
                                            </defs>
                                        </svg>
                                        Subscribed member
                                    </div>
                                }

                            </div>

                            {/* Divider */}
                            <div className="h-px bg-gray-200" />

                            {/* Info Grid */}
                            <div className="grid grid-cols-2 gap-6 text-sm justify-center">

                                <div className="h-10 flex flex-col justify-start items-start">
                                    <div className="inline-flex justify-start items-center gap-3">
                                        <div className="w-10 h-10 relative bg-gradient-to-l from-pink-400 to-purple-400 rounded-full">
                                            <div className="w-10 h-10 left-0 top-0 absolute rounded-full border-[0.75px] border-blue-200" />
                                            <div className="w-6 h-6 left-[10px] top-[8px] absolute overflow-hidden">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="22" viewBox="0 0 18 22" fill="none">
                                                    <path d="M9 12C10.6569 12 12 10.6569 12 9C12 7.34315 10.6569 6 9 6C7.34315 6 6 7.34315 6 9C6 10.6569 7.34315 12 9 12Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                    <path d="M9 21C13 17 17 13.4183 17 9C17 4.58172 13.4183 1 9 1C4.58172 1 1 4.58172 1 9C1 13.4183 5 17 9 21Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </div>
                                        </div>
                                        <div className="inline-flex flex-col justify-start items-start">
                                            <div className="justify-start text-Colors-Text-text-secondary-(700) text-sm font-semibold font-['Inter'] leading-5">Location</div>
                                            <div className="justify-start text-zinc-900 text-sm font-normal font-['Inter'] leading-5">{user.state} ,{user.country}</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="h-10 flex flex-col justify-start items-start">
                                    <div className="inline-flex justify-start items-center gap-3">
                                        <div className="w-10 h-10 relative bg-gradient-to-l from-pink-400 to-purple-400 rounded-full outline outline-1 outline-offset-[-1px] outline-pink-400">
                                            <div className="w-10 h-10 left-0 top-0 absolute rounded-full border-[0.75px] border-Component-colors-Components-Avatars-avatar-contrast-border/10" />
                                            <div className="w-6 h-6 left-[8px] top-[8px] absolute overflow-hidden">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" viewBox="0 0 23 23" fill="none">
                                                    <path d="M13.12 5C14.0967 5.19057 14.9944 5.66826 15.698 6.37194C16.4017 7.07561 16.8794 7.97326 17.07 8.95M13.12 1C15.1492 1.22544 17.0416 2.13417 18.4862 3.57701C19.9309 5.01984 20.842 6.91101 21.07 8.94M9.29695 12.8631C8.09537 11.6615 7.14659 10.3028 6.45059 8.85323C6.39072 8.72854 6.36079 8.66619 6.33779 8.5873C6.25607 8.30695 6.31477 7.96269 6.48478 7.72526C6.53262 7.65845 6.58978 7.60129 6.70409 7.48698C7.0537 7.13737 7.2285 6.96257 7.34278 6.78679C7.77378 6.1239 7.77378 5.26932 7.34279 4.60643C7.2285 4.43065 7.0537 4.25585 6.70409 3.90624L6.50922 3.71137C5.97778 3.17993 5.71206 2.91421 5.42668 2.76987C4.85912 2.4828 4.18885 2.4828 3.62129 2.76987C3.33591 2.91421 3.07019 3.17993 2.53874 3.71137L2.38111 3.86901C1.85149 4.39863 1.58668 4.66344 1.38443 5.02348C1.16001 5.42298 0.998645 6.04347 1.00001 6.5017C1.00124 6.91464 1.08134 7.19687 1.24155 7.76131C2.10252 10.7947 3.72699 13.6571 6.11497 16.045C8.50295 18.433 11.3653 20.0575 14.3987 20.9185C14.9632 21.0787 15.2454 21.1588 15.6583 21.16C16.1165 21.1614 16.737 21 17.1365 20.7756C17.4966 20.5733 17.7614 20.3085 18.291 19.7789L18.4486 19.6213C18.9801 19.0898 19.2458 18.8241 19.3902 18.5387C19.6772 17.9712 19.6772 17.3009 19.3902 16.7333C19.2458 16.448 18.9801 16.1822 18.4486 15.6508L18.2538 15.4559C17.9042 15.1063 17.7294 14.9315 17.5536 14.8172C16.8907 14.3862 16.0361 14.3862 15.3732 14.8172C15.1975 14.9315 15.0226 15.1063 14.673 15.4559C14.5587 15.5702 14.5016 15.6274 14.4348 15.6752C14.1973 15.8453 13.8531 15.904 13.5727 15.8222C13.4938 15.7992 13.4315 15.7693 13.3068 15.7094C11.8572 15.0134 10.4985 14.0646 9.29695 12.8631Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </div>
                                        </div>
                                        <div className="inline-flex flex-col justify-start items-start">
                                            <div className="justify-start text-Colors-Text-text-secondary-(700) text-sm font-semibold font-['Inter'] leading-5">Phone</div>
                                            <div className="justify-start text-zinc-900 text-sm font-normal font-['Inter'] leading-5">{user.phone}</div>
                                        </div>
                                    </div>
                                </div>

                                <div className='ml-12'>
                                    <div className="text-gray-500 font-semibold">
                                        PTIN
                                    </div>
                                    <div>{user.ptin}</div>
                                </div>

                                <div className='ml-12'>
                                    <div className="text-gray-500 font-semibold">
                                        CFP ID
                                    </div>
                                    <div>{user.cfpid}</div>
                                </div>

                            </div>
                        </Card>

                        {/* Subscription Card */}
                        {
                            !isSubscriptionExpired && <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex overflow-hidden">

                                <img
                                    src="/assets/images/anual-package.jpg"
                                    className="w-48 object-cover"
                                />

                                <div className="p-6 flex flex-col justify-between flex-1">

                                    <div>
                                        <div className="text-lg font-semibold">
                                            CPE Warehouse Live Events Pass
                                        </div>

                                        <div className="text-gray-500 text-sm mt-1">
                                            Valid Until -
                                            <span className="font-bold ml-1">
                                                {moment(subscriptionExpiredDate).format(" DD MMMM,  YYYY")}
                                            </span>
                                        </div>
                                    </div>

                                    {isSubscriptionRenewalDue && (
                                        <button className="bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-semibold w-fit">
                                            Renew Subscription
                                        </button>
                                    )}

                                </div>
                            </div>
                        }

                    </div>

                    <div className='space-y-4'>
                        <div className="relative flex flex-col gap-5 p-6 bg-white rounded-xl border border-gray-200 shadow-sm w-full">

                            {/* Year Button */}
                            <div className="absolute top-5 right-5">
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
                                            availableYears.length > 0 && availableYears.map((year: number, index: number) => (
                                                <SelectItem value={String(year)} key={index}>{year}</SelectItem>
                                            ))
                                        }
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Content */}
                            <div className="flex items-center gap-3">
                                <span className="text-6xl font-normal text-indigo-500 leading-[64px]">
                                    {totalCreditEarned}
                                </span>

                                <span className="text-sm font-medium text-slate-600">
                                    CPE Earned
                                </span>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">

                            {/* Table Header */}
                            <div className="grid grid-cols-2 border-b border-gray-200 px-6 py-3 text-sm font-bold text-gray-600">
                                <div>Field of Study</div>
                                <div>CPE Earned</div>
                            </div>

                            {/* Rows */}
                            {certificates && certificates.length > 0 && certificates.map((certificate: any, index: number) => (
                                <div
                                    key={index}
                                    className="grid grid-cols-2 px-6 py-3 border border-gray-200 border-b text-sm items-center"
                                >
                                    <div className="font-medium text-gray-900">
                                        {certificate?.fieldOfStudy}
                                    </div>

                                    <div>
                                        <span className="px-2.5 py-0.5 bg-green-50 border border-green-200 rounded-full text-green-700 text-xs font-medium">
                                            {certificate?.credit}
                                        </span>
                                    </div>
                                </div>
                            ))}

                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full p-8 space-y-4">
                {/* Tabs */}
                <div className="borde-b border-gray-200  text-lg font-semibold w-full">
                    <Tabs defaultValue="registered-event" className=" bg-transparent w-full">
                        <TabsList variant="line" className='w-[400px] ml-24 bg-transparent border-b border-gray-200'>
                            <TabsTrigger value="registered-event" className="text-xl  font-bold cursor-pointer hover:text-blue-500 hover:after:bg-blue-500 hover:after:opacity-100 font-['Inter'] leading-loose  data-[state=active]:text-blue-500 data-[state=active]:after:bg-blue-500">Registered Event(s)</TabsTrigger>
                            <TabsTrigger value="past-event" className="text-xl font-bold cursor-pointer hover:text-blue-500 hover:after:bg-blue-500 hover:after:opacity-100 font-['Inter'] leading-loose  data-[state=active]:text-blue-500 data-[state=active]:after:bg-blue-500">Past Event(s)</TabsTrigger>
                            <TabsTrigger value="recommended-events" className="text-xl font-bold cursor-pointer hover:text-blue-500 hover:after:bg-blue-500 hover:after:opacity-100 font-['Inter'] leading-loose  data-[state=active]:text-blue-500 data-[state=active]:after:bg-blue-500">Recommended Events</TabsTrigger>
                        </TabsList>
                        <TabsContent value="registered-event">
                            <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
                                {/* Header */}
                                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                                    <h2 className="text-lg font-semibold">Registered Event(s)</h2>

                                    <span className="text-xs px-2 py-1 border border-gray-200 rounded-md bg-gray-50">
                                        {registeredEventsForSelectedYear.length} events
                                    </span>
                                </div>

                                {/* Events */}
                                <div className="p-4 space-y-4 w-full">
                                    {registeredEventsForSelectedYear.length > 0 && registeredEventsForSelectedYear.map((event, index) => (
                                        <RegisteredEventCard key={index} event={event} onLaunch={launchEvent} />
                                    ))}
                                </div>
                            </div>
                        </TabsContent>
                        <TabsContent value="past-event">
                            <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
                                {/* Header */}
                                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                                    <h2 className="text-lg font-semibold">
                                        Past Event
                                    </h2>
                                </div>

                                {/* Events */}
                                <div className="p-4 space-y-4">
                                    {pastEventsForSelectedYear.length > 0 && pastEventsForSelectedYear.map((event, index) => (
                                        <PastEventCard key={index} event={event} />
                                    ))}
                                </div>
                            </div>
                        </TabsContent>
                        <TabsContent value="recommended-events">
                            <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
                                {/* Header */}
                                <div className="flex items-center justify-end px-6 py-4 border-b border-gray-200">
                                    <Link href="/course-catalog" className="text-lg font-semibold">
                                        View All Courses
                                    </Link>
                                </div>

                                {/* Events */}
                                <div className="p-4 space-y-4">
                                    {upcommingEvent.length > 0 && upcommingEvent.map((event, index) => (
                                        <RecommendedEventCard key={index} event={event} />
                                    ))}
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>

            </div>
        </>

    )
}

export default BasicDetails