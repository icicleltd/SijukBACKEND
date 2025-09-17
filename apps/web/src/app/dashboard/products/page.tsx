"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/table";
import { trpc } from "@/utils/trpc";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import * as React from "react";
import { toast } from "sonner";

export default function ProductsPage()
{
    // We'll fetch owner restaurants for a select, using owner.myRestaurants
    const myRestaurants = useQuery(trpc.owner.myRestaurants.queryOptions());
    const [selectedRestaurantId, setSelectedRestaurantId] = React.useState<string>("");
    const products = useQuery(
        trpc.owner.listProducts.queryOptions(
            selectedRestaurantId ? { restaurantId: selectedRestaurantId } : undefined as any,
        ),
    );

    const createProduct = useMutation(trpc.owner.createProduct.mutationOptions());
    const adjustStock = useMutation(trpc.owner.adjustStock.mutationOptions());

    const form = useForm({
        defaultValues: {
            restaurantId: "",
            name: "",
            type: "FOOD",
            basePrice: 0,
            stock: 0,
        },
        onSubmit: async ({ value }) =>
        {
            await createProduct.mutateAsync({
                restaurantId: value.restaurantId,
                name: value.name,
                type: value.type as any,
                basePrice: Number(value.basePrice),
                stock: Number(value.stock),
            }).then(() =>
            {
                toast.success("Product created");
                products.refetch();
            }).catch((e) => toast.error(e.message));
        },
    });

    return (
        <div className="p-4 space-y-6">
            <h1 className="text-2xl font-semibold">Products</h1>

            <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <h2 className="text-lg font-medium">Create Product</h2>
                    <form onSubmit={(e) => { e.preventDefault(); e.stopPropagation(); form.handleSubmit(); }} className="grid grid-cols-2 gap-3">
                        <form.Field name="restaurantId">{(field) => (
                            <div className="space-y-1 col-span-2">
                                <Label htmlFor={field.name}>Restaurant</Label>
                                <select id={field.name} className="h-9 rounded-md border px-2 bg-background" value={field.state.value} onChange={(e) => { field.handleChange(e.target.value); setSelectedRestaurantId(e.target.value); }}>
                                    <option value="">Select...</option>
                                    {(myRestaurants.data ?? []).map((r: any) => (
                                        <option key={r._id} value={r._id}>{r.name}</option>
                                    ))}
                                </select>
                            </div>
                        )}</form.Field>
                        <form.Field name="name">{(field) => (
                            <div className="space-y-1">
                                <Label htmlFor={field.name}>Name</Label>
                                <Input id={field.name} value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} />
                            </div>
                        )}</form.Field>
                        <form.Field name="type">{(field) => (
                            <div className="space-y-1">
                                <Label htmlFor={field.name}>Type</Label>
                                <select id={field.name} className="h-9 rounded-md border px-2 bg-background" value={field.state.value} onChange={(e) => field.handleChange(e.target.value)}>
                                    <option value="FOOD">FOOD</option>
                                    <option value="BEVERAGE">BEVERAGE</option>
                                </select>
                            </div>
                        )}</form.Field>
                        <form.Field name="basePrice">{(field) => (
                            <div className="space-y-1">
                                <Label htmlFor={field.name}>Base Price</Label>
                                <Input id={field.name} type="number" step="0.01" value={String(field.state.value)} onChange={(e) => field.handleChange(Number(e.target.value))} />
                            </div>
                        )}</form.Field>
                        <form.Field name="stock">{(field) => (
                            <div className="space-y-1">
                                <Label htmlFor={field.name}>Initial Stock</Label>
                                <Input id={field.name} type="number" value={String(field.state.value)} onChange={(e) => field.handleChange(Number(e.target.value))} />
                            </div>
                        )}</form.Field>
                        <div className="col-span-2">
                            <form.Subscribe>{(s) => (
                                <Button type="submit" disabled={!s.canSubmit || s.isSubmitting}>
                                    {s.isSubmitting ? "Submitting..." : "Create"}
                                </Button>
                            )}</form.Subscribe>
                        </div>
                    </form>
                </div>

                <div>
                    <h2 className="text-lg font-medium mb-2">Products</h2>
                    <Table>
                        <THead>
                            <TR>
                                <TH>Name</TH>
                                <TH>Type</TH>
                                <TH>Price</TH>
                                <TH>Stock</TH>
                                <TH>Actions</TH>
                            </TR>
                        </THead>
                        <TBody>
                            {(products.data ?? []).map((p: any) => (
                                <TR key={p._id}>
                                    <TD>{p.name}</TD>
                                    <TD>{p.type}</TD>
                                    <TD>{p.basePrice}</TD>
                                    <TD>{p.stock}</TD>
                                    <TD>
                                        <StockAdjust productId={p._id} onDone={() => products.refetch()} />
                                    </TD>
                                </TR>
                            ))}
                        </TBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}

function StockAdjust({ productId, onDone }: { productId: string; onDone: () => void })
{
    const [qty, setQty] = React.useState<string>("");
    const adjustStockMutation = useMutation(trpc.owner.adjustStock.mutationOptions());
    const adjust = async () =>
    {
        const n = Number(qty);
        if (!Number.isInteger(n) || n === 0) return;
        await adjustStockMutation.mutateAsync({ productId, quantity: n });
        setQty("");
        onDone();
    };
    return (
        <div className="flex items-center gap-2">
            <Input className="w-24" type="number" value={qty} onChange={(e) => setQty(e.target.value)} placeholder="±qty" />
            <Button size="sm" onClick={adjust}>Apply</Button>
        </div>
    );
}
