import type { GetProductsResponseModel } from "@/core_components/models/response/getProductsResponseModel";
import type ProductDetailResponse from "@/core_components/models/response/getProductDetailResponseModel";
import type { StockResponse, ProductPriceSet } from "@/core_components/models/response/getProductDetailResponseModel";
import api from "@/core_components/services/apiService";

const API_HOST = "https://asos2.p.rapidapi.com";

export type ProductSort = "freshness" | "priceasc" | "pricedesc";

export async function getProducts(categoryId:number,limit = 12, page = 1, sort: ProductSort = "freshness", q?: string): Promise<GetProductsResponseModel> {
    const safeLimit = Math.max(1, limit);
    const offset = Math.max(0, (page - 1) * safeLimit);
    const base = `/products/v2/list?store=US&offset=${offset}&categoryId=${categoryId}&country=US&sort=${encodeURIComponent(sort)}&currency=USD&sizeSchema=US&limit=${safeLimit}&lang=en-US`;
    const url = q && q.trim() !== "" ? `${base}&q=${encodeURIComponent(q.trim())}` : base;
    const data = await api.get<GetProductsResponseModel>(url);

    data.products = data.products.map((p) => {
        const img = p.imageUrl ?? p.additionalImageUrls?.[0] ?? "/next.svg";
        let resolved = img;
        if (typeof img === "string") {
            if (img.startsWith("/")) {
                resolved = API_HOST + img;
            } else if (!img.startsWith("http")) {
                resolved = "https://" + img;
            }
        }
        return {
            ...p,
            imageUrl: resolved,
        };
    });

    return data;
}

export async function getProductById(id: number): Promise<ProductDetailResponse> {
    const url = `/products/v4/detail?id=${id}&lang=en-US&store=US&sizeSchema=US&currency=USD`;
    const data = await api.get<ProductDetailResponse>(url);
    type MediaShape = { images?: Array<{ url?: string; isPrimary?: boolean }> };
    const dataWithMedia = data as ProductDetailResponse & MediaShape;
    const mediaImages: string[] = (dataWithMedia.media?.images ?? [])
        .map((m) => m?.url)
        .filter(Boolean) as string[];

    const localesPriority = ["en-US", "en-GB"];
    const ld = data.localisedData ?? [];
    const chosenLocalised =
        ld.find((l) => localesPriority.includes(l.locale)) ??
        ld[0];
    if (chosenLocalised) {
        data.title = data.title ?? chosenLocalised.title;
        data.pdpUrl = data.pdpUrl ?? chosenLocalised.pdpUrl;
    }

    const primary =
        data.imageUrl ??
    (dataWithMedia.media?.images?.find((mi) => mi?.isPrimary === true)?.url) ??
    mediaImages[0] ??
        mediaImages[0] ??
        data.additionalImageUrls?.[0] ??
        "/next.svg";
    let resolvedPrimary = primary as string;
    if (typeof primary === "string") {
        if (primary.startsWith("/")) {
            resolvedPrimary = API_HOST + primary;
        } else if (!primary.startsWith("http")) {
            resolvedPrimary = "https://" + primary;
        }
    }
    console.log(resolvedPrimary)
    const rawAdditional = [
        ...(mediaImages ?? []),
        ...(data.additionalImageUrls ?? []),
    ];

    const additional = rawAdditional
        .filter(Boolean)
        .map((img) => {
            if (img.startsWith("/")) return API_HOST + img;
            if (!img.startsWith("http")) return "https://" + img;
            return img;
        });

    try {
        const stockUrl = `/products/v4/get-stock-price?productIds=${id}&lang=en-US&store=US&sizeSchema=US&currency=USD`;
    const stockResp = await api.get<StockResponse>(stockUrl);
    const stockForProduct = Array.isArray(stockResp) ? stockResp.find((s) => s.productId === id) : undefined;
        if (stockForProduct) {
            (data as ProductDetailResponse).price = stockForProduct.productPrice ?? undefined;
            (data as ProductDetailResponse).isInStock = Boolean(stockForProduct.isInStock) || undefined;
            if (Array.isArray(stockForProduct.variants) && Array.isArray(data.variants)) {
                const priceByVariant = new Map<number, ProductPriceSet | undefined>();
                for (const v of stockForProduct.variants) {
                    priceByVariant.set(v.id, v.price ?? undefined);
                }
                data.variants = data.variants.map((v) => {
                    if (!v) return v;
                    const pid = v.id as number | undefined;
                    if (pid !== undefined && priceByVariant.has(pid)) {
                        return { ...v, price: priceByVariant.get(pid) };
                    }
                    return v;
                });
            }
        }
    } catch {
    }

    return {
        ...data,
        imageUrl: resolvedPrimary,
        additionalImageUrls: additional,
    };
}

const productsService = {
    getProducts,
    getProductById,
};

export default productsService;
