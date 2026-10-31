import {
  getCategoriesOptions,
  getSingleCategoryOptions,
  getSingleSubCategoryOptions,
  getSubCategoriesOptions,
} from "@/transtack-options/category-data";
import { useSuspenseQuery } from "@tanstack/react-query";

export const useGetCategories = () => {
  const { data, isLoading } = useSuspenseQuery(getCategoriesOptions);
  return { data: data.data, isLoading };
};

export const useGetSingleCategories = (slug: string) => {
  const { data, isLoading } = useSuspenseQuery(getSingleCategoryOptions(slug));
  return { data: data.data, isLoading };
};

export const useGetSubCategories = (catSlug?: string) => {
  const { data, isLoading } = useSuspenseQuery(
    getSubCategoriesOptions(catSlug),
  );
  return { data: data.data, isLoading };
};

export const useGetSingleSubCategories = (slug: string) => {
  const { data, isLoading } = useSuspenseQuery(
    getSingleSubCategoryOptions(slug),
  );
  return { data: data.data, isLoading };
};
