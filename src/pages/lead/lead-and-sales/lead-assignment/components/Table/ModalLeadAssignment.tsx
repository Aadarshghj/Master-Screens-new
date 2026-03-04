import React, { useMemo } from "react";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { CommonTable } from "@/components/ui/data-table";
import { HeaderWrapper } from "@/components/ui/header-wrapper/HeaderWrapper";
import { TitleHeader } from "@/components/ui/title-header/TitleHeader";
import { Flex, Grid } from "@/components/ui";
import { Badge } from "@/components/ui/badge";
import toast from "react-hot-toast";
import { logger } from "@/global/service";
import type { AssignmentHistory } from "@/types/lead";

interface ModalLeadAssignmentProps {
  assignmentHistory: AssignmentHistory[];
}

const columnHelper = createColumnHelper<AssignmentHistory>();

export const ModalLeadAssignmentTable: React.FC<ModalLeadAssignmentProps> = ({
  assignmentHistory,
}) => {
  const columns = useMemo(
    () => [
      columnHelper.accessor("leadCode", {
        header: "Lead Code",
        cell: info => (
          <span className="text-foreground font-medium">
            {info.getValue() || "-"}
          </span>
        ),
      }),
      columnHelper.accessor("fullName", {
        header: "Full Name",
        cell: info => (
          <span className="text-foreground">{info.getValue() || "-"}</span>
        ),
      }),
      columnHelper.accessor("assignedTo", {
        header: "Assigned To",
        cell: info => (
          <span className="text-foreground">{info.getValue() || "-"}</span>
        ),
      }),

      columnHelper.accessor("assignedOn", {
        header: "Assigned On",
        cell: info => {
          const date = info.getValue();
          if (!date) return <span>-</span>;

          try {
            const [year, month, day] = date.split("-");
            const localDate = new Date(
              parseInt(year),
              parseInt(month) - 1,
              parseInt(day)
            );

            const formattedDate = localDate.toLocaleDateString("en-IN", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            });

            return <span className="text-foreground">{formattedDate}</span>;
          } catch (_error: unknown) {
            let errorMessage = "Failed to update lead assignment";

            if (typeof _error === "object" && _error !== null) {
              const err = _error as { data?: { message?: string } };
              if (err.data?.message) {
                errorMessage = err.data.message;
              }
            }
            logger.error("Error updating lead assignment:", { toast: true });
            toast.error(errorMessage);
            return <span className="text-foreground">{date}</span>;
          }
        },
      }),
      columnHelper.accessor("status", {
        header: "Status",
        cell: info => {
          const status = info.getValue();
          return (
            <Badge
              variant={status === "ACTIVE" ? "default" : "secondary"}
              className="text-xs"
            >
              {status || "-"}
            </Badge>
          );
        },
      }),
    ],
    []
  );

  const table = useReactTable({
    data: assignmentHistory || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <article className="mt-2">
      <Grid>
        <Flex justify="between" align="center" className="mb-2">
          <HeaderWrapper>
            <TitleHeader title="Assignment History" />
          </HeaderWrapper>
        </Flex>

        <Grid.Item>
          {assignmentHistory && assignmentHistory.length > 0 ? (
            <CommonTable
              table={table}
              size="default"
              noDataText="No assignment history found"
              className="bg-card"
            />
          ) : (
            <div className="bg-muted/50 rounded-md border py-8 text-center">
              <p className="text-muted-foreground">
                No assignment history available
              </p>
            </div>
          )}
        </Grid.Item>
      </Grid>
    </article>
  );
};
