export interface LocalisedEntry {
    locale: string;
    title?: string;
    pdpUrl?: string;
}

export interface ProductPrice {
    value?: number | null;
    text?: string | null;
    versionId?: string;
    conversionId?: string;
}

export interface ProductPriceSet {
    current?: ProductPrice | null;
    previous?: ProductPrice | null;
    rrp?: ProductPrice | null;
    xrp?: ProductPrice | null;
    currency?: string;
    isMarkedDown?: boolean;
    isOutletPrice?: boolean;
    startDateTime?: string | null;
    previousEndDate?: string | null;
    lowestPriceInLast30DaysValue?: number | null;
    lowestPriceInLast30DaysText?: string | null;
    lowestPriceInLast30DaysEndDate?: string | null;
    lowestPriceInLast30DaysPercentage?: number | null;
    discountPercentage?: number | null;
    context?: string | null;
    additionalContexts?: unknown[];
}

export interface BrandInfo {
    id?: number;
    name?: string;
    description?: string;
}

export interface VariantEntry {
    id?: number;
    name?: string;
    sizeId?: number;
    brandSize?: string;
    displaySizeText?: string;
    sizeOrder?: number;
    sku?: string;
    isAvailable?: boolean;
    colourWayId?: number | null;
    colour?: string;
    isPrimary?: boolean;
    isProp65Risk?: boolean;
    ean?: string;
    countryOfManufacture?: string;
    price?: ProductPriceSet;
}

export interface MediaImage {
    url?: string;
    type?: string;
    colourWayId?: number | null;
    colour?: string;
    isPrimary?: boolean;
}

export interface ProductTypeInfo {
    id?: number;
    name?: string;
}

export default interface ProductDetailResponse {
    id?: number;
    name?: string;
    description?: string;
    localisedData?: LocalisedEntry[];
    gender?: string;
    productCode?: string | number;
    pdpLayout?: string;
    brand?: BrandInfo;
    sizeGuide?: string;
    isNoSize?: boolean;
    isOneSize?: boolean;
    hasVariantsWithProp65Risk?: boolean;
    variants?: VariantEntry[];
    media?: { images?: MediaImage[] };
    info?: { aboutMe?: string; sizeAndFit?: string; careInfo?: string };
    productType?: ProductTypeInfo;
    // fields we normalize and return
    imageUrl?: string;
    additionalImageUrls?: string[];
    // convenience localized fields
    title?: string;
    pdpUrl?: string;
    // price and stock info (populated from stock/price API)
    price?: ProductPriceSet;
    isInStock?: boolean;
}

// types for the stock/price endpoint response
export interface StockVariant {
    id: number;
    isInStock?: boolean;
    isLowInStock?: boolean;
    isRestockingSoon?: boolean;
    stockLastUpdatedDate?: string;
    warehouse?: string;
    source?: { id?: string; description?: string };
    seller?: unknown | null;
    price?: ProductPriceSet | null;
}

export interface StockProduct {
    productId: number;
    productPrice?: ProductPriceSet | null;
    hasMultipleColoursInStock?: boolean;
    hasMultiplePricesInStock?: boolean;
    isInStock?: boolean;
    variants?: StockVariant[];
    isRestockingSoon?: boolean;
    restockingLeadTime?: number;
}

export type StockResponse = StockProduct[];

