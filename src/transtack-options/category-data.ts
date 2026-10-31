import { getCategory, getSingleCategory } from "@/action/categories-action";
import {
  getSingleSubCategory,
  getSubCategory,
} from "@/action/sub-categories-action";

import {
  category_cache,
  single_category_cache,
  single_sub_category_cache,
  sub_category_cache,
} from "@/constants/query-cache";
import { queryOptions } from "@tanstack/react-query";

export const getCategoriesOptions = queryOptions({
  queryKey: category_cache,
  queryFn: getCategory,
  staleTime: 5 * 60 * 1000,
});

export const getSingleCategoryOptions = (slug: string) => {
  return queryOptions({
    queryKey: single_category_cache(slug),
    queryFn: () => getSingleCategory(slug),
    staleTime: 5 * 60 * 1000,
    enabled: !!slug,
  });
};

// sub categories

export const getSubCategoriesOptions = (catSlug?: string) =>
  queryOptions({
    queryKey: sub_category_cache(catSlug),
    queryFn: () => getSubCategory(catSlug),
    staleTime: 5 * 60 * 1000,
  });

export const getSingleSubCategoryOptions = (slug: string) => {
  return queryOptions({
    queryKey: single_sub_category_cache(slug),
    queryFn: () => getSingleSubCategory(slug),
    staleTime: 5 * 60 * 1000,
    enabled: !!slug,
  });
};
