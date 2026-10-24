"use client";

import { type ReactTable, type RowData } from "@tanstack/react-table";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { type DataTableFeatures } from "./data-table-features";

interface Props<TData extends RowData> {
  table: ReactTable<DataTableFeatures, TData>;
  column: string;
  title: string;
  options: {
    label: string;
    value: string;
    icon?: React.ComponentType<{ className?: string }>;
  }[];
}

export function DataTableFilter<TData extends RowData>({
  table,
  column,
  options,
  title,
}: Props<TData>) {
  const tableColumn = table.getColumn(column);

  return (
    <div>
      {tableColumn && (
        <DataTableFacetedFilter
          column={tableColumn}
          title={title}
          options={options}
        />
      )}

      <table.Subscribe selector={(state) => state.columnFilters.length > 0}>
        {(isFiltered) =>
          isFiltered && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => table.resetColumnFilters()}
            >
              Reset
              <X />
            </Button>
          )
        }
      </table.Subscribe>
    </div>
  );
}
