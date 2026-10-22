import {
  jsonb,
  numeric,
  snakeCase,
  text,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { timestamps } from "./schema.helper";
import { SPECIFICATION } from "../zod-validator/type";

export const categories = snakeCase.table("categories", {
  id: uuid().primaryKey().defaultRandom(),
  name: text().notNull(),
  slug: text().notNull().unique(),
  ...timestamps,
});

export const products = snakeCase.table("products", {
  id: uuid().primaryKey().defaultRandom(),
  name: text().notNull(),
  slug: text().notNull(),
  shortDesc: varchar({ length: 200 }).notNull(),
  description: text().notNull(),
  specification: jsonb().$type<SPECIFICATION>(),
  categorySlug: text()
    .notNull()
    .references(() => categories.slug),
  ...timestamps,
});

export const productVariants = snakeCase.table("product_variants", {
  id: uuid().primaryKey().defaultRandom(),
  size: varchar({ length: 6 }),
  color: text().array(),
  price: numeric({ scale: 2 }).notNull(),
  sku: varchar({ length: 50 }).notNull().unique(),
  images: text().array().notNull(),
});
