import {
  infiniteQueryOptions,
  type InfiniteData,
  type QueryClient,
} from "@tanstack/react-query";

import {
  getMyImages,
  type ImageItem,
  type ImagesCursor,
} from "@/action/images-action";

export type ImagesPage = Awaited<ReturnType<typeof getMyImages>>;

export const imageKeys = {
  all: ["images"] as const,
  list: () => [...imageKeys.all, "list"] as const,
};

export const imagesInfiniteOptions = () =>
  infiniteQueryOptions({
    queryKey: imageKeys.list(),
    queryFn: ({ pageParam }) => getMyImages(pageParam),
    initialPageParam: null as ImagesCursor,
    getNextPageParam: (last) => last.nextCursor,
    // only this user's uploads change the list, and we update the cache ourselves
    staleTime: 5 * 60_000,
    gcTime: 30 * 60_000,
  });

/** put freshly uploaded images at the top of the cached library, no refetch */
export function prependImages(qc: QueryClient, items: ImageItem[]) {
  qc.setQueryData<InfiniteData<ImagesPage, ImagesCursor>>(
    imageKeys.list(),
    (old) => {
      if (!old) return old; // library never opened: first open will fetch it
      const first = old.pages[0];
      if (!first) return old;

      const seen = new Set(old.pages.flatMap((p) => p.items.map((i) => i.id)));
      const fresh = items
        .filter((i) => !seen.has(i.id))
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      if (!fresh.length) return old;

      return {
        ...old,
        pages: [
          { ...first, items: [...fresh, ...first.items] },
          ...old.pages.slice(1),
        ],
      };
    },
  );
}
