"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CategoryData, StaffMetrics, TableMetrics } from "@/lib/dashboard-types"
import { ChefHat, Star, TrendingDown, TrendingUp, Users, Utensils } from "lucide-react"
import
{
    Cell,
    Legend,
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
            {/* Enhanced Popular Menu Categories - Full Width */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50">
                <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                <ChefHat className="h-5 w-5 text-orange-500" />
                                Popular Menu Categories
                            </CardTitle>
                            <CardDescription className="text-gray-600 mt-1">
                                Sales distribution and performance trends
                            </CardDescription>
                        </div>
                        <Badge variant="secondary" className="bg-orange-100 text-orange-700 border-orange-200">
                            {TOTAL_SALES} Total Sales
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="pt-0">
                    <div className="grid gap-6 lg:grid-cols-2">
                        {/* Pie Chart */}
                        <div className="space-y-4">
                            <h4 className="font-semibold text-gray-900 text-sm">Sales Distribution</h4>
                            <div className="h-[280px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={enhancedCategoryData}
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={100}
                                            innerRadius={40}
                                            paddingAngle={2}
                                            dataKey="sales"
                                        >
                                            {enhancedCategoryData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            formatter={(value, name) => [`${value} sales`, name]}
                                            labelFormatter={(label) => `Category: ${label}`}
                                        />
                                        <Legend
                                            verticalAlign="bottom"
                                            height={36}
                                            formatter={(value, entry) => (
                                                <span style={{ color: entry.color, fontSize: '12px' }}>
                                                    {value}
                                                </span>
                                            )}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Detailed Breakdown */}
                        <div className="space-y-4">
                            <h4 className="font-semibold text-gray-900 text-sm">Performance Details</h4>
                            <div className="space-y-3">
                                {enhancedCategoryData.map((category) => (
                                    <div key={category.name} className="p-4 rounded-lg border border-gray-100 bg-white/50">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className="w-3 h-3 rounded-full"
                                                    style={{ backgroundColor: category.color }}
                                                />
                                                <span className="font-medium text-gray-900 text-sm">
                                                    {category.name}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {category.trend > 0 ? (
                                                    <TrendingUp className="h-3 w-3 text-green-500" />
                                                ) : (
                                                    <TrendingDown className="h-3 w-3 text-red-500" />
                                                )}
                                                <span className={`text-xs font-medium ${category.trend > 0 ? 'text-green-600' : 'text-red-600'
                                                    }`}>
                                                    {category.trend > 0 ? '+' : ''}{category.trend}%
                                                </span>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-xs text-gray-600">
                                                <span>{category.sales} sales</span>
                                                <span>{category.percentage}% of total</span>
                                            </div>
                                            <Progress
                                                value={category.percentage}
                                                className="h-2"
                                            />
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