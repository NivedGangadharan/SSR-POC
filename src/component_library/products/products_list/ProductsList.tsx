import { getProducts } from "@/core_components/services/productsService";
import { Card, CardMedia, CardContent, CardActions, Button, Typography, Box } from "@mui/material";
import type { GetProductsResponseModel } from "@/core_components/models/response/getProductsResponseModel";
import { JSX } from "react";
import Link from "next/link";
import PaginationControlsClient from "./PaginationControlsClient";
import { redirect } from "next/navigation";
import AddToCartButton from "@/component_library/cart/AddToCartButton";
import { getSession } from "@/core_components/auth/getSession";

type Props = {
    categoryId: number;
    limit?: number;
    page?: number;
    showCategoryName?: boolean;
};

export default async function ProductsList({ limit = 12, page = 1, categoryId, showCategoryName }: Props): Promise<JSX.Element> {
    const session = await getSession();
    const data: GetProductsResponseModel = await getProducts(categoryId, limit, page);
    const totalItems = typeof data.itemCount === "number" ? data.itemCount : undefined;
    const hasNext = typeof totalItems === "number" ? page * limit < totalItems : (data.products?.length ?? 0) === limit;
    if (totalItems && page > Math.ceil(totalItems / limit)) {
        redirect(`/categories/${categoryId}?page=${Math.ceil(totalItems / limit)}&limit=${limit}`)
    }
    return (
        <Box mb={10}>
            {showCategoryName && data.categoryName && (
                <Typography variant="h5" sx={{ mb: 2 }}>{data.categoryName}</Typography>
            )}
            <Box
                sx={{
                    display: "grid",
                    gap: 3,
                    gridTemplateColumns: {
                        xs: "repeat(1, 1fr)",
                        sm: "repeat(2, 1fr)",
                        md: "repeat(3, 1fr)",
                        lg: "repeat(4, 1fr)",
                    },
                }}
            >
                {data.products.map((p) => {
                    const img = p.imageUrl ?? p.additionalImageUrls?.[0] ?? "/next.svg";
                    const priceText = p.price?.current?.text ?? "";

                    return (
                        <Card key={p.id}>
                            <CardMedia
                                component="img"
                                image={img}
                                alt={p.name}
                                height={220}
                                sx={{ objectFit: "cover" }}
                            />
                            <CardContent>
                                <Typography variant="subtitle1" noWrap>
                                    {p.name}
                                </Typography>
                                {priceText && (
                                    <Typography variant="body2" color="text.secondary">
                                        {priceText}
                                    </Typography>
                                )}
                            </CardContent>
                            <CardActions>
                                <Link href={`/product/${p.id}`}>
                                    <Button component="a" color="secondary" size="small">
                                        View
                                    </Button>
                                </Link>
                                <AddToCartButton
                                    id={p.id}
                                    name={p.name}
                                    imageUrl={p.imageUrl ?? p.additionalImageUrls?.[0]}
                                    priceValue={p.price?.current?.value}
                                    priceText={p.price?.current?.text}
                                    isSignedIn={!!session}
                                    label="Add"
                                    size="small"
                                    variant="text"
                                />
                            </CardActions>
                        </Card>
                    );
                })}
            </Box>

            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                <PaginationControlsClient
                    page={page}
                    count={totalItems ?? page * limit + (hasNext ? 1 : 0) * limit}
                    limit={limit}
                    basePath={`/categories/${categoryId}`}
                />
            </Box>
        </Box>
    );
}
