export interface ProductPrice {
    value: number;
    text: string;
}

export interface ProductSummary {
    id: number;
    name: string;
    price: {
        current: ProductPrice;
        previous?: ProductPrice;
        rrp?: ProductPrice;
        lowestPriceInLast30Days?: ProductPrice;
        isMarkedDown?: boolean;
        isOutletPrice?: boolean;
        currency?: string;
        context?: null | string;
    };
    colour?: string;
    colourWayId?: number;
    brandName?: string;
    hasVariantColours?: boolean;
    hasMultiplePrices?: boolean;
    groupId?: number;
    productCode?: number;
    productType?: string;
    url?: string;
    imageUrl?: string;
    additionalImageUrls?: string[];
    videoUrl?: string;
    videoAssetId?: string;
    showVideo?: boolean;
    isSellingFast?: boolean;
}

export interface GetProductsResponseModel {
    categoryName?: string;
    itemCount?: number;
    products: ProductSummary[];
}