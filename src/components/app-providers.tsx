"use client"

import { Toaster } from "@/components/ui/sonner"
import { RoleProvider } from "@/lib/roles"
import * as React from "react"

export function AppProviders({ children }: { children: React.ReactNode })
{
    return (
        <RoleProvider>
            {children}
            <Toaster richColors position="top-right" />
        </RoleProvider>
    )
}
