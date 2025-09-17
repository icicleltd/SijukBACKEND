"use client"

import * as React from "react"
import
  {
    IconCamera,
    IconChartBar,
    IconDashboard,
    IconDatabase,
    IconFileAi,
    IconFileDescription,
    IconFileWord,
    IconFolder,
    IconHelp,
    IconInnerShadowTop,
    IconListDetails,
    IconReport,
    IconSearch,
    IconSettings,
    IconUsers,
  } from "@tabler/icons-react"

import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import
  {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
  } from "@/components/ui/sidebar"

const data = {
  user: {
    name: "ChefAdmin",
    email: "admin@restaurant.com",
    avatar: "/avatars/chefadmin.jpg"
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard
    },
    {
      title: "Orders",
      url: "/orders",
      icon: IconListDetails
    },
    {
      title: "Menu Analytics",
      url: "/menu-analytics",
      icon: IconChartBar
    },
    {
      title: "Inventory",
      url: "/inventory",
      icon: IconFolder
    },
    {
      title: "Staff",
      url: "/staff",
      icon: IconUsers
    }
  ],
  navClouds: [
    {
      title: "Inventory Tracking",
      icon: IconCamera,
      isActive: true,
      url: "/inventory-tracking",
      items: [
        {
          title: "Active Stock",
          url: "/inventory/active"
        },
        {
          title: "Archived Stock",
          url: "/inventory/archived"
        }
      ]
    },
    {
      title: "Reservations",
      icon: IconFileDescription,
      url: "/reservations",
      items: [
        {
          title: "Current Bookings",
          url: "/reservations/current"
        },
        {
          title: "Archived Bookings",
          url: "/reservations/archived"
        }
      ]
    },
    {
      title: "Promotions",
      icon: IconFileAi,
      url: "/promotions",
      items: [
        {
          title: "Active Campaigns",
          url: "/promotions/active"
        },
        {
          title: "Archived Campaigns",
          url: "/promotions/archived"
        }
      ]
    }
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "/settings",
      icon: IconSettings
    },
    {
      title: "Get Help",
      url: "/support",
      icon: IconHelp
    },
    {
      title: "Search",
      url: "/search",
      icon: IconSearch
    }
  ],
  documents: [
    {
      name: "Recipe Library",
      url: "/recipes",
      icon: IconDatabase
    },
    {
      name: "Sales Reports",
      url: "/reports/sales",
      icon: IconReport
    },
    {
      name: "Menu Editor",
      url: "/menu-editor",
      icon: IconFileWord
    }
  ]
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>)
{
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">
                  Sijuk Admin
                </span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
