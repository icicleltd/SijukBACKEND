"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { IconChevronDown, IconChevronLeft, IconChevronRight, IconChevronsLeft, IconChevronsRight, IconPlus } from "@tabler/icons-react"
import { ColumnDef, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, SortingState, useReactTable } from "@tanstack/react-table"
import * as React from "react"

type Props<TData, TValue> = {
    title?: string
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    addLabel?: string
    onAddClick?: () => void
    searchPlaceholder?: string
    renderRowActions?: (row: TData) => React.ReactNode
}

export function ClientDataTable<TData, TValue>({
    title,
    columns,
    data,
    addLabel = "Add",
    onAddClick,
    searchPlaceholder = "Search...",
    renderRowActions,
}: Props<TData, TValue>)
{
    const [globalFilter, setGlobalFilter] = React.useState("")
    const [pageSize, setPageSize] = React.useState(10)
    const [sorting, setSorting] = React.useState<SortingState>([])

    const table = useReactTable({
        data,
        columns: React.useMemo(() =>
        {
            if (!renderRowActions) return columns
            return [
                ...columns,
                {
                    id: "actions",
                    header: "",
                    cell: (ctx: unknown) =>
                    {
                        const r = ctx as { row: { original: TData } }
                        return renderRowActions ? renderRowActions(r.row.original) : null
                    },
                    enableSorting: false,
                } as unknown as ColumnDef<TData, TValue>,
            ]
        }, [columns, renderRowActions]),
        state: { globalFilter, pagination: { pageIndex: 0, pageSize }, sorting },
        onSortingChange: setSorting,
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        globalFilterFn: "auto",
    })

    return (
        <div className="w-full space-y-4">
            <div className="flex items-center justify-between gap-2 px-4 lg:px-0">
                <div className="flex items-center gap-2">
                    {title && <h2 className="text-lg font-semibold">{title}</h2>}
                    <Input
                        placeholder={searchPlaceholder}
                        value={globalFilter ?? ""}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        className="h-8 w-48"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                                Columns
                                <IconChevronDown />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            {table
                                .getAllLeafColumns()
                                .filter((c) => c.getCanHide())
                                .map((column) => (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        className="capitalize"
                                        checked={column.getIsVisible()}
                                        onCheckedChange={(value) => column.toggleVisibility(!!value)}
                                    >
                                        {column.id}
                                    </DropdownMenuCheckboxItem>
                                ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Button variant="outline" size="sm" onClick={onAddClick}>
                        <IconPlus />
                        {addLabel}
                    </Button>
                </div>
            </div>
            <div className="overflow-hidden rounded-lg border">
                <Table>
                    <TableHeader className="bg-muted sticky top-0 z-10">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) =>
                                {
                                    const canSort = header.column.getCanSort?.()
                                    const sortDir = header.column.getIsSorted?.()
                                    return (
                                        <TableHead
                                            key={header.id}
                                            colSpan={header.colSpan}
                                            onClick={canSort ? header.column.getToggleSortingHandler?.() : undefined}
                                            className={canSort ? "cursor-pointer select-none" : undefined}
                                        >
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(header.column.columnDef.header, header.getContext())}
                                            {sortDir ? (sortDir === "asc" ? " ▲" : " ▼") : ""}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-between px-4">
                <div className="hidden items-center gap-2 lg:flex">
                    <span className="text-sm">Rows per page</span>
                    <Select value={`${pageSize}`} onValueChange={(v) => setPageSize(Number(v))}>
                        <SelectTrigger size="sm" className="w-20">
                            <SelectValue placeholder={pageSize} />
                        </SelectTrigger>
                        <SelectContent side="top">
                            {[10, 20, 30, 40, 50].map((s) => (
                                <SelectItem key={s} value={`${s}`}>
                                    {s}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        className="hidden h-8 w-8 p-0 lg:flex"
                        onClick={() => table.setPageIndex(0)}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <span className="sr-only">First page</span>
                        <IconChevronsLeft />
                    </Button>
                    <Button
                        variant="outline"
                        className="size-8"
                        size="icon"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <span className="sr-only">Previous page</span>
                        <IconChevronLeft />
                    </Button>
                    <div className="text-sm font-medium">
                        Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount() || 1}
                    </div>
                    <Button
                        variant="outline"
                        className="size-8"
                        size="icon"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        <span className="sr-only">Next page</span>
                        <IconChevronRight />
                    </Button>
                    <Button
                        variant="outline"
                        className="hidden size-8 lg:flex"
                        size="icon"
                        onClick={() => table.setPageIndex(Math.max(0, table.getPageCount() - 1))}
                        disabled={!table.getCanNextPage()}
                    >
                        <span className="sr-only">Last page</span>
                        <IconChevronsRight />
                    </Button>
                </div>
            </div>
        </div>
    )
}
