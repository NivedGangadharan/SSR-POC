import React from "react";
import { Grid, Card, CardContent, Skeleton, Box, Container } from "@mui/material";

const ProductListLoading = () => {
    const items = Array.from({ length: 12 });
    return (
        <Container sx={{ py: 4 }}>
            <Box sx={{ p: 2 }}>
                <Grid container spacing={2}>
                    {items.map((_, idx) => (
                        <Grid key={idx} size={{
                            xs: 12, sm: 6, md: 3
                        }}>
                            <Card>
                                <Skeleton variant="rectangular" height={180} />
                                <CardContent>
                                    <Skeleton height={24} width="60%" />
                                    <Skeleton height={20} width="40%" sx={{ mt: 1 }} />
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Container>
    );
};

export default ProductListLoading;