"use client"
import { AppSidebar } from "@/components/app-sidebar"
import { NotAuthorized } from "@/components/not-authorized"
import { RestaurantTable, schema } from "@/components/restaurent-data-table"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { RoleGuard } from "@/lib/roles"
import * as React from "react"
import data from "../data.json"

export default function RestaurantsPage()
{
    const [open, setOpen] = React.useState(false)
    const [form, setForm] = React.useState({
        name: "",
        location: "",
        ownerName: "",
        ownerEmail: "",
        description: "",
        latitude: "",
        longitude: "",
        employeeRange: "",
        phone: "",
        logoFile: null as File | null,
        coverFile: null as File | null,
    })
    return (
        <SidebarProvider
            style={{
                "--sidebar-width": "calc(var(--spacing) * 72)",
                "--header-height": "calc(var(--spacing) * 12)",
            } as React.CSSProperties}
        >
            <AppSidebar variant="inset" />
            <SidebarInset>
                <SiteHeader />
                <RoleGuard allow={["super-admin", "admin"]} fallback={<NotAuthorized />}>
                    <div className="flex flex-col gap-6 py-4 md:py-6">
                        <div className="flex justify-end px-4 lg:px-6">
                            <Button onClick={() => setOpen(true)}>Add Restaurant</Button>
                        </div>
                        <RestaurantTable data={data as unknown as import("zod").z.infer<typeof schema>[]} />
                    </div>
                    <Sheet open={open} onOpenChange={setOpen}>
                        <SheetContent>
                            <SheetHeader>
                                <SheetTitle>Create Restaurant</SheetTitle>
                            </SheetHeader>
                            <form className="mt-4 space-y-4 px-4" onSubmit={(e) => { e.preventDefault(); setOpen(false) }}>
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Name</Label>
                                        <Input id="name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="location">Location</Label>
                                        <Input id="location" value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))} />
                                    </div>
                                </div>
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="ownerName">Owner Name</Label>
                                        <Input id="ownerName" value={form.ownerName} onChange={(e) => setForm((f) => ({ ...f, ownerName: e.target.value }))} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="ownerEmail">Owner Email</Label>
                                        <Input id="ownerEmail" type="email" value={form.ownerEmail} onChange={(e) => setForm((f) => ({ ...f, ownerEmail: e.target.value }))} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="description">Description</Label>
                                    <textarea id="description" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} className="min-h-24 w-full rounded-md border bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" />
                                </div>
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="latitude">Latitude</Label>
                                        <Input id="latitude" inputMode="decimal" value={form.latitude} onChange={(e) => setForm((f) => ({ ...f, latitude: e.target.value }))} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="longitude">Longitude</Label>
                                        <Input id="longitude" inputMode="decimal" value={form.longitude} onChange={(e) => setForm((f) => ({ ...f, longitude: e.target.value }))} />
                                    </div>
                                </div>
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="employeeRange">Employee Range</Label>
                                        <Input id="employeeRange" placeholder="e.g. 11-50" value={form.employeeRange} onChange={(e) => setForm((f) => ({ ...f, employeeRange: e.target.value }))} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Phone</Label>
                                        <Input id="phone" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
                                    </div>
                                </div>
                                <div className="grid gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="logo">Logo</Label>
                                        <Input id="logo" type="file" accept="image/*" onChange={(e) => setForm((f) => ({ ...f, logoFile: e.target.files?.[0] ?? null }))} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="cover">Cover Image</Label>
                                        <Input id="cover" type="file" accept="image/*" onChange={(e) => setForm((f) => ({ ...f, coverFile: e.target.files?.[0] ?? null }))} />
                                    </div>
                                </div>
                                <div className="pt-2">
                                    <Button type="submit" className="w-full">Create</Button>
                                </div>
                            </form>
                        </SheetContent>
                    </Sheet>
                </RoleGuard>
            </SidebarInset>
        </SidebarProvider>
    )
}
