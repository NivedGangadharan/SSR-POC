"use client";
import React from "react";
import { Button, LinearProgress } from "@mui/material";
import { useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { addItem } from "@/core_components/state/cartSlice";
import type { RootState } from "@/core_components/state/store";

type Props = {
    id: number;
    name: string;
    imageUrl?: string;
    priceValue?: number;
    priceText?: string;
    isSignedIn: boolean;
    label?: string;
    size?: "small" | "medium" | "large";
    variant?: "text" | "outlined" | "contained";
};

export default function AddToCartButton({ id, name, imageUrl, priceValue, priceText, isSignedIn, label = "Add to cart", size = "medium", variant = "contained" }: Props) {
    const dispatch = useDispatch();
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isPending, start] = useTransition();
    const inCart = useSelector((s: RootState) => s.cart.items.some(i => i.id === id));
    const current = React.useMemo(() => {
        const qs = searchParams?.toString();
        return qs ? `${pathname}?${qs}` : pathname;
    }, [pathname, searchParams]);
    return (
        <>
            {isPending && <LinearProgress sx={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1300, height: 2 }} />}
            <Button
                variant={variant}
                color="secondary"
                size={size}
                onClick={() => start(() => {
                    if (!isSignedIn) {
                        router.push(`/sign-in?returnUrl=${encodeURIComponent(current ?? "/")}`);
                        return;
                    }
                    Promise.resolve().then(() => {
                        dispatch(addItem({ id, name, imageUrl, priceValue, priceText }));
                    });
                })}
                disabled={isPending}
            >
                {inCart ? "Added" : label}
            </Button>
        </>
    );
}
