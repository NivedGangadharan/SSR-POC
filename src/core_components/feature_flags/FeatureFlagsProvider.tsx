"use client";

import React, { createContext, useContext, useMemo } from "react";

export type FeatureFlags = Record<string, boolean>;

const FeatureFlagsContext = createContext<FeatureFlags>({});

export function FeatureFlagsProvider({
    initialFlags,
    children,
}: {
    initialFlags?: FeatureFlags | null;
    children: React.ReactNode;
}) {
    const value = useMemo<FeatureFlags>(() => ({ ...(initialFlags ?? {}) }), [initialFlags]);
    return <FeatureFlagsContext.Provider value={value}>{children}</FeatureFlagsContext.Provider>;
}

export function useFeatureFlags() {
    const flags = useContext(FeatureFlagsContext);
    const isOn = (name: string) => Boolean(flags?.[name]);
    return { flags, isOn };
}

export default FeatureFlagsProvider;
