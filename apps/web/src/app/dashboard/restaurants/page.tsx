"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/table";
import { trpc } from "@/utils/trpc";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export default function RestaurantsPage()
{
    const me = useQuery(trpc.me.queryOptions());
    const list = useQuery(
        trpc.admin.listRestaurants.queryOptions(undefined, {
            enabled: me.data?.role === "ADMIN" || me.data?.role === "SUPER_ADMIN",
        }),
    );
    const createOwnerAndRestaurant = useMutation(trpc.admin.createOwnerAndRestaurant.mutationOptions());

    const form = useForm({
        defaultValues: {
            ownerName: "",
            ownerEmail: "",
            ownerPassword: "",
            name: "",
            description: "",
            image: "",
            address: "",
        },
        onSubmit: async ({ value }) =>
        {
            await createOwnerAndRestaurant.mutateAsync({
                owner: { name: value.ownerName, email: value.ownerEmail, password: value.ownerPassword },
                restaurant: {
                    name: value.name,
                    description: value.description,
                    image: value.image,
                    location: { address: value.address, mapUrl: "", coordinates: { lat: 0, lng: 0 } },
                },
            }).then(() =>
            {
                toast.success("Created owner + restaurant");
                list.refetch();
            }).catch((e: any) => toast.error(e?.message ?? "Failed"));
        },
    });

    return (
        <div className="p-4 space-y-6">
            <h1 className="text-2xl font-semibold">Restaurants</h1>

            <div className="grid md:grid-cols-2 gap-6">
                {(me.data?.role === "ADMIN" || me.data?.role === "SUPER_ADMIN") && (
                    <div className="space-y-2">
                        <h2 className="text-lg font-medium">Create Owner + Restaurant</h2>
                        <form onSubmit={(e) => { e.preventDefault(); e.stopPropagation(); form.handleSubmit(); }} className="grid grid-cols-2 gap-3">
                            <div className="col-span-2 font-medium text-muted-foreground">Owner</div>
                            <form.Field name="ownerName">{(field) => (
                                <div className="space-y-1">
                                    <Label htmlFor={field.name}>Name</Label>
                                    <Input id={field.name} value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} />
                                </div>
                            )}</form.Field>
                            <form.Field name="ownerEmail">{(field) => (
                                <div className="space-y-1">
                                    <Label htmlFor={field.name}>Email</Label>
                                    <Input id={field.name} type="email" value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} />
                                </div>
                            )}</form.Field>
                            <form.Field name="ownerPassword">{(field) => (
                                <div className="space-y-1">
                                    <Label htmlFor={field.name}>Password</Label>
                                    <Input id={field.name} type="password" value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} />
                                </div>
                            )}</form.Field>

                            <div className="col-span-2 font-medium text-muted-foreground mt-2">Restaurant</div>
                            <form.Field name="name">{(field) => (
                                <div className="space-y-1">
                                    <Label htmlFor={field.name}>Name</Label>
                                    <Input id={field.name} value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} />
                                </div>
                            )}</form.Field>
                            <form.Field name="description">{(field) => (
                                <div className="space-y-1">
                                    <Label htmlFor={field.name}>Description</Label>
                                    <Input id={field.name} value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} />
                                </div>
                            )}</form.Field>
                            <form.Field name="image">{(field) => (
                                <div className="space-y-1">
                                    <Label htmlFor={field.name}>Image URL</Label>
                                    <Input id={field.name} value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} />
                                </div>
                            )}</form.Field>
                            <form.Field name="address">{(field) => (
                                <div className="space-y-1">
                                    <Label htmlFor={field.name}>Address</Label>
                                    <Input id={field.name} value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} />
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
                    </div>)}

                <div className={""}>
                    <h2 className="text-lg font-medium mb-2">All Restaurants</h2>
                    <Table>
                        <THead>
                            <TR>
                                <TH>Name</TH>
                                <TH>Owner</TH>
                                <TH>Address</TH>
                            </TR>
                        </THead>
                        <TBody>
                            {(list.data ?? []).map((r: any) => (
                                <TR key={r._id}>
                                    <TD>{r.name}</TD>
                                    <TD>{r.owner?.ownerName}</TD>
                                    <TD>{r.location?.address}</TD>
                                </TR>
                            ))}
                        </TBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}
