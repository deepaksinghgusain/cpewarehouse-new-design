"use client";

import { getCommonData } from "@/services/common";
import { XMarkIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const menuItems = [
    {
        name: "Dashboard",
        href: "/learner/dashboard",
    },
    {
        name: "Certificates",
        href: "/learner/certificates",
    },
    {
        name: "Invoices",
        href: "/learner/invoice",
    },
    {
        name: "Edit profile",
        href: "/learner/profile",
    },
];

export default function LearnerSidebar() {

    const pathName = usePathname();
    const [logo, setLogo] = useState("");
    const [isSubscriptionExpired, setIsSubscriptionExpired] = useState(false);

    const getHeaderData = async () => {
        const response: any = await getCommonData()

        let logo = `${process.env.NEXT_PUBLIC_IMAGE_END_POINT}` + response?.data?.attributes?.headerLogo?.data?.attributes?.url;

        setLogo(logo)
    }

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
        const hasActiveSubscription = subscriptions.some((subscription: any) => {
            const endDate = subscription.attributes?.endDate;
            if (!endDate) return false;

            const [year, month, day] = endDate.split('-').map(Number);
            const subscriptionEndDate = new Date(year, month - 1, day);

            return subscriptionEndDate >= todayDate;
        });

        setIsSubscriptionExpired(subscriptions.length > 0 && !hasActiveSubscription);
    }

    useEffect(() => {
        getHeaderData();
        getUserSubscription();
    }, [])


    return (
        <aside className="h-full min-h-full flex flex-col bg-white">
            {/* Logo */}
            <div className="px-6 sticky py-6 top-0 z-50 bg-white w-full">
                <Link href="/">
                    {
                        logo && <Image
                            height={42}
                            width={100}
                            src={logo}
                            alt="logo"
                            className="w-full h-[42px] object-contain"
                        />
                    }
                </Link>

            </div>

            {/* Top Section */}
            <div className="pt-8 flex flex-col gap-8 mb-5">

                {/* Navigation */}
                <div className="px-4 flex z-0 flex-col gap-2">
                    {menuItems.map((item, index) => {

                        let icon;

                        if (item.name === "Dashboard") {
                            icon = <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                className="w-6 h-6"
                            >
                                <path
                                    d="M8 15V17M12 11V17M16 7V17M7.8 21H16.2C17.8802 21 18.7202 21 19.362 20.673C19.9265 20.3854 20.3854 19.9265 20.673 19.362C21 18.7202 21 17.8802 21 16.2V7.8C21 6.11984 21 5.27976 20.673 4.63803C20.3854 4.07354 19.9265 3.6146 19.362 3.32698C18.7202 3 17.8802 3 16.2 3H7.8C6.11984 3 5.27976 3 4.63803 3.32698C4.07354 3.6146 3.6146 4.07354 3.32698 4.63803C3 5.27976 3 6.11984 3 7.8V16.2C3 17.8802 3 18.7202 3.32698 19.362C3.6146 19.9265 4.07354 20.3854 4.63803 20.673C5.27976 21 6.11984 21 7.8 21Z"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        }

                        if (item.name === "Certificates") {
                            icon = <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                className="w-6 h-6"
                            >
                                <path
                                    d="M4.5 19H3C1.89543 19 1 18.1046 1 17V3C1 1.89543 1.89543 1 3 1H17C18.1046 1 19 1.89543 19 3V17C19 18.1046 18.1046 19 17 19H15.5M10 18C11.6569 18 13 16.6569 13 15C13 13.3431 11.6569 12 10 12C8.34315 12 7 13.3431 7 15C7 16.6569 8.34315 18 10 18ZM10 18L10.0214 17.9998L6.82867 21.1926L4.00024 18.3641L7.01965 15.3447M10 18L13.1928 21.1926L16.0212 18.3641L13.0018 15.3447M7 5H13M5 8.5H15"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        }

                        if (item.name === "Invoices") {
                            icon = <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                className="w-6 h-6"
                            >
                                <path
                                    d="M1 5.8C1 4.11984 1 3.27976 1.32698 2.63803C1.6146 2.07354 2.07354 1.6146 2.63803 1.32698C3.27976 1 4.11984 1 5.8 1H12.2C13.8802 1 14.7202 1 15.362 1.32698C15.9265 1.6146 16.3854 2.07354 16.673 2.63803C17 3.27976 17 4.11984 17 5.8V19L14.25 17L11.75 19L9 17L6.25 19L3.75 17L1 19V5.8Z"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        }

                        if (item.name === "Edit profile") {
                            icon = <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                className="w-6 h-6"
                            >
                                <path
                                    d="M11 3.99998H6.8C5.11984 3.99998 4.27976 3.99998 3.63803 4.32696C3.07354 4.61458 2.6146 5.07353 2.32698 5.63801C2 6.27975 2 7.11983 2 8.79998V17.2C2 18.8801 2 19.7202 2.32698 20.362C2.6146 20.9264 3.07354 21.3854 3.63803 21.673C4.27976 22 5.11984 22 6.8 22H15.2C16.8802 22 17.7202 22 18.362 21.673C18.9265 21.3854 19.3854 20.9264 19.673 20.362C20 19.7202 20 18.8801 20 17.2V13M7.99997 16H9.67452C10.1637 16 10.4083 16 10.6385 15.9447C10.8425 15.8957 11.0376 15.8149 11.2166 15.7053C11.4184 15.5816 11.5914 15.4086 11.9373 15.0627L21.5 5.49998C22.3284 4.67156 22.3284 3.32841 21.5 2.49998C20.6716 1.67156 19.3284 1.67155 18.5 2.49998L8.93723 12.0627C8.59133 12.4086 8.41838 12.5816 8.29469 12.7834C8.18504 12.9624 8.10423 13.1574 8.05523 13.3615C7.99997 13.5917 7.99997 13.8363 7.99997 14.3255V16Z"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        }

                        return (
                            <Link
                                key={index}
                                href={item.href}
                                className={`flex items-center gap-3 px-3 py-4 rounded-md cursor-pointer text-gray-500 hover:text-indigo-600 transition-colors ${pathName === item.href ? "text-indigo-600 bg-indigo-50" : "text-gray-500 hover:text-indigo-600"}`}
                            >
                                {icon}

                                <span className="font-semibold">
                                    {item.name}
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </div>

            {
                isSubscriptionExpired && <div className="px-4">

                    <div className="bg-gray-50 rounded-lg p-5 flex flex-col gap-4">

                        {/* Title */}
                        <div className="relative">
                            <p className="text-sm font-semibold text-slate-600 pr-8">
                                Unlimited Access to Live Study and Self-Study
                            </p>

                            <button className="absolute right-0 top-0 p-1 rounded-md hover:bg-gray-200">
                                <XMarkIcon className="w-5 h-5 text-gray-400" />
                            </button>
                        </div>

                        {/* Image */}
                        <img
                            src="/assets/images/package.png"
                            className="rounded-md w-full h-[160px] object-cover"
                            alt="upgrade"
                        />

                        {/* Button */}
                        <Link href="/package/cpe-warehouse-annual-live-webinar-pass" className="text-sm font-semibold text-indigo-600 hover:underline">
                            Upgrade Now
                        </Link>

                    </div>

                </div>
            }

        </aside>
    );
}