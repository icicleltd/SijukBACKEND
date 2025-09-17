"use client"
import { AppSidebar } from "@/components/app-sidebar"
import { NotAuthorized } from "@/components/not-authorized"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { RoleGuard } from "@/lib/roles"

export default function POSPage()
{
    return (
        <SidebarProvider style={{ "--sidebar-width": "calc(var(--spacing) * 72)", "--header-height": "calc(var(--spacing) * 12)" } as React.CSSProperties}>
            <AppSidebar variant="inset" />
            <SidebarInset>
                <SiteHeader />
                <RoleGuard allow={["owner"]} fallback={<NotAuthorized />}>
                    <div className="p-4 lg:p-6 grid gap-4 grid-cols-1 md:grid-cols-3">
                        <Card className="md:col-span-2">
                            <CardHeader>
                                <CardTitle>Catalog</CardTitle>
                            </CardHeader>
                            <CardContent className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                                {Array.from({ length: 12 }).map((_, i) => (
                                    <Button key={i} variant="outline" className="h-20">Item {i + 1}</Button>
                                ))}
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Cart</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Input placeholder="Scan or search item" />
                                    <Button>Add</Button>
                                </div>
                                <div className="rounded-md border p-4 text-sm text-muted-foreground">
                                    No items added yet.
                                </div>
                                <div className="flex items-center justify-between font-semibold">
                                    <span>Total</span>
                                    <span>$0.00</span>
                                </div>
                                <Button className="w-full">Charge</Button>
                            </CardContent>
                        </Card>
                    </div>
                </RoleGuard>
            </SidebarInset>
        </SidebarProvider>
    )
}
