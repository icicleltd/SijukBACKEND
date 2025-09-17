"use client"
import { AppSidebar } from "@/components/app-sidebar"
import { ClientDataTable } from "@/components/data-table/client-data-table"
import { NotAuthorized } from "@/components/not-authorized"
import { SiteHeader } from "@/components/site-header"
import { Badge } from "@/components/ui/badge"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { RoleGuard } from "@/lib/roles"
import { ColumnDef } from "@tanstack/react-table"

type User = { id: string; name: string; email: string; role: string; status: string }

const columns: ColumnDef<User>[] = [
    { accessorKey: "name", header: "Name" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "role", header: "Role" },
    { accessorKey: "status", header: "Status", cell: ({ getValue }) => <Badge variant="outline">{String(getValue())}</Badge> },
]

const data: User[] = [
    { id: "1", name: "Alice", email: "alice@example.com", role: "owner", status: "active" },
    { id: "2", name: "Bob", email: "bob@example.com", role: "admin", status: "active" },
    { id: "3", name: "Carol", email: "carol@example.com", role: "user", status: "disabled" },
]

export default function UsersPage()
{
    return (
        <SidebarProvider style={{ "--sidebar-width": "calc(var(--spacing) * 72)", "--header-height": "calc(var(--spacing) * 12)" } as React.CSSProperties}>
            <AppSidebar variant="inset" />
            <SidebarInset>
                <SiteHeader />
                <RoleGuard allow={["super-admin", "admin"]} fallback={<NotAuthorized />}>
                    <div className="p-4 lg:p-6">
                        <ClientDataTable<User, unknown> title="Users" columns={columns} data={data} addLabel="Add User" />
                    </div>
                </RoleGuard>
            </SidebarInset>
        </SidebarProvider>
    )
}
