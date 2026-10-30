import {
  productColors,
  products,
  productSizes,
  productVariants,
} from "@/db/index.schema";
import { createInsertSchema } from "drizzle-orm/zod";
import { z } from "zod";

/* -------------------------------------------------------------------------- */
/*  Regexes                                                                   */
/* -------------------------------------------------------------------------- */

/** kebab-case: "classic-tee", "air-max-90" */
export const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** #RGB or #RRGGBB */
export const HEX_REGEX = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

/** numeric(12,2): up to 10 integer digits, up to 2 decimals, no leading zeros */
export const PRICE_REGEX = /^(?:0|[1-9]\d{0,9})(?:\.\d{1,2})?$/;

/** "TEE-M-BLU": uppercase letters/digits separated by single hyphens */
export const SKU_REGEX = /^[A-Z0-9]+(?:-[A-Z0-9]+)*$/;

/** "S", "XL", "42", "10.5", "One Size", "32/34" */
export const SIZE_REGEX = /^[A-Za-z0-9][A-Za-z0-9 ./-]{0,19}$/;

/** "Midnight Blue", "Off-White", "Rose Gold" (letters, spaces, hyphen, apostrophe) */
export const COLOR_NAME_REGEX = /^\p{L}[\p{L} '-]*$/u;

/* -------------------------------------------------------------------------- */
/*  Reusable pieces                                                           */
/*  RHF text inputs give "" when empty, so optional fields accept "" and the  */
/*  root transform at the bottom converts "" -> null for the API / database.  */
/* -------------------------------------------------------------------------- */

const priceField = z
  .string()
  .trim()
  .regex(PRICE_REGEX, "Enter a valid price, e.g. 19.99");

const optionalPriceField = z.union([
  z.literal(""),
  z.string().trim().regex(PRICE_REGEX, "Enter a valid price, e.g. 24.99"),
]);

const imageUrl = z.url("Must be a valid URL");

/* -------------------------------------------------------------------------- */
/*  Variant (size x color), the purchasable unit                              */
/* -------------------------------------------------------------------------- */

export const variantFormSchema = createInsertSchema(productVariants, {
  sku: z.union([
    z.literal(""),
    z
      .string()
      .trim()
      .max(64, "SKU is too long")
      .regex(SKU_REGEX, "Use A-Z, 0-9 and hyphens, e.g. TEE-M-BLU"),
  ]),
})
  .omit({ id: true, sizeId: true, colorId: true })
  .extend({
    /** points at colors[].key; null when the product has no colors */
    colorKey: z.string().min(1).nullable(),
  });

/* -------------------------------------------------------------------------- */
/*  Size (owns the price)                                                     */
/* -------------------------------------------------------------------------- */

export const sizeFormSchema = createInsertSchema(productSizes, {
  size: z.union([
    z.literal(""),
    z.string().trim().regex(SIZE_REGEX, "Invalid size, e.g. S, XL, 42, 10.5"),
  ]),
  price: priceField,
  compareAtPrice: optionalPriceField,
})
  .omit({ id: true, productSlug: true })
  .extend({
    variants: z
      .array(variantFormSchema)
      .min(1, "Add at least one variant for this size")
      .max(50),
  });

/* -------------------------------------------------------------------------- */
/*  Color (appearance + images, stored once)                                  */
/* -------------------------------------------------------------------------- */

export const colorFormSchema = createInsertSchema(productColors, {
  name: z
    .string()
    .trim()
    .min(2, "Color name is too short")
    .max(40, "Color name is too long")
    .regex(COLOR_NAME_REGEX, "Letters, spaces, hyphens and apostrophes only"),
  hex: z.string().trim().regex(HEX_REGEX, "Use a hex color like #191970"),
  images: z
    .array(imageUrl)
    .min(1, "Add at least one image")
    .max(8, "Maximum 8 images per color"),
})
  .omit({ id: true, productSlug: true })
  .extend({
    /** client-only id so variants can reference a color before it exists in the DB */
    key: z.string().min(1),
  });

/* -------------------------------------------------------------------------- */
/*  Product                                                                   */
/* -------------------------------------------------------------------------- */

export const productFormSchema = createInsertSchema(products, {
  name: (s) =>
    s.trim().min(3, "Name is too short").max(120, "Name is too long"),
  slug: (s) =>
    s
      .trim()
      .min(3, "Slug is too short")
      .max(160, "Slug is too long")
      .regex(SLUG_REGEX, "Lowercase letters, numbers and single hyphens only"),
  shortDesc: (s) =>
    s.trim().min(10, "At least 10 characters").max(200, "Max 200 characters"),
  description: (s) =>
    s.trim().min(30, "At least 30 characters").max(5000, "Max 5000 characters"),
  categorySlug: (s) => s.regex(SLUG_REGEX, "Select a category"),
  subCategorySlug: (s) => s.regex(SLUG_REGEX, "Select a sub category"),
  // Match this to your SPECIFICATION type
  specification: z
    .array(
      z.object({
        key: z.string().trim().min(1, "Required").max(60),
        value: z.string().trim().min(1, "Required").max(200),
      }),
    )
    .max(30)
    .optional(),
})
  .omit({ id: true, createdAt: true, updatedAt: true, deletedAt: true })
  .extend({
    colors: z.array(colorFormSchema).max(20, "Maximum 20 colors"),
    sizes: z
      .array(sizeFormSchema)
      .min(1, "Add at least one size (or leave one blank for no size)")
      .max(30, "Maximum 30 sizes"),
  })
  /* ---------------------------- cross-field rules --------------------------- */
  .superRefine((data, ctx) => {
    const issue = (path: (string | number)[], message: string) =>
      ctx.addIssue({ code: "custom", path, message });

    // 1. unique color hex (case-insensitive)
    const seenHex = new Map<string, number>();
    data.colors.forEach((c, i) => {
      const hex = c.hex.toLowerCase();
      if (seenHex.has(hex)) issue(["colors", i, "hex"], "Duplicate color");
      seenHex.set(hex, i);
    });

    // 2. unique size values; a blank size means "no sizes", so it must be the only one
    const seenSize = new Set<string>();
    data.sizes.forEach((s, i) => {
      const key = s.size.toLowerCase();
      if (seenSize.has(key)) issue(["sizes", i, "size"], "Duplicate size");
      seenSize.add(key);
      if (s.size === "" && data.sizes.length > 1) {
        issue(
          ["sizes", i, "size"],
          "Size is required when there are multiple sizes",
        );
      }
    });

    const colorKeys = new Set(data.colors.map((c) => c.key));
    const hasColors = data.colors.length > 0;
    const seenSku = new Map<string, string>();

    data.sizes.forEach((s, si) => {
      // 3. compareAtPrice must be higher than price
      if (
        s.compareAtPrice !== "" &&
        Number(s.compareAtPrice) <= Number(s.price)
      ) {
        issue(
          ["sizes", si, "compareAtPrice"],
          "Compare-at price must be higher than price",
        );
      }

      const usedColors = new Set<string | null>();

      s.variants.forEach((v, vi) => {
        const base = ["sizes", si, "variants", vi];

        // 4. variants must line up with the colors list
        if (!hasColors) {
          if (v.colorKey !== null)
            issue([...base, "colorKey"], "No colors defined");
          if (s.variants.length > 1) {
            issue(
              base,
              "A product without colors has exactly one variant per size",
            );
          }
        } else if (v.colorKey === null || !colorKeys.has(v.colorKey)) {
          issue([...base, "colorKey"], "Select a valid color");
        }

        // 5. one variant per color within a size
        if (usedColors.has(v.colorKey)) {
          issue(
            [...base, "colorKey"],
            "This color is already added for this size",
          );
        }
        usedColors.add(v.colorKey);

        // 6. SKU unique across the whole form
        if (v.sku !== "") {
          if (seenSku.has(v.sku)) issue([...base, "sku"], "Duplicate SKU");
          seenSku.set(v.sku, `${si}.${vi}`);
        }
      });
    });
  })
  /* --------------- normalize "" -> null for the API / database -------------- */
  .transform((data) => ({
    ...data,
    colors: data.colors.map((c) => ({ ...c, hex: c.hex.toLowerCase() })),
    sizes: data.sizes.map((s) => ({
      ...s,
      size: s.size === "" ? null : s.size,
      compareAtPrice: s.compareAtPrice === "" ? null : s.compareAtPrice,
      variants: s.variants.map((v) => ({
        ...v,
        sku: v.sku === "" ? null : v.sku,
      })),
    })),
  }));

/** what the form holds (strings, "" for empty) */
export type ProductFormInput = z.input<typeof productFormSchema>;
/** what you send to the API (nulls normalized) */
export type ProductFormValues = z.output<typeof productFormSchema>;
