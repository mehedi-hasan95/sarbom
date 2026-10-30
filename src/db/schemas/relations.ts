import { defineRelations } from "drizzle-orm";
import * as schema from "../index.schema";

export const relations = defineRelations(schema, (r) => ({
  user: {
    session: r.many.session(),
    accounts: r.many.account(),
  },

  session: {
    user: r.one.user({
      from: r.session.userId,
      to: r.user.id,
    }),
  },

  account: {
    user: r.one.user({
      from: r.account.userId,
      to: r.user.id,
    }),
  },
  categories: {
    subCategories: r.many.subCategories(),
    products: r.many.products(),
  },
  subCategories: {
    products: r.many.products(),
    categories: r.one.categories({
      from: r.subCategories.catSlug,
      to: r.categories.slug,
    }),
  },
  products: {
    category: r.one.categories({
      from: r.products.categorySlug,
      to: r.categories.slug,
    }),
    subCategory: r.one.subCategories({
      from: r.products.subCategorySlug,
      to: r.subCategories.slug,
    }),
    sizes: r.many.productSizes(),
    colors: r.many.productColors(),
  },
  productSizes: {
    // product: r.one.products({
    //   from: r.productSizes.productSlug,
    //   to: r.products.slug,
    // }),
    // colors: r.many.sizeColors(),

    product: r.one.products({
      from: r.productSizes.productSlug,
      to: r.products.slug,
      optional: false,
    }),
    variants: r.many.productVariants(),
  },
  productColors: {
    product: r.one.products({
      from: r.productColors.productSlug,
      to: r.products.slug,
      optional: false,
    }),
    variants: r.many.productVariants(),
  },
  productVariants: {
    size: r.one.productSizes({
      from: r.productVariants.sizeId,
      to: r.productSizes.id,
      optional: false,
    }),
    // optional (default) because colorId is nullable
    color: r.one.productColors({
      from: r.productVariants.colorId,
      to: r.productColors.id,
    }),
  },
}));
