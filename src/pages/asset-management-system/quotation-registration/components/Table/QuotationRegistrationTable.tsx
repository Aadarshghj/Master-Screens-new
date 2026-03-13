import React, { useMemo, useState } from "react";
import { Grid, CommonTable, Button } from "@/components";
import {
  createColumnHelper,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
// import { QUOTATION_MOCK_DATA } from "@/mocks/asset-management-system/quotation-registration";
import type { QuotationReqData } from "@/types/asset-management-system/quotation-registration-type";
import NeumorphicButton from "@/components/ui/neumorphic-button/neumorphic-button";

import { QuotRegWithSupplierModal } from "../Form/QuotationRegistrationForm";

const columnHelper = createColumnHelper<QuotationReqData>();

interface TableProps {
  data: QuotationReqData[] | undefined;
  isLoading: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  // handleEdit: (identity: string) => void;
  // handleDelete: (identity: string) => void;
}
export const QuotationRegistrationTable: React.FC<TableProps> = ({
  data,
  isLoading,
  //   handleEdit,
  //   handleDelete,
}) => {
  const tableData = data ?? [];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedQuotation, setSelectedQuotation] = useState<QuotationReqData | null>(null);

  const openModal = (rowData: QuotationReqData) => {
    setSelectedQuotation(rowData);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedQuotation(null);
    setIsModalOpen(false);
  };

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: "sno",
        header: "S.No",
        cell: ({ row }) => row.index + 1,
      }),

      columnHelper.accessor("quotReqId", {
        header: "Quotation Request ID",
        cell: info => info.getValue() || "- - - - - - - - -",
      }),

      columnHelper.accessor("quotReqDesc", {
        header: "Quotation Request Description",
        cell: info => info.getValue() || "- - - - - - - - -",
      }),

      columnHelper.accessor("quotReqItem", {
        header: "Quotation Request Name",
        cell: info => info.getValue() || "- - - - - - - - -",
      }),

      columnHelper.accessor("quotReqDate", {
        header: "Quotation Request Date",
        cell: info => info.getValue() || "- - - - - - - - -",
      }),

      columnHelper.accessor("status", {
        header: "Status",
        cell: info => {
          const rawStatus = String(info.getValue() ?? "");
          const status = rawStatus.toLowerCase();

          const styles =
            status === "quotation received"
              ? "bg-emerald-100 text-emerald-600"
              : status === "pending"
                ? "bg-amber-100 text-amber-600"
                : status === "cancelled"
                  ? "bg-red-300 text-red-500"
                  : "bg-red-100 text-red-500";

          return (
            <span
              className={`inline-flex h-6 items-center justify-center rounded-full px-3 text-[11px] font-medium ${styles}`}
            >
              {rawStatus}
            </span>
          );
        },
      }),

      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const quote = row.original.status?.trim().toLowerCase();
          return (
            <div className="flex items-center gap-2">
              <NeumorphicButton
                type="button"
                variant="secondary"
                size="secondary"
                onClick={() => openModal(row.original)}
              >
                Details
              </NeumorphicButton>

              <Button
                className="bg-blue-600 px-3 text-[11px] text-white hover:bg-blue-700"
              >
                Create Quotation
              </Button>

              {quote === "quotation received" && (
                <Button
                  type="button"
                  variant="resetPrimary"
                  size="compactWhite"
                  className="text-[11px]"
                >
                  Sent for Approval
                </Button>
              )}
            </div>
          );
        },
      }),
    ],
    []
  );
  const getNoDataText = () => {
    if (isLoading) {
      return "Loading Quotation Registration...";
    }
    return "No Quotation Registration found";
  };

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: 5,
      },
    },
  });

  return (
    <>
      <Grid>
        <Grid.Item>
          <CommonTable
            table={table}
            size="default"
            noDataText={getNoDataText()}
            className="w-full text-[9px] [&_td]:px-1 [&_td]:whitespace-nowrap [&_th]:px-1"
          />
          <div className="mt-4 flex items-center justify-end gap-2 text-sm">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="rounded px-2 py-1 text-gray-500 hover:text-gray-700 disabled:opacity-40"
            >
              ‹ Previous
            </button>

            {Array.from({ length: table.getPageCount() }, (_, i) => {
              const isActive = table.getState().pagination.pageIndex === i;

              return (
                <button
                  key={i}
                  onClick={() => table.setPageIndex(i)}
                  className={`
                  flex h-[20px] min-w-[20px] items-center justify-center
                  rounded-lg font-medium transition-all duration-200
                  ${
                    isActive
                      ? "bg-white text-gray-700 shadow-[0_2px_6px_rgba(0,0,0,0.15)]"
                      : "text-gray-500 hover:-translate-y-[1px] hover:bg-white hover:text-gray-700 hover:shadow-[0_2px_6px_rgba(0,0,0,0.12)]"
                  }
                `}
                >
                  {i + 1}
                </button>
              );
            })}

            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="rounded px-2 py-1 text-gray-500 hover:text-gray-700 disabled:opacity-40"
            >
              Next ›
            </button>
          </div>
        </Grid.Item>
      </Grid>

      <QuotRegWithSupplierModal
        isSubmitting
        isOpen={isModalOpen}
        onClose={closeModal}
        quotation={selectedQuotation}
        onToggleDisable={() => {
          console.log("Optional toggle when modal closes");
        }}
      />
    </>
  );
};
