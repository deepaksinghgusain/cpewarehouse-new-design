import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { ChevronDown, LucideShoppingCart, Search } from 'lucide-react'
import React from 'react'

const LearnerNavBar = () => {
    return (
        <div className="sticky top-0 z-50 bg-white py-5 w-full max-w-[1280px] px-8  flex justify-between items-center">

            {/* LEFT MENU */}
            <div className="flex items-center gap-1">

                <div className="px-3 py-2 rounded-md flex items-center gap-2">
                    <span className="text-base font-semibold text-gray-600">
                        About
                    </span>
                </div>

                <div className="px-3 py-2 rounded-md  flex items-center gap-2">
                    <span className="text-base font-semibold ">
                        Course Catalogue
                    </span>
                </div>

                <div className="px-3 py-2 rounded-md flex items-center gap-2">
                    <span className="text-base font-semibold text-gray-600">
                        Self-Study
                    </span>
                </div>

                <div className="px-3 py-2 rounded-md flex items-center gap-2">
                    <span className="text-base font-semibold text-gray-600">
                        Cpe Forums
                    </span>
                </div>

            </div>


            {/* RIGHT SIDE */}
            <div className="flex items-center gap-4">

                {/* icon box */}
                <div className="w-12 h-12 p-2 bg-white rounded-md flex justify-center items-center">
                    <div className="w-6 h-6 relative">
                        <div className="w-4 h-4 absolute left-[3px] top-[3px]">
                            <Search />
                        </div>
                    </div>
                </div>

                {/* black square */}
                <div className="w-12 h-12 flex items-center">
                    <LucideShoppingCart />
                    {/* <img src="/assets/images/cart.gif" className="w-8 h-8"></img> */}
                </div>

                {/* avatar */}
                <img
                    className="w-7 h-7"
                    src="https://placehold.co/29x29"
                    alt="profile"
                />

                {/* dashboard button */}
                <DropdownMenu modal={false}>
                    <DropdownMenuTrigger asChild>
                        <button className="px-4 py-2.5 bg-white rounded-lg border border-gray-300 shadow-sm flex items-center gap-2">
                            <span className="text-base font-semibold text-slate-700">
                                Dashboard
                            </span>
                            <ChevronDown className="w-4 h-4" />
                        </button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end" className="w-44">
                        <DropdownMenuItem className="cursor-pointer">Profile</DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer">Settings</DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer">Logout</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    )
}

export default LearnerNavBar