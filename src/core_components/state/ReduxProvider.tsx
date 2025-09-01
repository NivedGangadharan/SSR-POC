"use client";
import React, { PropsWithChildren, useEffect, useMemo } from "react";
import { Provider } from "react-redux";
import { makeStore, RootState } from "./store";
import { setCart } from "./cartSlice";

type Props = PropsWithChildren<{ preloadedState?: unknown }>;

export default function ReduxProvider({ preloadedState, children }: Props) {
    const store = useMemo(() => makeStore(preloadedState), [preloadedState]);
    useEffect(() => {
        try {
            const raw = localStorage.getItem("cart:v1");
            if (raw) {
                const parsed = JSON.parse(raw);
                if (parsed && parsed.items) {
                    store.dispatch(setCart({ items: parsed.items }));
                }
            }
        } catch { }
        const unsubscribe = store.subscribe(() => {
            const state = store.getState() as RootState;
            const items = state?.cart?.items ?? [];
            try {
                localStorage.setItem("cart:v1", JSON.stringify({ items }));
            } catch { }
        });
        return () => unsubscribe();
    }, [store]);
    return <Provider store={store}>{children}</Provider>;
}
