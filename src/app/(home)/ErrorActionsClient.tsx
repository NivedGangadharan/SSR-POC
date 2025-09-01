"use client";
import React from "react";

export default function ErrorActionsClient({ reset }: { reset: () => void }) {
    return (
        <div>
            <button
                onClick={() => {
                    // Client-side logging for diagnostics
                    console.info("User triggered retry/reset from error UI");
                    reset();
                }}
            >
                Try again
            </button>
        </div>
    );
}
