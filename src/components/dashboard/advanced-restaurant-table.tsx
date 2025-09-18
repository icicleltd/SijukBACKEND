import { ClientDataTable } from "@/components/data-table/client-data-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Restaurant } from "@/lib/dashboard-types"
import { ColumnDef } from "@tanstack/react-table"
import
{
    AlertTriangle,
    CheckCircle,
    Edit,
    Eye,
    MapPin,
    MoreHorizontal,
    Star,
    Trash2,
    TrendingDown,
    TrendingUp,
    XCircle
} from "lucide-react"
import Link from "next/link"
import * as React from "react"

// Enhanced Stock Health Component
function StockHealthIndicator({ stock }: { stock: Restaurant['stock'] })
{
    const lowStock = stock.filter((s) => s.qty <= s.min)
    const criticalStock = stock.filter((s) => s.qty < s.min * 0.5)

    if (criticalStock.length > 0) {
        return (
            <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                    <XCircle className="w-4 h-4 text-red-500" />
                    <Badge variant="destructive" className="text-xs">
                        Critical
                    </Badge>
                </div>
                <div className="flex flex-wrap gap-1">
                    {criticalStock.slice(0, 2).map((s) => (
                        <Badge key={s.id} variant="destructive" className="text-xs">
                            {s.name} {s.qty}/{s.min}
                        </Badge>
                    ))}
                    {criticalStock.length > 2 && (
                        <Badge variant="destructive" className="text-xs">
                            +{criticalStock.length - 2} more
                        </Badge>
                    )}
                </div>
            </div>
        )
    }

    if (lowStock.length > 0) {
        return (
            <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                    <AlertTriangle className="w-4 h-4 text-yellow-500" />
                    <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-800">
                        Low Stock
                    </Badge>
                </div>
                <div className="flex flex-wrap gap-1">
                    {lowStock.slice(0, 2).map((s) => (
                        <Badge key={s.id} variant="secondary" className="text-xs bg-yellow-100 text-yellow-800">
                            {s.name} {s.qty}/{s.min}
                        </Badge>
                    ))}
                    {lowStock.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                            +{lowStock.length - 2} more
                        </Badge>
                    )}
                </div>
            </div>
        )
    }

    return (
        <div className="flex items-center gap-1">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                Healthy
            </Badge>
        </div>
    )
}

// Enhanced Restaurant Name Cell
function RestaurantNameCell({ restaurant }: { restaurant: Restaurant })
{
    return (
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                {restaurant.name.charAt(0)}
            </div>
            <div>
                <Link
                    href={`/restaurants/${restaurant.id}`}
                    className="font-semibold hover:underline text-gray-900 hover:text-blue-600 transition-colors"
                >
                    {restaurant.name}
                </Link>
                <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                    <MapPin className="w-3 h-3" />
                    {restaurant.location}
                </div>
            </div>
        </div>
    )
}

// Performance Indicator
function PerformanceIndicator({ soldToday }: { soldToday: number })
{
    const isHigh = soldToday > 150
    const isMedium = soldToday > 100

    return (
        <div className="flex items-center gap-2">
            <span className="font-semibold">{soldToday}</span>
            {isHigh ? (
                <div className="flex items-center gap-1 text-green-600">
                    <TrendingUp className="w-4 h-4" />
                    <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                        High
                    </Badge>
                </div>
            ) : isMedium ? (
                <div className="flex items-center gap-1 text-yellow-600">
                    <TrendingUp className="w-4 h-4" />
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 text-xs">
                        Medium
                    </Badge>
                </div>
            ) : (
                <div className="flex items-center gap-1 text-red-600">
                    <TrendingDown className="w-4 h-4" />
                    <Badge variant="secondary" className="bg-red-100 text-red-800 text-xs">
                        Low
                    </Badge>
                </div>
            )}
        </div>
    )
}

// Enhanced Columns Definition
export function createAdvancedRestaurantColumns(): ColumnDef<Restaurant, unknown>[]
{
    return [
        {
            accessorKey: "name",
            header: "Restaurant",
            cell: ({ row }) => <RestaurantNameCell restaurant={row.original} />,
            minSize: 250,
        },
        {
            accessorKey: "topSoldItem",
            header: "Top Selling Item",
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="font-medium">{row.original.topSoldItem}</span>
                </div>
            ),
        },
        {
            accessorKey: "soldToday",
            header: "Daily Performance",
            cell: ({ row }) => <PerformanceIndicator soldToday={row.original.soldToday} />,
        },
        {
            accessorKey: "onlineSold",
            header: "Online Orders",
            cell: ({ row }) => (
                <div className="text-center">
                    <div className="font-semibold text-blue-600">{row.original.onlineSold}</div>
                    <div className="text-xs text-gray-500">orders</div>
                </div>
            ),
        },
        {
            accessorKey: "posSold",
            header: "POS Orders",
            cell: ({ row }) => (
                <div className="text-center">
                    <div className="font-semibold text-green-600">{row.original.posSold}</div>
                    <div className="text-xs text-gray-500">orders</div>
                </div>
            ),
        },
        {
            id: "balance",
            header: "Revenue",
            cell: ({ row }) => (
                <div className="text-right">
                    <div className="font-bold text-lg text-green-600">
                        ${row.original.balance.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">total balance</div>
                </div>
            ),
        },
        {
            id: "stockHealth",
            header: "Stock Status",
            cell: ({ row }) => <StockHealthIndicator stock={row.original.stock} />,
            enableSorting: false,
            minSize: 200,
        },
        {
            id: "actions",
            header: "Actions",
            cell: () => (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Restaurant
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Restaurant
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
            enableSorting: false,
        },
    ]
}

// Enhanced Restaurant Data Table Component
interface AdvancedRestaurantTableProps
{
    restaurants: Restaurant[]
    onAddClick: () => void
}

export function AdvancedRestaurantTable({ restaurants, onAddClick }: AdvancedRestaurantTableProps)
{
    // Calculate stats
    const totalRevenue = restaurants.reduce((sum, r) => sum + r.balance, 0)
    const totalSalesToday = restaurants.reduce((sum, r) => sum + r.soldToday, 0)
    const avgPerformance = totalSalesToday / restaurants.length

    // Create enhanced columns
    const columns = React.useMemo(() => createAdvancedRestaurantColumns(), [])

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <TrendingUp className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Total Restaurants</p>
                                <p className="text-2xl font-bold text-blue-600">{restaurants.length}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <TrendingUp className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Total Revenue</p>
                                <p className="text-2xl font-bold text-green-600">${totalRevenue.toLocaleString()}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <TrendingUp className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Sales Today</p>
                                <p className="text-2xl font-bold text-purple-600">{totalSalesToday}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-orange-100 rounded-lg">
                                <TrendingUp className="w-5 h-5 text-orange-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Avg Performance</p>
                                <p className="text-2xl font-bold text-orange-600">{avgPerformance.toFixed(1)}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Enhanced DataTable */}
            <Card className="border-0 shadow-xl bg-gradient-to-br from-white via-gray-50/30 to-blue-50/20">
                <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-2xl font-bold text-gray-900">Restaurant Management</CardTitle>
                            <CardDescription className="text-gray-600 mt-1">
                                Manage and monitor all registered restaurants with real-time performance data
                            </CardDescription>
                        </div>
                        <Button
                            onClick={onAddClick}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
                        >
                            Add New Restaurant
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="px-0">
                    <div className="px-6">
                        <ClientDataTable
                            columns={columns}
                            data={restaurants}
                            searchPlaceholder="Search restaurants, locations, or items..."
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}