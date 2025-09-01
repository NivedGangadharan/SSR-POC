"use client";
import React from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import muiTheme from "./muiTheme";

export default function ThemeProviderClient({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider theme={muiTheme}>
            <CssBaseline />
            {children}
        </ThemeProvider>
    );
}
