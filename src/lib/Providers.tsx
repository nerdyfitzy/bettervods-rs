import { type ReactNode, useState } from "react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

export default function ReactQueryProvider({
    children,
}: {
    children: ReactNode;
}) {
    const [queryClient] = useState(() => new QueryClient());
    return (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
}
