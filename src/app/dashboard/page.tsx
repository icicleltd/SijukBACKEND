"use client"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { RoleGuard } from "@/lib/roles"
import * as React from "react"

export default function DashboardPage()
{
    const [open, setOpen] = React.useState(false)
    const [form, setForm] = React.useState({ name: "", location: "", ownerName: "", ownerEmail: "" })
    const restaurants = React.useMemo(() => [
        { id: "r1", name: "Sunset Diner", location: "NYC" },
        { id: "r2", name: "Ocean Breeze", location: "LA" },
        { id: "r3", name: "Mountain Grill", location: "Denver" },
    ], [])
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
                <div className="p-4 lg:p-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Total Sales</CardTitle>
                        </CardHeader>
                        <CardContent className="text-3xl font-semibold">$42,340</CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Orders</CardTitle>
                        </CardHeader>
                        <CardContent className="text-3xl font-semibold">1,284</CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Customers</CardTitle>
                        </CardHeader>
                        <CardContent className="text-3xl font-semibold">892</CardContent>
                    </Card>
                    <RoleGuard allow={["super-admin", "admin"]}>
                        <Card>
                            <CardHeader>
                                <CardTitle>Active Restaurants</CardTitle>
                            </CardHeader>
                            <CardContent className="text-3xl font-semibold">36</CardContent>
                        </Card>
                    </RoleGuard>
                </div>
                <RoleGuard allow={["super-admin"]}>
                    <div className="px-4 lg:px-6">
                        <div className="mb-2 flex items-center justify-between">
                            <h3 className="text-base font-semibold">All Restaurants</h3>
                            <Button size="sm" onClick={() => setOpen(true)}>Create Restaurant</Button>
                        </div>
                        <div className="rounded-lg border divide-y text-sm">
                            {restaurants.map((r) => (
                                <div key={r.id} className="flex items-center justify-between p-3">
                                    <div className="font-medium">{r.name}</div>
                                    <div className="text-muted-foreground">{r.location}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <Sheet open={open} onOpenChange={setOpen}>
                        <SheetContent>
                            <SheetHeader>
                                <SheetTitle>Create Restaurant</SheetTitle>
                            </SheetHeader>
                            <form className="mt-4 space-y-4" onSubmit={(e) => { e.preventDefault(); setOpen(false) }}>
                                <div className="space-y-2">
                                    <Label htmlFor="name">Name</Label>
                                    <Input id="name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="location">Location</Label>
                                    <Input id="location" value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="ownerName">Owner Name</Label>
                                    <Input id="ownerName" value={form.ownerName} onChange={(e) => setForm((f) => ({ ...f, ownerName: e.target.value }))} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="ownerEmail">Owner Email</Label>
                                    <Input id="ownerEmail" type="email" value={form.ownerEmail} onChange={(e) => setForm((f) => ({ ...f, ownerEmail: e.target.value }))} />
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
