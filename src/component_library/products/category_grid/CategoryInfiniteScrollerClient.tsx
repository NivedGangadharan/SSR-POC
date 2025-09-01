"use client";
import React, { useEffect, useRef, useState, useTransition } from "react";
import { Box, Button, Card, CardMedia, CardContent, CardActions, Typography, CircularProgress } from "@mui/material";
import Link from "next/link";
import AddToCartButton from "@/component_library/cart/AddToCartButton";
import { getProducts } from "@/core_components/services/productsService";

type Product = {
    id: number;
    name: string;
    imageUrl?: string;
    additionalImageUrls?: string[];
    price?: { current?: { value?: number; text?: string | null } };
};

type LoadMoreResult = { products: Product[]; itemCount: number | null };
type Props = {
    startPage: number;
    limit: number;
    categoryId: number;
    isSignedIn: boolean;
    loadMore: (page: number, limit: number) => Promise<LoadMoreResult>;
};

export default function CategoryInfiniteScrollerClient({ startPage, limit, isSignedIn, categoryId }: Props) {
    const [page, setPage] = useState(startPage + 1);
    const [items, setItems] = useState<Product[]>([]);
    const [hasMore, setHasMore] = useState(true);
    const [isPending, startTransition] = useTransition();
    const sentinelRef = useRef<HTMLDivElement | null>(null);

    async function loadMore(nextPage: number, nextLimit: number) {
        const res = await getProducts(categoryId, nextLimit, nextPage);
        return {
            products: res.products,
            itemCount: typeof res.itemCount === "number" ? res.itemCount : null,
        };
    }

    useEffect(() => {
        const el = sentinelRef.current;
        if (!el) return;
        const io = new IntersectionObserver((entries) => {
            const entry = entries[0];
            if (entry.isIntersecting && hasMore && !isPending) {
                startTransition(() => {
                    loadMore(page, limit)
                        .then((data) => {
                            const newItems: Product[] = data.products ?? [];
                            setItems((prev) => [...prev, ...newItems]);
                            const total = typeof data.itemCount === "number" ? data.itemCount : null;
                            if (total !== null) {
                                const shown = page * limit;
                                setHasMore(shown < total);
                            } else {
                                setHasMore(newItems.length === limit);
                            }
                            setPage((p) => p + 1);
                        })
                        .catch(() => setHasMore(false));
                });
            }
        }, { rootMargin: "200px 0px" });
        io.observe(el);
        return () => io.disconnect();
    }, []);

    return (
        <>
            {items.map((p) => {
                const img = p.imageUrl ?? p.additionalImageUrls?.[0] ?? "/next.svg";
                const priceText = p.price?.current?.text ?? "";
                return (
                    <Card key={`client-${p.id}`}>
                        <CardMedia component="img" image={img} alt={p.name} height={220} sx={{ objectFit: "cover" }} />
                        <CardContent>
                            <Typography variant="subtitle1" noWrap>{p.name}</Typography>
                            {priceText && (
                                <Typography variant="body2" color="text.secondary">{priceText}</Typography>
                            )}
                        </CardContent>
                        <CardActions>
                            <Link href={`/product/${p.id}`}>
                                <Button component="a" color="secondary" size="small">View</Button>
                            </Link>
                            <AddToCartButton
                                id={p.id}
                                name={p.name}
                                imageUrl={p.imageUrl ?? p.additionalImageUrls?.[0]}
                                priceValue={p.price?.current?.value}
                                priceText={p.price?.current?.text ?? undefined}
                                isSignedIn={isSignedIn}
                                label="Add"
                                size="small"
                                variant="text"
                            />
                        </CardActions>
                    </Card>
                );
            })}
            <div ref={sentinelRef} />
            {isPending && (
                <Box sx={{ display: 'flex', position: 'absolute', bottom: -50, justifyContent: 'center', py: 2, width: '100%' }}>
                    <CircularProgress size={24} thickness={5} sx={{ color: '#fff' }} />
                </Box>
            )}
            {!hasMore && (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                    <Button size="small" disabled>No more items</Button>
                </Box>
            )}
        </>
    );
}
