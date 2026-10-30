export const category_cache = ["categories"];

export const single_category_cache = (slug: string) =>
  ["categories", slug] as const;

export const sub_category_cache = ["sub_categories"];

export const single_sub_category_cache = (slug: string) =>
  ["sub_categories", slug] as const;
