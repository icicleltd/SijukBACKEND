"use client"
import { AppSidebar } from "@/components/app-sidebar"
import { ClientDataTable } from "@/components/data-table/client-data-table"
import { NotAuthorized } from "@/components/not-authorized"
import { SiteHeader } from "@/components/site-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { RoleGuard } from "@/lib/roles"
import { ColumnDef } from "@tanstack/react-table"
import { Archive, DollarSign, Package, Plus, TrendingUp } from "lucide-react"
import * as React from "react"

type Product = { id: string; name: string; sku: string; price: number; status: string; category: string; stock: number }

const columns: ColumnDef<Product>[] = [
    {
        accessorKey: "name",
        header: "Product",
        cell: ({ getValue, row }) => (
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center text-white font-medium">
                    {String(getValue()).charAt(0).toUpperCase()}
                </div>
                <div>
                    <div className="font-medium text-gray-900">{String(getValue())}</div>
                    <div className="text-sm text-gray-500">{(row.original as Product).category}</div>
                </div>
            </div>
        )
    },
    {
        accessorKey: "sku",
        header: "SKU",
        cell: ({ getValue }) => (
            <code className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs font-mono">
                {String(getValue())}
            </code>
        )
    },
    {
        accessorKey: "price",
        header: "Price",
        cell: ({ getValue }) => (
            <div className="font-bold text-green-600">
                ${(getValue() as number).toFixed(2)}
            </div>
        )
    },
    {
        accessorKey: "stock",
        header: "Stock",
        cell: ({ getValue }) =>
        {
            const stock = getValue() as number
            return (
                <Badge className={stock > 10 ? "bg-green-100 text-green-800" : stock > 0 ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"}>
                    {stock} units
                </Badge>
            )
        }
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ getValue }) =>
        {
            const status = String(getValue())
            return (
                <Badge className={status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                    {status}
                </Badge>
            )
        }
    },
]

const data: Product[] = [
    { id: "1", name: "Cheeseburger", sku: "CB-001", price: 9.99, status: "active", category: "Burgers", stock: 45 },
    { id: "2", name: "Veggie Pizza", sku: "VP-002", price: 12.5, status: "active", category: "Pizza", stock: 23 },
    { id: "3", name: "Caesar Salad", sku: "CS-003", price: 7.25, status: "archived", category: "Salads", stock: 0 },
    { id: "4", name: "Chicken Wings", sku: "CW-004", price: 8.99, status: "active", category: "Appetizers", stock: 8 },
]

const productStats = {
    totalProducts: data.length,
    activeProducts: data.filter(p => p.status === "active").length,
    totalValue: data.reduce((sum, p) => sum + (p.price * p.stock), 0),
    lowStock: data.filter(p => p.stock <= 10 && p.stock > 0).length,
}

export default function ProductsPage()
{
    const [rows, setRows] = React.useState<Product[]>(data)
    const [open, setOpen] = React.useState(false)

    return (
        <SidebarProvider style={{ "--sidebar-width": "calc(var(--spacing) * 72)", "--header-height": "calc(var(--spacing) * 12)" } as React.CSSProperties}>
            <AppSidebar variant="inset" />
            <SidebarInset>
                <SiteHeader />
                <RoleGuard allow={["admin", "owner"]} fallback={<NotAuthorized />}>
                    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-4 lg:p-6">
                        {/* Header */}
                        <div className="mb-6">
                            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                                <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl">
                                    <Package className="h-8 w-8 text-white" />
                                </div>
                                Product Management
                            </h1>
                            <p className="text-gray-600 mt-1">Manage your menu items and inventory</p>
                        </div>

                        {/* Stats Cards */}
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
                            <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-green-50/50">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">Total Products</p>
                                            <p className="text-3xl font-bold text-gray-900">{productStats.totalProducts}</p>
                                        </div>
                                        <div className="p-3 bg-green-100 rounded-xl">
                                            <Package className="h-6 w-6 text-green-600" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-blue-50/50">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">Active Products</p>
                                            <p className="text-3xl font-bold text-gray-900">{productStats.activeProducts}</p>
                                        </div>
                                        <div className="p-3 bg-blue-100 rounded-xl">
                                            <TrendingUp className="h-6 w-6 text-blue-600" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-purple-50/50">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">Inventory Value</p>
                                            <p className="text-3xl font-bold text-gray-900">${productStats.totalValue.toFixed(0)}</p>
                                        </div>
                                        <div className="p-3 bg-purple-100 rounded-xl">
                                            <DollarSign className="h-6 w-6 text-purple-600" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-orange-50/50">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">Low Stock</p>
                                            <p className="text-3xl font-bold text-gray-900">{productStats.lowStock}</p>
                                        </div>
                                        <div className="p-3 bg-orange-100 rounded-xl">
                                            <Archive className="h-6 w-6 text-orange-600" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Products Table */}
                        <Card className="border-0 shadow-xl bg-gradient-to-br from-white via-green-50/20 to-emerald-50/30">
                            <CardHeader className="bg-gradient-to-r from-green-500/5 to-emerald-500/5">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                            <Package className="h-5 w-5 text-green-500" />
                                            Product Catalog
                                        </CardTitle>
                                        <CardDescription className="text-gray-600 mt-1">
                                            Manage menu items, pricing, and inventory
                                        </CardDescription>
                                    </div>
                                    <Button
                                        onClick={() => setOpen(true)}
                                        className="bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700"
                                    >
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add Product
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                <ClientDataTable<Product, unknown>
                                    title=""
                                    columns={columns}
                                    data={rows}
                                    addLabel="Add Product"
                                    onAddClick={() => setOpen(true)}
                                    renderRowActions={(row) => (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setRows((r) => r.filter((x) => x.id !== (row as Product).id))}
                                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                        >
                                            Delete
                                        </Button>
                                    )}
                                />
                            </CardContent>
                        </Card>

                        <Sheet open={open} onOpenChange={setOpen}>
                            <SheetContent className="w-[400px] sm:w-[540px]">
                                <SheetHeader>
                                    <SheetTitle className="flex items-center gap-2">
                                        <Plus className="h-5 w-5" />
                                        Add New Product
                                    </SheetTitle>
                                </SheetHeader>
                                <form className="mt-6 space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Product Name</Label>
                                        <Input id="name" placeholder="e.g. Cheeseburger" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="sku">SKU</Label>
                                            <Input id="sku" placeholder="e.g. CB-001" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="category">Category</Label>
                                            <Input id="category" placeholder="e.g. Burgers" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="price">Price ($)</Label>
                                            <Input id="price" type="number" step="0.01" placeholder="9.99" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="stock">Stock Quantity</Label>
                                            <Input id="stock" type="number" placeholder="50" />
                                        </div>
                                    </div>
                                    <div className="pt-4">
                                        <Button
                                            type="button"
                                            onClick={() => setOpen(false)}
                                            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700"
                                        >
                                            Save Product
                                        </Button>
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
