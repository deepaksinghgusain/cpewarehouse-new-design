"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"


export default function Search() {
    const [query, setQuery] = React.useState("")
    const [filtered, setFiltered] = React.useState<string[]>([])
    const [open, setOpen] = React.useState(false)

    const options = [
        "React",
        "Next.js",
        "Node.js",
        "GraphQL",
        "Tailwind CSS",
        "MongoDB",
    ]

    React.useEffect(() => {
        if (!query) {
            setFiltered([])
            return
        }

        console.log(options);


        const results = options.filter((item) =>
            item.toLowerCase().includes(query.toLowerCase())
        )

        setFiltered(results)
    }, [query, options])

    return (
        <div className="relative w-full max-w-sm">
            <Input
                placeholder="Search Course"
                value={query}
                onChange={(e) => {
                    setQuery(e.target.value)
                    setOpen(true)
                }}
                onFocus={() => setOpen(true)}
            />

            {open && filtered.length > 0 && (
                <Card className="absolute z-50 p-0 w-full max-h-60 gap-0 overflow-auto">
                    {filtered.map((item, index) => (
                        <div
                            key={index}
                            className="cursor-pointer rounded-md px-2 py-1 hover:bg-muted"
                            onClick={() => {
                                setQuery(item)
                                setOpen(false)
                            }}
                        >
                            {item}
                        </div>
                    ))}
                </Card>
            )}
        </div>
    )
}