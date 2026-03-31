"use client"
import React, { useEffect, useState } from 'react'
import { BookOpen, Calendar, Clock, User } from 'lucide-react';
import { getUpcomingCourse, GetUserSubscribedCourses } from '@/services/course';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { imageUrl } from '@/lib/constants';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import moment from 'moment';


const studies = [
    { name: "Accounting", cpe: 1 },
    { name: "Information Technology", cpe: 2 },
    { name: "Tax Law", cpe: 1 },
    { name: "Regulatory Ethics", cpe: 3 },
];

const events = [
    {
        type: "Live Webinar",
        title:
            "2024 FINCEN BENEFICIAL OWNERSHIP INTEREST (BOI) REPORTING - HOW TO GIVE GREAT CLIENT SERVICE / STAY OUT OF TROUBLE",
        date: "Wed, Aug 07 2024",
        time: "1:00 PM - 4:00 PM ET",
        instructor: "Art Werner",
        image: "https://placehold.co/200x160",
    },
    {
        type: "Self Study",
        title:
            "2024 FINCEN BENEFICIAL OWNERSHIP INTEREST (BOI) REPORTING - HOW TO GIVE GREAT CLIENT SERVICE / STAY OUT OF TROUBLE",
        date: "Self Paced",
        instructor: "Art Werner",
        image: "https://placehold.co/200x160",
    },
    {
        type: "E-Book",
        title: "Federal Tax Update Workbook",
        instructor: "University Of Illinois Tax School",
        image: "https://placehold.co/200x160",
    },
]


function EventCard({ event }: any) {
    return (
        <div className="flex gap-6 p-4 border rounded-xl hover:shadow-md transition w-full">

            {/* Image */}
            <img
                src={imageUrl + event.image}
                className="w-48 h-36 rounded-lg object-cover"
                alt=""
            />

            {/* Content */}
            <div className="flex flex-col flex-1 justify-between">

                <div>
                    <p className="text-pink-600 font-medium">{event.category}</p>

                    <h3 className="text-lg font-semibold text-gray-900 mt-1">
                        {event.course.title}
                    </h3>
                </div>

                <div className="flex flex-wrap gap-6 text-gray-600 text-sm mt-3">

                    {event.startDate && (
                        <div className="flex items-center gap-2">
                            <Calendar size={16} />
                            {event.startDate}
                        </div>
                    )}

                    {event.time && (
                        <div className="flex items-center gap-2">
                            <Clock size={16} />
                            {event.time}
                        </div>
                    )}

                    <div className="flex items-center gap-2">
                        <img src={imageUrl + event.instrutors.image.data.attributes.url} height="20" width="20" className='rounded-xl' />
                        {event.instrutors?.firstName}
                    </div>

                </div>

                <div className="mt-3 flex items-center gap-4">

                    <button className="text-blue-700 font-semibold flex items-center gap-2">
                        <BookOpen size={18} />
                        Handouts
                    </button>
                </div>
            </div>

            {/* Action */}
            <button className="h-fit px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700">
                Launch
            </button>
        </div>
    )
}


const BasicDetails = () => {

    const [user, setUser] = useState<any>({})
    const [mounted, setMounted] = useState(false)
    let [certificates, setCertificates] = useState<any>([]);
    let [totalCreditEarned, settTotalCreditEarned] = useState(0);
    let [availableYears, setAvailableYears] = useState<any>([]);
    let [certificatesByYear, setCertificatesByYear] = useState<{ [year: number]: { fieldOfStudy: string, credit: number }[] }>({});
    let [pastEvents, setPastEvents] = useState([]);
    let [regEvent, setRegEvent] = useState([]);

    let [selectedYear, setSelectedYear] = useState(new Date().getFullYear())

    useEffect(() => {
        const token = localStorage.getItem("token");
        fetch(process.env.NEXT_PUBLIC_API_BASE_URL + "/api/users/me", {
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        }).then((res) => {
            return res.json()
        }).then(res => {
            if (res.jwt) {
                localStorage.setItem("token", res.jwt)
            } else {
                setUser(res)
            }
        });

        getEventlist()

        setMounted(true);
    }, [])

    async function getUserSubscription() {

        const token = localStorage.getItem("token");

        fetch(process.env.NEXT_PUBLIC_API_BASE_URL + "/api/annual-pass-subscriptions?populate=user", {
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        }).then((res) => {
            return res.json()
        }).then(res => {
            console.log(res);
        });
    }

    async function getEventlist() {
        const email = localStorage.getItem('email')?.toString() || '';

        let availableYears = [];
        let regEvent = []
        const coursesPurchased: any = []
        const localTime = moment().format('YYYY-MM-DD') + 'T00:00:00.000Z'; // store localTime

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
                        'instrutors': course?.instructors?.data?.[0]?.attributes,
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

                // Condition for including credits:
                // 1. Live course AND completed AND has a completion year
                // 2. Recorded course (we're assuming all recorded courses count once purchased)
                const includeCredit = (categoryLower === 'live' && usercourse?.status?.toLowerCase() === 'completed' && completedYear) ||
                    categoryLower === 'recorded';

                if (includeCredit && completedYear) {
                    if (!fieldCreditMapByYear[completedYear]) {
                        fieldCreditMapByYear[completedYear] = new Map<string, number>();
                    }
                    const yearMap = fieldCreditMapByYear[completedYear];
                    yearMap.set(fieldOfStudy, (yearMap.get(fieldOfStudy) || 0) + creditValue);
                }
            }
        });

        console.log(subscribedCourseIds);
        

        const response = await getUpcomingCourse(subscribedCourseIds);

        console.log(response);
        

        console.log(coursesPurchased);
        
        regEvent = coursesPurchased.filter((element: any) =>
        ((element.category.toLowerCase() === "live" && new Date(element?.course?.endDate) >= new Date(localTime))
            || (element.category.toLowerCase() === "recorded")
            && new Date(element?.course?.endDate) <= new Date(localTime)
        ));

        console.log(regEvent);

        // Sort the regEvent array
        regEvent.sort((a: any, b: any) => {
            // First, compare by courseType: "Live Webinar" should come before "Self-Study"
            if (a.courseType === 'Live Webinar' && b.courseType !== 'Live Webinar') {
                return -1; // a comes before b
            }
            if (a.courseType !== 'Live Webinar' && b.courseType === 'Live Webinar') {
                return 1; // b comes before a
            }
            // If both are the same courseType, then sort by startDate
            return (Date.parse(a.startDate) < Date.parse(b.startDate)) ? -1 : 1;
        });
        

        setRegEvent(regEvent);

        let pastEvents = coursesPurchased.filter((element: any) =>
            (element.category.toLowerCase() === "live")
            && new Date(element?.course?.endDate) <= new Date(localTime)
        );
        //sorting 

        pastEvents = pastEvents.sort((a: any, b: any) => (Date.parse(a.startDate) < Date.parse(b.startDate)) ? 1 : -1);

        setPastEvents(pastEvents)

        // Populate available years for dropdown
        availableYears = Object.keys(fieldCreditMapByYear)
            .map(Number)
            .sort((a, b) => b - a); // Sort descending
        // Set selectedYear to the first available year if there are any
        setAvailableYears(availableYears);

        if (availableYears.length > 0) {
            selectedYear = availableYears[0];
        } else {
            selectedYear = new Date().getFullYear(); // Fallback if no data
        }

        setSelectedYear(selectedYear);

        // Convert fieldCreditMapByYear to display format
        for (let year of availableYears) {
            let data = Array.from(fieldCreditMapByYear[year], ([fieldOfStudy, credit]) => ({
                fieldOfStudy,
                credit
            }));

            setCertificatesByYear((prevValue) => ({
                ...prevValue,
                [year]: data
            }))
        }

        updateDisplayedCredits();
    }

    function updateDisplayedCredits() {
        const year = selectedYear;
        setCertificates(certificatesByYear[year])
        settTotalCreditEarned(certificates.reduce((sum: number, c: any) => sum + (c.credit || 0), 0))
    }


    if (mounted) {
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
                            <div className="bg-white rounded-xl border shadow-sm p-6 flex flex-col gap-6">

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
                                                CPA, EA, CFA, MBA
                                            </div>
                                        </div>
                                    </div>

                                    {/* Badge */}
                                    <div className="px-3 py-1 bg-green-50 border border-green-200 rounded-full text-green-700 text-sm font-medium">
                                        Subscribed member
                                    </div>
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

                                    <div>
                                        <div className="text-gray-500 font-semibold">
                                            PTIN
                                        </div>
                                        <div>{user.ptin}</div>
                                    </div>

                                    <div>
                                        <div className="text-gray-500 font-semibold">
                                            CFP ID
                                        </div>
                                        <div>{user.cfpid}</div>
                                    </div>

                                </div>
                            </div>

                            {/* Subscription Card */}
                            <div className="bg-white rounded-xl shadow-sm border flex overflow-hidden">

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
                                                02/06/2025
                                            </span>
                                        </div>
                                    </div>

                                    <button className="bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-semibold w-fit">
                                        Renew Subscription
                                    </button>

                                </div>
                            </div>

                        </div>

                        <div className='space-y-4'>
                            <div className="relative flex flex-col gap-5 p-6 bg-white rounded-xl border border-gray-200 shadow-sm w-full">

                                {/* Year Button */}
                                <div className="absolute top-5 right-5">
                                    <Select defaultValue="2024">
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

                                        <SelectContent position="popper">
                                            {
                                                availableYears.length > 0 && availableYears.map((year: any, index: number) => (
                                                    <SelectItem value={year} key={index}>2024</SelectItem>
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

                            <div className="bg-white rounded-xl border shadow-sm overflow-hidden">

                                {/* Table Header */}
                                <div className="grid grid-cols-2 border-b px-6 py-3 text-sm font-bold text-gray-600">
                                    <div>Field of Study</div>
                                    <div>CPE Earned</div>
                                </div>

                                {/* Rows */}
                                {certificates && certificates.length > 0 && certificates.map((certificate: any, index: number) => (
                                    <div
                                        key={index}
                                        className="grid grid-cols-2 px-6 py-3 border-b text-sm items-center"
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

                <div className="w-full mx-auto p-8 space-y-4">

                    {/* Tabs */}
                    <div className="border-b flex gap-6 text-lg font-semibold w-full">
                        <Tabs defaultValue="registered-event" className=" bg-transparent w-full">
                            <TabsList variant="line" className='w-full bg-transparent border-b border-[#dee1e9]'>
                                <TabsTrigger value="registered-event" className="text-xl font-bold cursor-pointer hover:text-blue-500 hover:after:bg-blue-500 hover:after:opacity-100 font-['Inter'] leading-loose  data-[state=active]:text-blue-500 data-[state=active]:after:bg-blue-500">Registered Event(s)</TabsTrigger>
                                <TabsTrigger value="past-event" className="text-xl font-bold cursor-pointer hover:text-blue-500 hover:after:bg-blue-500 hover:after:opacity-100 font-['Inter'] leading-loose  data-[state=active]:text-blue-500 data-[state=active]:after:bg-blue-500">Past Event(s)</TabsTrigger>
                                <TabsTrigger value="recommended-events" className="text-xl font-bold cursor-pointer hover:text-blue-500 hover:after:bg-blue-500 hover:after:opacity-100 font-['Inter'] leading-loose  data-[state=active]:text-blue-500 data-[state=active]:after:bg-blue-500">Recommended Events</TabsTrigger>
                            </TabsList>
                            <TabsContent value="registered-event">
                                <div className="bg-white border rounded-xl shadow-sm">
                                    {/* Header */}
                                    <div className="flex items-center justify-between px-6 py-4 border-b">
                                        <h2 className="text-lg font-semibold">Registered Event(s)</h2>

                                        <span className="text-xs px-2 py-1 border rounded-md bg-gray-50">
                                            {regEvent.length} events
                                        </span>
                                    </div>

                                    {/* Events */}
                                    <div className="p-4 space-y-4 w-full">
                                        {regEvent.length > 0 && regEvent.map((event, index) => (
                                            <EventCard key={index} event={event} />
                                        ))}
                                    </div>
                                </div>
                            </TabsContent>
                            <TabsContent value="past-event">
                                <div className="bg-white border rounded-xl shadow-sm">
                                    {/* Header */}
                                    <div className="flex items-center justify-between px-6 py-4 border-b">
                                        <h2 className="text-lg font-semibold">
                                            Past Event
                                        </h2>
                                    </div>

                                    {/* Events */}
                                    <div className="p-4 space-y-4">
                                        {pastEvents.length > 0 && pastEvents.map((event, index) => (
                                            <EventCard key={index} event={event} />
                                        ))}
                                    </div>
                                </div>
                            </TabsContent>
                            <TabsContent value="recommended-events">
                                <div className="bg-white border rounded-xl shadow-sm">
                                    {/* Header */}
                                    <div className="flex items-center justify-end px-6 py-4 border-b">
                                        <h2 className="text-lg font-semibold">
                                            View All Courses
                                        </h2>
                                    </div>

                                    {/* Events */}
                                    <div className="p-4 space-y-4">
                                        {/* {events.map((event, index) => (
                                            <EventCard key={index} event={event} />
                                        ))} */}
                                    </div>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>

                </div>
            </>

        )
    }
}

export default BasicDetails