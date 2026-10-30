import { getSession } from "@/lib/get-session";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

const auth = async () => {
  const session = await getSession();
  if (session?.role !== "user") throw new UploadThingError("Unauthorized");
  return { userId: session.id };
};

export const ourFileRouter = {
  eyeImage: f({ image: { maxFileCount: 5, maxFileSize: "16MB" } })
    .middleware(() => auth())
    .onUploadComplete(() => {}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
