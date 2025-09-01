import axios from "axios";

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

export async function getFeatureFlags(): Promise<FeatureFlag> {
    let lastError: unknown = undefined;
    try {
        const resp = await axios.get<unknown>(
            `https://raw.githubusercontent.com/NivedGangadharan/dummy_json/main/db.json`,
            {
                headers: { Accept: "application/json" },
                timeout: 8000,
                // Important: do not reuse the project AxiosInstance (it has RapidAPI base/headers)
                // and avoid sending any auth headers to GitHub.
                validateStatus: (s) => s >= 200 && s < 300,
            }
        );
        return normalizeFlags(resp.data);
    } catch (err) {
        lastError = err;
        // fallthrough to error below
    }

    const e = new Error("Unable to fetch feature flags from remote source");
    (e as unknown as { cause?: unknown }).cause = lastError;
    throw e;
}

const featureFlagServices = {
    getFeatureFlags,
};

export default featureFlagServices;
