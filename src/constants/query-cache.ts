export const category_cache = ["categories"];

export const single_category_cache = (id: string) =>
  ["categories", id] as const;
