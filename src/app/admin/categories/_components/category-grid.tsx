"use client";

import { DataTable } from "@/components/common/data-table/data-table";
import { adminCategoryColumns } from "./admin-category-columns";
import { deleteCategory } from "@/action/categories-action";
import { category_cache } from "@/constants/query-cache";
import { DeleteButton } from "@/components/common/delete-button";
import { useModalStore } from "@/store/useModalStore";
import { useGetCategories } from "@/hooks/categories/use-categories";

export const CategoryGrid = () => {
  const { data } = useGetCategories();

  const deletedData = useModalStore((state) => state.data);
  return (
    <div className="">
      <DataTable columns={adminCategoryColumns} data={data} searchKey="name" />
      <DeleteButton
        deleteFn={deleteCategory}
        queryKey={category_cache}
        id={deletedData!}
      />
    </div>
  );
};
