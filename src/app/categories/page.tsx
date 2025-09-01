import { Container } from "@mui/material";
import MultiCategoriesList from "@/component_library/products/multi_categories/MultiCategoriesList";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
    const categories = [51569, 17565, 17184];
    return (
        <Container sx={{ py: 4 }}>
            <MultiCategoriesList categories={categories} limit={12} />
        </Container>
    );
}
