import React from "react";
import ClientFeatureFlagsProvider from "@/core_components/feature_flags/FeatureFlagsProvider";
import { getFeatureFlags } from "@/core_components/services/featureFlagServices";

// Server component wrapper: fetch flags on the server, then hydrate a client context.
export default async function FeatureFlagsServerProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    let flags: Record<string, boolean> = {};
    try {
        flags = await getFeatureFlags();
        console.log(flags)
    } catch {
        // Keep empty flags on error (network, rate limits, etc.)
    }

    return (
        <ClientFeatureFlagsProvider initialFlags={flags}>
            {children}
        </ClientFeatureFlagsProvider>
    );
}
