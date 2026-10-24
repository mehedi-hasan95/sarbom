"use client";

import { type ReactTable, type RowData } from "@tanstack/react-table";
import { Trash } from "lucide-react";
import { Button } from "@/components/ui/button";

import { type DataTableFeatures } from "./data-table-features";

interface DataTableToolbarProps<TData extends RowData> {
  table: ReactTable<DataTableFeatures, TData>;
  onDelete: (ids: string[]) => void;
  getDeleteId: (row: TData) => string;
}

export function DataTableToolbar<TData extends RowData>({
  table,
  onDelete,
  getDeleteId,
}: DataTableToolbarProps<TData>) {
  const selectedRows = table.getFilteredSelectedRowModel().rows;

  return (
    <div>
      {selectedRows.length > 0 && (
        <Button
          size="sm"
          variant="outline"
          className="ml-auto text-sm font-normal"
          onClick={() => {
            onDelete(
              table
                .getSelectedRowModel()
                .rows.map((row) => getDeleteId(row.original)),
            );
          }}
        >
          <Trash className="mr-2 h-4 w-4" />
          Delete ({selectedRows.length})
        </Button>
      )}
    </div>
  );
}
