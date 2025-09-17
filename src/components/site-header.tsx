"use client"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useRole, type UserRole } from "@/lib/roles"
import Link from "next/link"

export function SiteHeader()
{
  const { role, setRole } = useRole()
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">Dashboard</h1>
        <div className="ml-auto flex items-center gap-2">
          <Select value={role} onValueChange={(v) => setRole(v as UserRole)}>
            <SelectTrigger className="w-40" size="sm">
              <SelectValue placeholder="Select Role" />
            </SelectTrigger>
            <SelectContent align="end">
              <SelectItem value="super-admin">Super Admin</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="owner">Restaurant Owner</SelectItem>
              <SelectItem value="user">User</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="ghost" asChild size="sm" className="hidden sm:flex">
            <Link
              href="/"
              rel="noopener noreferrer"
              target="_blank"
              className="dark:text-foreground"
            >
              Website
            </Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
