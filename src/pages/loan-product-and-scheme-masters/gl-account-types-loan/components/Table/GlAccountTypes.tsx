import React, { useMemo, useState, useCallback } from "react";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { CommonTable } from "@/components/ui/data-table";
import { Grid } from "@/components/ui";
import { Switch } from "@/components/ui/switch";
import type {
  GLAccountSearchResult,
  GLAccountTypeData,
} from "@/types/loan-product-and-scheme-masters/gl-account-types.types";
import { useLazySearchGLAccountsThreeQuery } from "@/global/service/end-points/loan-product-and-service-masters/gl-account-types";
import { logger } from "@/global/service";
import { InputWithSearch } from "@/components/ui/input-with-search";

interface GLAccountTypesTableProps {
  glAccountTypes: GLAccountTypeData[];
  onUpdateGLAccount: (
    glAccountTypeId: string,
    glAccountId: string | null,
    glAccountName: string | null
  ) => void;
  onToggleActive: (glAccountTypeId: string) => void;
  isLoading?: boolean;
  readonly?: boolean;
}

const columnHelper = createColumnHelper<GLAccountTypeData>();

interface SelectedGLAccount {
  identity: string;
  name: string;
  code: string;
}

const GLAccountSearchCell: React.FC<{
  glAccountTypeId: string;
  currentValue: string | null;
  currentName: string | null;
  onUpdate: (
    glAccountTypeId: string,
    glAccountId: string | null,
    glAccountName: string | null
  ) => void;
  readonly?: boolean;
}> = ({ glAccountTypeId, currentValue, currentName, onUpdate, readonly }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<GLAccountSearchResult[]>(
    []
  );
  const [showResults, setShowResults] = useState(false);
  const [selectedGLAccount, setSelectedGLAccount] =
    useState<SelectedGLAccount | null>(
      currentValue && currentName
        ? { identity: currentValue, name: currentName, code: "" }
        : null
    );

  const [triggerSearch, { isLoading }] = useLazySearchGLAccountsThreeQuery();

  React.useEffect(() => {
    if (currentValue && currentName) {
      setSelectedGLAccount({
        identity: currentValue,
        name: currentName,
        code: "",
      });
    } else {
      setSelectedGLAccount(null);
    }
  }, [currentValue, currentName]);

  const handleSearch = useCallback(async () => {
    if (!searchTerm.trim() || searchTerm.length < 3) {
      logger.info("Please enter at least 3 characters to search", {
        toast: true,
      });
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    try {
      const results = await triggerSearch(searchTerm).unwrap();
      setSearchResults(results);
      setShowResults(true);
    } catch (error) {
      logger.error("No GL Account found", { toast: true });
      logger.error(error, { toast: false });

      setSearchResults([]);
      setShowResults(false);
    }
  }, [searchTerm, triggerSearch]);

  const handleSelect = useCallback(
    (option: {
      value: string;
      label: string;
      glAccountName: string;
      glAccountCode: string;
    }) => {
      const selected: SelectedGLAccount = {
        identity: option.value,
        name: option.glAccountName,
        code: option.glAccountCode,
      };

      setSelectedGLAccount(selected);
      onUpdate(glAccountTypeId, option.value, option.glAccountName);
      setSearchTerm("");
      setSearchResults([]);
      setShowResults(false);
    },
    [glAccountTypeId, onUpdate]
  );

  const handleClear = useCallback(() => {
    setSelectedGLAccount(null);
    onUpdate(glAccountTypeId, null, null);
    setSearchTerm("");
    setSearchResults([]);
    setShowResults(false);
  }, [glAccountTypeId, onUpdate]);

  const handleSearchTermChange = useCallback(
    (value: string) => {
      const expectedValue = selectedGLAccount
        ? `${selectedGLAccount.name}${selectedGLAccount.code ? ` - ${selectedGLAccount.code}` : ""}`
        : "";

      if (selectedGLAccount && value !== expectedValue) {
        setSelectedGLAccount(null);
        setSearchTerm(value);
      } else {
        setSearchTerm(value);
      }

      if (!value.trim()) {
        setSearchResults([]);
        setShowResults(false);
      }
    },
    [selectedGLAccount]
  );

  if (readonly) {
    return <span className="text-xs">{currentName || "—"}</span>;
  }

  const displayValue = selectedGLAccount
    ? `${selectedGLAccount.name}${selectedGLAccount.code ? ` - ${selectedGLAccount.code}` : ""}`
    : searchTerm || "";

  const dropdownOptions = searchResults.map(result => ({
    value: result.identity,
    label: `${result.glCode ?? "-"} - ${result.glName}`,
    glAccountName: result.glName,
    glAccountCode: result.glCode,
  }));

  return (
    <div className="relative">
      <InputWithSearch
        value={displayValue}
        onChange={e => handleSearchTermChange(e.target.value)}
        onSearch={handleSearch}
        placeholder="Search GL Account..."
        size="form"
        variant="form"
        isSearching={isLoading}
        disabled={readonly}
        onDoubleClick={() => {
          if (selectedGLAccount && !readonly) {
            handleClear();
          }
        }}
        onClose={() => {
          setShowResults(false);
          setSearchTerm("");
        }}
        onKeyDown={e => {
          if (e.key === "Escape" && selectedGLAccount && !readonly) {
            handleClear();
          }
        }}
        showDropdown={showResults && searchTerm.length >= 3}
        dropdownOptions={dropdownOptions}
        onOptionSelect={handleSelect as (option: unknown) => void}
        dropdownLoading={isLoading}
        noResultsText="No GL accounts found for this search term."
      />
    </div>
  );
};

export const GLAccountTypesTable: React.FC<GLAccountTypesTableProps> = ({
  glAccountTypes,
  onUpdateGLAccount,
  onToggleActive,
  isLoading = false,
  readonly = false,
}) => {
  const columns = useMemo(
    () => [
      columnHelper.accessor("category", {
        header: "GL Category",
        // size: 150,
        cell: info => <span className="text-xs">{info.getValue()}</span>,
      }),
      columnHelper.accessor("glAccountType", {
        header: "GL Account Type",
        // size: 200,
        cell: info => (
          <span className="text-xs font-medium">{info.getValue()}</span>
        ),
      }),
      columnHelper.display({
        id: "glAccount",
        header: "GL Account",
        // size: 250,
        cell: ({ row }) => (
          <GLAccountSearchCell
            glAccountTypeId={row.original.glAccountTypeId}
            currentValue={row.original.glAccountId}
            currentName={row.original.glAccountName}
            onUpdate={onUpdateGLAccount}
            readonly={readonly}
          />
        ),
      }),
      columnHelper.accessor("isActive", {
        header: "Status",
        // size: 100,
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Switch
              checked={row.original.isActive}
              onCheckedChange={() =>
                onToggleActive(row.original.glAccountTypeId)
              }
              disabled={readonly}
            />
          </div>
        ),
      }),
    ],
    [onUpdateGLAccount, onToggleActive, readonly]
  );

  const table = useReactTable({
    data: glAccountTypes,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const getNoDataText = () => {
    if (isLoading) {
      return "Loading GL account types...";
    }
    return "No GL account types found";
  };

  return (
    <article className="mt-4">
      <Grid>
        <Grid.Item>
          <CommonTable
            table={table}
            size="default"
            noDataText={getNoDataText()}
            className="bg-card"
          />
        </Grid.Item>
      </Grid>
    </article>
  );
};
