"use client"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { RoleGuard } from "@/lib/roles"
import * as React from "react"

// Enhanced Dashboard Components
import { AdvancedRestaurantTable } from "@/components/dashboard/advanced-restaurant-table"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { EnhancedRestaurantForm } from "@/components/dashboard/enhanced-restaurant-form"
import { RestaurantMetrics } from "@/components/dashboard/restaurant-metrics"
import { SalesAnalyticsChart } from "@/components/dashboard/sales-analytics-chart"
import { StatCard } from "@/components/dashboard/stat-card"
import { TodaysReportCard } from "@/components/dashboard/todays-report-card"

// Data and Types
import
{
    mockCategoryData,
    mockSalesData,
    mockStaffMetrics,
    mockTableMetrics,
    mockTodayData,
    primaryStatCards,
    secondaryStatCards
} from "@/lib/dashboard-data"

export default function DashboardPage()
{
    const [isFormOpen, setIsFormOpen] = React.useState(false)

    const restaurants = React.useMemo(() => [
        {
            id: "r1",
            name: "Sunset Diner",
            location: "NYC",
            topSoldItem: "Classic Burger",
            soldToday: 184,
            onlineSold: 92,
            posSold: 92,
            balance: 3290,
            rating: 4.8,
            performance: { trend: "up" as const, value: 12 },
            status: "active",
            stock: [
                { id: "s1", name: "Buns", qty: 5, min: 8, status: "critical" as const },
                { id: "s2", name: "Cheese", qty: 12, min: 5, status: "healthy" as const },
                { id: "s3", name: "Beef Patty", qty: 7, min: 10, status: "low" as const },
            ],
        },
        {
            id: "r2",
            name: "Ocean Breeze",
            location: "LA",
            topSoldItem: "Grilled Salmon",
            soldToday: 132,
            onlineSold: 54,
            posSold: 78,
            balance: 2180,
            rating: 4.6,
            performance: { trend: "up" as const, value: 8 },
            status: "active",
            stock: [
                { id: "s1", name: "Lemon", qty: 14, min: 10, status: "healthy" as const },
                { id: "s2", name: "Salmon", qty: 6, min: 6, status: "healthy" as const },
                { id: "s3", name: "Butter", qty: 2, min: 5, status: "critical" as const },
            ],
        },
        {
            id: "r3",
            name: "Mountain Grill",
            location: "Denver",
            topSoldItem: "Steak & Fries",
            soldToday: 96,
            onlineSold: 40,
            posSold: 56,
            balance: 1745,
            rating: 4.4,
            performance: { trend: "down" as const, value: -3 },
            status: "active",
            stock: [
                { id: "s1", name: "Potatoes", qty: 20, min: 10, status: "healthy" as const },
                { id: "s2", name: "Ribeye", qty: 3, min: 6, status: "critical" as const },
                { id: "s3", name: "Oil", qty: 9, min: 5, status: "healthy" as const },
            ],
        },
        {
            id: "r4",
            name: "City Bites",
            location: "Chicago",
            topSoldItem: "Deep Dish Slice",
            soldToday: 211,
            onlineSold: 150,
            posSold: 61,
            balance: 3890,
            rating: 4.9,
            performance: { trend: "up" as const, value: 15 },
            status: "active",
            stock: [
                { id: "s1", name: "Tomato Sauce", qty: 4, min: 6, status: "low" as const },
                { id: "s2", name: "Mozzarella", qty: 11, min: 8, status: "healthy" as const },
                { id: "s3", name: "Flour", qty: 25, min: 10, status: "healthy" as const },
            ],
        },
        {
            id: "r5",
            name: "Spice Route",
            location: "Houston",
            topSoldItem: "Chicken Tikka",
            soldToday: 157,
            onlineSold: 70,
            posSold: 87,
            balance: 2950,
            rating: 4.7,
            performance: { trend: "up" as const, value: 6 },
            status: "active",
            stock: [
                { id: "s1", name: "Chicken", qty: 16, min: 12, status: "healthy" as const },
                { id: "s2", name: "Yogurt", qty: 3, min: 6, status: "critical" as const },
                { id: "s3", name: "Masala Mix", qty: 7, min: 5, status: "healthy" as const },
            ],
        },
    ], [])

    return (
        <SidebarProvider
            style={{
                "--sidebar-width": "calc(var(--spacing) * 72)",
                "--header-height": "calc(var(--spacing) * 12)",
            } as React.CSSProperties}
        >
            <AppSidebar variant="inset" />
            <SidebarInset>
                <SiteHeader />
                <div className="flex flex-1 flex-col gap-6 p-4 lg:p-6 bg-gradient-to-br from-gray-50 via-white to-blue-50/20">
                    {/* Dashboard Header */}
                    <DashboardHeader />

                    {/* Primary Stats Grid - Enhanced with gradients */}
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                        {primaryStatCards.map((card, index) => (
                            <StatCard key={index} data={card} />
                        ))}
                    </div>

                    {/* Secondary Stats Grid */}
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                        {secondaryStatCards.map((card, index) => (
                            <StatCard key={index} data={card} />
                        ))}
                    </div>

                    {/* Charts Section - Full width layout */}
                    <div className="grid gap-6 lg:grid-cols-3">
                        {/* Sales Analytics - Takes 2 columns */}
                        <div className="lg:col-span-2">
                            <SalesAnalyticsChart data={mockSalesData} />
                        </div>

                        {/* Today's Report - Takes 1 column */}
                        <div className="lg:col-span-1">
                            <TodaysReportCard peakHoursData={mockTodayData} />
                        </div>
                    </div>

                    {/* Enhanced Restaurant Management Metrics - Full Width */}
                    <RestaurantMetrics
                        categoryData={mockCategoryData}
                        staffMetrics={mockStaffMetrics}
                        tableMetrics={mockTableMetrics}
                    />

                    {/* Advanced Restaurant Table - Super Admin Only */}
                    <RoleGuard allow={["super-admin"]}>
                        <div className="space-y-6">
                            <AdvancedRestaurantTable
                                restaurants={restaurants}
                                onAddClick={() => setIsFormOpen(true)}
                            />

                            <EnhancedRestaurantForm
                                isOpen={isFormOpen}
                                onClose={() => setIsFormOpen(false)}
                            />
                        </div>
                    </RoleGuard>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
