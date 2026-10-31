import { db } from "@/db";
import { images } from "@/db/index.schema";
import { getSession } from "@/lib/get-session";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

// todo: use auth
// const auth = async () => {
//   const session = await getSession();
//   if (session?.role !== "user") throw new UploadThingError("Unauthorized");
//   return { userId: session.id };
// };

export const ourFileRouter = {
  productImage: f({ image: { maxFileCount: 5, maxFileSize: "16MB" } })
    // .middleware(() => auth())
    .onUploadComplete(async ({ file }) => {
      const [row] = await db
        .insert(images)
        .values({
          url: file.ufsUrl,
          key: file.key,
        })
        .returning({
          id: images.id,
          url: images.url,
          createdAt: images.createdAt,
        });

      // this object arrives on the client as `serverData`
      return {
        id: row!.id,
        url: row!.url,
        createdAt: row!.createdAt.toISOString(),
      };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
