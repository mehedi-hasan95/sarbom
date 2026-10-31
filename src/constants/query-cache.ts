export const category_cache = ["categories"];

export const single_category_cache = (slug: string) =>
  ["categories", slug] as const;

export const sub_category_cache = (catSlug?: string) => [
  "all_sub_categories",
  catSlug,
];

export const single_sub_category_cache = (slug: string) =>
  ["sub_categories", slug] as const;
