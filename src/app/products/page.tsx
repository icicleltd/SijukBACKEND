"use client"
import { AppSidebar } from "@/components/app-sidebar"
import { ClientDataTable } from "@/components/data-table/client-data-table"
import { NotAuthorized } from "@/components/not-authorized"
import { SiteHeader } from "@/components/site-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { RoleGuard } from "@/lib/roles"
import { ColumnDef } from "@tanstack/react-table"
import * as React from "react"

type Product = { id: string; name: string; sku: string; price: number; status: string }

const columns: ColumnDef<Product>[] = [
    { accessorKey: "name", header: "Product" },
    { accessorKey: "sku", header: "SKU" },
    { accessorKey: "price", header: "Price", cell: ({ getValue }) => `$${(getValue() as number).toFixed(2)}` },
    { accessorKey: "status", header: "Status", cell: ({ getValue }) => <Badge variant="outline">{String(getValue())}</Badge> },
]

const data: Product[] = [
    { id: "1", name: "Cheeseburger", sku: "CB-001", price: 9.99, status: "active" },
    { id: "2", name: "Veggie Pizza", sku: "VP-002", price: 12.5, status: "active" },
    { id: "3", name: "Caesar Salad", sku: "CS-003", price: 7.25, status: "archived" },
]

export default function ProductsPage()
{
    const [rows, setRows] = React.useState<Product[]>(data)
    const [open, setOpen] = React.useState(false)
    return (
        <SidebarProvider style={{ "--sidebar-width": "calc(var(--spacing) * 72)", "--header-height": "calc(var(--spacing) * 12)" } as React.CSSProperties}>
            <AppSidebar variant="inset" />
            <SidebarInset>
                <SiteHeader />
                <RoleGuard allow={["owner"]} fallback={<NotAuthorized />}>
                    <div className="p-4 lg:p-6">
                        <ClientDataTable<Product, unknown>
                            title="Products"
                            columns={columns}
                            data={rows}
                            addLabel="Add Product"
                            onAddClick={() => setOpen(true)}
                            renderRowActions={(row) => (
                                <Button variant="ghost" size="sm" onClick={() => setRows((r) => r.filter((x) => x.id !== (row as Product).id))}>Delete</Button>
                            )}
                        />
                        <Sheet open={open} onOpenChange={setOpen}>
                            <SheetContent>
                                <SheetHeader>
                                    <SheetTitle>Add Product</SheetTitle>
                                </SheetHeader>
                                <form className="mt-4 space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Name</Label>
                                        <Input id="name" placeholder="e.g. Cheeseburger" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="sku">SKU</Label>
                                        <Input id="sku" placeholder="e.g. CB-001" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="price">Price</Label>
                                        <Input id="price" type="number" step="0.01" placeholder="9.99" />
                                    </div>
                                    <div className="pt-2">
                                        <Button type="button" onClick={() => setOpen(false)} className="w-full">Save</Button>
                                    </div>
                                </form>
                            </SheetContent>
                        </Sheet>
                    </div>
                </RoleGuard>
            </SidebarInset>
        </SidebarProvider>
    )
}
