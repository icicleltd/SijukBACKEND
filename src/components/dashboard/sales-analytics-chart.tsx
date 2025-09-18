import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/dashboard-data"
import { SalesData } from "@/lib/dashboard-types"
import { BarChart3 } from "lucide-react"
import
{
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from "recharts"

interface SalesAnalyticsChartProps
{
    data: SalesData[]
    dateRange?: string
}

export function SalesAnalyticsChart({
    data,
    dateRange = "Aug 15 - Sep 14"
}: SalesAnalyticsChartProps)
{

    // Calculate totals for the legend
    const totals = data.reduce(
        (acc, item) => ({
            sales: acc.sales + item.sales,
            profit: acc.profit + item.profit,
            cost: acc.cost + item.cost
        }),
        { sales: 0, profit: 0, cost: 0 }
    )

    return (
        <Card className="border-0 shadow-xl bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/50">
            <CardHeader className="pb-4">
                <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
                    <div className="space-y-1">
                        <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            <BarChart3 className="w-6 h-6 text-blue-600" />
                            Sales & Financial Analytics
                        </CardTitle>
                        <p className="text-sm text-gray-600">
                            Track your sales, revenue, and purchase costs over time
                        </p>
                    </div>
                    <div className="flex gap-2 text-sm">
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg font-medium">
                            {dateRange}
                        </span>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pt-0">
                {/* Enhanced Legend */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="flex items-center justify-between p-4 bg-blue-50/50 rounded-lg border border-blue-100">
                        <div className="flex items-center gap-3">
                            <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                            <span className="text-sm font-medium text-blue-900">Total Sales</span>
                        </div>
                        <div className="text-right">
                            <span className="text-lg font-bold text-blue-600">
                                {formatCurrency(totals.sales)}
                            </span>
                            <div className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                                ↑ 140%
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-green-50/50 rounded-lg border border-green-100">
                        <div className="flex items-center gap-3">
                            <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                            <span className="text-sm font-medium text-green-900">Total Profit</span>
                        </div>
                        <span className="text-lg font-bold text-green-600">
                            {formatCurrency(totals.profit)}
                        </span>
                    </div>

                    <div className="flex flex-col items-center justify-between p-4 bg-orange-50/50 rounded-lg border border-orange-100">
                        <div className="flex items-center gap-3">
                            <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                            <span className="text-sm font-medium text-orange-900">Purchase Cost</span>
                        </div>
                        <span className="text-lg font-bold text-orange-600">
                            {formatCurrency(totals.cost)}
                        </span>
                    </div>
                </div>

                {/* Full Width Chart Container */}
                <div className="w-full h-[400px] -mx-6 px-6">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                            data={data}
                            margin={{
                                top: 20,
                                right: 30,
                                left: 20,
                                bottom: 20,
                            }}
                        >
                            <defs>
                                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05} />
                                </linearGradient>
                                <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.05} />
                                </linearGradient>
                                <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.05} />
                                </linearGradient>
                            </defs>

                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.5} />

                            <XAxis
                                dataKey="date"
                                stroke="#6b7280"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                            />

                            <YAxis
                                stroke="#6b7280"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                            />

                            <Tooltip
                                content={({ active, payload, label }) =>
                                {
                                    if (active && payload && payload.length) {
                                        return (
                                            <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
                                                <p className="font-semibold text-gray-900 mb-2">{label}</p>
                                                {payload.map((entry, index) => (
                                                    <div key={index} className="flex items-center gap-2 text-sm">
                                                        <div
                                                            className="w-3 h-3 rounded-full"
                                                            style={{ backgroundColor: entry.color }}
                                                        />
                                                        <span className="text-gray-600 capitalize">{entry.dataKey}:</span>
                                                        <span className="font-medium text-gray-900">
                                                            {formatCurrency(entry.value as number)}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        )
                                    }
                                    return null
                                }}
                            />

                            <Area
                                type="monotone"
                                dataKey="sales"
                                stroke="#3b82f6"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorSales)"
                                name="Sales"
                            />
                            <Area
                                type="monotone"
                                dataKey="profit"
                                stroke="#10b981"
                                strokeWidth={2}
                                fillOpacity={1}
                                fill="url(#colorProfit)"
                                name="Profit"
                            />
                            <Area
                                type="monotone"
                                dataKey="cost"
                                stroke="#f59e0b"
                                strokeWidth={2}
                                fillOpacity={1}
                                fill="url(#colorCost)"
                                name="Cost"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}