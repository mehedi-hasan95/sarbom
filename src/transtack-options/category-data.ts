import { getCategory } from "@/action/categories-action";
import { category_cache } from "@/constants/query-cache";
import { queryOptions } from "@tanstack/react-query";

export const getCategoryOptions = queryOptions({
  queryKey: category_cache,
  queryFn: getCategory,
  staleTime: 5 * 60 * 1000,
});
