// GLHeadsTable.tsx
import React, { useMemo, useState } from "react";
import { Button, CommonTable } from "@/components";
import {
  createColumnHelper,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  getPaginationRowModel,
} from "@tanstack/react-table";
import { Pencil, Filter } from "lucide-react";
import { Select } from "@/components";
import { Flex } from "@/components/ui/flex";
import {
  useGetGLTypesQuery,
  useGetGLAccountsByTypeQuery,
  useGetGLMappingByTypeQuery,
} from "@/global/service/end-points/loan-product-and-scheme/gl-mappings";
import { useAppSelector } from "@/hooks/store";
import type { GLMappingTableData } from "@/types/loan-product-and schema Stepper/gl-mappings.types";

const columnHelper = createColumnHelper<GLMappingTableData>();

interface GLHeadsTableProps {
  tableData: GLMappingTableData[];
  setTableData?: React.Dispatch<React.SetStateAction<GLMappingTableData[]>>;
  onEdit?: (item: GLMappingTableData) => void;
  onDelete?: (item: GLMappingTableData) => void;
}

export const GLHeadsTable: React.FC<GLHeadsTableProps> = ({
  tableData,
  onEdit,
}) => {
  const [filterDocument, setFilterDocument] = useState("All");
  const [filterAcceptance, setFilterAcceptance] = useState("All");
  const [selectedGLTypeId] = useState<string>("");
  const [selectedFilterGLType, setSelectedFilterGLType] = useState<string>("");

  const { currentSchemeId } = useAppSelector(state => state.loanProduct);

  // API hooks
  const { data: glTypes = [] } = useGetGLTypesQuery();

  // Get GL accounts for the selected filter type
  const { data: filterGLAccounts = [] } = useGetGLAccountsByTypeQuery(
    selectedFilterGLType,
    {
      skip: !selectedFilterGLType || selectedFilterGLType === "All",
    }
  );

  const { isLoading: filterLoading } = useGetGLMappingByTypeQuery(
    { schemeId: currentSchemeId!, glTypeId: selectedGLTypeId },
    {
      skip: !currentSchemeId || !selectedGLTypeId || selectedGLTypeId === "All",
      refetchOnMountOrArgChange: true,
    }
  );

  const columns = useMemo(
    () => [
      columnHelper.accessor("glAccountTypeName", {
        header: "GL Account Type",
        cell: info => (
          <span className="text-table-cell text-xxs font-medium">
            {info.getValue()}
          </span>
        ),
      }),
      columnHelper.accessor("glAccountName", {
        header: "GL Account Name",
        cell: info => (
          <span className="text-table-cell text-xxs font-medium">
            {info.getValue()}
          </span>
        ),
      }),
      columnHelper.accessor("createdOn", {
        header: "Created On",
        cell: info => (
          <span className="text-table-cell text-xxs font-medium">
            {info.getValue()}
          </span>
        ),
      }),
      columnHelper.accessor("updatedOn", {
        header: "Updated On",
        cell: info => (
          <span className="text-table-cell text-xxs font-medium">
            {info.getValue()}
          </span>
        ),
      }),
      columnHelper.display({
        id: "action",
        header: "Action",
        cell: ({ row }) => (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              onEdit?.(row.original);
            }}
          >
            <Pencil className="h-4 w-4 text-blue-600" />
          </Button>
        ),
      }),
    ],
    [onEdit]
  );

  // Handle filter functionality
  const handleFilter = () => {
    // Filtering is now handled automatically by the useMemo
  };

  // Calculate display data based on current state
  const filteredData = useMemo(() => {
    let dataToUse = tableData || [];

    // Apply GL Account Type filter
    if (filterDocument !== "All") {
      dataToUse = dataToUse.filter(
        item => item.glAccountTypeName === filterDocument
      );
    }

    // Apply GL Account Name filter
    if (filterAcceptance !== "All") {
      dataToUse = dataToUse.filter(
        item => item.glAccountName === filterAcceptance
      );
    }

    return dataToUse;
  }, [filterDocument, filterAcceptance, tableData]);

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });

  // Dynamic options from API and table data
  const documentOptions = useMemo(
    () => [
      { value: "All", label: "All" },
      ...glTypes.map(type => ({ value: type.label, label: type.label })),
    ],
    [glTypes]
  );

  // GL Account options from API when a type is selected, otherwise from table data
  const acceptanceOptions = useMemo(() => {
    const baseOptions = [{ value: "All", label: "All" }];

    if (
      selectedFilterGLType &&
      selectedFilterGLType !== "All" &&
      filterGLAccounts.length > 0
    ) {
      // Use API data when a specific GL type is selected
      return [
        ...baseOptions,
        ...filterGLAccounts.map(account => ({
          value: account.label,
          label: account.label,
        })),
      ];
    } else {
      // Use table data when "All" is selected
      return [
        ...baseOptions,
        ...Array.from(new Set(tableData.map(item => item.glAccountName)))
          .filter(name => name && name !== "Unknown Account")
          .map(name => ({ value: name, label: name })),
      ];
    }
  }, [selectedFilterGLType, filterGLAccounts, tableData]);

  return (
    <div className="w-full">
      {/* Filters */}
      <div className="mb-6 rounded-lg border bg-gray-50 p-4">
        <Flex align="end" className="gap-4">
          <div className="w-64">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              GL Account Type
            </label>
            <Select
              value={filterDocument}
              onValueChange={value => {
                setFilterDocument(value);
                // Set the GL type ID for fetching accounts
                const selectedType = glTypes.find(type => type.label === value);
                setSelectedFilterGLType(selectedType?.value || "");
                // Reset GL account filter when type changes
                setFilterAcceptance("All");
              }}
              options={documentOptions}
              size="form"
              placeholder="Select GL Account Type"
              fullWidth
            />
          </div>

          <div className="w-64">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              GL Account Name
            </label>
            <Select
              value={filterAcceptance}
              onValueChange={setFilterAcceptance}
              options={acceptanceOptions}
              size="form"
              placeholder="Select GL Account Name"
              fullWidth
            />
          </div>

          <Button
            variant="primary"
            size="default"
            onClick={handleFilter}
            disabled={filterLoading}
          >
            <Filter className="mr-2 h-4 w-4" />
            {filterLoading ? "Filtering..." : "Filter"}
          </Button>
        </Flex>
      </div>

      {/* Table */}
      <CommonTable table={table} size="default" />
    </div>
  );
};
