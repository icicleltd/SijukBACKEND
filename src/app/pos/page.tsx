"use client"
import { AppSidebar } from "@/components/app-sidebar"
import { NotAuthorized } from "@/components/not-authorized"
import { SiteHeader } from "@/components/site-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { ProtectedComponent } from "@/lib/permissions"
import { CreditCard, DollarSign, Minus, Package, Plus, Receipt, Scan, Search, ShoppingCart, Trash2 } from "lucide-react"
import { useState } from "react"

interface CartItem
{
    id: string
    name: string
    price: number
    quantity: number
    category: string
}

const menuItems = [
    { id: "1", name: "Cheeseburger", price: 9.99, category: "Burgers", available: true },
    { id: "2", name: "Veggie Pizza", price: 12.50, category: "Pizza", available: true },
    { id: "3", name: "Caesar Salad", price: 7.25, category: "Salads", available: true },
    { id: "4", name: "Chicken Wings", price: 8.99, category: "Appetizers", available: true },
    { id: "5", name: "Fish Tacos", price: 11.99, category: "Mexican", available: false },
    { id: "6", name: "Pasta Alfredo", price: 13.99, category: "Italian", available: true },
    { id: "7", name: "Grilled Salmon", price: 16.99, category: "Seafood", available: true },
    { id: "8", name: "BBQ Ribs", price: 18.99, category: "BBQ", available: true },
    { id: "9", name: "Greek Salad", price: 8.50, category: "Salads", available: true },
    { id: "10", name: "Mushroom Pizza", price: 14.25, category: "Pizza", available: true },
    { id: "11", name: "Beef Burrito", price: 10.99, category: "Mexican", available: true },
    { id: "12", name: "Ice Cream", price: 4.99, category: "Desserts", available: true },
]

const categories = ["All", "Burgers", "Pizza", "Salads", "Appetizers", "Mexican", "Italian", "Seafood", "BBQ", "Desserts"]

export default function POSPage()
{
    const [cart, setCart] = useState<CartItem[]>([])
    const [selectedCategory, setSelectedCategory] = useState("All")
    const [searchQuery, setSearchQuery] = useState("")

    const filteredItems = menuItems.filter(item =>
    {
        const matchesCategory = selectedCategory === "All" || item.category === selectedCategory
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesCategory && matchesSearch && item.available
    })

    const addToCart = (item: typeof menuItems[0]) =>
    {
        setCart(prev =>
        {
            const existing = prev.find(cartItem => cartItem.id === item.id)
            if (existing) {
                return prev.map(cartItem =>
                    cartItem.id === item.id
                        ? { ...cartItem, quantity: cartItem.quantity + 1 }
                        : cartItem
                )
            }
            return [...prev, { ...item, quantity: 1 }]
        })
    }

    const updateQuantity = (id: string, change: number) =>
    {
        setCart(prev => prev.map(item =>
        {
            if (item.id === id) {
                const newQuantity = item.quantity + change
                return newQuantity > 0 ? { ...item, quantity: newQuantity } : item
            }
            return item
        }).filter(item => item.quantity > 0))
    }

    const removeFromCart = (id: string) =>
    {
        setCart(prev => prev.filter(item => item.id !== id))
    }

    const getTotalAmount = () =>
    {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0)
    }

    const getTotalItems = () =>
    {
        return cart.reduce((total, item) => total + item.quantity, 0)
    }

    return (
        <SidebarProvider style={{ "--sidebar-width": "calc(var(--spacing) * 72)", "--header-height": "calc(var(--spacing) * 12)" } as React.CSSProperties}>
            <AppSidebar variant="inset" />
            <SidebarInset>
                <SiteHeader />
                <ProtectedComponent roles={["admin", "owner"]} fallback={<NotAuthorized />}>
                    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 p-4 lg:p-6">
                        {/* Header */}
                        <div className="mb-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                                        <div className="p-2 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl">
                                            <ShoppingCart className="h-8 w-8 text-white" />
                                        </div>
                                        Point of Sale
                                    </h1>
                                    <p className="text-gray-600 mt-1">Fast and efficient order management</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <Badge className="bg-green-100 text-green-800 border-green-200 px-3 py-1">
                                        <Package className="h-4 w-4 mr-1" />
                                        {getTotalItems()} Items
                                    </Badge>
                                    <Badge className="bg-blue-100 text-blue-800 border-blue-200 px-3 py-1">
                                        <DollarSign className="h-4 w-4 mr-1" />
                                        ${getTotalAmount().toFixed(2)}
                                    </Badge>
                                </div>
                            </div>
                        </div>

                        <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
                            {/* Menu Catalog */}
                            <Card className="lg:col-span-2 border-0 shadow-xl bg-gradient-to-br from-white via-orange-50/20 to-amber-50/30">
                                <CardHeader className="pb-4 bg-gradient-to-r from-orange-500/5 to-amber-500/5">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                        <div>
                                            <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                                <Package className="h-5 w-5 text-orange-500" />
                                                Menu Catalog
                                            </CardTitle>
                                            <CardDescription className="text-gray-600">
                                                Select items to add to cart
                                            </CardDescription>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="relative">
                                                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                                <Input
                                                    placeholder="Search items..."
                                                    className="pl-10 w-64"
                                                    value={searchQuery}
                                                    onChange={(e) => setSearchQuery(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Category Filter */}
                                    <div className="flex flex-wrap gap-2 mt-4">
                                        {categories.map(category => (
                                            <Button
                                                key={category}
                                                variant={selectedCategory === category ? "default" : "outline"}
                                                size="sm"
                                                onClick={() => setSelectedCategory(category)}
                                                className={selectedCategory === category
                                                    ? "bg-gradient-to-r from-orange-500 to-amber-600 text-white border-0"
                                                    : "border-orange-200 text-gray-700 hover:bg-orange-50"
                                                }
                                            >
                                                {category}
                                            </Button>
                                        ))}
                                    </div>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                                        {filteredItems.map((item) => (
                                            <Button
                                                key={item.id}
                                                variant="outline"
                                                className="h-24 p-3 border-gray-200 hover:border-orange-300 hover:bg-orange-50 transition-all duration-200 flex flex-col items-center justify-center gap-2 group"
                                                onClick={() => addToCart(item)}
                                            >
                                                <div className="text-sm font-medium text-gray-900 text-center leading-tight">
                                                    {item.name}
                                                </div>
                                                <div className="text-lg font-bold text-orange-600 group-hover:text-orange-700">
                                                    ${item.price.toFixed(2)}
                                                </div>
                                                <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-600">
                                                    {item.category}
                                                </Badge>
                                            </Button>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Cart */}
                            <Card className="border-0 shadow-xl bg-gradient-to-br from-white via-green-50/20 to-emerald-50/30">
                                <CardHeader className="pb-4 bg-gradient-to-r from-green-500/5 to-emerald-500/5">
                                    <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                        <ShoppingCart className="h-5 w-5 text-green-500" />
                                        Cart
                                        {cart.length > 0 && (
                                            <Badge className="bg-green-100 text-green-800 border-green-200">
                                                {getTotalItems()}
                                            </Badge>
                                        )}
                                    </CardTitle>
                                    <CardDescription className="text-gray-600">
                                        Current order items
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="p-6 space-y-4">
                                    {/* Quick Scan */}
                                    <div className="flex items-center gap-2">
                                        <div className="relative flex-1">
                                            <Scan className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                            <Input placeholder="Scan or search item" className="pl-10" />
                                        </div>
                                        <Button className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
                                            Add
                                        </Button>
                                    </div>

                                    {/* Cart Items */}
                                    <div className="space-y-3 max-h-96 overflow-y-auto">
                                        {cart.length === 0 ? (
                                            <div className="rounded-lg border border-gray-200 p-6 text-center">
                                                <ShoppingCart className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                                                <p className="text-sm text-gray-500">No items in cart</p>
                                            </div>
                                        ) : (
                                            cart.map((item) => (
                                                <div key={item.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100 shadow-sm">
                                                    <div className="flex-1">
                                                        <p className="font-medium text-gray-900 text-sm">{item.name}</p>
                                                        <p className="text-xs text-gray-500">${item.price.toFixed(2)} each</p>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="h-8 w-8 p-0"
                                                            onClick={() => updateQuantity(item.id, -1)}
                                                        >
                                                            <Minus className="h-3 w-3" />
                                                        </Button>
                                                        <span className="w-8 text-center text-sm font-medium">
                                                            {item.quantity}
                                                        </span>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="h-8 w-8 p-0"
                                                            onClick={() => updateQuantity(item.id, 1)}
                                                        >
                                                            <Plus className="h-3 w-3" />
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                                                            onClick={() => removeFromCart(item.id)}
                                                        >
                                                            <Trash2 className="h-3 w-3" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>

                                    {/* Total */}
                                    <div className="pt-4 border-t border-gray-200">
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="text-lg font-bold text-gray-900">Total</span>
                                            <span className="text-2xl font-bold text-green-600">
                                                ${getTotalAmount().toFixed(2)}
                                            </span>
                                        </div>

                                        {/* Payment Buttons */}
                                        <div className="space-y-2">
                                            <Button
                                                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700"
                                                disabled={cart.length === 0}
                                            >
                                                <CreditCard className="h-4 w-4 mr-2" />
                                                Charge ${getTotalAmount().toFixed(2)}
                                            </Button>
                                            <Button
                                                variant="outline"
                                                className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
                                                disabled={cart.length === 0}
                                            >
                                                <Receipt className="h-4 w-4 mr-2" />
                                                Print Receipt
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </ProtectedComponent>
            </SidebarInset>
        </SidebarProvider>
    )
}
