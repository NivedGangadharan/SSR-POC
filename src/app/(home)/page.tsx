import { Suspense } from "react";
import { Container, Typography } from "@mui/material";
import { JSX } from "react";
import ProductsList from "@/component_library/products/products_list/ProductsList";
import ProductListLoading from "@/component_library/products/products_list/productListLoading";

type SearchParams = Record<string, string | string[] | undefined>;
type Props = { searchParams?: SearchParams | Promise<SearchParams> };

export default async function Home({ searchParams }: Props): Promise<JSX.Element> {
  const awaited = await searchParams;
  const pageRaw = awaited?.page;
  const pageParam = typeof pageRaw === "string" ? pageRaw : Array.isArray(pageRaw) ? pageRaw?.[0] : undefined;
  const page = Number(pageParam) > 0 ? Number(pageParam) : 1;
  const limitRaw = awaited?.limit;
  const limitParam = typeof limitRaw === "string" ? limitRaw : Array.isArray(limitRaw) ? limitRaw?.[0] : undefined;
  const limit = Number(limitParam) > 0 && Number(limitParam) <= 48 ? Number(limitParam) : 12;

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" fontWeight={800} my={4} gutterBottom>
        New Collections
      </Typography>

      <Suspense fallback={<ProductListLoading />}>
        <ProductsList page={page} limit={limit} categoryId={4209} />
      </Suspense>
    </Container>
  );
}
