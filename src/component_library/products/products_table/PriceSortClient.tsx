"use client";
import React, { useTransition } from "react";
import { TableSortLabel, LinearProgress, Box } from "@mui/material";
import { useRouter } from "next/navigation";
import type { ProductSort } from "@/core_components/services/productsService";
import { encodeSearchTerm } from "@/core_components/utils/searchCodec";

type Props = {
    sort: ProductSort;
    basePath: string;
    limit: number;
    q?: string;
};

export default function PriceSortClient({ sort, basePath, limit, q }: Props) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const direction: "asc" | "desc" = sort === "priceasc" ? "asc" : "desc";
    const active = sort === "priceasc" || sort === "pricedesc";

    const handleToggle = () => {
        const nextSort: ProductSort = sort === "priceasc" ? "pricedesc" : "priceasc";
        const params = new URLSearchParams();
        params.set("page", "1");
        params.set("limit", String(limit));
        params.set("sort", nextSort);
        if (q && q.trim()) params.set("q", encodeSearchTerm(q.trim()));
        startTransition(() => router.push(`${basePath}?${params.toString()}`));
    };

    return (
        <Box sx={{ alignItems: "center" }}>
            {isPending && (
                <LinearProgress sx={{ position: "absolute", left: 0, right: 0, top: 0, height: 2, zIndex: 100, backgroundColor: "white", width: '100%' }} />
            )}
            <TableSortLabel active={active} direction={direction} onClick={handleToggle}>
                Price
            </TableSortLabel>
        </Box>
    );
}
