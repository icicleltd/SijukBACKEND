import { AppSidebar } from "@/components/app-sidebar"
import { NotAuthorized } from "@/components/not-authorized"
import { RestaurantTable, schema } from "@/components/restaurent-data-table"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { RoleGuard } from "@/lib/roles"
import data from "../data.json"

export default function RestaurantsPage()
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
                <RoleGuard allow={["super-admin", "admin"]} fallback={<NotAuthorized />}>
                    <div className="flex flex-col gap-6 py-4 md:py-6">
                        <RestaurantTable data={data as unknown as import("zod").z.infer<typeof schema>[]} />
                    </div>
                </RoleGuard>
            </SidebarInset>
        </SidebarProvider>
    )
}
