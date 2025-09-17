"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/table";
import { trpc } from "@/utils/trpc";
import { useForm } from "@tanstack/react-form";
import { skipToken, useMutation, useQuery } from "@tanstack/react-query";
import * as React from "react";
import { toast } from "sonner";

export default function POSPage()
{
    const myRestaurants = useQuery(trpc.owner.myRestaurants.queryOptions());
    const [ordersRestaurantId, setOrdersRestaurantId] = React.useState<string>("");
    const myOrders = useQuery(
        trpc.orders.myOrders.queryOptions(
            ordersRestaurantId ? { restaurantId: ordersRestaurantId } : skipToken,
        ),
    );

    const createPOSOrder = useMutation(trpc.orders.createPOSOrder.mutationOptions());

    const form = useForm({
        defaultValues: {
            restaurantId: "",
            productId: "",
            quantity: 1,
            notes: "",
        },
        onSubmit: async ({ value }) =>
        {
            await createPOSOrder.mutateAsync({
                restaurantId: value.restaurantId,
                items: [{ productId: value.productId, quantity: Number(value.quantity) }],
                notes: value.notes,
            }).then(() =>
            {
                toast.success("Order created");
                myOrders.refetch();
            }).catch((e) => toast.error(e.message));
        },
    });

    return (
        <div className="p-4 space-y-6">
            <h1 className="text-2xl font-semibold">POS</h1>
            <div className="grid md:grid-cols-2 gap-6">
                <form onSubmit={(e) => { e.preventDefault(); e.stopPropagation(); form.handleSubmit(); }} className="grid grid-cols-2 gap-3">
                    <form.Field name="restaurantId">{(field) => (
                        <div className="space-y-1 col-span-2">
                            <Label htmlFor={field.name}>Restaurant</Label>
                            <select id={field.name} className="h-9 rounded-md border px-2 bg-background" value={field.state.value} onChange={(e) => field.handleChange(e.target.value)}>
                                <option value="">Select...</option>
                                {(myRestaurants.data ?? []).map((r: any) => (
                                    <option key={r._id} value={r._id}>{r.name}</option>
                                ))}
                            </select>
                        </div>
                    )}</form.Field>
                    <form.Field name="productId">{(field) => (
                        <div className="space-y-1">
                            <Label htmlFor={field.name}>Product ID</Label>
                            <Input id={field.name} value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} />
                        </div>
                    )}</form.Field>
                    <form.Field name="quantity">{(field) => (
                        <div className="space-y-1">
                            <Label htmlFor={field.name}>Qty</Label>
                            <Input id={field.name} type="number" value={String(field.state.value)} onChange={(e) => field.handleChange(Number(e.target.value))} />
                        </div>
                    )}</form.Field>
                    <form.Field name="notes">{(field) => (
                        <div className="space-y-1 col-span-2">
                            <Label htmlFor={field.name}>Notes</Label>
                            <Input id={field.name} value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} />
                        </div>
                    )}</form.Field>
                    <div className="col-span-2">
                        <form.Subscribe>{(s) => (
                            <Button type="submit" disabled={!s.canSubmit || s.isSubmitting}>
                                {s.isSubmitting ? "Placing..." : "Place Order"}
                            </Button>
                        )}</form.Subscribe>
                    </div>
                </form>

                <div>
                    <div className="flex items-end justify-between mb-2 gap-2">
                        <h2 className="text-lg font-medium">My Orders</h2>
                        <div className="space-y-1">
                            <Label htmlFor="ordersRestaurant">Filter by Restaurant</Label>
                            <select
                                id="ordersRestaurant"
                                className="h-9 rounded-md border px-2 bg-background"
                                value={ordersRestaurantId}
                                onChange={(e) => setOrdersRestaurantId(e.target.value)}
                            >
                                <option value="">All</option>
                                {(myRestaurants.data ?? []).map((r: any) => (
                                    <option key={r._id} value={r._id}>{r.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <Table>
                        <THead>
                            <TR>
                                <TH>ID</TH>
                                <TH>Status</TH>
                                <TH>Total</TH>
                            </TR>
                        </THead>
                        <TBody>
                            {(myOrders.data ?? []).map((o: any) => (
                                <TR key={o._id}>
                                    <TD>{o._id}</TD>
                                    <TD>{o.status}</TD>
                                    <TD>{o.total}</TD>
                                </TR>
                            ))}
                        </TBody>
                    </Table>
                </div>
            </div>
        </div>
    )
}
