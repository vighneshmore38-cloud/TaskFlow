import { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import { FiChevronUp, FiChevronDown, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import Loader from "./Loader";
import { EmptyState } from "./EmptyState";
import { classNames } from "../../utils/helpers";

/**
 * Generic, reusable data table used by Users / Tasks / Logs pages.
 *
 *   <Table
 *     columns={columns}        // TanStack column defs
 *     data={rows}
 *     isLoading={loading}
 *     emptyTitle="No users yet"
 *     getRowClassName={(row) => priorityRail[row.priority]}  // optional, drives the "status rail"
 *   />
 *
 * Sorting and pagination are handled internally so every page gets them for free.
 */
export default function Table({
  columns,
  data,
  isLoading = false,
  emptyTitle = "No records found",
  emptyDescription = "",
  getRowClassName,
  pageSize = 6,
}) {
  const [sorting, setSorting] = useState([]);

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize } },
  });

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]">
        <Loader label="Loading..." />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="thin-scrollbar overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-[var(--color-border)] bg-[var(--color-surface-soft)]/80">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    className={classNames(
                      "px-4 py-3 font-medium text-[var(--color-ink-soft)]",
                      header.column.getCanSort() && "cursor-pointer select-none"
                    )}
                  >
                    <div className="flex items-center gap-1">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getIsSorted() === "asc" && <FiChevronUp className="h-3.5 w-3.5" />}
                      {header.column.getIsSorted() === "desc" && <FiChevronDown className="h-3.5 w-3.5" />}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className={classNames(
                  "border-b border-[var(--color-border)] last:border-0 hover:bg-slate-50/60",
                  getRowClassName ? getRowClassName(row.original) : ""
                )}
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-3 align-middle text-[var(--color-ink)]">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {table.getPageCount() > 1 && (
        <div className="flex items-center justify-between border-t border-[var(--color-border)] px-4 py-3 text-sm text-[var(--color-ink-soft)]">
          <span>
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="rounded-lg border border-[var(--color-border)] p-1.5 disabled:opacity-40"
              aria-label="Previous page"
            >
              <FiChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="rounded-lg border border-[var(--color-border)] p-1.5 disabled:opacity-40"
              aria-label="Next page"
            >
              <FiChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
