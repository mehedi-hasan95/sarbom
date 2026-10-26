"use client";

import { DataTable } from "@/components/common/data-table/data-table";
import { getCategoriesOptions } from "@/transtack-options/category-data";
import { useSuspenseQuery } from "@tanstack/react-query";
import { adminCategoryColumns } from "./admin-category-columns";
import { useMemo, useState } from "react";
import { DeleteCategoryDialog } from "./delete-modal";
import { deleteCategory } from "@/action/categories-action";
import { category_cache } from "@/constants/query-cache";
import { DeleteButton } from "@/components/common/delete-button";
import { useModalStore } from "@/store/useModalStore";

export const CategoryGrid = () => {
  const { data } = useSuspenseQuery(getCategoriesOptions);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const columns = useMemo(() => adminCategoryColumns(setDeleteId), []);

  const deletedData = useModalStore((state) => state.data);
  return (
    <div className="">
      <DataTable columns={columns} data={data.data} searchKey="name" />
      {/* <DeleteCategoryDialog
        id={deleteId}
        onClose={() => setDeleteId(null)}
        deleteFn={deleteCategory}
        queryKey={category_cache}
      /> */}
      <DeleteButton
        deleteFn={deleteCategory}
        queryKey={category_cache}
        id={deletedData!}
      />
    </div>
  );
};
