import React, { useMemo, useEffect, useCallback, useState } from "react";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { CommonTable } from "@/components/ui/data-table";
import { HeaderWrapper } from "@/components/ui/header-wrapper/HeaderWrapper";
import { TitleHeader } from "@/components/ui/title-header/TitleHeader";
import { Button, Flex, Grid } from "@/components/ui";
import { StatusBadge } from "@/components";
import { useGetBankAccountsQuery } from "@/global/service/end-points/customer/bank";
import { logger } from "@/global/service";
import type {
  BankAccountResponse,
  BankAccountTableProps,
} from "@/types/customer/bank.types";
import {
  useGetAccountStatusesQuery,
  useGetAccountTypesQuery,
} from "@/global/service/end-points/master/master";
import { useDisableState } from "@/hooks/useDisableState";
import VerificationStatus from "@/components/ui/verification-status/verification-status";
import NeumorphicButton from "@/components/ui/neumorphic-button/neumorphic-button";
import { Eye } from "lucide-react";
import { useFileViewer } from "@/hooks/useFileViewer";
import PhotoAndDocumentGallery from "@/components/ui/photo-gallery/PhotoGalleryModal";

const columnHelper = createColumnHelper<BankAccountResponse>();

export const BankAccountDetailsTable: React.FC<BankAccountTableProps> = ({
  customerIdentity,
  isView = false,
  readOnly = false,
  pendingForApproval = false,
}) => {
  const customerId = customerIdentity;
  const { handleUpdateState, handleResetState } = useDisableState({
    isView,
  });
  const [photoGalleryOpen, setphotoGalleryOpen] = useState(false);
  const {
    data: bankAccounts = [],
    isLoading,
    error,
  } = useGetBankAccountsQuery(customerId || "", {
    skip: !customerIdentity,
  });
  const { viewDocument, documentUrl } = useFileViewer();
  const handleViewDocument = useCallback(
    (document: BankAccountResponse) => {
      viewDocument(document.bankProofFilePath);
      setphotoGalleryOpen(true);
    },
    [bankAccounts]
  );
  useEffect(() => {
    if (bankAccounts.length === 0) {
      handleUpdateState(
        "Incomplete Step",
        "Please complete the current step before continuing."
      );
    } else {
      handleResetState();
    }
  }, [bankAccounts]);

  const { data: accountTypes = [], error: accountTypesError } =
    useGetAccountTypesQuery();

  const { data: accountStatuses = [], error: accountStatusesError } =
    useGetAccountStatusesQuery();

  const getNoDataText = (isLoading: boolean, error: unknown) => {
    if (isLoading && customerId) return "Loading bank accounts...";
    if (error && customerId) return "Failed to load bank accounts";
    if (!customerId)
      return "Customer identity is required to view bank accounts.";
    if (bankAccounts.length === 0) return "No bank accounts added yet";
    return "No bank accounts found.";
  };

  useEffect(() => {
    if (error) {
      logger.error(error, { toast: true });
    }
  }, [error]);

  useEffect(() => {
    if (accountTypesError) {
      logger.error(accountTypesError, { toast: true });
    }
  }, [accountTypesError]);

  useEffect(() => {
    if (accountStatusesError) {
      logger.error(accountStatusesError, { toast: true });
    }
  }, [accountStatusesError]);

  const columns = useMemo(() => {
    const getAccountTypeLabel = (value: string): string => {
      if (!value) return "N/A";
      const option = accountTypes.find(opt => opt.value === value);
      return option ? option.label : value;
    };

    const getAccountStatusLabel = (value: string): string => {
      if (!value) return "N/A";
      const option = accountStatuses.find(opt => opt.value === value);
      return option ? option.label : value;
    };

    const baseColumns = [
      columnHelper.accessor("accountType", {
        header: "Type",
        cell: info => (
          <span className="text-foreground capitalize">
            {getAccountTypeLabel(info.getValue())}
          </span>
        ),
      }),
      columnHelper.accessor("bankName", {
        header: "Bank Name",
        cell: info => (
          <span className="text-foreground font-medium">{info.getValue()}</span>
        ),
      }),
      columnHelper.accessor("branchName", {
        header: "Branch Name",
        cell: info => (
          <span className="text-foreground font-medium">{info.getValue()}</span>
        ),
      }),
      columnHelper.accessor("accountNumber", {
        header: "Account Number",
        cell: info => {
          const accountNumber = info.getValue();
          return (
            <span className="text-foreground font-mono">
              ****{accountNumber.slice(-4)}
            </span>
          );
        },
      }),
      columnHelper.accessor("ifscCode", {
        header: "IFSC",
        cell: info => (
          <span className="text-foreground font-mono">{info.getValue()}</span>
        ),
      }),
      columnHelper.accessor("pdStatus", {
        header: "Penny drop verification",
        cell: info => (
          <VerificationStatus
            labelVerified="Valid"
            labelDenied="Invalid"
            verified={info.getValue() === "VERIFIED"}
          />
        ),
      }),
      columnHelper.accessor("upiVerified", {
        header: "UPI ID Verification",
        cell: info => (
          <VerificationStatus
            labelVerified="Valid"
            labelDenied="Invalid"
            verified={info.getValue()}
          />
        ),
      }),
      columnHelper.accessor("accountStatus", {
        header: "Status",
        cell: info => {
          const label = getAccountStatusLabel(info.getValue());
          const isActive = label === "ACTIVE";
          return (
            <NeumorphicButton
              variant={isActive ? "success" : "error"}
              size={isActive ? "success" : "error"}
              className="min-h-0 px-4 py-1"
            >
              {label}
            </NeumorphicButton>
          );
        },
      }),
      columnHelper.accessor("isPrimary", {
        header: () => <div className="text-center">Is Primary</div>,
        cell: info => (
          <div className="flex justify-center">
            <StatusBadge
              status={info.getValue() ? "Yes" : "No"}
              type="status"
              size="sm"
            />
          </div>
        ),
      }),
    ];

    const actionColumn =
      readOnly && !pendingForApproval
        ? [
            columnHelper.display({
              id: "actions",
              header: "Actions",
              cell: ({ row }) => (
                <Button
                  variant="ghost"
                  size="xs"
                  className="h-6 w-6 p-0 text-cyan-400 hover:bg-cyan-400/70"
                  title="View Document"
                  onClick={() => handleViewDocument(row.original)}
                >
                  <Eye className="w-3" />
                </Button>
              ),
            }),
          ]
        : [];

    return [...baseColumns, ...actionColumn];
  }, [accountTypes, accountStatuses, readOnly, pendingForApproval]);

  const table = useReactTable({
    data: bankAccounts,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  const handleCloseGallery = () => {
    viewDocument("");
    setphotoGalleryOpen(false);
  };
  return (
    <article className="mt-1 px-2">
      <PhotoAndDocumentGallery
        title="Bank Account"
        fileType="DOC"
        imageUrl={documentUrl}
        isOpen={photoGalleryOpen && documentUrl !== null}
        onClose={handleCloseGallery}
      />
      <Grid>
        <Flex justify="between" align="center" className="mb-1">
          <HeaderWrapper>
            <TitleHeader title="Bank Account Details" />
          </HeaderWrapper>
        </Flex>

        <Grid.Item>
          <CommonTable
            table={table}
            size="default"
            noDataText={getNoDataText(isLoading, error)}
            className="bg-card"
          />
        </Grid.Item>
      </Grid>
    </article>
  );
};
