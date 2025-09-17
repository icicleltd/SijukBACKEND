"use client"

import * as React from "react"

export type UserRole = "super-admin" | "admin" | "owner" | "user"

type RoleContextValue = {
    role: UserRole
    setRole: (r: UserRole) => void
}

const RoleContext = React.createContext<RoleContextValue | undefined>(
    undefined
)

export function RoleProvider({
    children,
    initialRole = "super-admin",
}: {
    children: React.ReactNode
    initialRole?: UserRole
})
{
    const [role, setRole] = React.useState<UserRole>(initialRole)
    const value = React.useMemo(() => ({ role, setRole }), [role])
    return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>
}

export function useRole()
{
    const ctx = React.useContext(RoleContext)
    if (!ctx) throw new Error("useRole must be used within RoleProvider")
    return ctx
}

export function RoleGuard({
    allow,
    children,
    fallback = null,
}: {
    allow: UserRole[]
    children: React.ReactNode
    fallback?: React.ReactNode
})
{
    const { role } = useRole()
    if (allow.includes(role)) return <>{children}</>
    return <>{fallback}</>
}

export const Permissions: Record<UserRole, {
    routes: string[]
}> = {
    "super-admin": {
        routes: [
            "/dashboard",
            "/users",
        ],
    },
    admin: {
        routes: [
            "/dashboard",
        ],
    },
    owner: {
        routes: [
            "/dashboard",
            "/restaurants",
            "/products",
            "/stock",
            "/orders",
            "/pos",
        ],
    },
    user: {
        routes: [
            "/dashboard",
        ],
    },
}

export function routeAllowedForRole(pathname: string, role: UserRole)
{
    const list = Permissions[role]?.routes || []
    return list.some((r) => pathname.startsWith(r))
}
