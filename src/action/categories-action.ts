"use server";

import { db } from "@/db";
import { categories } from "@/db/index.schema";
import { getSession } from "@/lib/get-session";
import { getPgError } from "@/utils/error-handler";
import { categoryValidator } from "@/zod-validator/validators";
import { eq } from "drizzle-orm";
import z from "zod";

export const getCategory = async () => {
  const data = await db.query.categories.findMany({
    orderBy: { createdAt: "desc" },
  });
  return { data };
};

export const createCategory = async (
  values: z.infer<typeof categoryValidator>,
) => {
  try {
    const validateData = categoryValidator.safeParse(values);
    if (!validateData.success) {
      return { error: "Invalid payload" };
    }

    // const user = await getSession()
    // if (!user||user.role!=="admin") {
    //     return {error:"Unauthorize"}
    // }

    const [data] = await db
      .insert(categories)
      .values(validateData.data)
      .returning();

    return { data };
  } catch (error) {
    const pgError = getPgError(error);

    if (pgError?.code === "23505") {
      return { error: "A category with this slug already exists" };
    }
    return { error: "Something went wrong" };
  }
};

export const updateCategory = async (
  values: z.infer<typeof categoryValidator> & { id: string },
) => {
  try {
    const validateData = categoryValidator.safeParse(values);
    if (!validateData.success) {
      return { error: "Invalid payload" };
    }

    // const user = await getSession()
    // if (!user||user.role!=="admin") {
    //     return {error:"Unauthorize"}
    // }

    const data = await db
      .update(categories)
      .set({ ...validateData.data })
      .where(eq(categories.id, validateData.data.id!))
      .returning();
    return { data };
  } catch (error) {
    const pgError = getPgError(error);

    if (pgError?.code === "23505") {
      return { error: "A category with this slug already exists" };
    }
    return { error: "Something went wrong" };
  }
};

export const deleteCategory = async (id: string) => {
  try {
    // const user = await getSession()
    // if (!user||user.role!=="admin") {
    //     return {error:"Unauthorize"}
    // }

    await db.delete(categories).where(eq(categories.id, id)).returning();
    return { data: "Category delete successfully" };
  } catch (error) {
    return { error: error || "Something went wrong" };
  }
};

export const getSingleCategory = async (slug: string) => {
  const data = await db.query.categories.findFirst({ where: { slug } });
  return { data };
};
