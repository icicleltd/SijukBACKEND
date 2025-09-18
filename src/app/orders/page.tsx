"use client"
import { AppSidebar } from "@/components/app-sidebar"
import { ClientDataTable } from "@/components/data-table/client-data-table"
import { SiteHeader } from "@/components/site-header"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { ProtectedComponent } from "@/lib/permissions"
import { ColumnDef } from "@tanstack/react-table"
import { CheckCircle, Clock, DollarSign, Package, ShoppingBag, TrendingUp, XCircle } from "lucide-react"

type Order = {
    id: string
    number: string
    customer: string
    total: number
    status: string
    items: number
    date: string
    time: string
}

const columns: ColumnDef<Order>[] = [
    {
        accessorKey: "number",
        header: "Order #",
        cell: ({ getValue }) => (
            <div className="font-medium text-gray-900">
                {String(getValue())}
            </div>
        )
    },
    {
        accessorKey: "customer",
        header: "Customer",
        cell: ({ getValue }) => (
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {String(getValue()).charAt(0).toUpperCase()}
                </div>
                <span className="font-medium text-gray-900">{String(getValue())}</span>
            </div>
        )
    },
    {
        accessorKey: "items",
        header: "Items",
        cell: ({ getValue }) => (
            <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                {getValue() as number} items
            </Badge>
        )
    },
    {
        accessorKey: "total",
        header: "Total",
        cell: ({ getValue }) => (
            <div className="font-bold text-green-600">
                ${(getValue() as number).toFixed(2)}
            </div>
        )
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ getValue }) =>
        {
            const status = String(getValue())
            const statusConfig = {
                pending: { color: "bg-yellow-100 text-yellow-800 border-yellow-200", icon: Clock },
                preparing: { color: "bg-blue-100 text-blue-800 border-blue-200", icon: Package },
                ready: { color: "bg-green-100 text-green-800 border-green-200", icon: CheckCircle },
                delivered: { color: "bg-gray-100 text-gray-800 border-gray-200", icon: CheckCircle },
                cancelled: { color: "bg-red-100 text-red-800 border-red-200", icon: XCircle },
            }
            const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
            const IconComponent = config.icon

            return (
                <Badge className={`${config.color} flex items-center gap-1 w-fit`}>
                    <IconComponent className="h-3 w-3" />
                    {status}
                </Badge>
            )
        }
    },
    {
        accessorKey: "date",
        header: "Date",
        cell: ({ getValue }) => (
            <div className="text-sm text-gray-600">
                {String(getValue())}
            </div>
        )
    },
    {
        accessorKey: "time",
        header: "Time",
        cell: ({ getValue }) => (
            <div className="text-sm text-gray-600">
                {String(getValue())}
            </div>
        )
    }
]

const data: Order[] = [
    { id: "1", number: "#ORD-1001", customer: "Alice Johnson", total: 32.50, status: "delivered", items: 3, date: "2024-01-15", time: "12:30 PM" },
    { id: "2", number: "#ORD-1002", customer: "Bob Smith", total: 21.00, status: "preparing", items: 2, date: "2024-01-15", time: "1:15 PM" },
    { id: "3", number: "#ORD-1003", customer: "Carol Davis", total: 15.75, status: "ready", items: 1, date: "2024-01-15", time: "1:45 PM" },
    { id: "4", number: "#ORD-1004", customer: "David Wilson", total: 45.25, status: "pending", items: 5, date: "2024-01-15", time: "2:00 PM" },
    { id: "5", number: "#ORD-1005", customer: "Eva Brown", total: 18.99, status: "cancelled", items: 2, date: "2024-01-15", time: "2:15 PM" },
]

const orderStats = {
    totalOrders: data.length,
    totalRevenue: data.filter(o => o.status !== 'cancelled').reduce((sum, o) => sum + o.total, 0),
    pendingOrders: data.filter(o => o.status === 'pending').length,
    completedOrders: data.filter(o => o.status === 'delivered').length,
}

export default function OrdersPage()
{
    return (
        <SidebarProvider style={{ "--sidebar-width": "calc(var(--spacing) * 72)", "--header-height": "calc(var(--spacing) * 12)" } as React.CSSProperties}>
            <AppSidebar variant="inset" />
            <SidebarInset>
                <SiteHeader />
                <ProtectedComponent roles={["owner", "admin"]} permission="orders:view">
                    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 lg:p-6">
                        {/* Header */}
                        <div className="mb-6">
                            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                                <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
                                    <ShoppingBag className="h-8 w-8 text-white" />
                                </div>
                                Order Management
                            </h1>
                            <p className="text-gray-600 mt-1">Track and manage customer orders</p>
                        </div>

                        {/* Stats Cards */}
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
                            <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-blue-50/50">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">Total Orders</p>
                                            <p className="text-3xl font-bold text-gray-900">{orderStats.totalOrders}</p>
                                        </div>
                                        <div className="p-3 bg-blue-100 rounded-xl">
                                            <ShoppingBag className="h-6 w-6 text-blue-600" />
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1 mt-2 text-sm">
                                        <TrendingUp className="h-4 w-4 text-green-500" />
                                        <span className="text-green-600 font-medium">+12%</span>
                                        <span className="text-gray-500">from last week</span>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-green-50/50">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">Revenue</p>
                                            <p className="text-3xl font-bold text-gray-900">${orderStats.totalRevenue.toFixed(2)}</p>
                                        </div>
                                        <div className="p-3 bg-green-100 rounded-xl">
                                            <DollarSign className="h-6 w-6 text-green-600" />
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1 mt-2 text-sm">
                                        <TrendingUp className="h-4 w-4 text-green-500" />
                                        <span className="text-green-600 font-medium">+8%</span>
                                        <span className="text-gray-500">from last week</span>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-yellow-50/50">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">Pending</p>
                                            <p className="text-3xl font-bold text-gray-900">{orderStats.pendingOrders}</p>
                                        </div>
                                        <div className="p-3 bg-yellow-100 rounded-xl">
                                            <Clock className="h-6 w-6 text-yellow-600" />
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1 mt-2 text-sm">
                                        <span className="text-yellow-600 font-medium">Active</span>
                                        <span className="text-gray-500">orders waiting</span>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-purple-50/50">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">Completed</p>
                                            <p className="text-3xl font-bold text-gray-900">{orderStats.completedOrders}</p>
                                        </div>
                                        <div className="p-3 bg-purple-100 rounded-xl">
                                            <CheckCircle className="h-6 w-6 text-purple-600" />
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1 mt-2 text-sm">
                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                        <span className="text-green-600 font-medium">Delivered</span>
                                        <span className="text-gray-500">today</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Orders Table */}
                        <Card className="border-0 shadow-xl bg-gradient-to-br from-white via-blue-50/20 to-indigo-50/30">
                            <CardHeader className="bg-gradient-to-r from-blue-500/5 to-indigo-500/5">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                            <ShoppingBag className="h-5 w-5 text-blue-500" />
                                            Recent Orders
                                        </CardTitle>
                                        <CardDescription className="text-gray-600 mt-1">
                                            Manage and track customer orders
                                        </CardDescription>
                                    </div>
                                    <ProtectedComponent permission="orders:create">
                                        <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                                            {data.length} orders today
                                        </Badge>
                                    </ProtectedComponent>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                <ClientDataTable<Order, unknown>
                                    title=""
                                    columns={columns}
                                    data={data}
                                    addLabel="Create Order"
                                />
                            </CardContent>
                        </Card>
                    </div>
                </ProtectedComponent>
            </SidebarInset>
        </SidebarProvider>
    )
}
