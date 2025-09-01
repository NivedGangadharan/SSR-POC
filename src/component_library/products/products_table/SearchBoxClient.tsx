"use client";
import React, { useEffect, useState, useTransition, useRef } from "react";
import { Box, LinearProgress, TextField, InputAdornment, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import { useRouter } from "next/navigation";
import type { ProductSort } from "@/core_components/services/productsService";
import { encodeSearchTerm } from "@/core_components/utils/searchCodec";

type Props = {
    basePath: string;
    limit: number;
    sort: ProductSort;
    q?: string;
    debounceMs?: number;
};

export default function SearchBoxClient({ basePath, limit, sort, q = "", debounceMs = 400 }: Props) {
    const [value, setValue] = useState(q);
    const [isPending, startTransition] = useTransition();
    const router = useRouter();
    const userChangeRef = useRef(false);

    useEffect(() => {
        setValue(q);
        // Reset the flag when value comes from URL/props, so we don't push on initial mount or URL-driven changes.
        userChangeRef.current = false;
    }, [q]);

    useEffect(() => {
        // Only trigger navigation for user-initiated edits, not on first render.
        if (!userChangeRef.current) return;
        const handle = setTimeout(() => {
            const params = new URLSearchParams();
            params.set("page", "1");
            params.set("limit", String(limit));
            params.set("sort", sort);
            const trimmed = value.trim();
            if (trimmed) params.set("q", encodeSearchTerm(trimmed));
            startTransition(() => router.push(`${basePath}?${params.toString()}`));
        }, debounceMs);
        return () => clearTimeout(handle);
    }, [value, basePath, limit, sort, debounceMs, router]);

    const clear = () => {
        userChangeRef.current = true;
        setValue("");
    };

    return (
        <Box sx={{ minWidth: 260 }}>
            {isPending && (
                <LinearProgress style={{ position: "fixed", top: 0, left: 0, height: 1, backgroundColor: "white", zIndex: 10000, width: '100vw' }} />
            )}
            <TextField
                size="small"
                placeholder="Search products"
                value={value}
                onChange={(e) => {
                    userChangeRef.current = true;
                    setValue(e.target.value);
                }}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon fontSize="small" />
                        </InputAdornment>
                    ),
                    endAdornment: value ? (
                        <InputAdornment position="end">
                            <IconButton size="small" onClick={clear} aria-label="Clear">
                                <ClearIcon fontSize="small" />
                            </IconButton>
                        </InputAdornment>
                    ) : undefined,
                }}
            />
        </Box>
    );
}
