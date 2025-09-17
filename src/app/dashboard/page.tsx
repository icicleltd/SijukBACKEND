import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { RoleGuard } from "@/lib/roles"

export default function DashboardPage()
{
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
                <div className="p-4 lg:p-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Total Sales</CardTitle>
                        </CardHeader>
                        <CardContent className="text-3xl font-semibold">$42,340</CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Orders</CardTitle>
                        </CardHeader>
                        <CardContent className="text-3xl font-semibold">1,284</CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Customers</CardTitle>
                        </CardHeader>
                        <CardContent className="text-3xl font-semibold">892</CardContent>
                    </Card>
                    <RoleGuard allow={["super-admin", "admin"]}>
                        <Card>
                            <CardHeader>
                                <CardTitle>Active Restaurants</CardTitle>
                            </CardHeader>
                            <CardContent className="text-3xl font-semibold">36</CardContent>
                        </Card>
                    </RoleGuard>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
