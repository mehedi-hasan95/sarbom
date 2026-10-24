import { connection } from "next/server";
import {
  HydrationBoundary,
  dehydrate,
  noop,
  type QueryClient,
} from "@tanstack/react-query";
import type { ReactNode } from "react";
import { getQueryClient } from "@/lib/transtack-query/get-query-client";

type HydratedProps = {
  children: ReactNode;
  prefetch: (queryClient: QueryClient) => unknown;
};

export async function Hydrated({ children, prefetch }: HydratedProps) {
  await connection();

  const queryClient = getQueryClient();

  const result = prefetch(queryClient);
  if (Array.isArray(result)) {
    result.forEach((p) => void Promise.resolve(p).catch(noop));
  } else {
    void Promise.resolve(result).catch(noop);
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  );
}

// how to use
{
  /* <Hydrated prefetch={qc=>qc.query(data)}>{children}</Hydrated>
<Hydrated prefetch={qc=>[qc.query(data)]}>{children}</Hydrated> */
}
