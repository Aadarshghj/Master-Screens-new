import React, { useMemo } from "react";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { CommonTable, Grid } from "@/components";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { RoleInFirm } from "@/types/firm/firm-details.types";

interface AssociatedPersonData {
  customerCode: string;
  customerName: string;
  roleInFirm: string;
  roleInFirmIdentity?: string;
  authorizedSignatory: boolean;
  durationWithCompany: string;
}

const columnHelper = createColumnHelper<AssociatedPersonData>();

// Function to get role display name from role ID/key
const getRoleDisplayName = (roleValue: string): string => {
  // Handle both enum values and keys
  const roleEntries = Object.entries(RoleInFirm);

  // First try to find by value (e.g., "Director")
  const byValue = roleEntries.find(([, value]) => value === roleValue);
  if (byValue) return byValue[1];

  // Then try to find by key (e.g., "DIRECTOR")
  const byKey = roleEntries.find(([key]) => key === roleValue);
  if (byKey) return byKey[1];

  // Return original value if no match found
  return roleValue;
};

interface FirmDetailsTableProps {
  handleRemoveAssociate: (customerCode: string) => void;
  data: AssociatedPersonData[];
  roleInFirmOptions?: Array<{
    value: string | number;
    label: string;
    identity?: string | number;
  }>;
  readonly?: boolean;
}

export const FirmDetailsTable: React.FC<FirmDetailsTableProps> = ({
  handleRemoveAssociate,
  data,
  roleInFirmOptions = [],
  readonly = false,
}) => {
  // Function to get role display name from role ID using API options
  const getRoleNameFromOptions = (roleValue: string): string => {
    if (!roleValue) return "";
    // First try to match by identity/value
    const option = roleInFirmOptions.find(
      opt =>
        opt.value?.toString() === roleValue.toString() ||
        opt.identity?.toString() === roleValue.toString()
    );
    return option ? option.label : getRoleDisplayName(roleValue);
  };
  const columns = useMemo(
    () => [
      columnHelper.accessor("customerCode", {
        header: "Customer Code",
        cell: info => (
          <span className="text-foreground font-medium">{info.getValue()}</span>
        ),
      }),
      columnHelper.accessor("customerName", {
        header: "Customer Name",
        cell: info => (
          <span className="text-foreground">{info.getValue()}</span>
        ),
      }),
      columnHelper.accessor("roleInFirm", {
        header: "Role in firm",
        cell: info => {
          // Handle both roleInFirm and roleInFirmIdentity from API
          const roleValue =
            info.getValue() || info.row.original.roleInFirmIdentity || "";
          return (
            <span className="text-foreground">
              {getRoleNameFromOptions(roleValue)}
            </span>
          );
        },
      }),
      columnHelper.accessor("authorizedSignatory", {
        header: "Authorized Signatory",
        cell: info => (
          <span className="text-foreground">
            {info.getValue() ? "Yes" : "No"}
          </span>
        ),
      }),
      columnHelper.accessor("durationWithCompany", {
        header: "Duration with company",
        cell: info => (
          <span className="text-foreground">{info.getValue()}</span>
        ),
      }),
      ...(readonly
        ? []
        : [
            columnHelper.display({
              id: "actions",
              header: () => (
                <div className="text-left">
                  <span className="text-foreground font-medium">Action</span>
                </div>
              ),
              cell: ({ row }) => (
                <div className="flex items-center ">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive/90"
                    onClick={() =>
                      handleRemoveAssociate(row.original.customerCode)
                    }
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ),
            }),
          ]),
    ],
    [handleRemoveAssociate, getRoleNameFromOptions]
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <article className="mt-1 px-2">
      <Grid>
        <Grid.Item>
          <CommonTable
            table={table}
            size="default"
            noDataText="No records found"
            className="bg-card"
          />
        </Grid.Item>
      </Grid>
    </article>
  );
};
