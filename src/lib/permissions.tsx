"use client"

import { useAppSelector } from '@/lib/store/hooks'
import { UserRole } from '@/lib/store/userSlice'
import React from 'react'

interface ProtectedComponentProps
{
    children: React.ReactNode
    permission?: string
    roles?: UserRole[]
    fallback?: React.ReactNode
}

export function ProtectedComponent({
    children,
    permission,
    roles,
    fallback = null
}: ProtectedComponentProps)
{
    const role = useAppSelector((state) => state.user.role) as UserRole
    const permissions = useAppSelector((state) => state.user.permissions) as string[]

    // Check role-based access
    if (roles && !roles.includes(role)) {
        return <>{fallback}</>
    }

    // Check permission-based access
    if (permission && !permissions.includes(permission)) {
        return <>{fallback}</>
    }

    return <>{children}</>
}

interface UsePermissionResult
{
    hasPermission: (permission: string) => boolean
    hasRole: (roles: UserRole | UserRole[]) => boolean
    hasAnyRole: (roles: UserRole[]) => boolean
    canAccess: (permission?: string, roles?: UserRole[]) => boolean
}

export function usePermissions(): UsePermissionResult
{
    const role = useAppSelector((state) => state.user.role) as UserRole
    const permissions = useAppSelector((state) => state.user.permissions) as string[]

    const hasPermission = (permission: string): boolean =>
    {
        return permissions.includes(permission)
    }

    const hasRole = (roles: UserRole | UserRole[]): boolean =>
    {
        const roleArray = Array.isArray(roles) ? roles : [roles]
        return roleArray.includes(role)
    }

    const hasAnyRole = (roles: UserRole[]): boolean =>
    {
        return roles.includes(role)
    }

    const canAccess = (permission?: string, roles?: UserRole[]): boolean =>
    {
        if (roles && !hasAnyRole(roles)) return false
        if (permission && !hasPermission(permission)) return false
        return true
    }

    return {
        hasPermission,
        hasRole,
        hasAnyRole,
        canAccess
    }
}

export const roleHierarchy: Record<UserRole, number> = {
    "user": 1,
    "owner": 2,
    "admin": 3,
    "super-admin": 4
}

export function hasMinimumRole(userRole: UserRole, minimumRole: UserRole): boolean
{
    return roleHierarchy[userRole] >= roleHierarchy[minimumRole]
}