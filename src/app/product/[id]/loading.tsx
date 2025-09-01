import React from "react";
import { Box, Card, CardContent, Skeleton } from "@mui/material";

const DetailedProductLoading = () => {
    return (
        <Box sx={{ display: 'grid', placeContent: 'center', height: '90dvh' }}>
            <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
                <Card sx={{ maxWidth: 900, width: "100%", display: "flex", gap: 2 }}>
                    <Skeleton variant="rectangular" width={400} height={500} />
                    <CardContent sx={{ flex: 1 }}>
                        <Skeleton height={40} width="60%" />
                        <Skeleton height={30} width="30%" sx={{ mt: 1 }} />
                        <Skeleton height={20} width="90%" sx={{ mt: 2 }} />
                        <Skeleton height={20} width="80%" sx={{ mt: 1 }} />
                        <Skeleton height={48} width={360} sx={{ mt: 3 }} />
                    </CardContent>
                </Card>
            </Box>
        </Box>
    );
};

export default DetailedProductLoading;