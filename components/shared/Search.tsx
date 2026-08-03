"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Search } from "lucide-react"
import Link from 'next/link'
import { getAllCourseForSearch } from "@/services/course"
import { usePathname } from "next/navigation"
import { useEffect } from "react"

export default function SearchComponent() {
    const [query, setQuery] = React.useState("")
    const [filtered, setFiltered] = React.useState<any[]>([])
    const [open, setOpen] = React.useState(false)

     const pathname = usePathname();

    const onInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value)
        const results = await getAllCourseForSearch(e.target.value)
        setFiltered(results.data)
    }

    useEffect(() => {
        setQuery("")
        setFiltered([])
        setOpen(false)
    }, [pathname]);

    return (
        <div className="relative w-full">

            {/* Search Icon */}
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />

            <Input
                placeholder="Search Course"
                value={query}
                onChange={onInputChange}
                onFocus={() => setOpen(true)}
                className="pl-9 focus:ring-2 focus:ring-blue-500 border-gray-200 h-12 text-[18px]"   // space for icon
            />

            {open && filtered.length > 0 && (
                <Card className="absolute z-50 top-13 p-0 w-full max-h-60 gap-0 overflow-auto border-gray-200">
                    {filtered.map((item, index) => (
                        <Link href={"/course/" + item?.attributes?.slug}
                            key={index}
                            className="cursor-pointer px-2 py-2 hover:bg-muted bg-white border-b border-gray-200"
                            onClick={() => {
                                setOpen(false)
                            }}
                        >
                            {item?.attributes?.title}
                        </Link>
                    ))}
                </Card>
            )}
        </div>
    )
}