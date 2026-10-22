import z, { ZodType } from "zod";
import { createInsertSchema } from "drizzle-orm/zod";
import {
  categories,
  products,
  productVariants,
} from "../schemas/products.schema";

export const slugSchema = z
  .string()
  .trim()
  .min(1, "Slug is required")
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message:
      "Slug must contain only lowercase letters, numbers, and single hyphens",
  });

/**
 * Normalizes multipart/form-data array fields.
 * Handles three shapes a single field can arrive in:
 *  - undefined (not sent)
 *  - a single string (only one value appended)
 *  - a string[] (multiple values appended)
 */
export const formArray = <T extends ZodType>(schema: T) =>
  z.preprocess((val) => {
    if (val === undefined || val === null || val === "") return undefined;
    return Array.isArray(val) ? val : [val];
  }, schema);

export const specificationValidator = z.object({
  specification: z
    .array(
      z
        .object({
          key: z.string(),
          value: z.string(),
        })
        .refine(
          (data) =>
            (data.key === "" && data.value === "") ||
            (data.key !== "" && data.value !== ""),
          {
            message: "Both key and value are required",
            path: ["value"],
          },
        ),
    )
    .optional(),
});

export const categoryValidator = createInsertSchema(categories, {
  slug: slugSchema,
});

export const productsValidator = createInsertSchema(products, {
  slug: slugSchema,
  categorySlug: slugSchema,
  specification: specificationValidator.shape.specification.optional(),
});

export const productVariantsValidator = createInsertSchema(productVariants, {
  color: formArray(
    z
      .array(
        z
          .string()
          .regex(
            /^#(?:[0-9A-Fa-f]{3}|[0-9A-Fa-f]{4}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/,
            "Invalid hex color",
          ),
      )
      .optional(),
  ),
  images: z.array(z.url()),
  size: z.string().optional(),
});
