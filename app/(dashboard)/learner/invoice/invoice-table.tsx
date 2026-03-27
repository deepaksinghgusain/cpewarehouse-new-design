"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { Button } from "@/components/ui/button"

type Invoice = {
  invoice: string
  date: string
  receipt: string
}

const data: Invoice[] = [
  { invoice: "INV-001", date: "2024-01-12", receipt: "Download" },
  { invoice: "INV-002", date: "2023-05-21", receipt: "Download" },
  { invoice: "INV-003", date: "2022-09-01", receipt: "Download" },
  { invoice: "INV-004", date: "2024-02-10", receipt: "Download" },
  { invoice: "INV-005", date: "2023-08-18", receipt: "Download" },
  { invoice: "INV-006", date: "2024-04-11", receipt: "Download" },
  { invoice: "INV-007", date: "2022-07-15", receipt: "Download" },
  { invoice: "INV-008", date: "2023-12-22", receipt: "Download" },
]

const columns: ColumnDef<Invoice>[] = [
  {
    accessorKey: "invoice",
    header: "Invoice(s)",
  },
  {
    accessorKey: "date",
    header: "Date",
    filterFn: (row, columnId, filterValue) => {
      if (!filterValue || filterValue === "all") return true
      const date = new Date(row.getValue(columnId))
      return date.getFullYear().toString() === filterValue
    },
  },
  {
    accessorKey: "receipt",
    header: "Receipt",
    cell: ({ row }) => (
      <Button variant="outline" size="sm">
        {row.original.receipt}
      </Button>
    ),
  },
]

export default function InvoiceDataTable() {
  const [columnFilters, setColumnFilters] =
    React.useState<ColumnFiltersState>([])

  const table = useReactTable({
    data,
    columns,
    state: { columnFilters },
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
  })

  const uniqueYears = Array.from(
    new Set(data.map((item) => new Date(item.date).getFullYear()))
  )

  const totalRows = table.getFilteredRowModel().rows.length
  const pageIndex = table.getState().pagination.pageIndex
  const pageSize = table.getState().pagination.pageSize

  const startRow = pageIndex * pageSize + 1
  const endRow = Math.min((pageIndex + 1) * pageSize, totalRows)

  const totalPages = table.getPageCount()

  return (
    <div className="container mx-auto py-10 space-y-4">

      {/* FILTER + PAGE SIZE */}
      <div className="flex justify-between">

        <Select
          onValueChange={(value) =>
            table.getColumn("date")?.setFilterValue(value)
          }
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by Year" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {uniqueYears.map((year) => (
              <SelectItem key={year} value={year.toString()}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={pageSize.toString()}
          onValueChange={(value) => table.setPageSize(Number(value))}
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue />
          </SelectTrigger>

          <SelectContent>
            {[5, 10, 20].map((size) => (
              <SelectItem key={size} value={size.toString()}>
                {size} rows
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* TABLE */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-6">
                  No results
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* PAGINATION */}
      <div className="flex items-center justify-between">

        <div className="text-sm text-muted-foreground">
          Showing {startRow} to {endRow} of {totalRows} entries
        </div>

        <div className="flex gap-2">

          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>

          {Array.from({ length: totalPages }).map((_, index) => (
            <Button
              key={index}
              size="sm"
              variant={pageIndex === index ? "default" : "outline"}
              onClick={() => table.setPageIndex(index)}
            >
              {index + 1}
            </Button>
          ))}

          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>

        </div>
      </div>

    </div>
  )
}