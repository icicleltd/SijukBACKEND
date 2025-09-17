import { Schema, model } from "mongoose";

export type OrderStatus = "PENDING" | "CONFIRMED" | "PREPARING" | "READY" | "COMPLETED" | "CANCELLED";

export interface IOrderItemAddon
{
    name: string;
    price: number;
}

export interface IOrderItemVariant
{
    name: string;
    priceDelta: number;
}

export interface IOrderItem
{
    productId: string;
    name: string;
    basePrice: number;
    quantity: number;
    variant?: IOrderItemVariant;
    addons?: IOrderItemAddon[];
    total: number; // computed per item
}

export interface IOrder
{
    _id: string;
    restaurantId: string;
    createdBy: string; // userId who created the order (POS/user)
    items: IOrderItem[];
    subtotal: number;
    tax?: number;
    discount?: number;
    total: number;
    status: OrderStatus;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}

const orderItemAddonSchema = new Schema<IOrderItemAddon>(
    { name: { type: String, required: true }, price: { type: Number, required: true } },
    { _id: false }
);

const orderItemVariantSchema = new Schema<IOrderItemVariant>(
    { name: { type: String, required: true }, priceDelta: { type: Number, required: true } },
    { _id: false }
);

const orderItemSchema = new Schema<IOrderItem>(
    {
        productId: { type: String, required: true, ref: "Product" },
        name: { type: String, required: true },
        basePrice: { type: Number, required: true },
        quantity: { type: Number, required: true },
        variant: { type: orderItemVariantSchema, required: false },
        addons: { type: [orderItemAddonSchema], default: [] },
        total: { type: Number, required: true },
    },
    { _id: false }
);

const orderSchema = new Schema<IOrder>(
    {
        _id: { type: String },
        restaurantId: { type: String, required: true, ref: "Restaurant" },
        createdBy: { type: String, required: true, ref: "User" },
        items: { type: [orderItemSchema], default: [] },
        subtotal: { type: Number, required: true },
        tax: { type: Number },
        discount: { type: Number },
        total: { type: Number, required: true },
        status: { type: String, enum: ["PENDING", "CONFIRMED", "PREPARING", "READY", "COMPLETED", "CANCELLED"], default: "PENDING" },
        notes: { type: String },
        createdAt: { type: Date, required: true, default: () => new Date() },
        updatedAt: { type: Date, required: true, default: () => new Date() },
    },
    { collection: "order" }
);

orderSchema.pre("save", function (next)
{
    this.updatedAt = new Date();
    next();
});

export const Order = model<IOrder>("Order", orderSchema);
Order.collection.createIndex({ restaurantId: 1, createdAt: -1 }).catch(() => { });
