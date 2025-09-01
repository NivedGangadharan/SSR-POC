import React from "react";
import { Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Skeleton, Box, LinearProgress } from "@mui/material";

export default function Loading() {
    const rows = Array.from({ length: 8 });
    return (
        <Container sx={{ py: 4 }}>
            <LinearProgress sx={{ mb: 2 }} />
            <TableContainer component={Paper}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Image</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Price</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((_, i) => (
                            <TableRow key={i}>
                                <TableCell>
                                    <Box sx={{ width: 56, height: 56 }}>
                                        <Skeleton variant="rectangular" width={56} height={56} />
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <Skeleton width={260} />
                                </TableCell>
                                <TableCell>
                                    <Skeleton width={80} />
                                </TableCell>
                                <TableCell align="right">
                                    <Skeleton width={60} sx={{ ml: 'auto' }} />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
}