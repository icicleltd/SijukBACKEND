"use client"
import { AppSidebar } from "@/components/app-sidebar"
import { ClientDataTable } from "@/components/data-table/client-data-table"
import { SiteHeader } from "@/components/site-header"
import { Badge } from "@/components/ui/badge"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { RoleGuard } from "@/lib/roles"
import { ColumnDef } from "@tanstack/react-table"

type Order = { id: string; number: string; customer: string; total: number; status: string }

const columns: ColumnDef<Order>[] = [
    { accessorKey: "number", header: "Order #" },
    { accessorKey: "customer", header: "Customer" },
    { accessorKey: "total", header: "Total", cell: ({ getValue }) => `$${(getValue() as number).toFixed(2)}` },
    { accessorKey: "status", header: "Status", cell: ({ getValue }) => <Badge variant="outline">{String(getValue())}</Badge> },
]

const data: Order[] = [
    { id: "1", number: "#1001", customer: "Alice", total: 32.5, status: "paid" },
    { id: "2", number: "#1002", customer: "Bob", total: 21.0, status: "preparing" },
    { id: "3", number: "#1003", customer: "Cara", total: 15.75, status: "delivered" },
]

export default function OrdersPage()
{
    return (
        <SidebarProvider style={{ "--sidebar-width": "calc(var(--spacing) * 72)", "--header-height": "calc(var(--spacing) * 12)" } as React.CSSProperties}>
            <AppSidebar variant="inset" />
            <SidebarInset>
                <SiteHeader />
                <RoleGuard allow={["super-admin", "admin", "owner", "user"]}>
                    <div className="p-4 lg:p-6">
                        <ClientDataTable<Order, unknown> title="Orders" columns={columns} data={data} addLabel="Create Order" />
                    </div>
                </RoleGuard>
            </SidebarInset>
        </SidebarProvider>
    )
}
