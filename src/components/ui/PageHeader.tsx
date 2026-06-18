import type { ReactNode } from "react";

export const PageHeader = ({ children }: { children: ReactNode }) => {
    return (
        <div style={{ padding: "1rem 2rem" }}>
            {children}
        </div>
    );
};