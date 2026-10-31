"use client";

import { DataTable } from "@/components/common/data-table/data-table";
import { adminCategoryColumns } from "./admin-category-columns";
import { sub_category_cache } from "@/constants/query-cache";
import { DeleteButton } from "@/components/common/delete-button";
import { useModalStore } from "@/store/useModalStore";
import { useGetSubCategories } from "@/hooks/categories/use-categories";
import { deleteSubCategory } from "@/action/sub-categories-action";

export const SubCategoryGrid = () => {
  const { data } = useGetSubCategories();

  const deletedData = useModalStore((state) => state.data);
  return (
    <div className="">
      <DataTable columns={adminCategoryColumns} data={data} searchKey="name" />
      <DeleteButton
        deleteFn={deleteSubCategory}
        queryKey={sub_category_cache()}
        id={deletedData!}
        title="Delete Sub Category"
        description="Delete sub categories"
      />
    </div>
  );
};
