"use client";
import React, { useTransition } from "react";
import { Box, Button, LinearProgress, Paper, Stack, Typography } from "@mui/material";
import Link from "next/link";

type Props = {
    error: Error;
    reset: () => void;
};

export default function GlobalError({ reset }: Props) {
    const [isPending, startTransition] = useTransition();
    return (
        <Box sx={{ minHeight: '70dvh', display: 'grid', placeItems: 'center', px: 2 }}>
            {isPending && (
                <LinearProgress sx={{ position: 'fixed', top: 0, left: 0, right: 0, width: '100%', zIndex: 1300, height: 2 }} />
            )}
            <Paper elevation={4} sx={{ maxWidth: 560, width: '100%', borderRadius: 3, p: 4 }}>
                <Stack spacing={2} alignItems="center" textAlign="center">
                    <Typography variant="h5">Something went wrong</Typography>
                    <Typography variant="body2" color="text.secondary">
                        We hit an unexpected error. You can retry or go back to the home page.
                    </Typography>
                    <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                        <Button
                            variant="contained"
                            onClick={() => {
                                startTransition(() => {
                                    reset();
                                });
                            }}
                            disabled={isPending}
                            aria-busy={isPending}
                        >
                            Try again
                        </Button>
                        <Button component={Link} href="/" variant="outlined" color="secondary">
                            Go home
                        </Button>
                    </Stack>
                </Stack>
            </Paper>
        </Box>
    );
}
