import { Schema, model } from "mongoose";

export interface IRestaurantLocation
{
    address?: string;
    mapUrl?: string;
    coordinates?: { lat: number; lng: number };
}

export interface IRestaurantOwnerInfo
{
    ownerUserId: string; // references auth User._id
    ownerName: string;
    ownerEmail: string;
}

export interface IRestaurant
{
    _id: string;
    name: string;
    description?: string;
    image?: string;
    location?: IRestaurantLocation;
    owner: IRestaurantOwnerInfo;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const restaurantSchema = new Schema<IRestaurant>(
    {
        _id: { type: String },
        name: { type: String, required: true },
        description: { type: String },
        image: { type: String },
        location: {
            address: { type: String },
            mapUrl: { type: String },
            coordinates: {
                lat: { type: Number },
                lng: { type: Number },
            },
        },
        owner: {
            ownerUserId: { type: String, required: true, ref: "User" },
            ownerName: { type: String, required: true },
            ownerEmail: { type: String, required: true },
        },
        isActive: { type: Boolean, default: true },
        createdAt: { type: Date, required: true, default: () => new Date() },
        updatedAt: { type: Date, required: true, default: () => new Date() },
    },
    { collection: "restaurant" }
);

restaurantSchema.pre("save", function (next)
{
    this.updatedAt = new Date();
    next();
});

export const Restaurant = model<IRestaurant>("Restaurant", restaurantSchema);
Restaurant.collection.createIndex({ "owner.ownerUserId": 1 }).catch(() => { });
