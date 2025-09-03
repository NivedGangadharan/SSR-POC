import { Container } from "@mui/material";
import MultiCategoriesList from "@/component_library/products/multi_categories/MultiCategoriesList";
import { Suspense } from "react";
import ProductListLoading from "@/component_library/products/products_list/productListLoading";

export default async function CategoriesPage() {
    const categories = [51569, 17565, 17184];
    return (
        <Container sx={{ py: 4 }}>
            <Suspense fallback={<ProductListLoading />}>
                <MultiCategoriesList categories={categories} limit={12} />
            </Suspense>
        </Container>
    );
}
