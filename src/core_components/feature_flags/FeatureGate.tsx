"use client";

import React from "react";
import { useFeatureFlags } from "@/core_components/feature_flags/FeatureFlagsProvider";

type Props = {
    flag: string;
    children: React.ReactNode;
    fallback?: React.ReactNode;
};

export default function FeatureGate({ flag, children, fallback = null }: Props) {
    const { isOn } = useFeatureFlags();
    return isOn(flag) ? <>{children}</> : <>{fallback}</>;
}
