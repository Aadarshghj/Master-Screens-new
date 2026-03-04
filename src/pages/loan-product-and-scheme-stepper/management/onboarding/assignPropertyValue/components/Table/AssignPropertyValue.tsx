// PropertyValuesTable.tsx
import React, { useMemo, useState, useCallback } from "react";
import { Input, Switch, CommonTable } from "@/components";
import { InputWithSearch } from "@/components/ui/input-with-search/index";
import {
  createColumnHelper,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  getPaginationRowModel,
} from "@tanstack/react-table";

import type {
  PropertyValue,
  PropertyValuesTableProps,
  GLAccountItem as GLAccount,
} from "@/types/loan-product-and schema Stepper/assign-property.types";
import { useGetGLAccountsQuery } from "@/global/service/end-points/loan-product-and-scheme/loan-scheme-property-values";

const columnHelper = createColumnHelper<PropertyValue>();

export const PropertyValuesTable: React.FC<PropertyValuesTableProps> = ({
  tableData,
  handlePropertyValueChange,
  handleGLAccountChange,
  handleGLAccountNameChange,
  handleStatusChange,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState<number | null>(null);

  const currentSearchTerm =
    dropdownOpen !== null ? tableData[dropdownOpen]?.glAccountName || "" : "";

  const { data: glAccounts = [], isLoading } = useGetGLAccountsQuery(
    currentSearchTerm,
    {
      skip: dropdownOpen === null || currentSearchTerm.trim().length < 2,
    }
  );

  // ---------- handlers ----------
  const handlePropertyValueChangeLocal = useCallback(
    (index: number, value: string) => {
      // Only allow numbers (including decimals) with max 2 decimal places
      let numericValue = value.replace(/[^0-9.]/g, "");

      // Prevent multiple decimal points
      const decimalCount = (numericValue.match(/\./g) || []).length;
      if (decimalCount > 1) {
        numericValue = numericValue.substring(0, numericValue.lastIndexOf("."));
      }

      // Limit to 2 decimal places
      const parts = numericValue.split(".");
      if (parts[1] && parts[1].length > 2) {
        numericValue = parts[0] + "." + parts[1].substring(0, 2);
      }

      // Limit total length to prevent overflow
      if (numericValue.length > 12) {
        numericValue = numericValue.substring(0, 12);
      }

      handlePropertyValueChange(index, numericValue);
    },
    [handlePropertyValueChange]
  );

  const handleGLAccountInputChange = useCallback(
    (index: number, value: string) => {
      handleGLAccountNameChange(index, value);
      if (value.trim().length >= 2) {
        setDropdownOpen(index);
      } else {
        setDropdownOpen(null);
      }
    },
    [handleGLAccountNameChange]
  );

  const handleGLAccountSelect = useCallback(
    (account: GLAccount, index: number) => {
      handleGLAccountChange(index, account.identity);
      setDropdownOpen(null);
    },
    [handleGLAccountChange]
  );

  const handleSearchClick = useCallback(
    (index: number) => {
      const value = tableData[index]?.glAccountName || "";
      if (value.trim().length >= 2) {
        setDropdownOpen(prev => (prev === index ? null : index));
      }
    },
    [tableData]
  );

  const handleStatusChangeLocal = useCallback(
    (index: number, checked: boolean) => handleStatusChange(index, checked),
    [handleStatusChange]
  );

  // ---------- columns ----------
  const columns = useMemo(
    () => [
      columnHelper.accessor("propertyKey", {
        header: "Property Key",
        cell: info => (
          <span className="text-xxs font-medium">{info.getValue()}</span>
        ),
      }),
      columnHelper.accessor("defaultValue", {
        header: "Default Value",
        cell: info => (
          <span className="text-xxs">{String(info.getValue())}</span>
        ),
      }),
      columnHelper.display({
        id: "propertyValueEdit",
        header: "Property Value",
        cell: ({ row }) => (
          <Input
            value={row.original.propertyValue}
            onChange={e =>
              handlePropertyValueChangeLocal(row.index, e.target.value)
            }
            className="text-xxs h-8"
            type="text"
            inputMode="decimal"
            pattern="[0-9]+(\.[0-9]{0,2})?"
            placeholder="Enter numeric value"
            disabled={!row.original.status}
          />
        ),
      }),
      columnHelper.display({
        id: "glAccount",
        header: "GL Account",
        cell: ({ row }) => (
          <InputWithSearch
            value={row.original.glAccountName || ""}
            onChange={e =>
              handleGLAccountInputChange(row.index, e.target.value)
            }
            onSearch={() => handleSearchClick(row.index)}
            placeholder="Type to search GL Account"
            size="form"
            variant="form"
            disabled={!row.original.status}
            isSearching={isLoading && dropdownOpen === row.index}
            showDropdown={
              dropdownOpen === row.index && currentSearchTerm.trim().length >= 2
            }
            dropdownOptions={glAccounts.map(acc => ({
              value: acc.identity,
              label: acc.glName,
              glCode: acc.glCode,
            }))}
            onOptionSelect={(option: {
              value: string;
              label: string;
              glCode?: string;
            }) => {
              handleGLAccountSelect(
                {
                  identity: option.value,
                  glName: option.label,
                  glCode: option.glCode || "",
                  level: 0,
                },
                row.index
              );
            }}
            dropdownLoading={isLoading}
            noResultsText="No GL accounts found"
          />
        ),
      }),
      columnHelper.display({
        id: "status",
        header: "Status",
        cell: ({ row }) => (
          <Switch
            checked={row.original.status}
            onCheckedChange={c => handleStatusChangeLocal(row.index, c)}
          />
        ),
      }),
    ],
    [
      handlePropertyValueChangeLocal,
      handleGLAccountInputChange,
      handleSearchClick,
      handleStatusChangeLocal,
    ]
  );

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });

  // ---------- render ----------
  return (
    <div className="w-full">
      <CommonTable table={table} size="default" />
    </div>
  );
};
