'use client';

import { Box, LinearProgress, Pagination, Select, MenuItem } from "@mui/material";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

type Props = {
    page: number;
    count: number;
    limit: number;
    limits?: number[];
    basePath?: string;
};

export default function PaginationControlsClient({ page, count, limit, limits = [12, 24, 48], basePath }: Props) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const to = (p: number, l: number) => `${basePath ?? "/"}?page=${p}&limit=${l}`;
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', gap: 1 }}>
            {isPending && (
                <LinearProgress
                    sx={{ position: 'fixed', top: 0, left: 0, right: 0, width: '100%', zIndex: 1300, backgroundColor: 'gray', minHeight: '2px', height: '2px' }}
                />
            )}
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', justifyContent: 'center', width: '100%', flexWrap: 'wrap' }}>
                <Select
                    size="small"
                    value={String(limit)}
                    onChange={(e) => {
                        const nextLimit = parseInt(String(e.target.value), 10) || limit;
                        const totalPagesNext = Math.max(1, Math.ceil(Math.max(1, count) / nextLimit));
                        const indexStart = (page - 1) * limit; // 0-based index of first item on current page
                        const newPage = Math.min(
                            totalPagesNext,
                            Math.max(1, Math.floor(indexStart / nextLimit) + 1)
                        );
                        startTransition(() => { router.push(to(newPage, nextLimit)); });
                    }}
                >
                    {limits.map((l) => (
                        <MenuItem key={l} value={String(l)}>{l} / page</MenuItem>
                    ))}
                </Select>
                <Pagination
                    page={page}
                    count={Math.ceil(Math.max(1, count) / limit)}
                    color="primary"
                    onChange={(_, nextPage) => {
                        startTransition(() => { router.push(to(nextPage, limit)); });
                    }}
                />
            </Box>
        </Box>
    );
}
