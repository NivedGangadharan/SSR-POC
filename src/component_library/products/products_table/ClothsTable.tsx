import React from "react";
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Link as MuiLink, Typography, Box } from "@mui/material";
import Link from "next/link";
import type { GetProductsResponseModel, ProductSummary } from "@/core_components/models/response/getProductsResponseModel";
import { getProducts, type ProductSort } from "@/core_components/services/productsService";
import { redirect } from "next/navigation";
import TablePaginationClient from "@/component_library/products/products_table/TablePaginationClient";
import FeatureGate from "@/core_components/feature_flags/FeatureGate";
import PriceSortClient from "@/component_library/products/products_table/PriceSortClient";
import SearchBoxClient from "./SearchBoxClient";
import { encodeSearchTerm } from "@/core_components/utils/searchCodec";

type Props = { categoryId: number; page: number; limit: number; basePath: string; sort: ProductSort; q?: string };

export default async function ClothsTable({ categoryId, page, limit, basePath, sort, q }: Props) {
    const data: GetProductsResponseModel = await getProducts(categoryId, limit, page, sort, q);
    const totalItems = typeof data.itemCount === "number" ? data.itemCount : undefined;
    const hasNext = typeof totalItems === "number" ? page * limit < totalItems : (data.products?.length ?? 0) === limit;
    if (totalItems && page > Math.ceil(totalItems / limit)) {
        const params = new URLSearchParams({ page: String(Math.ceil(totalItems / limit)), limit: String(limit), sort: String(sort) });
        if (q) params.set('q', encodeSearchTerm(q));
        redirect(`${basePath}?${params.toString()}`);
    }
    const products: ProductSummary[] = data.products;
    return (
        <>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, gap: 2, flexWrap: 'wrap' }}>
                <Typography variant="h5">Category {data.categoryName ?? categoryId}</Typography>
                <SearchBoxClient basePath={basePath} limit={limit} sort={sort} q={q} />
            </Box>
            <TableContainer sx={{ position: 'relative' }} component={Paper}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Image</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell><PriceSortClient sort={sort} basePath={basePath} limit={limit} q={q} /></TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {products.map((p) => {
                            const img = p.imageUrl ?? p.additionalImageUrls?.[0] ?? "/next.svg";
                            const priceText = p.price?.current?.text ?? "";
                            return (
                                <TableRow key={p.id} hover>
                                    <TableCell>
                                        <Box component="img" src={img} alt={p.name} sx={{ width: 56, height: 56, objectFit: "cover", borderRadius: 1 }} />
                                    </TableCell>
                                    <TableCell sx={{ maxWidth: 420 }}>
                                        <Typography variant="body2" noWrap>{p.name}</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" color="text.secondary">{priceText}</Typography>
                                    </TableCell>
                                    <TableCell align="right">
                                        <MuiLink component={Link} href={`/product/${p.id}`} underline="hover" color="secondary.main">View</MuiLink>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
            <FeatureGate flag="table_pagination">
                <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
                    <TablePaginationClient
                        page={page}
                        count={totalItems ?? page * limit + (hasNext ? limit : 0)}
                        limit={limit}
                        basePath={basePath}
                        query={{ sort, ...(q ? { q } : {}) }}
                        rowsPerPageOptions={[10, 20, 50, 100]}
                    />
                </Box>
            </FeatureGate>
        </>
    );
}
