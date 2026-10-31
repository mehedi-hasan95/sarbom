"use server";

import { and, desc, eq, lt, or } from "drizzle-orm";
import { headers } from "next/headers";

// import { auth } from "@/lib/auth";
import { db } from "@/db";
import { images } from "@/db/index.schema";

export type ImageItem = { id: number; url: string; createdAt: string };
export type ImagesCursor = { createdAt: string; id: number } | null;

const PAGE_SIZE = 24;

/** keyset pagination on (createdAt desc, id desc), scoped to the signed-in user */
export async function getMyImages(cursor: ImagesCursor) {
  // todo: add auth
  // const session = await auth.api.getSession({ headers: await headers() });
  // if (!session) throw new Error("Unauthorized");

  const at = cursor ? new Date(cursor.createdAt) : null;

  const rows = await db
    .select({
      id: images.id,
      url: images.url,
      key: images.key,
      createdAt: images.createdAt,
    })
    .from(images)
    .where(
      cursor && at
        ? or(
            lt(images.createdAt, at),
            and(eq(images.createdAt, at), lt(images.id, cursor.id)),
          )
        : undefined,
    )
    .orderBy(desc(images.createdAt), desc(images.id))
    .limit(PAGE_SIZE + 1);

  const items: ImageItem[] = rows.slice(0, PAGE_SIZE).map((r) => ({
    id: r.id,
    url: r.url,
    createdAt: r.createdAt.toISOString(),
  }));
  const last = items.at(-1);

  return {
    items,
    nextCursor:
      rows.length > PAGE_SIZE && last
        ? ({ createdAt: last.createdAt, id: last.id } satisfies ImagesCursor)
        : null,
  };
}
