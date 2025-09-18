import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import
    {
        Building2,
        Car,
        Clock,
        CreditCard,
        DollarSign,
        FileImage,
        MapPin,
        Phone,
        Star,
        Upload,
        User,
        Users,
        Utensils,
        Wifi,
        X
    } from "lucide-react"
import * as React from "react"

export interface RestaurantFormData
{
    // Basic Information
    name: string
    description: string
    category: string
    establishedYear: string

    // Owner Information
    ownerName: string
    ownerEmail: string
    ownerPhone: string

    // Location Information
    address: string
    city: string
    state: string
    zipCode: string
    country: string
    latitude: string
    longitude: string

    // Business Information
    employeeRange: string
    seatingCapacity: string
    operatingHours: {
        monday: { open: string; close: string; closed: boolean }
        tuesday: { open: string; close: string; closed: boolean }
        wednesday: { open: string; close: string; closed: boolean }
        thursday: { open: string; close: string; closed: boolean }
        friday: { open: string; close: string; closed: boolean }
        saturday: { open: string; close: string; closed: boolean }
        sunday: { open: string; close: string; closed: boolean }
    }

    // Financial Information
    avgOrderValue: string
    monthlyRevenue: string
    commissionRate: string

    // Services & Features
    services: string[]
    cuisineTypes: string[]
    paymentMethods: string[]

    // Media
    logoFile: File | null
    coverFile: File | null
    galleryFiles: File[]

    // Legal & Compliance
    businessLicense: string
    taxId: string
    foodLicense: string
}

const initialFormData: RestaurantFormData = {
    name: "",
    description: "",
    category: "",
    establishedYear: "",
    ownerName: "",
    ownerEmail: "",
    ownerPhone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
    latitude: "",
    longitude: "",
    employeeRange: "",
    seatingCapacity: "",
    operatingHours: {
        monday: { open: "09:00", close: "22:00", closed: false },
        tuesday: { open: "09:00", close: "22:00", closed: false },
        wednesday: { open: "09:00", close: "22:00", closed: false },
        thursday: { open: "09:00", close: "22:00", closed: false },
        friday: { open: "09:00", close: "23:00", closed: false },
        saturday: { open: "09:00", close: "23:00", closed: false },
        sunday: { open: "10:00", close: "21:00", closed: false }
    },
    avgOrderValue: "",
    monthlyRevenue: "",
    commissionRate: "",
    services: [],
    cuisineTypes: [],
    paymentMethods: [],
    logoFile: null,
    coverFile: null,
    galleryFiles: [],
    businessLicense: "",
    taxId: "",
    foodLicense: ""
}

interface EnhancedRestaurantFormProps
{
    isOpen: boolean
    onClose: () => void
    onSubmit?: (data: RestaurantFormData) => void
}

export function EnhancedRestaurantForm({ isOpen, onClose, onSubmit }: EnhancedRestaurantFormProps)
{
    const [form, setForm] = React.useState<RestaurantFormData>(initialFormData)
    const [currentStep, setCurrentStep] = React.useState(1)
    const totalSteps = 5

    const serviceOptions = [
        { id: "delivery", label: "Delivery", icon: Car },
        { id: "takeout", label: "Takeout", icon: Utensils },
        { id: "dine-in", label: "Dine-in", icon: Users },
        { id: "wifi", label: "Free WiFi", icon: Wifi },
        { id: "parking", label: "Parking", icon: Car }
    ]

    const cuisineOptions = [
        "American", "Italian", "Chinese", "Mexican", "Indian", "Japanese",
        "Thai", "Mediterranean", "French", "Korean", "Vietnamese", "Other"
    ]

    const paymentOptions = [
        { id: "cash", label: "Cash", icon: DollarSign },
        { id: "credit", label: "Credit Cards", icon: CreditCard },
        { id: "debit", label: "Debit Cards", icon: CreditCard },
        { id: "digital", label: "Digital Wallets", icon: Phone }
    ]

    const nextStep = () => setCurrentStep(Math.min(currentStep + 1, totalSteps))
    const prevStep = () => setCurrentStep(Math.max(currentStep - 1, 1))

    const toggleService = (serviceId: string) =>
    {
        setForm(prev => ({
            ...prev,
            services: prev.services.includes(serviceId)
                ? prev.services.filter(s => s !== serviceId)
                : [...prev.services, serviceId]
        }))
    }

    const toggleCuisine = (cuisine: string) =>
    {
        setForm(prev => ({
            ...prev,
            cuisineTypes: prev.cuisineTypes.includes(cuisine)
                ? prev.cuisineTypes.filter(c => c !== cuisine)
                : [...prev.cuisineTypes, cuisine]
        }))
    }

    const togglePayment = (paymentId: string) =>
    {
        setForm(prev => ({
            ...prev,
            paymentMethods: prev.paymentMethods.includes(paymentId)
                ? prev.paymentMethods.filter(p => p !== paymentId)
                : [...prev.paymentMethods, paymentId]
        }))
    }

    const renderStepContent = () =>
    {
        switch (currentStep) {
            case 1:
                return (
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Building2 className="w-5 h-5" />
                                    Basic Information
                                </CardTitle>
                                <CardDescription>Tell us about your restaurant</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Restaurant Name *</Label>
                                        <Input
                                            id="name"
                                            placeholder="e.g., Sunset Diner"
                                            value={form.name}
                                            onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="category">Category *</Label>
                                        <Select value={form.category} onValueChange={(val) => setForm(prev => ({ ...prev, category: val }))}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="fine-dining">Fine Dining</SelectItem>
                                                <SelectItem value="casual">Casual Dining</SelectItem>
                                                <SelectItem value="fast-food">Fast Food</SelectItem>
                                                <SelectItem value="cafe">Cafe</SelectItem>
                                                <SelectItem value="bar">Bar & Grill</SelectItem>
                                                <SelectItem value="food-truck">Food Truck</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">Description *</Label>
                                    <textarea
                                        id="description"
                                        placeholder="Describe your restaurant, specialties, atmosphere..."
                                        value={form.description}
                                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setForm(prev => ({ ...prev, description: e.target.value }))}
                                        className="flex min-h-[96px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    />
                                </div>

                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="establishedYear">Established Year</Label>
                                        <Input
                                            id="establishedYear"
                                            type="number"
                                            placeholder="e.g., 2020"
                                            value={form.establishedYear}
                                            onChange={(e) => setForm(prev => ({ ...prev, establishedYear: e.target.value }))}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="seatingCapacity">Seating Capacity</Label>
                                        <Input
                                            id="seatingCapacity"
                                            type="number"
                                            placeholder="e.g., 50"
                                            value={form.seatingCapacity}
                                            onChange={(e) => setForm(prev => ({ ...prev, seatingCapacity: e.target.value }))}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <Label>Cuisine Types *</Label>
                                    <div className="flex flex-wrap gap-2">
                                        {cuisineOptions.map((cuisine) => (
                                            <Badge
                                                key={cuisine}
                                                variant={form.cuisineTypes.includes(cuisine) ? "default" : "outline"}
                                                className="cursor-pointer hover:bg-primary/80"
                                                onClick={() => toggleCuisine(cuisine)}
                                            >
                                                {cuisine}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )

            case 2:
                return (
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="w-5 h-5" />
                                    Owner Information
                                </CardTitle>
                                <CardDescription>Contact details for the restaurant owner</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="ownerName">Owner Name *</Label>
                                        <Input
                                            id="ownerName"
                                            placeholder="John Doe"
                                            value={form.ownerName}
                                            onChange={(e) => setForm(prev => ({ ...prev, ownerName: e.target.value }))}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="ownerPhone">Phone Number *</Label>
                                        <Input
                                            id="ownerPhone"
                                            type="tel"
                                            placeholder="+1 (555) 123-4567"
                                            value={form.ownerPhone}
                                            onChange={(e) => setForm(prev => ({ ...prev, ownerPhone: e.target.value }))}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="ownerEmail">Email Address *</Label>
                                    <Input
                                        id="ownerEmail"
                                        type="email"
                                        placeholder="john@restaurant.com"
                                        value={form.ownerEmail}
                                        onChange={(e) => setForm(prev => ({ ...prev, ownerEmail: e.target.value }))}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <MapPin className="w-5 h-5" />
                                    Location Details
                                </CardTitle>
                                <CardDescription>Where is your restaurant located?</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="address">Street Address *</Label>
                                    <Input
                                        id="address"
                                        placeholder="123 Main Street"
                                        value={form.address}
                                        onChange={(e) => setForm(prev => ({ ...prev, address: e.target.value }))}
                                    />
                                </div>

                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="city">City *</Label>
                                        <Input
                                            id="city"
                                            placeholder="New York"
                                            value={form.city}
                                            onChange={(e) => setForm(prev => ({ ...prev, city: e.target.value }))}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="state">State *</Label>
                                        <Input
                                            id="state"
                                            placeholder="NY"
                                            value={form.state}
                                            onChange={(e) => setForm(prev => ({ ...prev, state: e.target.value }))}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="zipCode">ZIP Code *</Label>
                                        <Input
                                            id="zipCode"
                                            placeholder="10001"
                                            value={form.zipCode}
                                            onChange={(e) => setForm(prev => ({ ...prev, zipCode: e.target.value }))}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="country">Country *</Label>
                                        <Select value={form.country} onValueChange={(val) => setForm(prev => ({ ...prev, country: val }))}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="United States">United States</SelectItem>
                                                <SelectItem value="Canada">Canada</SelectItem>
                                                <SelectItem value="Mexico">Mexico</SelectItem>
                                                <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                                                <SelectItem value="Other">Other</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="latitude">Latitude (Optional)</Label>
                                        <Input
                                            id="latitude"
                                            placeholder="40.7128"
                                            value={form.latitude}
                                            onChange={(e) => setForm(prev => ({ ...prev, latitude: e.target.value }))}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="longitude">Longitude (Optional)</Label>
                                        <Input
                                            id="longitude"
                                            placeholder="-74.0060"
                                            value={form.longitude}
                                            onChange={(e) => setForm(prev => ({ ...prev, longitude: e.target.value }))}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )

            case 3:
                return (
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Clock className="w-5 h-5" />
                                    Business Operations
                                </CardTitle>
                                <CardDescription>Operating hours and staff information</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Employee Range *</Label>
                                    <Select value={form.employeeRange} onValueChange={(val) => setForm(prev => ({ ...prev, employeeRange: val }))}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select employee range" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="1-5">1-5 employees</SelectItem>
                                            <SelectItem value="6-15">6-15 employees</SelectItem>
                                            <SelectItem value="16-50">16-50 employees</SelectItem>
                                            <SelectItem value="51-100">51-100 employees</SelectItem>
                                            <SelectItem value="100+">100+ employees</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <Separator />

                                <div className="space-y-3">
                                    <Label>Services Offered *</Label>
                                    <div className="grid gap-3 md:grid-cols-2">
                                        {serviceOptions.map((service) =>
                                        {
                                            const Icon = service.icon
                                            const isSelected = form.services.includes(service.id)
                                            return (
                                                <div
                                                    key={service.id}
                                                    className={`p-4 border rounded-lg cursor-pointer transition-all ${isSelected
                                                            ? 'border-primary bg-primary/5 shadow-sm'
                                                            : 'border-gray-200 hover:border-gray-300'
                                                        }`}
                                                    onClick={() => toggleService(service.id)}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <Icon className={`w-5 h-5 ${isSelected ? 'text-primary' : 'text-gray-500'}`} />
                                                        <span className={`font-medium ${isSelected ? 'text-primary' : 'text-gray-700'}`}>
                                                            {service.label}
                                                        </span>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>

                                <Separator />

                                <div className="space-y-3">
                                    <Label>Payment Methods *</Label>
                                    <div className="grid gap-3 md:grid-cols-2">
                                        {paymentOptions.map((payment) =>
                                        {
                                            const Icon = payment.icon
                                            const isSelected = form.paymentMethods.includes(payment.id)
                                            return (
                                                <div
                                                    key={payment.id}
                                                    className={`p-4 border rounded-lg cursor-pointer transition-all ${isSelected
                                                            ? 'border-primary bg-primary/5 shadow-sm'
                                                            : 'border-gray-200 hover:border-gray-300'
                                                        }`}
                                                    onClick={() => togglePayment(payment.id)}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <Icon className={`w-5 h-5 ${isSelected ? 'text-primary' : 'text-gray-500'}`} />
                                                        <span className={`font-medium ${isSelected ? 'text-primary' : 'text-gray-700'}`}>
                                                            {payment.label}
                                                        </span>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )

            case 4:
                return (
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <DollarSign className="w-5 h-5" />
                                    Financial Information
                                </CardTitle>
                                <CardDescription>Revenue and pricing details</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-4 md:grid-cols-3">
                                    <div className="space-y-2">
                                        <Label htmlFor="avgOrderValue">Average Order Value</Label>
                                        <Input
                                            id="avgOrderValue"
                                            type="number"
                                            placeholder="25.00"
                                            value={form.avgOrderValue}
                                            onChange={(e) => setForm(prev => ({ ...prev, avgOrderValue: e.target.value }))}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="monthlyRevenue">Monthly Revenue</Label>
                                        <Input
                                            id="monthlyRevenue"
                                            type="number"
                                            placeholder="15000"
                                            value={form.monthlyRevenue}
                                            onChange={(e) => setForm(prev => ({ ...prev, monthlyRevenue: e.target.value }))}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="commissionRate">Commission Rate (%)</Label>
                                        <Input
                                            id="commissionRate"
                                            type="number"
                                            placeholder="15"
                                            value={form.commissionRate}
                                            onChange={(e) => setForm(prev => ({ ...prev, commissionRate: e.target.value }))}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FileImage className="w-5 h-5" />
                                    Media & Documents
                                </CardTitle>
                                <CardDescription>Upload restaurant images and required documents</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="logo">Restaurant Logo</Label>
                                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                                            <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                                            <Input
                                                id="logo"
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={(e) => setForm(prev => ({ ...prev, logoFile: e.target.files?.[0] ?? null }))}
                                            />
                                            <Label htmlFor="logo" className="cursor-pointer text-sm text-gray-600 hover:text-gray-800">
                                                Click to upload logo
                                            </Label>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="cover">Cover Image</Label>
                                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                                            <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                                            <Input
                                                id="cover"
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={(e) => setForm(prev => ({ ...prev, coverFile: e.target.files?.[0] ?? null }))}
                                            />
                                            <Label htmlFor="cover" className="cursor-pointer text-sm text-gray-600 hover:text-gray-800">
                                                Click to upload cover
                                            </Label>
                                        </div>
                                    </div>
                                </div>

                                <Separator />

                                <div className="space-y-4">
                                    <Label>Legal Documents</Label>
                                    <div className="grid gap-4 md:grid-cols-3">
                                        <div className="space-y-2">
                                            <Label htmlFor="businessLicense">Business License</Label>
                                            <Input
                                                id="businessLicense"
                                                placeholder="License number"
                                                value={form.businessLicense}
                                                onChange={(e) => setForm(prev => ({ ...prev, businessLicense: e.target.value }))}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="taxId">Tax ID</Label>
                                            <Input
                                                id="taxId"
                                                placeholder="Tax identification"
                                                value={form.taxId}
                                                onChange={(e) => setForm(prev => ({ ...prev, taxId: e.target.value }))}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="foodLicense">Food Service License</Label>
                                            <Input
                                                id="foodLicense"
                                                placeholder="Food license number"
                                                value={form.foodLicense}
                                                onChange={(e) => setForm(prev => ({ ...prev, foodLicense: e.target.value }))}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )

            case 5:
                return (
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Star className="w-5 h-5" />
                                    Review & Submit
                                </CardTitle>
                                <CardDescription>Please review all information before submitting</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid gap-6 md:grid-cols-2">
                                    <div className="space-y-3">
                                        <h4 className="font-semibold text-sm text-gray-900">Basic Information</h4>
                                        <div className="space-y-2 text-sm">
                                            <div><span className="text-gray-600">Name:</span> {form.name}</div>
                                            <div><span className="text-gray-600">Category:</span> {form.category}</div>
                                            <div><span className="text-gray-600">Established:</span> {form.establishedYear}</div>
                                            <div><span className="text-gray-600">Seating:</span> {form.seatingCapacity} seats</div>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <h4 className="font-semibold text-sm text-gray-900">Owner Details</h4>
                                        <div className="space-y-2 text-sm">
                                            <div><span className="text-gray-600">Name:</span> {form.ownerName}</div>
                                            <div><span className="text-gray-600">Email:</span> {form.ownerEmail}</div>
                                            <div><span className="text-gray-600">Phone:</span> {form.ownerPhone}</div>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <h4 className="font-semibold text-sm text-gray-900">Location</h4>
                                        <div className="space-y-2 text-sm">
                                            <div><span className="text-gray-600">Address:</span> {form.address}</div>
                                            <div><span className="text-gray-600">City:</span> {form.city}, {form.state} {form.zipCode}</div>
                                            <div><span className="text-gray-600">Country:</span> {form.country}</div>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <h4 className="font-semibold text-sm text-gray-900">Services & Features</h4>
                                        <div className="space-y-2 text-sm">
                                            <div><span className="text-gray-600">Services:</span> {form.services.join(', ') || 'None selected'}</div>
                                            <div><span className="text-gray-600">Cuisines:</span> {form.cuisineTypes.join(', ') || 'None selected'}</div>
                                            <div><span className="text-gray-600">Payments:</span> {form.paymentMethods.join(', ') || 'None selected'}</div>
                                        </div>
                                    </div>
                                </div>

                                <Separator />

                                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                                    <h4 className="font-semibold text-blue-900 mb-2">Next Steps</h4>
                                    <ul className="text-sm text-blue-800 space-y-1">
                                        <li>• Your application will be reviewed within 2-3 business days</li>
                                        <li>• We&apos;ll verify your documents and business information</li>
                                        <li>• You&apos;ll receive an email with your account activation details</li>
                                        <li>• Once approved, you can start managing your restaurant profile</li>
                                    </ul>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )

            default:
                return null
        }
    }

    const handleSubmit = (e: React.FormEvent) =>
    {
        e.preventDefault()
        if (currentStep === totalSteps) {
            onSubmit?.(form)
            onClose()
        }
    }

    const handleCancel = () =>
    {
        setCurrentStep(1)
        setForm(initialFormData)
        onClose()
    }

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className="w-full sm:max-w-4xl">
                <SheetHeader>
                    <SheetTitle>Register Your Restaurant</SheetTitle>
                </SheetHeader>

                <div className="mt-6 overflow-y-auto max-h-[calc(100vh-120px)] px-5">
                    {/* Progress Bar */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700">Step {currentStep} of {totalSteps}</span>
                            <span className="text-sm text-gray-500">{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                            />
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {renderStepContent()}

                        {/* Navigation Buttons */}
                        <div className="flex justify-between pt-6 border-t">
                            <div className="flex gap-3">
                                {currentStep > 1 && (
                                    <Button type="button" variant="outline" onClick={prevStep}>
                                        Previous
                                    </Button>
                                )}
                                <Button type="button" variant="ghost" onClick={handleCancel}>
                                    <X className="w-4 h-4 mr-2" />
                                    Cancel
                                </Button>
                            </div>

                            <div className="flex gap-3">
                                {currentStep < totalSteps ? (
                                    <Button type="button" onClick={nextStep}>
                                        Next Step
                                    </Button>
                                ) : (
                                    <Button type="submit" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                                        Submit Application
                                    </Button>
                                )}
                            </div>
                        </div>
                    </form>
                </div>
            </SheetContent>
        </Sheet>
    )
}