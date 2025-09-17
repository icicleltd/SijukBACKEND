"use client"

import { Button } from "@/components/ui/button"
import { IconLock } from "@tabler/icons-react"
import Link from "next/link"

export function NotAuthorized()
{
    return (
        <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
            <IconLock className="text-muted-foreground" />
            <h2 className="text-xl font-semibold">You don&#39;t have access to this page</h2>
            <p className="text-muted-foreground max-w-md">
                Please switch to a role with permission or return to the dashboard.
            </p>
            <Button asChild>
                <Link href="/dashboard">Back to Dashboard</Link>
            </Button>
        </div>
    )
}
