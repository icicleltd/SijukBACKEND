"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CategoryData, StaffMetrics, TableMetrics } from "@/lib/dashboard-types"
import { ChefHat, Star, TrendingDown, TrendingUp, Users, Utensils } from "lucide-react"
import
{
    Cell,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip
} from "recharts"

interface RestaurantMetricsProps
{
    categoryData: CategoryData[]
    staffMetrics: StaffMetrics
    tableMetrics: TableMetrics
}

// Enhanced menu categories data with trends and colors
const enhancedCategoryData = [
    { name: "Main Courses", sales: 450, percentage: 35, color: "#3b82f6", trend: 12 },
    { name: "Appetizers", sales: 320, percentage: 25, color: "#10b981", trend: 8 },
    { name: "Beverages", sales: 260, percentage: 20, color: "#f59e0b", trend: -3 },
    { name: "Desserts", sales: 180, percentage: 14, color: "#ef4444", trend: 15 },
    { name: "Specials", sales: 80, percentage: 6, color: "#8b5cf6", trend: 22 }
]

const TOTAL_SALES = enhancedCategoryData.reduce((sum, item) => sum + item.sales, 0)

export function RestaurantMetrics({
    staffMetrics,
    tableMetrics
}: RestaurantMetricsProps)
{
    return (
        <div className="space-y-6">
            {/* Enhanced Popular Menu Categories - Professional Design */}
            <Card className="border-0 shadow-xl bg-gradient-to-br from-white via-orange-50/20 to-amber-50/30 overflow-hidden">
                <CardHeader className="py-6 bg-gradient-to-r from-orange-500/5 to-amber-500/5">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="space-y-2">
                            <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                                <div className="p-2 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl">
                                    <ChefHat className="h-6 w-6 text-white" />
                                </div>
                                Popular Menu Categories
                            </CardTitle>
                            <CardDescription className="text-gray-600 text-base">
                                Sales performance and trends across different menu categories
                            </CardDescription>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="text-center px-4 py-2 bg-white/70 rounded-xl border border-orange-200/50 backdrop-blur-sm">
                                <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">Total Sales</p>
                                <p className="text-2xl font-bold text-orange-600">{TOTAL_SALES.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="p-6">
                    <div className="grid gap-8 xl:grid-cols-5">
                        {/* Interactive Pie Chart with Enhanced Design */}
                        <div className="xl:col-span-2 space-y-6">
                            <div className="text-center">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Sales Distribution</h3>
                                <p className="text-sm text-gray-600">Interactive breakdown by category</p>
                            </div>

                            <div className="relative h-[300px] bg-gradient-to-br from-white to-gray-50/50 rounded-2xl p-4 border border-gray-100/50">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <defs>
                                            <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                                                <feDropShadow dx="2" dy="4" stdDeviation="3" floodOpacity="0.1" />
                                            </filter>
                                        </defs>
                                        <Pie
                                            data={enhancedCategoryData}
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={110}
                                            innerRadius={55}
                                            paddingAngle={3}
                                            dataKey="sales"
                                            stroke="rgba(255,255,255,0.8)"
                                            strokeWidth={2}
                                            filter="url(#shadow)"
                                        >
                                            {enhancedCategoryData.map((entry, index) => (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={entry.color}
                                                    className="hover:opacity-80 transition-opacity duration-200"
                                                />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            position={{ x: 0, y: 0 }}
                                            wrapperStyle={{
                                                position: 'relative',
                                                zIndex: 1000,
                                                pointerEvents: 'none'
                                            }}
                                            content={({ active, payload }) =>
                                            {
                                                if (active && payload && payload.length) {
                                                    const data = payload[0].payload;
                                                    return (
                                                        <div className="bg-white/95 backdrop-blur-sm p-3 rounded-lg shadow-xl border border-gray-200/50 max-w-[200px]">
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <div
                                                                    className="w-3 h-3 rounded-full"
                                                                    style={{ backgroundColor: data.color }}
                                                                />
                                                                <p className="font-semibold text-gray-900 text-sm">{data.name}</p>
                                                            </div>
                                                            <div className="space-y-1 text-xs">
                                                                <p className="text-gray-600">Sales: <span className="font-medium text-gray-900">{data.sales}</span></p>
                                                                <p className="text-gray-600">Share: <span className="font-medium text-gray-900">{data.percentage}%</span></p>
                                                                <p className="text-gray-600">Trend: <span className={`font-medium ${data.trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                                    {data.trend > 0 ? '+' : ''}{data.trend}%
                                                                </span></p>
                                                            </div>
                                                        </div>
                                                    );
                                                }
                                                return null;
                                            }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>

                                {/* Center Content */}
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <div className="text-center bg-white/80 backdrop-blur-sm rounded-full p-4 border border-gray-200/50">
                                        <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">Total</p>
                                        <p className="text-lg font-bold text-gray-900">{TOTAL_SALES}</p>
                                        <p className="text-xs text-gray-500">orders</p>
                                    </div>
                                </div>
                            </div>

                            {/* Summary Insights */}
                            <div className="pt-6 border-t border-gray-200/50">
                                <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
                                    <div className="text-center p-4 bg-blue-50/50 rounded-xl border border-blue-200/30">
                                        <div className="w-8 h-8 bg-blue-500 rounded-lg mx-auto mb-2 flex items-center justify-center">
                                            <TrendingUp className="h-4 w-4 text-white" />
                                        </div>
                                        <p className="text-sm font-medium text-blue-900">Best Performer</p>
                                        <p className="text-xs text-blue-600">{enhancedCategoryData[0].name}</p>
                                    </div>

                                    <div className="text-center p-4 bg-green-50/50 rounded-xl border border-green-200/30">
                                        <div className="w-8 h-8 bg-green-500 rounded-lg mx-auto mb-2 flex items-center justify-center">
                                            <Star className="h-4 w-4 text-white" />
                                        </div>
                                        <p className="text-sm font-medium text-green-900">Growth Leader</p>
                                        <p className="text-xs text-green-600">
                                            {enhancedCategoryData.reduce((prev, current) => prev.trend > current.trend ? prev : current).name}
                                        </p>
                                    </div>

                                    <div className="text-center p-4 bg-purple-50/50 rounded-xl border border-purple-200/30">
                                        <div className="w-8 h-8 bg-purple-500 rounded-lg mx-auto mb-2 flex items-center justify-center">
                                            <ChefHat className="h-4 w-4 text-white" />
                                        </div>
                                        <p className="text-sm font-medium text-purple-900">Categories</p>
                                        <p className="text-xs text-purple-600">{enhancedCategoryData.length} Active</p>
                                    </div>

                                    <div className="text-center p-4 bg-orange-50/50 rounded-xl border border-orange-200/30">
                                        <div className="w-8 h-8 bg-orange-500 rounded-lg mx-auto mb-2 flex items-center justify-center">
                                            <TrendingUp className="h-4 w-4 text-white" />
                                        </div>
                                        <p className="text-sm font-medium text-orange-900">Avg Growth</p>
                                        <p className="text-xs text-orange-600">
                                            +{(enhancedCategoryData.reduce((sum, cat) => sum + cat.trend, 0) / enhancedCategoryData.length).toFixed(1)}%
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Enhanced Category Performance Cards */}
                        <div className="xl:col-span-3 space-y-4">
                            <div className="text-center xl:text-left">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Category Performance</h3>
                                <p className="text-sm text-gray-600">Detailed breakdown with trends and insights</p>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-2">
                                {enhancedCategoryData.map((category, index) => (
                                    <div
                                        key={category.name}
                                        className="group relative bg-white/70 backdrop-blur-sm rounded-2xl p-5 border border-gray-200/50 hover:border-gray-300/50 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
                                    >
                                        {/* Background Pattern */}
                                        <div
                                            className="absolute inset-0 rounded-2xl opacity-5"
                                            style={{
                                                background: `linear-gradient(135deg, ${category.color}20 0%, ${category.color}05 100%)`
                                            }}
                                        />

                                        <div className="relative space-y-4">
                                            {/* Header */}
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="relative">
                                                        <div
                                                            className="w-4 h-4 rounded-full ring-2 ring-white shadow-sm"
                                                            style={{ backgroundColor: category.color }}
                                                        />
                                                        <div
                                                            className="absolute inset-0 w-4 h-4 rounded-full animate-pulse opacity-30"
                                                            style={{ backgroundColor: category.color }}
                                                        />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-semibold text-gray-900">{category.name}</h4>
                                                        <p className="text-xs text-gray-500">Rank #{index + 1}</p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${category.trend > 0
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'bg-red-100 text-red-700'
                                                        }`}>
                                                        {category.trend > 0 ? (
                                                            <TrendingUp className="h-3 w-3" />
                                                        ) : (
                                                            <TrendingDown className="h-3 w-3" />
                                                        )}
                                                        {category.trend > 0 ? '+' : ''}{category.trend}%
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Metrics */}
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="text-center">
                                                    <p className="text-2xl font-bold" style={{ color: category.color }}>
                                                        {category.sales}
                                                    </p>
                                                    <p className="text-xs text-gray-600">Sales</p>
                                                </div>
                                                <div className="text-center">
                                                    <p className="text-2xl font-bold text-gray-900">
                                                        {category.percentage}%
                                                    </p>
                                                    <p className="text-xs text-gray-600">Share</p>
                                                </div>
                                            </div>

                                            {/* Progress Bar */}
                                            <div className="space-y-2">
                                                <div className="flex justify-between text-xs text-gray-600">
                                                    <span>Market Share</span>
                                                    <span>{category.percentage}% of total</span>
                                                </div>
                                                <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                                                    <div
                                                        className="absolute left-0 top-0 h-full rounded-full transition-all duration-1000 ease-out"
                                                        style={{
                                                            width: `${category.percentage}%`,
                                                            background: `linear-gradient(90deg, ${category.color} 0%, ${category.color}80 100%)`
                                                        }}
                                                    />
                                                    <div
                                                        className="absolute left-0 top-0 h-full rounded-full opacity-30 animate-pulse"
                                                        style={{
                                                            width: `${category.percentage}%`,
                                                            backgroundColor: category.color
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>


                </CardContent>
            </Card>

            {/* Staff and Table Metrics Row */}
            <div className="grid gap-6 md:grid-cols-2">
                {/* Enhanced Staff Metrics */}
                <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-white">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-lg font-bold text-blue-900 flex items-center gap-2">
                            <Users className="h-5 w-5 text-blue-600" />
                            Staff Performance
                        </CardTitle>
                        <CardDescription className="text-blue-700">
                            Current staff status and efficiency
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-4">
                            <div className="flex items-center justify-between p-3 rounded-lg bg-white/70 border border-blue-100">
                                <div>
                                    <p className="text-sm font-medium text-blue-900">Active Staff</p>
                                    <p className="text-2xl font-bold text-blue-600">{staffMetrics.activeToday}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-blue-600">of {staffMetrics.totalStaff} total</p>
                                    <Progress
                                        value={(staffMetrics.activeToday / staffMetrics.totalStaff) * 100}
                                        className="h-2 w-20 mt-1"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-3 rounded-lg bg-white/70 border border-blue-100">
                                <div>
                                    <p className="text-sm font-medium text-blue-900">Efficiency</p>
                                    <div className="flex items-center gap-1">
                                        <p className="text-xl font-bold text-blue-600">{staffMetrics.efficiency}%</p>
                                    </div>
                                </div>
                                <Badge variant="secondary" className="bg-green-100 text-green-700">
                                    {staffMetrics.efficiency >= 90 ? 'Excellent' : staffMetrics.efficiency >= 70 ? 'Good' : 'Needs Improvement'}
                                </Badge>
                            </div>

                            <div className="p-3 rounded-lg bg-white/70 border border-blue-100">
                                <div className="flex items-center justify-between mb-2">
                                    <p className="text-sm font-medium text-blue-900">Top Performer</p>
                                    <Star className="h-4 w-4 text-yellow-500" />
                                </div>
                                <p className="text-lg font-bold text-blue-600">{staffMetrics.topPerformer}</p>
                                <p className="text-xs text-blue-600">{staffMetrics.avgOrdersPerStaff} avg orders/staff</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Enhanced Table Metrics */}
                <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-white">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-lg font-bold text-green-900 flex items-center gap-2">
                            <Utensils className="h-5 w-5 text-green-600" />
                            Table Management
                        </CardTitle>
                        <CardDescription className="text-green-700">
                            Seating capacity and availability
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-4">
                            <div className="flex items-center justify-between p-3 rounded-lg bg-white/70 border border-green-100">
                                <div>
                                    <p className="text-sm font-medium text-green-900">Occupied Tables</p>
                                    <p className="text-2xl font-bold text-green-600">{tableMetrics.occupied}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-green-600">of {tableMetrics.totalTables} total</p>
                                    <Progress
                                        value={(tableMetrics.occupied / tableMetrics.totalTables) * 100}
                                        className="h-2 w-20 mt-1"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-3 rounded-lg bg-white/70 border border-green-100">
                                <div>
                                    <p className="text-sm font-medium text-green-900">Occupancy Rate</p>
                                    <p className="text-xl font-bold text-green-600">{tableMetrics.occupancyRate}%</p>
                                </div>
                                <Badge variant="secondary" className={`${tableMetrics.occupancyRate >= 80 ? 'bg-red-100 text-red-700' :
                                    tableMetrics.occupancyRate >= 60 ? 'bg-yellow-100 text-yellow-700' :
                                        'bg-green-100 text-green-700'
                                    }`}>
                                    {tableMetrics.occupancyRate >= 80 ? 'High' :
                                        tableMetrics.occupancyRate >= 60 ? 'Moderate' : 'Low'}
                                </Badge>
                            </div>

                            <div className="p-3 rounded-lg bg-white/70 border border-green-100">
                                <p className="text-sm font-medium text-green-900 mb-2">Average Turnover</p>
                                <p className="text-lg font-bold text-green-600">{tableMetrics.avgTurnover}</p>
                                <p className="text-xs text-green-600">{tableMetrics.available} tables available</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}