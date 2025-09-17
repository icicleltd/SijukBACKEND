"use client";
import { trpc } from "@/utils/trpc";
import { useQuery } from "@tanstack/react-query";
import type { Route } from "next";
import Link from "next/link";

export default function AdminHome()
{
    const stats = useQuery(trpc.stats.queryOptions());
    return (
        <div className="p-4 space-y-4">
            <h1 className="text-2xl font-semibold">Admin</h1>
            <div className="flex gap-4">
                <Link href={"/dashboard/restaurants" as Route} className="underline">Restaurants</Link>
                <Link href={"/dashboard/products" as Route} className="underline">Products</Link>
                <Link href={"/dashboard/pos" as Route} className="underline">POS</Link>
            </div>
            <div>
                <p className="text-muted-foreground">Stats:</p>
                <pre className="text-xs bg-muted p-2 rounded-md">{JSON.stringify(stats.data, null, 2)}</pre>
            </div>
        </div>
    );
}
