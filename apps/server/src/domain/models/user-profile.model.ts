import { Schema, model } from "mongoose";

export type UserRole = "SUPER_ADMIN" | "ADMIN" | "OWNER" | "USER";

export interface IUserProfile
{
    _id: string; // same as auth User._id
    role: UserRole;
    // For OWNER role
    managedRestaurantIds?: string[];
    createdAt: Date;
    updatedAt: Date;
}

const userProfileSchema = new Schema<IUserProfile>(
    {
        _id: { type: String },
        role: { type: String, enum: ["SUPER_ADMIN", "ADMIN", "OWNER", "USER"], required: true },
        managedRestaurantIds: { type: [String], default: [] },
        createdAt: { type: Date, required: true, default: () => new Date() },
        updatedAt: { type: Date, required: true, default: () => new Date() },
    },
    { collection: "user_profile" }
);

userProfileSchema.pre("save", function (next)
{
    this.updatedAt = new Date();
    next();
});

export const UserProfile = model<IUserProfile>("UserProfile", userProfileSchema);
