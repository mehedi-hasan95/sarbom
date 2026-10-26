"use client";

import { DataTableColumnHeader } from "@/components/common/data-table/data-table-column-header";
import { DataTableFeatures } from "@/components/common/data-table/data-table-features";
import { categoryValidator } from "@/db/zod-validator/validators";
import { createColumnHelper } from "@tanstack/react-table";
import { format } from "date-fns";
import z from "zod";
import { AdminCategoryCell } from "./admin-category-cell";

export type Payment = {
  id: string;
  amount: number;
  status: "pending" | "processing" | "success" | "failed";
  email: string;
};

// Use `accessor` for data columns and `display` for columns without one.
const columnHelper = createColumnHelper<
  DataTableFeatures,
  z.infer<typeof categoryValidator>
>();

export const adminCategoryColumns = (onDelete: (id: string) => void) =>
  columnHelper.columns([
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

    columnHelper.accessor("updatedAt", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Created Time" />
      ),
      cell: ({ row }) => {
        const date = row.original.updatedAt;
        return (
          <span>{date ? format(new Date(date), "MMM dd, yyyy") : "-"}</span>
        );
      },
    }),

    columnHelper.display({
      id: "Action",
      cell: ({ row }) => (
        <AdminCategoryCell
          id={row.original.id!}
          slug={row.original.slug!}
          onDelete={onDelete}
        />
      ),
    }),
  ]);
