"use client"
import { AppSidebar } from "@/components/app-sidebar"
import { ClientDataTable } from "@/components/data-table/client-data-table"
import { SiteHeader } from "@/components/site-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { RoleGuard } from "@/lib/roles"
import type { ColumnDef } from "@tanstack/react-table"
import * as React from "react"

export default function DashboardPage()
{
    const [open, setOpen] = React.useState(false)
    const [form, setForm] = React.useState<{
        name: string
        location: string
        ownerName: string
        ownerEmail: string
        description: string
        latitude: string
        longitude: string
        employeeRange: string
        phone: string
        logoFile: File | null
        coverFile: File | null
    }>({
        name: "",
        location: "",
        ownerName: "",
        ownerEmail: "",
        description: "",
        latitude: "",
        longitude: "",
        employeeRange: "",
        phone: "",
        logoFile: null,
        coverFile: null,
    })
    const restaurants = React.useMemo(() => [
        {
            id: "r1",
            name: "Sunset Diner",
            location: "NYC",
            topSoldItem: "Classic Burger",
            soldToday: 184,
            onlineSold: 92,
            posSold: 92,
            balance: 3290,
            stock: [
                { id: "s1", name: "Buns", qty: 5, min: 8 },
                { id: "s2", name: "Cheese", qty: 12, min: 5 },
                { id: "s3", name: "Beef Patty", qty: 7, min: 10 },
            ],
        },
        {
            id: "r2",
            name: "Ocean Breeze",
            location: "LA",
            topSoldItem: "Grilled Salmon",
            soldToday: 132,
            onlineSold: 54,
            posSold: 78,
            balance: 2180,
            stock: [
                { id: "s1", name: "Lemon", qty: 14, min: 10 },
                { id: "s2", name: "Salmon", qty: 6, min: 6 },
                { id: "s3", name: "Butter", qty: 2, min: 5 },
            ],
        },
        {
            id: "r3",
            name: "Mountain Grill",
            location: "Denver",
            topSoldItem: "Steak & Fries",
            soldToday: 96,
            onlineSold: 40,
            posSold: 56,
            balance: 1745,
            stock: [
                { id: "s1", name: "Potatoes", qty: 20, min: 10 },
                { id: "s2", name: "Ribeye", qty: 3, min: 6 },
                { id: "s3", name: "Oil", qty: 9, min: 5 },
            ],
        },
        {
            id: "r4",
            name: "City Bites",
            location: "Chicago",
            topSoldItem: "Deep Dish Slice",
            soldToday: 211,
            onlineSold: 150,
            posSold: 61,
            balance: 3890,
            stock: [
                { id: "s1", name: "Tomato Sauce", qty: 4, min: 6 },
                { id: "s2", name: "Mozzarella", qty: 11, min: 8 },
                { id: "s3", name: "Flour", qty: 25, min: 10 },
            ],
        },
        {
            id: "r5",
            name: "Spice Route",
            location: "Houston",
            topSoldItem: "Chicken Tikka",
            soldToday: 157,
            onlineSold: 70,
            posSold: 87,
            balance: 2950,
            stock: [
                { id: "s1", name: "Chicken", qty: 16, min: 12 },
                { id: "s2", name: "Yogurt", qty: 3, min: 6 },
                { id: "s3", name: "Masala Mix", qty: 7, min: 5 },
            ],
        },
        // Add More Random Items Here
        { id: "r6", name: "Lakeside Cafe", location: "Seattle", topSoldItem: "Cedar Plank Salmon", soldToday: 123, onlineSold: 60, posSold: 63, balance: 2340, stock: [{ id: "s1", name: "Salmon", qty: 8, min: 6 }, { id: "s2", name: "Maple Syrup", qty: 5, min: 4 }, { id: "s3", name: "Asparagus", qty: 10, min: 8 }] },
        { id: "r7", name: "Garden Delight", location: "Portland", topSoldItem: "Vegan Bowl", soldToday: 89, onlineSold: 45, posSold: 44, balance: 1450, stock: [{ id: "s1", name: "Quinoa", qty: 12, min: 10 }, { id: "s2", name: "Chickpeas", qty: 8, min: 6 }, { id: "s3", name: "Avocado", qty: 5, min: 5 }] },
        { id: "r8", name: "Pasta House", location: "Boston", topSoldItem: "Spaghetti Carbonara", soldToday: 140, onlineSold: 70, posSold: 70, balance: 2600, stock: [{ id: "s1", name: "Pasta", qty: 18, min: 15 }, { id: "s2", name: "Bacon", qty: 10, min: 8 }, { id: "s3", name: "Parmesan", qty: 6, min: 5 }] },
        { id: "r9", name: "Taco Fiesta", location: "San Diego", topSoldItem: "Fish Tacos", soldToday: 175, onlineSold: 80, posSold: 95, balance: 3100, stock: [{ id: "s1", name: "Tortillas", qty: 30, min: 20 }, { id: "s2", name: "White Fish", qty: 12, min: 10 }, { id: "s3", name: "Cabbage", qty: 15, min: 10 }] },
        { id: "r10", name: "BBQ Haven", location: "Nashville", topSoldItem: "Pulled Pork Sandwich", soldToday: 160, onlineSold: 75, posSold: 85, balance: 2800, stock: [{ id: "s1", name: "Pork Shoulder", qty: 14, min: 10 }, { id: "s2", name: "BBQ Sauce", qty: 9, min: 8 }, { id: "s3", name: "Coleslaw Mix", qty: 20, min: 15 }] },
        { id: "r11", name: "Sushi World", location: "San Francisco", topSoldItem: "California Roll", soldToday: 190, onlineSold: 100, posSold: 90, balance: 3500, stock: [{ id: "s1", name: "Sushi Rice", qty: 25, min: 20 }, { id: "s2", name: "Nori Sheets", qty: 30, min: 25 }, { id: "s3", name: "Imitation Crab", qty: 15, min: 10 }] },
    ], [])
    type R = typeof restaurants[number]
    const columns = React.useMemo<ColumnDef<R, unknown>[]>(() => [
        {
            accessorKey: "name",
            header: "Name",
            cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
        },
        {
            accessorKey: "location",
            header: "Location",
        },
        {
            accessorKey: "topSoldItem",
            header: "Top Sold",
        },
        {
            accessorKey: "soldToday",
            header: "Sold Today",
        },
        {
            accessorKey: "onlineSold",
            header: "Online",
        },
        {
            accessorKey: "posSold",
            header: "POS",
        },
        {
            id: "balance",
            header: "Balance",
            cell: ({ row }) => `$${row.original.balance.toLocaleString()}`,
        },
        {
            id: "stockHealth",
            header: "Stock Health",
            cell: ({ row }) =>
            {
                const low = row.original.stock.filter((s) => s.qty <= s.min)
                return low.length ? (
                    <div className="flex flex-wrap gap-1">
                        {low.slice(0, 2).map((s) => (
                            <Badge key={s.id} variant="secondary">{s.name} {s.qty}/{s.min}</Badge>
                        ))}
                        {low.length > 2 && <Badge variant="outline">+{low.length - 2}</Badge>}
                    </div>
                ) : (
                    <Badge variant="secondary">OK</Badge>
                )
            },
            enableSorting: false,
        },
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
                <div className="p-4 lg:p-6 grid gap-4 md:grid-cols-2 xl:grid-cols-6">
                    <Card className="xl:col-span-2">
                        <CardHeader>
                            <CardTitle>Today&apos;s Total Sale</CardTitle>
                        </CardHeader>
                        <CardContent className="text-3xl font-semibold">$5,420</CardContent>
                    </Card>
                    <Card className="xl:col-span-1">
                        <CardHeader>
                            <CardTitle>Online Sale</CardTitle>
                        </CardHeader>
                        <CardContent className="text-3xl font-semibold">$2,310</CardContent>
                    </Card>
                    <Card className="xl:col-span-1">
                        <CardHeader>
                            <CardTitle>POS Sale</CardTitle>
                        </CardHeader>
                        <CardContent className="text-3xl font-semibold">$3,110</CardContent>
                    </Card>
                    <Card className="xl:col-span-1">
                        <CardHeader>
                            <CardTitle>Total Revenue</CardTitle>
                        </CardHeader>
                        <CardContent className="text-3xl font-semibold">$42,340</CardContent>
                    </Card>
                    <Card className="xl:col-span-1">
                        <CardHeader>
                            <CardTitle>Current Balance</CardTitle>
                        </CardHeader>
                        <CardContent className="text-3xl font-semibold">$12,890</CardContent>
                    </Card>
                </div>
                <RoleGuard allow={["super-admin"]}>
                    <div className="px-4 lg:px-6">
                        <ClientDataTable
                            title="All Restaurants"
                            columns={columns}
                            data={restaurants}
                            addLabel="Create"
                            onAddClick={() => setOpen(true)}
                            searchPlaceholder="Search restaurants..."
                        />
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
                                        <Label>Employee Range</Label>
                                        <Select value={form.employeeRange} onValueChange={(val) => setForm((f) => ({ ...f, employeeRange: val }))}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select range" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="1-10">1-10</SelectItem>
                                                <SelectItem value="11-50">11-50</SelectItem>
                                                <SelectItem value="51-200">51-200</SelectItem>
                                                <SelectItem value="200+">200+</SelectItem>
                                            </SelectContent>
                                        </Select>
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
