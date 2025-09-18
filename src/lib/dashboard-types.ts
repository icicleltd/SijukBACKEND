export interface SalesData
{
    date: string
    sales: number
    profit: number
    cost: number
}

export interface TodayMetric
{
    name: string
    value: number
    color: string
}

export interface CategoryData
{
    category: string
    sales: number
    color: string
}

export interface StatCardData
{
    title: string
    value: string | number
    icon: React.ComponentType<{ className?: string }>
    trend?: string
    trendDirection?: 'up' | 'down'
    variant: 'primary' | 'secondary'
    colorScheme: {
        from: string
        to: string
        text: string
        accent: string
        background?: string
        border?: string
    }
}

export interface StaffMetrics
{
    totalStaff: number
    activeToday: number
    avgOrdersPerStaff: number
    topPerformer: string
    efficiency: number
}

export interface TableMetrics
{
    totalTables: number
    occupied: number
    available: number
    avgTurnover: string
    occupancyRate: number
}

export interface Restaurant
{
    id: string
    name: string
    location: string
    topSoldItem: string
    soldToday: number
    onlineSold: number
    posSold: number
    balance: number
    rating?: number
    performance?: {
        trend: "up" | "down"
        value: number
    }
    status?: string
    stock: Array<{
        id: string
        name: string
        qty: number
        min: number
        status?: "critical" | "low" | "healthy"
    }>
}