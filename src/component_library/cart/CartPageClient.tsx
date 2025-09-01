"use client";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/core_components/state/store";
import { removeItem, setQty, clearCart } from "@/core_components/state/cartSlice";
import { Box, Button, Card, CardContent, CardMedia, IconButton, Stack, Typography, Divider, LinearProgress } from "@mui/material";
import Link from "next/link";
import { useTransition } from "react";

export default function CartPageClient() {
    const items = useSelector((s: RootState) => s.cart.items);
    const dispatch = useDispatch();
    const [isPending, startTransition] = useTransition();
    const [hydrated, setHydrated] = useState(false);
    useEffect(() => setHydrated(true), []);

    const total = items.every(i => typeof i.priceValue === "number")
        ? items.reduce((sum, i) => sum + (i.priceValue || 0) * i.qty, 0)
        : null;

    if (!hydrated) {
        return (
            <Box sx={{ minHeight: '30dvh' }}>
                <LinearProgress sx={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1300, height: 2, backgroundColor: 'gray' }} />
            </Box>
        );
    }

    if (items.length === 0) {
        return (
            <Box sx={{ display: 'grid', placeItems: 'center', minHeight: '70dvh', px: 2 }}>
                {isPending && <LinearProgress sx={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1300, height: 2 }} />}
                <Stack spacing={2} alignItems="center">
                    <Typography variant="h6">Your cart is empty</Typography>
                    <Button component={Link} href="/" variant="contained">Browse products</Button>
                </Stack>
            </Box>
        );
    }

    return (
        <Box sx={{ maxWidth: 900, mx: 'auto', px: 2, py: 3 }}>
            {isPending && <LinearProgress sx={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1300, height: 2 }} />}
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Typography variant="h5">Your cart</Typography>
                <Button color="warning" onClick={() => startTransition(() => { dispatch(clearCart()); })}>Clear cart</Button>
            </Stack>
            <Stack spacing={2}>
                {items.map(item => (
                    <Card key={item.id} sx={{ display: 'flex', p: 1 }}>
                        {item.imageUrl && (
                            <CardMedia component="img" image={item.imageUrl} alt={item.name} sx={{ width: 96, height: 96, objectFit: 'cover', borderRadius: 1 }} />
                        )}
                        <CardContent sx={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr auto', gap: 1, alignItems: 'center' }}>
                            <Stack spacing={0.5}>
                                <Typography component={Link} href={`/product/${item.id}`} color="inherit" sx={{ textDecoration: 'none' }}>
                                    {item.name}
                                </Typography>
                                {item.priceText && (
                                    <Typography variant="body2" color="text.secondary">{item.priceText}</Typography>
                                )}
                                {!item.priceText && typeof item.priceValue === 'number' && (
                                    <Typography variant="body2" color="text.secondary">${'{'}item.priceValue.toFixed(2){'}'}</Typography>
                                )}
                            </Stack>

                            <Stack direction="row" spacing={1} alignItems="center">
                                <IconButton aria-label="decrease" onClick={() => startTransition(() => { dispatch(setQty({ id: item.id, qty: Math.max(0, item.qty - 1) })); })}>
                                    −
                                </IconButton>
                                <Typography minWidth={24} textAlign="center">{item.qty}</Typography>
                                <IconButton aria-label="increase" onClick={() => startTransition(() => { dispatch(setQty({ id: item.id, qty: item.qty + 1 })); })}>
                                    +
                                </IconButton>
                                <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
                                <Button color="error" onClick={() => startTransition(() => { dispatch(removeItem({ id: item.id })); })}>Remove</Button>
                            </Stack>
                        </CardContent>
                    </Card>
                ))}
            </Stack>

            <Divider sx={{ my: 2 }} />

            <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'stretch', sm: 'center' }} gap={2}>
                <Stack>
                    <Typography variant="subtitle2" color="text.secondary">Total</Typography>
                    {total !== null ? (
                        <Typography variant="h6">{total.toFixed(2)}</Typography>
                    ) : (
                        <Typography variant="body2" color="text.secondary">Total unavailable for some items</Typography>
                    )}
                </Stack>
                <Button variant="contained" size="large" disabled>Checkout</Button>
            </Stack>
        </Box>
    );
}
