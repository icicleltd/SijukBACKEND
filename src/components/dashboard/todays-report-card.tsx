import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getCurrentDate } from "@/lib/dashboard-data"
import { TodayMetric } from "@/lib/dashboard-types"
import { Activity, BarChart3, Calendar, DollarSign, Package, ShoppingCart } from "lucide-react"
import
    {
        Cell,
        Pie,
        PieChart,
        ResponsiveContainer,
        Tooltip
    } from "recharts"

interface TodaysReportCardProps
{
    peakHoursData: TodayMetric[]
    todaysSales?: number
    todaysProfit?: number
    todaysPurchase?: number
    todaysOrders?: number
}

export function TodaysReportCard({
    peakHoursData,
    todaysSales = 0,
    todaysProfit = 0,
    todaysPurchase = 0,
    todaysOrders = 0
}: TodaysReportCardProps)
{

    const todayMetrics = [
        {
            label: "Today's Sales",
            value: `₨ ${todaysSales.toLocaleString()}`,
            icon: BarChart3,
            bgColor: "bg-blue-50",
            iconBg: "bg-blue-500",
            textColor: "text-blue-600"
        },
        {
            label: "Today's Profit",
            value: `₨ ${todaysProfit.toLocaleString()}`,
            icon: DollarSign,
            bgColor: "bg-green-50",
            iconBg: "bg-green-500",
            textColor: "text-green-600"
        },
        {
            label: "Today's Purchase",
            value: `₨ ${todaysPurchase.toLocaleString()}`,
            icon: ShoppingCart,
            bgColor: "bg-purple-50",
            iconBg: "bg-purple-500",
            textColor: "text-purple-600"
        },
        {
            label: "Today's Orders",
            value: todaysOrders.toString(),
            icon: Package,
            bgColor: "bg-orange-50",
            iconBg: "bg-orange-500",
            textColor: "text-orange-600"
        }
    ]

    return (
        <Card className="md:col-span-4">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-blue-600" />
                    Today&apos;s Report
                </CardTitle>
                <p className="text-sm text-gray-600">Overview of today&apos;s business performance</p>
                <div className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full w-fit">
                    <Calendar className="w-4 h-4" />
                    {getCurrentDate()}
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Today's Metrics */}
                {todayMetrics.map((metric, index) => (
                    <div key={index} className={`flex items-center justify-between p-3 ${metric.bgColor} rounded-lg`}>
                        <div className="flex items-center gap-3">
                            <div className={`p-2 ${metric.iconBg} rounded-lg`}>
                                <metric.icon className="w-4 h-4 text-white" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-600">{metric.label}</p>
                                <p className={`text-lg font-bold ${metric.textColor}`}>{metric.value}</p>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Peak Hours Chart */}
                <div className="mt-6">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Peak Hours Distribution</h4>
                    <div className="h-32">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={peakHoursData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={25}
                                    outerRadius={50}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {peakHoursData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value) => [`${value}%`, 'Orders']} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex justify-center gap-4 mt-2">
                        {peakHoursData.map((item, index) => (
                            <div key={index} className="flex items-center gap-1 text-xs">
                                <div
                                    className="w-2 h-2 rounded-full"
                                    style={{ backgroundColor: item.color }}
                                ></div>
                                <span>{item.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}