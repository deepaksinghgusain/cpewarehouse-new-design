"use client"

import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"

type Props = {
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
}

export default function PaginationComponent({
    currentPage,
    totalPages,
    onPageChange,
}: Props) {

    function generatePagination(currentPage: number, totalPages: number) {
        const pages = []

        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) pages.push(i)
        } else {
            pages.push(1)

            if (currentPage > 3) pages.push("...")

            for (
                let i = Math.max(2, currentPage - 1);
                i <= Math.min(totalPages - 1, currentPage + 1);
                i++
            ) {
                pages.push(i)
            }

            if (currentPage < totalPages - 2) pages.push("...")

            pages.push(totalPages)
        }

        return pages
    }

    const pages = generatePagination(currentPage, totalPages)

    return (
        <Pagination>
            <PaginationContent>

                {/* Previous */}
                <PaginationItem>
                    <PaginationPrevious
                        onClick={() =>
                            currentPage > 1 && onPageChange(currentPage - 1)
                        }
                    />
                </PaginationItem>

                {/* Pages */}
                {pages.map((page, index) => {
                    if (page === "...") {
                        return (
                            <PaginationItem key={index}>
                                <span className="px-3">...</span>
                            </PaginationItem>
                        )
                    }

                    return (
                        <PaginationItem key={index}>
                            <PaginationLink
                                isActive={currentPage === page}
                                onClick={() => onPageChange(Number(page))}
                                className="border-gray-200"
                            >
                                {page}
                            </PaginationLink>
                        </PaginationItem>
                    )
                })}

                {/* Next */}
                <PaginationItem>
                    <PaginationNext
                        onClick={() =>
                            currentPage < totalPages &&
                            onPageChange(currentPage + 1)
                        }
                    />
                </PaginationItem>

            </PaginationContent>
        </Pagination>
    )
}