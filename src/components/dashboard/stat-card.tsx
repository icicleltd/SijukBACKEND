import { Card, CardContent } from "@/components/ui/card"
import { StatCardData } from "@/lib/dashboard-types"
import { ArrowUpRight } from "lucide-react"

interface StatCardProps
{
    data: StatCardData
}

export function StatCard({ data }: StatCardProps)
{
    const { title, value, icon: Icon, trend, variant, colorScheme } = data

    if (variant === "primary") {
        return (
            <Card className={`relative overflow-hidden border-0 shadow-lg bg-gradient-to-br ${colorScheme.from} ${colorScheme.to}`}>
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className={`${colorScheme.text} text-sm font-medium`}>{title}</p>
                            <p className="text-3xl font-bold text-white">{value}</p>
                            {trend && (
                                <div className={`flex items-center gap-1 ${colorScheme.text} text-sm mt-2`}>
                                    <ArrowUpRight className="w-4 h-4" />
                                    <span>{trend}</span>
                                </div>
                            )}
                        </div>
                        <div className={`p-3 ${colorScheme.accent} rounded-full`}>
                            <Icon className="w-8 h-8 text-white" />
                        </div>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className={`border ${colorScheme.border} ${colorScheme.background}`}>
            <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className={`${colorScheme.text} text-sm font-medium`}>{title}</p>
                        <p className={`text-2xl font-bold ${colorScheme.text.replace('600', '900')}`}>{value}</p>
                        {trend && (
                            <div className={`flex items-center gap-1 ${colorScheme.text} text-sm mt-1`}>
                                <ArrowUpRight className="w-4 h-4" />
                                <span>{trend}</span>
                            </div>
                        )}
                    </div>
                    <div className={`p-2 ${colorScheme.accent} rounded-lg`}>
                        <Icon className={`w-6 h-6 ${colorScheme.text}`} />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}