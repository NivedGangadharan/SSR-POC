import { Box, Card, CardMedia, CardContent, CardActions, Button, Typography, Stack, Divider } from "@mui/material";
import Link from "next/link";
import { getProducts } from "@/core_components/services/productsService";
import type { GetProductsResponseModel, ProductSummary } from "@/core_components/models/response/getProductsResponseModel";
import AddToCartButton from "@/component_library/cart/AddToCartButton";
import { getSession } from "@/core_components/auth/getSession";

type Props = { categories: number[]; limit?: number };

export default async function MultiCategoriesList({ categories, limit = 12 }: Props) {
    const session = await getSession();
    const dataByCategory: Array<{ id: number; data: GetProductsResponseModel }> = [];
    for (const cid of categories) {
        const data = await getProducts(cid, limit, 1);
        dataByCategory.push({ id: cid, data });
    }

    return (
        <Stack spacing={4}>
            {dataByCategory.map(({ id, data }) => (
                <Box key={id}>
                    <Stack direction="row" alignItems="baseline" justifyContent="space-between" sx={{ mb: 1 }}>
                        <Typography variant="h6">{data.categoryName}</Typography>
                        <Button component={Link} href={`/categories/${id}`} size="small" color="secondary">See more</Button>
                    </Stack>
                    <Divider sx={{ mb: 2 }} />
                    <Box sx={{
                        display: "grid",
                        gap: 3,
                        gridTemplateColumns: { xs: "repeat(1, 1fr)", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)", lg: "repeat(4, 1fr)" },
                    }}>
                        {data.products.map((p: ProductSummary) => {
                            const img = p.imageUrl ?? p.additionalImageUrls?.[0] ?? "/next.svg";
                            const priceText = p.price?.current?.text ?? "";
                            return (
                                <Card key={`${id}-${p.id}`}>
                                    <CardMedia component="img" image={img} alt={p.name} height={220} sx={{ objectFit: "cover" }} />
                                    <CardContent>
                                        <Typography variant="subtitle1" noWrap>{p.name}</Typography>
                                        {priceText && <Typography variant="body2" color="text.secondary">{priceText}</Typography>}
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
                    </Box>
                </Box>
            ))}
        </Stack>
    );
}
