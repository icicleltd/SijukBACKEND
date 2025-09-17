import { z } from "zod";
import { Restaurant } from "../domain/models/restaurant.model";
import { UserProfile } from "../domain/models/user-profile.model";
import { auth } from "../lib/auth";
import { roleProtected, router } from "../lib/trpc";
import { newId } from "../utils/id";

const locationSchema = z.object({
    address: z.string().optional(),
    mapUrl: z.string().url().optional(),
    coordinates: z
        .object({ lat: z.number(), lng: z.number() })
        .optional(),
});

export const adminRouter = router({
    createOwnerAndRestaurant: roleProtected(["SUPER_ADMIN", "ADMIN"]).input(
        z.object({
            owner: z.object({ name: z.string().min(1), email: z.string().email(), password: z.string().min(6) }),
            restaurant: z.object({
                name: z.string().min(1),
                description: z.string().optional(),
                image: z.string().url().optional(),
                location: locationSchema.optional(),
            }),
        })
    ).mutation(async ({ input }) =>
    {
        const res = await auth.api.signUpEmail({
            body: { name: input.owner.name, email: input.owner.email, password: input.owner.password },
        });
        const ownerUser = (res as any).user; // better-auth returns {user, token}
        if (!ownerUser?.id) throw new Error("Failed to create owner account");
        await UserProfile.create({ _id: ownerUser.id, role: "OWNER", managedRestaurantIds: [], createdAt: new Date(), updatedAt: new Date() });

        const restaurantId = newId();
        const restaurantDoc = await Restaurant.create({
            _id: restaurantId,
            name: input.restaurant.name,
            description: input.restaurant.description,
            image: input.restaurant.image,
            location: input.restaurant.location,
            owner: { ownerUserId: ownerUser.id, ownerName: input.owner.name, ownerEmail: input.owner.email },
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        await UserProfile.updateOne({ _id: ownerUser.id }, { $addToSet: { managedRestaurantIds: restaurantId } });
        return { restaurant: restaurantDoc, owner: { id: ownerUser.id, email: ownerUser.email, name: ownerUser.name } };
    }),

    listRestaurants: roleProtected(["SUPER_ADMIN", "ADMIN"]).query(async () =>
    {
        return Restaurant.find({}).lean();
    }),

    updateRestaurant: roleProtected(["SUPER_ADMIN", "ADMIN"]).input(
        z.object({
            id: z.string(),
            name: z.string().optional(),
            description: z.string().optional(),
            image: z.string().url().optional(),
            isActive: z.boolean().optional(),
            location: locationSchema.optional(),
        })
    ).mutation(async ({ input }) =>
    {
        await Restaurant.updateOne({ _id: input.id }, { $set: { ...input, id: undefined, updatedAt: new Date() } });
        return Restaurant.findById(input.id).lean();
    }),
});
