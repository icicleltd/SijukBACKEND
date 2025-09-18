import { getCurrentDate } from "@/lib/dashboard-data"
import { Calendar } from "lucide-react"

export function DashboardHeader()
{
    return (
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
                <p className="text-gray-600 mt-1">
                    Track your sales, revenue, and purchase costs over time
                </p>
            </div>
            <div className="text-sm text-gray-500">
                <Calendar className="inline w-4 h-4 mr-1" />
                {getCurrentDate()}
            </div>
        </div>
    )
}