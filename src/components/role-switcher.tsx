"use client"

import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks'
import { setRole, UserRole } from '@/lib/store/userSlice'
import { Crown, Shield, User, Users } from 'lucide-react'

const roleIcons = {
    "super-admin": Crown,
    "admin": Shield,
    "owner": Users,
    "user": User
}

const roleColors = {
    "super-admin": "bg-purple-100 text-purple-800 border-purple-200",
    "admin": "bg-blue-100 text-blue-800 border-blue-200",
    "owner": "bg-green-100 text-green-800 border-green-200",
    "user": "bg-gray-100 text-gray-800 border-gray-200"
}

export function RoleSwitcher()
{
    const dispatch = useAppDispatch()
    const role = useAppSelector((state) => state.user.role) as UserRole

    const handleRoleChange = (newRole: string) =>
    {
        dispatch(setRole(newRole as UserRole))
    }

    const IconComponent = roleIcons[role]

    return (
        <div className="flex items-center gap-3">
            <Badge className={`${roleColors[role]} flex items-center gap-1`}>
                <IconComponent className="h-3 w-3" />
                {role}
            </Badge>

            <Select value={role} onValueChange={handleRoleChange}>
                <SelectTrigger className="w-[140px]">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="super-admin">
                        <div className="flex items-center gap-2">
                            <Crown className="h-4 w-4" />
                            Super Admin
                        </div>
                    </SelectItem>
                    <SelectItem value="admin">
                        <div className="flex items-center gap-2">
                            <Shield className="h-4 w-4" />
                            Admin
                        </div>
                    </SelectItem>
                    <SelectItem value="owner">
                        <div className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            Owner
                        </div>
                    </SelectItem>
                    <SelectItem value="user">
                        <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            User
                        </div>
                    </SelectItem>
                </SelectContent>
            </Select>
        </div>
    )
}