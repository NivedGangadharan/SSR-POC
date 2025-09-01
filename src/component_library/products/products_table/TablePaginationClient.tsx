"use client";
import React from "react";
import { TablePagination, LinearProgress, Box } from "@mui/material";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { encodeSearchTerm } from "@/core_components/utils/searchCodec";

type Props = {
    page: number;
    limit: number;
    count: number;
    basePath: string;
    rowsPerPageOptions?: number[];
    query?: Record<string, string | number | boolean | undefined>;
};

export default function TablePaginationClient({ page, limit, count, basePath, rowsPerPageOptions = [10, 20, 50, 100], query = {} }: Props) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const pageZero = Math.max(0, page - 1);

    const push = (p: number, l: number) => {
        const params = new URLSearchParams();
        params.set("page", String(p));
        params.set("limit", String(l));
        for (const [k, v] of Object.entries(query)) {
            if (v === undefined) continue;
            // don't overwrite page/limit if someone passed them in query
            if (k === "page" || k === "limit") continue;
            if (k === "q") {
                const raw = String(v);
                const enc = encodeSearchTerm(raw);
                if (enc) params.set(k, enc);
            } else {
                params.set(k, String(v));
            }
        }
        const url = `${basePath}?${params.toString()}`;
        startTransition(() => { router.push(url); });
    };

    return (
        <Box sx={{ position: 'relative', width: '100%' }}>
            {isPending && <LinearProgress sx={{ position: 'absolute', left: 0, right: 0, top: -6, height: 2, backgroundColor: 'white' }} />}
            <TablePagination
                component="div"
                count={Math.max(0, count)}
                page={pageZero}
                rowsPerPage={limit}
                onPageChange={(_, newPageZero) => {
                    const newPage = newPageZero + 1;
                    push(newPage, limit);
                }}
                onRowsPerPageChange={(e) => {
                    const nextLimit = parseInt(e.target.value, 10) || limit;
                    const indexStart = pageZero * limit; // 0-based index of first item on current page
                    const newPageZero = Math.ceil(indexStart / nextLimit);
                    push(newPageZero + 1, nextLimit);
                }}
                rowsPerPageOptions={rowsPerPageOptions}
            />
        </Box>
    );
}
