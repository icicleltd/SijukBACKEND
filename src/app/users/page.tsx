"use client"
import { AppSidebar } from "@/components/app-sidebar"
import { ClientDataTable } from "@/components/data-table/client-data-table"
import { NotAuthorized } from "@/components/not-authorized"
import { SiteHeader } from "@/components/site-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { RoleGuard } from "@/lib/roles"
import { IconDotsVertical } from "@tabler/icons-react"
import { ColumnDef } from "@tanstack/react-table"
import * as React from "react"

type User = { id: string; name: string; email: string; role: string; status: string }

const columns: ColumnDef<User>[] = [
    { accessorKey: "name", header: "Name" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "role", header: "Role" },
    { accessorKey: "status", header: "Status", cell: ({ getValue }) => <Badge variant="outline">{String(getValue())}</Badge> },
]

const seed: User[] = [
    { id: "1", name: "Alice", email: "alice@example.com", role: "owner", status: "active" },
    { id: "2", name: "Bob", email: "bob@example.com", role: "admin", status: "active" },
    { id: "3", name: "Carol", email: "carol@example.com", role: "user", status: "disabled" },
]

export default function UsersPage()
{
    const [rows, setRows] = React.useState<User[]>(seed)
    const [open, setOpen] = React.useState(false)
    const [editing, setEditing] = React.useState<User | null>(null)
    const [form, setForm] = React.useState<Partial<User>>({})
    const onAdd = () => { setEditing(null); setForm({}); setOpen(true) }
    const onEdit = (row: User) => { setEditing(row); setForm(row); setOpen(true) }
    const onDelete = (row: User) => setRows((r) => r.filter((x) => x.id !== row.id))
    const onSave = () =>
    {
        if (editing) {
            setRows((r) => r.map((x) => (x.id === editing.id ? { ...(editing as User), ...(form as User) } : x)))
        } else {
            const id = (rows.length + 1).toString()
            setRows((r) => [...r, { id, name: form.name || "", email: form.email || "", role: form.role || "user", status: form.status || "active" }])
        }
        setOpen(false)
    }
    return (
        <SidebarProvider style={{ "--sidebar-width": "calc(var(--spacing) * 72)", "--header-height": "calc(var(--spacing) * 12)" } as React.CSSProperties}>
            <AppSidebar variant="inset" />
            <SidebarInset>
                <SiteHeader />
                <RoleGuard allow={["super-admin", "admin"]} fallback={<NotAuthorized />}>
                    <div className="p-4 lg:p-6">
                        <ClientDataTable<User, unknown>
                            title="Users"
                            columns={columns}
                            data={rows}
                            addLabel="Add User"
                            onAddClick={onAdd}
                            renderRowActions={(row) => (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="size-8">
                                            <IconDotsVertical />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => onEdit(row)}>Edit</DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => onDelete(row)} variant="destructive">Delete</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            )}
                        />
                        <Sheet open={open} onOpenChange={setOpen}>
                            <SheetContent>
                                <SheetHeader>
                                    <SheetTitle>{editing ? "Edit User" : "Add User"}</SheetTitle>
                                </SheetHeader>
                                <form className="mt-4 space-y-4" onSubmit={(e) => { e.preventDefault(); onSave() }}>
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Name</Label>
                                        <Input id="name" value={form.name || ""} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input id="email" type="email" value={form.email || ""} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="role">Role</Label>
                                        <Input id="role" value={form.role || "user"} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="status">Status</Label>
                                        <Input id="status" value={form.status || "active"} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))} />
                                    </div>
                                    <div className="pt-2">
                                        <Button type="submit" className="w-full">Save</Button>
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
