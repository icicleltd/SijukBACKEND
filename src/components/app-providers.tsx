"use client"

import { Toaster } from "@/components/ui/sonner"
import { RoleProvider } from "@/lib/roles"
import { StoreProvider } from "@/lib/store/StoreProvider"
import * as React from "react"

export function AppProviders({ children }: { children: React.ReactNode })
{
    return (
        <StoreProvider>
            <RoleProvider>
                {children}
                <Toaster richColors position="top-right" />
            </RoleProvider>
        </StoreProvider>
    )
}
