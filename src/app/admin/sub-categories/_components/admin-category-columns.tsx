"use client";

import { DataTableColumnHeader } from "@/components/common/data-table/data-table-column-header";
import { DataTableFeatures } from "@/components/common/data-table/data-table-features";
import { createColumnHelper } from "@tanstack/react-table";
import { format } from "date-fns";
import z from "zod";
import { AdminSubCategoryCell } from "./admin-sub-category-cell";
import { subCategoriesValidator } from "@/zod-validator/validators";

// Use `accessor` for data columns and `display` for columns without one.
const columnHelper = createColumnHelper<
  DataTableFeatures,
  z.infer<typeof subCategoriesValidator>
>();

export const adminCategoryColumns = columnHelper.columns([
  columnHelper.accessor("name", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    // cell: ({ row }) => <div className="w-20">{row.getValue("name")}</div>,
    enableSorting: true,
    enableHiding: false,
  }),

  columnHelper.accessor("slug", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Slug" />
    ),
    enableSorting: true,
    enableHiding: false,
  }),

  columnHelper.accessor("catSlug", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Category" />
    ),
    enableSorting: true,
    enableHiding: false,
  }),

  columnHelper.accessor("updatedAt", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created Time" />
    ),
    cell: ({ row }) => {
      const date = row.original.updatedAt;
      return <span>{date ? format(new Date(date), "MMM dd, yyyy") : "-"}</span>;
    },
  }),

  columnHelper.display({
    id: "Action",
    cell: ({ row }) => (
      <AdminSubCategoryCell id={row.original.id!} slug={row.original.slug!} />
    ),
  }),
]);
