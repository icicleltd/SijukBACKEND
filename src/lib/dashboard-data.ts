import
    {
        BarChart3,
        Clock,
        DollarSign,
        Package,
        ShoppingCart,
        Store,
        TrendingUp
    } from 'lucide-react'
import { CategoryData, SalesData, StaffMetrics, StatCardData, TableMetrics, TodayMetric } from './dashboard-types'

// Sample data for development/testing
export const mockSalesData: SalesData[] = [
    { date: "Aug 15", sales: 22240, profit: 8840, cost: 13400 },
    { date: "Aug 16", sales: 28920, profit: 11570, cost: 17350 },
    { date: "Aug 17", sales: 32240, profit: 12900, cost: 19340 },
    { date: "Aug 28", sales: 18640, profit: 7460, cost: 11180 },
    { date: "Aug 31", sales: 34200, profit: 13680, cost: 20520 },
    { date: "Sep 02", sales: 29840, profit: 11940, cost: 17900 },
    { date: "Sep 04", sales: 31260, profit: 12500, cost: 18760 },
    { date: "Sep 07", sales: 35400, profit: 14160, cost: 21240 },
    { date: "Sep 08", sales: 28640, profit: 11460, cost: 17180 }
]

export const mockTodayData: TodayMetric[] = [
    { name: "Morning", value: 25, color: "#3b82f6" },
    { name: "Afternoon", value: 35, color: "#10b981" },
    { name: "Evening", value: 40, color: "#f59e0b" }
]

export const mockCategoryData: CategoryData[] = [
    { category: "Main Dishes", sales: 45, color: "#ef4444" },
    { category: "Beverages", sales: 25, color: "#3b82f6" },
    { category: "Desserts", sales: 20, color: "#10b981" },
    { category: "Appetizers", sales: 10, color: "#f59e0b" }
]

export const mockStaffMetrics: StaffMetrics = {
    totalStaff: 247,
    activeToday: 189,
    avgOrdersPerStaff: 12.4,
    topPerformer: "John Doe",
    efficiency: 76
}

export const mockTableMetrics: TableMetrics = {
    totalTables: 156,
    occupied: 89,
    available: 67,
    avgTurnover: "2.3h",
    occupancyRate: 57
}

// Primary stat cards configuration
export const primaryStatCards: StatCardData[] = [
    {
        title: "Total Sales",
        value: "412,653",
        icon: DollarSign,
        trend: "Live Data",
        variant: "primary",
        colorScheme: {
            from: "from-blue-500",
            to: "to-blue-600",
            text: "text-blue-100",
            accent: "bg-blue-400/30"
        }
    },
    {
        title: "Total Profit",
        value: "27,639",
        icon: TrendingUp,
        trend: "Live Data",
        variant: "primary",
        colorScheme: {
            from: "from-green-500",
            to: "to-green-600",
            text: "text-green-100",
            accent: "bg-green-400/30"
        }
    },
    {
        title: "Total Purchase",
        value: "2,397,630",
        icon: ShoppingCart,
        trend: "Live Data",
        variant: "primary",
        colorScheme: {
            from: "from-purple-500",
            to: "to-purple-600",
            text: "text-purple-100",
            accent: "bg-purple-400/30"
        }
    },
    {
        title: "Total Orders",
        value: "118",
        icon: Package,
        trend: "Live Data",
        variant: "primary",
        colorScheme: {
            from: "from-orange-500",
            to: "to-orange-600",
            text: "text-orange-100",
            accent: "bg-orange-400/30"
        }
    }
]

// Secondary stat cards configuration
export const secondaryStatCards: StatCardData[] = [
    {
        title: "Total Stores",
        value: "39",
        icon: Store,
        trend: "Live Data",
        variant: "secondary",
        colorScheme: {
            from: "",
            to: "",
            text: "text-teal-600",
            accent: "bg-teal-100",
            background: "bg-teal-50",
            border: "border-teal-200"
        }
    },
    {
        title: "Pending Orders",
        value: "2",
        icon: Clock,
        trend: "Live Data",
        variant: "secondary",
        colorScheme: {
            from: "",
            to: "",
            text: "text-yellow-600",
            accent: "bg-yellow-100",
            background: "bg-yellow-50",
            border: "border-yellow-200"
        }
    },
    {
        title: "Total Inventory Items",
        value: "7,355",
        icon: Package,
        trend: "Live Data",
        variant: "secondary",
        colorScheme: {
            from: "",
            to: "",
            text: "text-cyan-600",
            accent: "bg-cyan-100",
            background: "bg-cyan-50",
            border: "border-cyan-200"
        }
    },
    {
        title: "Total Inventory Value",
        value: "2,014,927",
        icon: BarChart3,
        trend: "Live Data",
        variant: "secondary",
        colorScheme: {
            from: "",
            to: "",
            text: "text-pink-600",
            accent: "bg-pink-100",
            background: "bg-pink-50",
            border: "border-pink-200"
        }
    }
]

// Utility functions
export const formatCurrency = (value: number): string =>
{
    return `₨ ${value.toLocaleString()}`
}

export const formatNumber = (value: number): string =>
{
    return value.toLocaleString()
}

export const getCurrentDate = (): string =>
{
    return new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })
}