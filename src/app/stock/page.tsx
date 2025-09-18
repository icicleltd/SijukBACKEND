"use client"
import { AppSidebar } from "@/components/app-sidebar"
import { ClientDataTable } from "@/components/data-table/client-data-table"
import { NotAuthorized } from "@/components/not-authorized"
import { SiteHeader } from "@/components/site-header"
import { Badge } from "@/components/ui/badge"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { RoleGuard } from "@/lib/roles"
import { ColumnDef } from "@tanstack/react-table"

type Stock = { id: string; item: string; qty: number; unit: string; status: string }

const columns: ColumnDef<Stock>[] = [
    { accessorKey: "item", header: "Item" },
    { accessorKey: "qty", header: "Qty" },
    { accessorKey: "unit", header: "Unit" },
    { accessorKey: "status", header: "Status", cell: ({ getValue }) => <Badge variant="outline">{String(getValue())}</Badge> },
]

const data: Stock[] = [
    { id: "1", item: "Beef Patty", qty: 120, unit: "pcs", status: "ok" },
    { id: "2", item: "Cheddar Cheese", qty: 15, unit: "kg", status: "low" },
    { id: "3", item: "Buns", qty: 300, unit: "pcs", status: "ok" },
]

export default function StockPage()
{
    return (
        <SidebarProvider style={{ "--sidebar-width": "calc(var(--spacing) * 72)", "--header-height": "calc(var(--spacing) * 12)" } as React.CSSProperties}>
            <AppSidebar variant="inset" />
            <SidebarInset>
                <SiteHeader />
                <RoleGuard allow={["admin", "owner"]} fallback={<NotAuthorized />}>
                    <div className="p-4 lg:p-6">
                        <ClientDataTable<Stock, unknown> title="Stock" columns={columns} data={data} addLabel="Add Stock" />
                    </div>
                </RoleGuard>
            </SidebarInset>
        </SidebarProvider>
    )
}
