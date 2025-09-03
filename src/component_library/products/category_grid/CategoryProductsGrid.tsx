import { Box, Card, CardMedia, CardContent, CardActions, Button, Typography } from "@mui/material";
import Link from "next/link";
import { getProducts } from "@/core_components/services/productsService";
import type { GetProductsResponseModel } from "@/core_components/models/response/getProductsResponseModel";
import AddToCartButton from "@/component_library/cart/AddToCartButton";
import { getSession } from "@/core_components/auth/getSession";
import { redirect } from "next/navigation";
import CategoryInfiniteScrollerClient from "./CategoryInfiniteScrollerClient";

type Props = {
    categoryId: number;
    page?: number;
    limit?: number;
    showCategoryName?: boolean;
};

export default async function CategoryProductsGrid({ categoryId, page = 1, limit = 12, showCategoryName }: Props) {
    const session = await getSession();
    const data: GetProductsResponseModel = await getProducts(categoryId, limit, page);
    const totalItems = typeof data.itemCount === "number" ? data.itemCount : undefined;

    if (totalItems && page > Math.ceil(totalItems / limit)) {
        redirect(`/categories/${categoryId}?page=${Math.ceil(totalItems / limit)}&limit=${limit}`);
    }

    return (
        <Box mb={10}>
            {showCategoryName && data.categoryName && (
                <Typography variant="h5" sx={{ mb: 2 }}>{data.categoryName}</Typography>
            )}
            <Box sx={{
                display: "grid",
                gap: 3,
                position: 'relative',
                gridTemplateColumns: { xs: "repeat(1, 1fr)", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)", lg: "repeat(4, 1fr)" },
            }}>
                {data.products.map((p) => {
                    const img = p.imageUrl ?? p.additionalImageUrls?.[0] ?? "/next.svg";
                    const priceText = p.price?.current?.text ?? "";
                    return (
                        <Card key={p.id}>
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
                {/* Infinite scroller appends more items below */}
                <CategoryInfiniteScrollerClient categoryId={categoryId} startPage={page} limit={limit} isSignedIn={!!session} />
            </Box>
        </Box>
    );
}
