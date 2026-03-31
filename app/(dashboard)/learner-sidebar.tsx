import {
    Squares2X2Icon,
    DocumentCheckIcon,
    DocumentTextIcon,
    UserIcon,
    XMarkIcon,
} from "@heroicons/react/24/outline";

export default function LearnerSidebar() {

    const menuItems = [
        {
            name: "Dashboard",
            icon: Squares2X2Icon,
            href: "/learner/dashboard",
            active: true,
        },
        {
            name: "Certificates",
            icon: DocumentCheckIcon,
            href: "/learner/certificates",
            active: true,
        },
        {
            name: "Invoices",
            icon: DocumentTextIcon,
            href: "/learner/invoice",
            active: true,
        },
        {
            name: "Edit profile",
            icon: UserIcon,
            href: "/learner/profile",
            active: true,
        },
    ];


    return (
        <div className="w-1/3 flex flex-col bg-white border-r">

            {/* Top Section */}
            <div className="pt-8 flex flex-col gap-8 mb-20">

                {/* Logo */}
                {/* <div className="px-6">
                    <img
                        src="https://placehold.co/230x42"
                        alt="logo"
                        className="w-full h-[42px] object-contain"
                    />
                </div> */}

                {/* Navigation */}
                <div className="px-4 flex flex-col gap-2">
                    {menuItems.map((item, index) => {
                        const Icon = item.icon;

                        return (
                            <a
                                key={index}
                                href={item.href}
                                className={`flex items-center gap-3 px-3 py-4 rounded-md cursor-pointer transition ${item.active ? "bg-indigo-50" : "hover:bg-gray-50"}`}
                            >
                                <Icon
                                    className={`w-6 h-6 ${item.active ? "text-indigo-600" : "text-gray-500"
                                        }`}
                                />

                                <span
                                    className={`text-xl font-semibold ${item.active ? "text-indigo-600" : "text-gray-500"
                                        }`}
                                >
                                    {item.name}
                                </span>
                            </a>
                        );
                    })}
                </div>
            </div>

            {/* Bottom Upgrade Card */}
            <div className="px-4 pb-8">

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
                    <button className="text-sm font-semibold text-indigo-600 hover:underline">
                        Upgrade Now
                    </button>

                </div>

            </div>
        </div>
    );
}