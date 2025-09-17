import { model, Schema } from "mongoose";

export type ProductType = "FOOD" | "BEVERAGE";

export interface IProductVariant
{
    name: string;
    priceDelta: number; // additional price over base
}

export interface IProductAddon
{
    name: string;
    price: number;
}

export interface IProduct
{
    _id: string;
    restaurantId: string;
    name: string;
    description?: string;
    image?: string;
    type: ProductType;
    category?: string;
    basePrice: number;
    variants?: IProductVariant[];
    addons?: IProductAddon[];
    stock: number; // current stock level
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const variantSchema = new Schema<IProductVariant>(
    {
        name: { type: String, required: true },
        priceDelta: { type: Number, required: true, default: 0 },
    },
    { _id: false }
);

const addonSchema = new Schema<IProductAddon>(
    {
        name: { type: String, required: true },
        price: { type: Number, required: true },
    },
    { _id: false }
);

const productSchema = new Schema<IProduct>(
    {
        _id: { type: String },
        restaurantId: { type: String, required: true, ref: "Restaurant" },
        name: { type: String, required: true },
        description: { type: String },
        image: { type: String },
        type: { type: String, enum: ["FOOD", "BEVERAGE"], required: true },
        category: { type: String },
        basePrice: { type: Number, required: true },
        variants: { type: [variantSchema], default: [] },
        addons: { type: [addonSchema], default: [] },
        stock: { type: Number, required: true, default: 0 },
        isActive: { type: Boolean, default: true },
        createdAt: { type: Date, required: true, default: () => new Date() },
        updatedAt: { type: Date, required: true, default: () => new Date() },
    },
    { collection: "product" }
);

productSchema.pre("save", function (next)
{
    this.updatedAt = new Date();
    next();
});

export const Product = model<IProduct>("Product", productSchema);
Product.collection.createIndex({ restaurantId: 1 }).catch(() => { });

export interface IStockMovement
{
    _id: string;
    restaurantId: string;
    productId: string;
    quantity: number; // positive for add, negative for remove
    reason?: string;
    createdBy: string; // userId
    createdAt: Date;
}

const stockMovementSchema = new Schema<IStockMovement>(
    {
        _id: { type: String },
        restaurantId: { type: String, required: true, ref: "Restaurant" },
        productId: { type: String, required: true, ref: "Product" },
        quantity: { type: Number, required: true },
        reason: { type: String },
        createdBy: { type: String, required: true, ref: "User" },
        createdAt: { type: Date, required: true, default: () => new Date() },
    },
    { collection: "stock_movement" }
);

export const StockMovement = model<IStockMovement>("StockMovement", stockMovementSchema);
StockMovement.collection.createIndex({ restaurantId: 1, productId: 1, createdAt: -1 }).catch(() => { });
