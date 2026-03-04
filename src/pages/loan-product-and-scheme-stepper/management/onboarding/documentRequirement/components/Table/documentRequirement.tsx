// DocumentRequirementTable.tsx
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
  useGetDocumentOptionsQuery,
  useGetAcceptanceLevelsQuery,
} from "@/global/service/end-points/loan-product-and-scheme/document-requirements";
import { useAppSelector } from "@/hooks/store";

interface DocumentRequirement {
  id: string;
  documentIdentity: string;
  acceptanceLevelIdentity: string;
  documentName: string;
  acceptanceLevelName?: string;
  mandatory: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface DocumentRequirementTableProps {
  tableData: DocumentRequirement[];
  onDelete: (item: DocumentRequirement) => void;
  onEdit: (item: DocumentRequirement) => void;
}

const columnHelper = createColumnHelper<DocumentRequirement>();

export const DocumentRequirementTable: React.FC<
  DocumentRequirementTableProps
> = ({ tableData, onEdit }) => {
  const [filterDocument, setFilterDocument] = useState("All");
  const [filterAcceptance, setFilterAcceptance] = useState("All");

  const { currentSchemeId } = useAppSelector(state => state.loanProduct);

  // API hooks for dynamic options
  const { data: documentOptions = [] } = useGetDocumentOptionsQuery(
    {
      schemeId: currentSchemeId || "",
      tenantId: "default",
    },
    {
      skip: !currentSchemeId,
    }
  );
  const { data: acceptanceLevels = [] } = useGetAcceptanceLevelsQuery(
    {
      schemeId: currentSchemeId || "",
      tenantId: "default",
    },
    {
      skip: !currentSchemeId,
    }
  );

  const columns = useMemo(
    () => [
      columnHelper.accessor("documentName", {
        header: "Document Name",
        cell: info => (
          <span className="text-xxs font-medium">{info.getValue()}</span>
        ),
      }),
      columnHelper.accessor("acceptanceLevelName", {
        header: "Acceptance Level",
        cell: info => (
          <span className="text-xxs font-medium">{info.getValue() || ""}</span>
        ),
      }),
      columnHelper.accessor("mandatory", {
        header: "Mandatory Status",
        cell: info => (
          <span
            className={`text-xxs rounded-full px-3 py-1 font-medium ${
              info.getValue()
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {info.getValue() ? "Mandatory" : "Optional"}
          </span>
        ),
      }),
      columnHelper.accessor("isActive", {
        header: "Status",
        cell: info => (
          <span
            className={`text-xxs rounded-full px-3 py-1 font-medium ${
              info.getValue()
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {info.getValue() ? "Active" : "Inactive"}
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
            onClick={() => onEdit(row.original)}
          >
            <Pencil className="h-4 w-4 text-blue-600" />
          </Button>
        ),
      }),
    ],
    [onEdit]
  );

  const filteredData = useMemo(() => {
    return tableData.filter(item => {
      const matchDocument =
        filterDocument === "All" || item.documentName === filterDocument;
      const matchAcceptance =
        filterAcceptance === "All" ||
        (item.acceptanceLevelName &&
          item.acceptanceLevelName === filterAcceptance);
      return matchDocument && matchAcceptance;
    });
  }, [tableData, filterDocument, filterAcceptance]);

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });

  // Dynamic options from API and table data
  const documentFilterOptions = useMemo(
    () => [
      { value: "All", label: "All" },
      ...documentOptions.map(doc => ({ value: doc.label, label: doc.label })),
    ],
    [documentOptions]
  );

  const acceptanceFilterOptions = useMemo(
    () => [
      { value: "All", label: "All" },
      ...acceptanceLevels.map(level => ({
        value: level.label,
        label: level.label,
      })),
    ],
    [acceptanceLevels]
  );

  return (
    <div className="w-full">
      {/* Filters */}
      <div className="mb-6 rounded-lg border bg-gray-50 p-4">
        <Flex align="end" className="gap-4">
          <div className="w-64">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Document Name
            </label>
            <Select
              value={filterDocument}
              onValueChange={setFilterDocument}
              options={documentFilterOptions}
              size="form"
              placeholder="Select document"
              fullWidth
            />
          </div>

          <div className="w-64">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Acceptance Level
            </label>
            <Select
              value={filterAcceptance}
              onValueChange={setFilterAcceptance}
              options={acceptanceFilterOptions}
              size="form"
              placeholder="Select acceptance level"
              fullWidth
            />
          </div>

          <Button variant="primary" size="default">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
        </Flex>
      </div>

      {/* Table */}
      <CommonTable table={table} size="default" />
    </div>
  );
};
