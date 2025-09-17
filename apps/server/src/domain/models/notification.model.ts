import { Schema, model } from "mongoose";

export type NotificationType = "NEW_ORDER" | "LOW_STOCK";

export interface INotification
{
    _id: string;
    userId: string; // owner/admin who receives
    restaurantId?: string;
    type: NotificationType;
    title: string;
    message?: string;
    data?: Record<string, unknown>;
    read: boolean;
    createdAt: Date;
}

const notificationSchema = new Schema<INotification>(
    {
        _id: { type: String },
        userId: { type: String, required: true, ref: "User" },
        restaurantId: { type: String, ref: "Restaurant" },
        type: { type: String, enum: ["NEW_ORDER", "LOW_STOCK"], required: true },
        title: { type: String, required: true },
        message: { type: String },
        data: { type: Schema.Types.Mixed },
        read: { type: Boolean, default: false },
        createdAt: { type: Date, required: true, default: () => new Date() },
    },
    { collection: "notification" }
);

export const Notification = model<INotification>("Notification", notificationSchema);
Notification.collection.createIndex({ userId: 1, createdAt: -1 }).catch(() => { });
