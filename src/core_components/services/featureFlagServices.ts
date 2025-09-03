import { revalidateTag } from "next/cache";
import { cache } from "react";

// A map of feature flags like { "shirts": true, "table_pagination": false }
export type FeatureFlag = Record<string, boolean>;

function normalizeFlags(input: unknown): FeatureFlag {
    const out: FeatureFlag = {};
    // If it's already an object map
    if (input && typeof input === "object" && !Array.isArray(input)) {
        for (const [k, v] of Object.entries(input as Record<string, unknown>)) {
            if (typeof k !== "string") continue;
            // coerce common truthy representations
            const bool = v === true || v === 1 || v === "1" || v === "true";
            out[k] = Boolean(bool);
        }
        return out;
    }
    // If it's an array of objects, merge them left-to-right
    if (Array.isArray(input)) {
        for (const item of input) {
            if (!item || typeof item !== "object") continue;
            for (const [k, v] of Object.entries(item as Record<string, unknown>)) {
                const bool = v === true || v === 1 || v === "1" || v === "true";
                out[k] = Boolean(bool);
            }
        }
        return out;
    }
    return out;
}

const FLAGS_URL = "https://raw.githubusercontent.com/NivedGanga/dummy_json/main/db.json";

// Fetch using Next.js fetch for built-in request-level deduping
async function fetchFlags(): Promise<FeatureFlag> {
    console.log("callingggg");
    const res = await fetch(FLAGS_URL, {
        // Let Next cache for 60s (ISR) and allow tag-based revalidation
        // Also enables request-level dedupe between layout and page
        next: { revalidate: 6, tags: ["feature-flags"] },
        headers: { Accept: "application/json" },
        // A small timeout via AbortController if needed could be added by callers if required
    });
    console.log("fetch completed")
    if (!res.ok) {
        // On non-2xx, treat as empty flags
        return {};
    }
    
    const data = await res.json();
    return normalizeFlags(data as unknown);
}

// React cache() dedupes within the same server render/request even if called from multiple files
export const getFeatureFlags = cache(async () => fetchFlags());

// Optional: allow manual revalidation by tag from server actions or route handlers
export function revalidateFeatureFlags() {
    revalidateTag("feature-flags");
}

const featureFlagServices = {
    getFeatureFlags,
    revalidateFeatureFlags,
};

export default featureFlagServices;
