"use client";

import * as React from "react";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { Check, Images, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { imagesInfiniteOptions } from "../../transtack-options/image-query";

export function ImageLibraryDialog({
  selected,
  max,
  onConfirm,
}: {
  selected: string[];
  max: number;
  onConfirm: (urls: string[]) => void;
}) {
  const queryClient = useQueryClient();
  const [open, setOpen] = React.useState(false);
  const [picked, setPicked] = React.useState<Set<string>>(new Set(selected));

  const query = useInfiniteQuery({
    ...imagesInfiniteOptions(),
    enabled: open,
  });

  const items = query.data?.pages.flatMap((p) => p.items) ?? [];

  // warm the cache before the dialog opens; no-op while data is fresh
  const prefetch = () => queryClient.infiniteQuery(imagesInfiniteOptions());

  function toggle(url: string) {
    setPicked((prev) => {
      const next = new Set(prev);
      if (next.has(url)) next.delete(url);
      else if (next.size < max) next.add(url);
      return next;
    });
  }

  function confirm() {
    // keep the current order, drop deselected, append newly picked
    const kept = selected.filter((u) => picked.has(u));
    const added = [...picked].filter((u) => !selected.includes(u));
    onConfirm([...kept, ...added]);
    setOpen(false);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (o) setPicked(new Set(selected)); // sync with the form on open
        setOpen(o);
      }}
    >
      <DialogTrigger
        render={
          <Button
            type="button"
            variant="outline"
            size="sm"
            onPointerEnter={prefetch}
            onFocus={prefetch}
          >
            <Images aria-hidden /> Choose from library
          </Button>
        }
      />

      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Image library</DialogTitle>
          <DialogDescription>
            Select up to {max} images. {picked.size} selected.
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[60vh] overflow-y-auto">
          {query.isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="animate-spin" aria-hidden />
            </div>
          ) : query.isError ? (
            <p className="py-12 text-center text-sm text-destructive">
              Could not load images. Close this dialog and try again.
            </p>
          ) : items.length === 0 ? (
            <p className="py-12 text-center text-sm text-muted-foreground">
              No uploaded images yet.
            </p>
          ) : (
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
              {items.map((img) => {
                const isPicked = picked.has(img.url);
                return (
                  <button
                    key={img.id}
                    type="button"
                    onClick={() => toggle(img.url)}
                    aria-pressed={isPicked}
                    className="relative aspect-square overflow-hidden rounded-md border bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img.url}
                      alt=""
                      className="size-full object-cover"
                    />
                    {isPicked && (
                      <span className="absolute inset-0 flex items-start justify-end bg-primary/20 p-1 ring-2 ring-primary ring-inset">
                        <span className="rounded-full bg-primary p-0.5 text-primary-foreground">
                          <Check className="size-3.5" aria-hidden />
                        </span>
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {query.hasNextPage && (
            <div className="flex justify-center pt-4">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={query.isFetchingNextPage}
                onClick={() => query.fetchNextPage()}
              >
                {query.isFetchingNextPage && (
                  <Loader2 className="animate-spin" aria-hidden />
                )}
                Load more
              </Button>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button type="button" onClick={confirm}>
            Use {picked.size} image{picked.size === 1 ? "" : "s"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
