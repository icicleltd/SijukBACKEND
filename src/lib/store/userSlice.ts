import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type UserRole = "super-admin" | "admin" | "owner" | "user"

interface UserState
{
    role: UserRole
    isAuthenticated: boolean
    username?: string
    email?: string
    permissions: string[]
}

const rolePermissions: Record<UserRole, string[]> = {
    "super-admin": [
        "dashboard:view",
        "users:view",
        "users:create",
        "users:edit",
        "users:delete",
        "restaurants:view",
        "restaurants:create",
        "restaurants:edit",
        "restaurants:delete",
        "products:view",
        "products:create",
        "products:edit",
        "products:delete",
        "orders:view",
        "orders:create",
        "orders:edit",
        "orders:delete",
        "stock:view",
        "stock:create",
        "stock:edit",
        "stock:delete",
        "pos:view",
        "pos:use"
    ],
    "admin": [
        "dashboard:view",
        "restaurants:view",
        "products:view",
        "orders:view",
        "stock:view"
    ],
    "owner": [
        "dashboard:view",
        "products:view",
        "products:create",
        "products:edit",
        "products:delete",
        "orders:view",
        "orders:create",
        "orders:edit",
        "stock:view",
        "stock:create",
        "stock:edit",
        "pos:view",
        "pos:use"
    ],
    "user": [
        "dashboard:view"
    ]
}

const initialState: UserState = {
    role: "super-admin", // Default for development
    isAuthenticated: true,
    username: "Admin User",
    email: "admin@example.com",
    permissions: rolePermissions["super-admin"]
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setRole: (state, action: PayloadAction<UserRole>) =>
        {
            state.role = action.payload
            state.permissions = rolePermissions[action.payload]
        },
        setUser: (state, action: PayloadAction<Partial<UserState>>) =>
        {
            Object.assign(state, action.payload)
            if (action.payload.role) {
                state.permissions = rolePermissions[action.payload.role]
            }
        },
        logout: (state) =>
        {
            state.isAuthenticated = false
            state.role = "user"
            state.username = undefined
            state.email = undefined
            state.permissions = rolePermissions["user"]
        }
    },
})

export const { setRole, setUser, logout } = userSlice.actions

// Export as default
export default userSlice.reducer

// Also export the slice itself
export { userSlice }
