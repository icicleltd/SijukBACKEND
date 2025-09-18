import { Badge } from "@/components/ui/badge"
import { getCurrentDate } from "@/lib/dashboard-data"
import { useRole } from "@/lib/roles"
import { Calendar, Crown, Shield, User, Users } from "lucide-react"

const roleIcons = {
    "super-admin": Crown,
    "admin": Shield,
    "owner": Users,
    "user": User
}

const roleColors = {
    "super-admin": "bg-purple-100 text-purple-800 border-purple-200",
    "admin": "bg-blue-100 text-blue-800 border-blue-200",
    "owner": "bg-green-100 text-green-800 border-green-200",
    "user": "bg-gray-100 text-gray-800 border-gray-200"
}

const roleLabels = {
    "super-admin": "Super Administrator",
    "admin": "Administrator",
    "owner": "Restaurant Owner",
    "user": "User"
}

export function DashboardHeader()
{
    const { role } = useRole()
    const IconComponent = roleIcons[role]

    return (
        <div className="flex items-center justify-between">
            <div>
                <div className="flex items-center gap-4 mb-2">
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
                    <Badge className={`${roleColors[role]} flex items-center gap-1 px-3 py-1`}>
                        <IconComponent className="h-4 w-4" />
                        {roleLabels[role]}
                    </Badge>
                </div>
                <p className="text-gray-600">
                    Track your sales, revenue, and performance metrics
                </p>
            </div>
            <div className="text-sm text-gray-500">
                <Calendar className="inline w-4 h-4 mr-1" />
                {getCurrentDate()}
            </div>
        </div>
    )
}