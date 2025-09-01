import { getProductById } from "@/core_components/services/productsService";
import { JSX } from "react";
import type ProductDetailResponse from "@/core_components/models/response/getProductDetailResponseModel";
import DetailedProduct from "@/component_library/products/detailed_product/detailed_product";
import { Box } from "@mui/material";

type Props = {
    params: {
        id: string;
    };
};

export default async function ProductPage(props: Props): Promise<JSX.Element> {
    const { params } = props;
    const awaitedParams = await params;
    const id = Number(awaitedParams.id);
    const product: ProductDetailResponse = await getProductById(id);

    return (
        <Box sx={{ display: 'grid', placeContent: 'center', height: '90dvh' }}>
            <DetailedProduct product={product} />
        </Box>
    );
}
