import { Container } from "@mui/material";
import CategoryProductsGrid from "@/component_library/products/category_grid/CategoryProductsGrid";
import { JSX, Suspense } from "react";
import ProductListLoading from "@/component_library/products/products_list/productListLoading";

type Props = { params: { id: string }, searchParams?: { page?: string; limit?: string } };

export default async function CategoryListingPage({ params, searchParams }: Props): Promise<JSX.Element> {
  const awaitedParams = await params;
  const awaitedSearch = await searchParams;
  const id = Number(awaitedParams.id);
  const page = Number(awaitedSearch?.page ?? 1) || 1;
  const limit = Number(awaitedSearch?.limit ?? 12) || 12;
  return (
    <Container sx={{ py: 4 }}>
      <Suspense fallback={<ProductListLoading />}>
        <CategoryProductsGrid categoryId={id} page={page} limit={limit} showCategoryName />
      </Suspense>
    </Container>
  );
}
