"use client";

import { Toaster } from "sonner";

interface ProvidersProps {
    children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
    return (
        <>
            {children}
            <Toaster
                position="top-center"
                richColors
                closeButton
                theme="dark"
            />
        </>
    );
}
