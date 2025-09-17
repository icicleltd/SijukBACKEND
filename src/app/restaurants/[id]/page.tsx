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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RoleGuard } from "@/lib/roles"
import type { ColumnDef } from "@tanstack/react-table"
import * as React from "react"

export default function RestaurantDetailsPage({ params }: { params: { id: string } })
{
    const [activeTab, setActiveTab] = React.useState("products")
    const [open, setOpen] = React.useState(false)

    // Mock restaurant-specific datasets
    const [products, setProducts] = React.useState(() => ([
        { id: "p1", name: "Classic Burger", price: 9.99, stock: 42, category: "Burgers" },
        { id: "p2", name: "Veggie Burger", price: 8.49, stock: 15, category: "Burgers" },
        { id: "p3", name: "Fries", price: 3.49, stock: 100, category: "Sides" },
    ]))
    const [stock, setStock] = React.useState(() => ([
        { id: "s1", name: "Buns", qty: 12, min: 8 },
        { id: "s2", name: "Cheese", qty: 4, min: 6 },
        { id: "s3", name: "Beef Patty", qty: 22, min: 10 },
    ]))
    const [orders, setOrders] = React.useState(() => ([
        { id: "o1", number: "#1001", items: 3, channel: "POS", total: 24.47, status: "paid" },
        { id: "o2", number: "#1002", items: 2, channel: "Online", total: 18.98, status: "paid" },
        { id: "o3", number: "#1003", items: 1, channel: "Online", total: 9.99, status: "pending" },
    ]))

    // Columns
    type Prod = typeof products[number]
    const productCols: ColumnDef<Prod, unknown>[] = [
        { accessorKey: "name", header: "Name" },
        { accessorKey: "category", header: "Category" },
        { accessorKey: "price", header: "Price", cell: ({ row }) => `$${row.original.price.toFixed(2)}` },
        { accessorKey: "stock", header: "In Stock" },
    ]
    type Stock = typeof stock[number]
    const stockCols: ColumnDef<Stock, unknown>[] = [
        { accessorKey: "name", header: "Item" },
        { accessorKey: "qty", header: "Qty" },
        { accessorKey: "min", header: "Min" },
        {
            id: "health",
            header: "Health",
            cell: ({ row }) => row.original.qty <= row.original.min ? (
                <Badge variant="destructive">LOW</Badge>
            ) : (
                <Badge variant="secondary">OK</Badge>
            ),
            enableSorting: false,
        },
    ]
    type Ord = typeof orders[number]
    const orderCols: ColumnDef<Ord, unknown>[] = [
        { accessorKey: "number", header: "Order" },
        { accessorKey: "channel", header: "Channel" },
        { accessorKey: "items", header: "Items" },
        { accessorKey: "total", header: "Total", cell: ({ row }) => `$${row.original.total.toFixed(2)}` },
        { accessorKey: "status", header: "Status" },
    ]

    // Minimal add/edit forms per tab (sheets)
    type ProductForm = { kind: "products"; name: string; category: string; price: string; stock: string }
    type StockForm = { kind: "stock"; name: string; qty: string; min: string }
    type OrderForm = { kind: "orders"; channel: "POS" | "Online" | ""; items: string; total: string; status: "paid" | "pending" | "cancelled" | "" }
    type FormState = ProductForm | StockForm | OrderForm | object
    const [form, setForm] = React.useState<FormState>({})
    const onAdd = () => setOpen(true)
    const onSubmit = (e: React.FormEvent) =>
    {
        e.preventDefault()
        if (activeTab === "products") {
            const f = form as Partial<ProductForm>
            setProducts((prev) => [...prev, { id: crypto.randomUUID(), name: f.name || "New", category: f.category || "Misc", price: Number(f.price || 0), stock: Number(f.stock || 0) }])
        } else if (activeTab === "stock") {
            const f = form as Partial<StockForm>
            setStock((prev) => [...prev, { id: crypto.randomUUID(), name: f.name || "Item", qty: Number(f.qty || 0), min: Number(f.min || 0) }])
        } else if (activeTab === "orders") {
            const f = form as Partial<OrderForm>
            const ch: "POS" | "Online" = (f.channel === "Online" ? "Online" : "POS")
            const st: "paid" | "pending" | "cancelled" = (f.status === "pending" || f.status === "cancelled") ? f.status : "paid"
            setOrders((prev) => [...prev, { id: crypto.randomUUID(), number: `#${Math.floor(Math.random() * 9000) + 1000}`, items: Number(f.items || 1), channel: ch, total: Number(f.total || 0), status: st }])
        }
        setForm({})
        setOpen(false)
    }

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

                <RoleGuard allow={["owner"]}>

                    <div className="p-4 lg:p-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <h1 className="text-xl font-semibold">Restaurant {params.id}</h1>
                            <Button size="sm" onClick={onAdd}>Add</Button>
                        </div>

                        <Tabs value={activeTab} onValueChange={setActiveTab}>
                            <TabsList>
                                <TabsTrigger value="products">Products</TabsTrigger>
                                <TabsTrigger value="stock">Stock</TabsTrigger>
                                <TabsTrigger value="orders">Orders</TabsTrigger>
                                <TabsTrigger value="pos">POS</TabsTrigger>
                            </TabsList>
                            <TabsContent value="products">
                                <ClientDataTable title="Products" columns={productCols} data={products} addLabel="Add Product" onAddClick={onAdd} />
                            </TabsContent>
                            <TabsContent value="stock">
                                <ClientDataTable title="Stock" columns={stockCols} data={stock} addLabel="Add Item" onAddClick={onAdd} />
                            </TabsContent>
                            <TabsContent value="orders">
                                <ClientDataTable title="Orders" columns={orderCols} data={orders} addLabel="Create Order" onAddClick={onAdd} />
                            </TabsContent>
                            <TabsContent value="pos">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>POS</CardTitle>
                                    </CardHeader>
                                    <CardContent className="text-sm text-muted-foreground">POS UI can be implemented here per restaurant.</CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </div>

                    <Sheet open={open} onOpenChange={setOpen}>
                        <SheetContent>
                            <SheetHeader>
                                <SheetTitle>Add to {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</SheetTitle>
                            </SheetHeader>
                            <form onSubmit={onSubmit} className="mt-4 space-y-4">
                                {activeTab === "products" && (
                                    <>
                                        <div className="space-y-2">
                                            <Label htmlFor="pname">Name</Label>
                                            <Input id="pname" value={(form as ProductForm).name || ""} onChange={(e) => setForm((f) => ({ ...(f as object), kind: "products", name: e.target.value } as ProductForm))} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="pcat">Category</Label>
                                            <Input id="pcat" value={(form as ProductForm).category || ""} onChange={(e) => setForm((f) => ({ ...(f as object), kind: "products", category: e.target.value } as ProductForm))} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="pprice">Price</Label>
                                            <Input id="pprice" inputMode="decimal" value={(form as ProductForm).price || ""} onChange={(e) => setForm((f) => ({ ...(f as object), kind: "products", price: e.target.value } as ProductForm))} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="pstock">Stock</Label>
                                            <Input id="pstock" inputMode="numeric" value={(form as ProductForm).stock || ""} onChange={(e) => setForm((f) => ({ ...(f as object), kind: "products", stock: e.target.value } as ProductForm))} />
                                        </div>
                                    </>
                                )}
                                {activeTab === "stock" && (
                                    <>
                                        <div className="space-y-2">
                                            <Label htmlFor="sname">Item</Label>
                                            <Input id="sname" value={(form as StockForm).name || ""} onChange={(e) => setForm((f) => ({ ...(f as object), kind: "stock", name: e.target.value } as StockForm))} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="sqty">Qty</Label>
                                            <Input id="sqty" inputMode="numeric" value={(form as StockForm).qty || ""} onChange={(e) => setForm((f) => ({ ...(f as object), kind: "stock", qty: e.target.value } as StockForm))} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="smin">Min</Label>
                                            <Input id="smin" inputMode="numeric" value={(form as StockForm).min || ""} onChange={(e) => setForm((f) => ({ ...(f as object), kind: "stock", min: e.target.value } as StockForm))} />
                                        </div>
                                    </>
                                )}
                                {activeTab === "orders" && (
                                    <>
                                        <div className="space-y-2">
                                            <Label htmlFor="ochannel">Channel</Label>
                                            <Select value={(form as OrderForm).channel || ""} onValueChange={(v) => setForm((f) => ({ ...(f as object), kind: "orders", channel: v as OrderForm["channel"] } as OrderForm))}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select channel" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="POS">POS</SelectItem>
                                                    <SelectItem value="Online">Online</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="oitems">Items</Label>
                                            <Input id="oitems" inputMode="numeric" value={(form as OrderForm).items || ""} onChange={(e) => setForm((f) => ({ ...(f as object), kind: "orders", items: e.target.value } as OrderForm))} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="ototal">Total</Label>
                                            <Input id="ototal" inputMode="decimal" value={(form as OrderForm).total || ""} onChange={(e) => setForm((f) => ({ ...(f as object), kind: "orders", total: e.target.value } as OrderForm))} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="ostatus">Status</Label>
                                            <Select value={(form as OrderForm).status || ""} onValueChange={(v) => setForm((f) => ({ ...(f as object), kind: "orders", status: v as OrderForm["status"] } as OrderForm))}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select status" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="paid">paid</SelectItem>
                                                    <SelectItem value="pending">pending</SelectItem>
                                                    <SelectItem value="cancelled">cancelled</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </>
                                )}
                                <Button type="submit" className="w-full">Save</Button>
                            </form>
                        </SheetContent>
                    </Sheet>
                </RoleGuard>
            </SidebarInset>
        </SidebarProvider>
    )
}
