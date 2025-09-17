import type { UserRole } from "../domain/models/user-profile.model";

export const Roles = {
    SUPER_ADMIN: "SUPER_ADMIN",
    ADMIN: "ADMIN",
    OWNER: "OWNER",
    USER: "USER",
} as const;

export function canManageRestaurants(role: UserRole)
{
    return role === Roles.SUPER_ADMIN || role === Roles.ADMIN;
}

export function canManageOwnRestaurant(role: UserRole)
{
    return role === Roles.OWNER || role === Roles.SUPER_ADMIN || role === Roles.ADMIN;
}

export function isElevated(role: UserRole)
{
    return role === Roles.SUPER_ADMIN || role === Roles.ADMIN;
}
