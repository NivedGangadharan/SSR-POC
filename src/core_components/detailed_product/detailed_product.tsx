import React from "react";
import { Box, Card, CardMedia, CardContent, Typography } from "@mui/material";
import ProductDetailResponse from "../models/response/getProductDetailResponseModel";
import AddToCartButton from "@/component_library/cart/AddToCartButton";
import { getSession } from "@/core_components/auth/getSession";

type Props = {
    product: ProductDetailResponse;
};

const sanitizeHtml = (html?: string) => {
    if (!html) return "";
    return html
        .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
        .replace(/on\w+=\"[^\"]*\"/gi, "")
        .replace(/on\w+=\'[^']*\'/gi, "");
};

export default async function DetailedProduct({ product }: Props) {
    const session = await getSession();
    return (
        <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
            <Card sx={{ maxWidth: 900, width: "100%", display: "flex", gap: 2 }}>
                <CardMedia
                    component="img"
                    image={product.imageUrl}
                    alt={product.name}
                    sx={{ width: 400, objectFit: "cover" }}
                />
                <CardContent sx={{ flex: 1 }}>
                    <Typography variant="h5">{product.name}</Typography>
                    {product.price?.current?.text && (
                        <Typography variant="h6" color="text.secondary" sx={{ mt: 1 }}>
                            {product.price.current.text}
                        </Typography>
                    )}
                    {product.description && (
                        <Typography variant="body1" sx={{ mt: 2, '& a': { color: 'white', textDecoration: 'none' } }} component="div" dangerouslySetInnerHTML={{ __html: sanitizeHtml(product.description) }} />
                    )}
                    <Box sx={{ mt: 3 }}>
                        <AddToCartButton
                            id={product.id ?? 0}
                            name={product.name ?? "Product"}
                            imageUrl={product.imageUrl}
                            priceValue={product.price?.current?.value ?? undefined}
                            priceText={product.price?.current?.text ?? undefined}
                            isSignedIn={!!session}
                        />
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
}
