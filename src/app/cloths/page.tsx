import { Container } from "@mui/material";
import ClothsTable from "@/component_library/products/products_table/ClothsTable";
import { decodeSearchTerm } from "@/core_components/utils/searchCodec";
import { getFeatureFlags } from "@/core_components/services/featureFlagServices";

export const dynamic = "force-dynamic";

type SearchParams = Record<string, string | string[] | undefined>;
type Props = { searchParams?: SearchParams | Promise<SearchParams> };

export default async function ClothsPage({ searchParams }: Props) {
    const categoryId = 51570;
    const awaited = await searchParams;
    const pageRaw = awaited?.page;
    const pageParam = typeof pageRaw === "string" ? pageRaw : Array.isArray(pageRaw) ? pageRaw?.[0] : undefined;
    const page = Number(pageParam) > 0 ? Number(pageParam) : 1;
    const limitRaw = awaited?.limit;
    const limitParam = typeof limitRaw === "string" ? limitRaw : Array.isArray(limitRaw) ? limitRaw?.[0] : undefined;
    const limit = Number(limitParam) > 0 && Number(limitParam) <= 100 ? Number(limitParam) : 20;
    const sortRaw = awaited?.sort;
    const sortParam = typeof sortRaw === "string" ? sortRaw : Array.isArray(sortRaw) ? sortRaw?.[0] : undefined;
    const sort = sortParam === "priceasc" || sortParam === "pricedesc" ? sortParam : "freshness";
    const qRaw = awaited?.q;
    const qParam = typeof qRaw === "string" ? qRaw : Array.isArray(qRaw) ? qRaw?.[0] : undefined;
    const q = decodeSearchTerm(qParam);

    return (
        <Container sx={{ py: 4 }}>
            <ClothsTable categoryId={categoryId} page={page} limit={limit} basePath="/cloths" sort={sort} q={q} />
        </Container>
    );
}
