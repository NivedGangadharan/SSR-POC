/**
 * URL-safe Base64 encode/decode helpers for search terms.
 * Encodes to Base64 and makes it URL-safe by replacing +/ with -_ and stripping padding.
 */

export function encodeSearchTerm(raw: string): string {
    const input = (raw ?? "").trim();
    if (!input) return "";
    try {
        let b64: string;
        if (typeof window !== "undefined" && typeof window.btoa === "function") {
            // encode to UTF-8 before btoa
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore - unescape/escape purposely used for UTF-8 conversion for btoa/atob
            b64 = window.btoa(unescape(encodeURIComponent(input)));
        } else {
            // Node.js / server
            b64 = Buffer.from(input, "utf-8").toString("base64");
        }
        return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
    } catch {
        return "";
    }
}

export function decodeSearchTerm(encoded: string | undefined): string | undefined {
    const val = (encoded ?? "").trim();
    if (!val) return undefined;
    try {
        // restore to standard base64
        const norm = val.replace(/-/g, "+").replace(/_/g, "/");
        const padLen = norm.length % 4 === 0 ? 0 : 4 - (norm.length % 4);
        const b64 = norm + "=".repeat(padLen);
        let out: string;
        if (typeof window !== "undefined" && typeof window.atob === "function") {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore - unescape/escape purposely used for UTF-8 conversion for btoa/atob
            out = decodeURIComponent(escape(window.atob(b64)));
        } else {
            out = Buffer.from(b64, "base64").toString("utf-8");
        }
        const trimmed = out.trim();
        return trimmed ? trimmed : undefined;
    } catch {
        // If it's not valid base64, fall back to using the raw value for backward compatibility
        return val || undefined;
    }
}
