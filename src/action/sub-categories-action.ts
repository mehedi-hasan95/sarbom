"use server";

import { db } from "@/db";
import { subCategories } from "@/db/index.schema";
import { getSession } from "@/lib/get-session";
import { getPgError } from "@/utils/error-handler";
import { subCategoriesValidator } from "@/zod-validator/validators";
import { eq } from "drizzle-orm";
import z from "zod";

export const getSubCategory = async () => {
  const data = await db.query.subCategories.findMany({
    orderBy: { createdAt: "desc" },
  });
  return { data };
};

export const createSubCategory = async (
  values: z.infer<typeof subCategoriesValidator>,
) => {
  try {
    const validateData = subCategoriesValidator.safeParse(values);
    if (!validateData.success) {
      return { error: "Invalid payload" };
    }

    // const user = await getSession()
    // if (!user||user.role!=="admin") {
    //     return {error:"Unauthorize"}
    // }

    const [data] = await db
      .insert(subCategories)
      .values(validateData.data)
      .returning();

    return { data };
  } catch (error) {
    const pgError = getPgError(error);

    if (pgError?.code === "23505") {
      return { error: "A sub category with this slug already exists" };
    }
    return { error: "Something went wrong" };
  }
};

export const updateSubCategory = async (
  values: z.infer<typeof subCategoriesValidator> & { id: string },
) => {
  try {
    const validateData = subCategoriesValidator.safeParse(values);
    if (!validateData.success) {
      return { error: "Invalid payload" };
    }

    // const user = await getSession()
    // if (!user||user.role!=="admin") {
    //     return {error:"Unauthorize"}
    // }

    const data = await db
      .update(subCategories)
      .set({ ...validateData.data })
      .where(eq(subCategories.id, validateData.data.id!))
      .returning();
    return { data };
  } catch (error) {
    const pgError = getPgError(error);

    if (pgError?.code === "23505") {
      return { error: "A sub category with this slug already exists" };
    }
    return { error: "Something went wrong" };
  }
};

export const deleteSubCategory = async (id: string) => {
  try {
    // const user = await getSession()
    // if (!user||user.role!=="admin") {
    //     return {error:"Unauthorize"}
    // }

    await db.delete(subCategories).where(eq(subCategories.id, id)).returning();
    return { data: "Sub Category delete successfully" };
  } catch (error) {
    return { error: error || "Something went wrong" };
  }
};

export const getSingleSubCategory = async (slug: string) => {
  const data = await db.query.subCategories.findFirst({ where: { slug } });
  return { data };
};
