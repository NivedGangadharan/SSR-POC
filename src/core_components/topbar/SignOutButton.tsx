"use client";
import { Button, LinearProgress } from "@mui/material";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

export default function SignOutButton() {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    return (
        <>
            {isPending && (
                <LinearProgress sx={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1300, height: 2, backgroundColor: 'gray' }} />
            )}
            <Button
                onClick={() => {
                    startTransition(async () => {
                        await fetch('/api/sign-out', { method: 'POST' });
                        router.refresh();
                    });
                }}
                size="small"
                variant="outlined"
                color="inherit"
                disabled={isPending}
            >
                Sign out
            </Button>
        </>
    );
}
