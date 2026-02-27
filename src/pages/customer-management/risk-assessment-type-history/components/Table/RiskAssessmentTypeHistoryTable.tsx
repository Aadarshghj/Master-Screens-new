import React, { useMemo } from "react";
import { Grid, CommonTable, ConfirmationModal, Button} from "@/components";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import type {
  RiskAssessmentTypeHistory,
} from "@/types/customer-management/risk-assessment-type-history";
import { Pencil, Trash2 } from "lucide-react";
import { useRiskAssessmentTypeHistoryTable } from "../Hooks/useRiskAssessmentTypeHistoryTable";

const columnHelper = createColumnHelper<RiskAssessmentTypeHistory>();

interface RiskAssessmentTypeTableProps{
  onEdit:(identity:RiskAssessmentTypeHistory) =>void;
}
export const RiskAssessmentTypeHistoryTable: React.FC<RiskAssessmentTypeTableProps> = ({
  onEdit,
})=>{
   const {
      data,
      showDeleteModal,
      openDeleteModal,
      closeDeleteModal,
      handleConfirmDelete,
    } = useRiskAssessmentTypeHistoryTable();

    

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: "s.no",
        header: "S.No",
        cell: ({ row }) => row.index + 1,
      }),

      columnHelper.accessor("riskAssessmentType", {
        header: "Risk Assessment Type ",
      }),

      columnHelper.accessor("description", {
        header: "Description",
      }),

      columnHelper.accessor("isActive", {
        header: "Status",
        cell:info=>{
          const isActive = Boolean(info.getValue());
          return(
            <span className={`text-xs font-medium ${isActive?"text-green-600":"text-red-600"}`}>
              {isActive ? "ACTIVE":"INACTIVE"}

            </span>
          )
        }
      }),

      columnHelper.display({
        id: "actions",
        header: "Actions",
         cell: ({row}) => (
          
          <div className="flex gap-2">
          
       <Button
        variant="ghost"
        className="text-primary hover:bg-primary/40 h-6 w-6 p-0"
        onClick={()=>onEdit(row.original)}
        title="Edit Property" >
            <Pencil size={13} />
      </Button>
      <Button
        variant="ghost"
        className="text-status-error hover:bg-status-error-background h-6 w-6 p-0"
        onClick={()=>openDeleteModal(row.original.identity)}
        title="Delete Property" >
             <Trash2 size={13} />
      </Button>

          </div>
        ),
      }),
    ],
    [openDeleteModal,onEdit]
  );

  const table = useReactTable({
    data ,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      
        <Grid>
        <Grid.Item>
          <CommonTable
            table={table}
            noDataText="No Risk Assessment Type Records"
            className="bg-card"
          />
        </Grid.Item>
      </Grid>

    <ConfirmationModal
            isOpen={showDeleteModal}
            onConfirm={handleConfirmDelete}
            onCancel={closeDeleteModal}
            title="Delete Risk Assessment Type"
            message="Are you sure you want to delete this risk assessment type ? This action cannot be undone."
            confirmText="Delete"
            cancelText="Cancel"
            type="error"
            size="compact"
          />
    </>
  );
};