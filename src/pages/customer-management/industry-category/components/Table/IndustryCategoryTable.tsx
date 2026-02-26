import React, { useMemo } from "react";
import { Grid, CommonTable } from "@/components";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Trash2 } from "lucide-react";
import type { IndustryCategoryResponseDto } from "@/types/customer-management/industry-category";
import {
  useDeleteIndustryCategoryMutation,
  useGetIndustryCategoriesQuery,
} from "@/global/service/end-points/customer-management/industry-category.api";
import toast from "react-hot-toast";

const columnHelper = createColumnHelper<IndustryCategoryResponseDto>();

export const IndustryCategoryTable: React.FC = () => {
  const { data = [], refetch } = useGetIndustryCategoriesQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const [deleteIndustryCategory] = useDeleteIndustryCategoryMutation();

  const handleDelete = async (identity: string) => {
    try {
      await deleteIndustryCategory(identity).unwrap();
      toast.success("Industry category deleted successfully");
      // ensure list refresh if automatic invalidation didn't trigger
      try {
        await refetch();
      } catch {
        // ignore
      }
    } catch {
      toast.error("Failed to delete industry category");
    }
  };

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: "sno",
        header: "S.No",
        cell: ({ row }) => row.index + 1,
      }),
      columnHelper.accessor("industryCategoryName", {
        header: "Industry Category Name",
      }),
      columnHelper.accessor("description", {
        header: "Description",
      }),
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <button
            onClick={() => handleDelete(row.original.identity)}
            className="text-destructive hover:opacity-80"
          >
            <Trash2 size={12} />
          </button>
        ),
      }),
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Grid>
      <Grid.Item>
        <CommonTable
          table={table}
          noDataText="No industry category available"
        />
      </Grid.Item>
    </Grid>
  );
};
