import {
  CommonTable,
  Flex,
  Grid,
  HeaderWrapper,
  TitleHeader,
} from "@/components";
import {
  createColumnHelper,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo, useCallback } from "react";
import {
  useGetFirmAccountTypesQuery,
  useGetFirmAccountStatusesQuery,
} from "@/global/service/end-points/master/firm-master";
import VerificationStatus from "@/components/ui/verification-status/verification-status";
import NeumorphicButton from "@/components/ui/neumorphic-button/neumorphic-button";

interface BankAccount {
  bankName?: string;
  bank_name?: string;
  branchName?: string;
  accountNumber?: string;
  account_number?: string;
  maskedAccountNumber?: string;
  accountHolderName?: string;
  ifscCode?: string;
  ifsc_code?: string;
  ifsc?: string;
  accountType?: string;
  account_type?: string;
  accountStatus?: string;
  pdStatus?: string;
  isPrimary?: boolean;
  isActive?: boolean;
  upiId?: string;
  upiVerified?: boolean;
  bankProofDocumentRefId?: string;
  bankProofFilePath?: string;
  bankAccountIdentity?: string;
}

interface AccountType {
  identity?: string;
  id?: string | number;
  value?: string;
  accountType?: string;
  name?: string;
  label?: string;
}

const columnHelper = createColumnHelper<BankAccount>();

interface BankDetailsTableComponentProps {
  data?: BankAccount[] | { bankAccounts?: BankAccount[] };
}

export const BankDetailsTable = ({
  data = [],
}: BankDetailsTableComponentProps) => {
  const { data: accountTypes = [], isLoading: typesLoading } =
    useGetFirmAccountTypesQuery();
  const { isLoading: statusesLoading } = useGetFirmAccountStatusesQuery();

  // Extract bankAccounts array if data is an object with bankAccounts property
  const bankAccounts = Array.isArray(data) ? data : data?.bankAccounts || [];

  // Check if account is primary

  const getAccountTypeName = useCallback(
    (id: string) => {
      const type = (accountTypes as AccountType[]).find(
        (type: AccountType) =>
          type.identity === id || String(type.id) === id || type.value === id
      );
      return type?.accountType || type?.name || type?.label || "Unknown Type";
    },
    [accountTypes]
  );

  const columns = useMemo(() => {
    return [
      columnHelper.display({
        id: "accountType",
        header: "Type",
        cell: ({ row }) => {
          const typeId = row.original.accountType || row.original.account_type;
          return (
            <span className="text-table-cell text-xxs font-medium">
              {typeId ? getAccountTypeName(typeId) : "-"}
            </span>
          );
        },
        enableSorting: true,
      }),
      columnHelper.display({
        id: "bankName",
        header: "Bank Name",
        cell: ({ row }) => (
          <span className="text-table-cell text-xxs font-medium">
            {row.original.bankName || row.original.bank_name || "-"}
          </span>
        ),
        enableSorting: true,
      }),
      columnHelper.display({
        id: "accountNumber",
        header: "Account Number",
        cell: ({ row }) => {
          const accountNumber =
            row.original.accountNumber || row.original.account_number;
          const maskedNumber = accountNumber
            ? "x".repeat(accountNumber.length - 4) + accountNumber.slice(-4)
            : "-";
          return (
            <span className="text-table-cell text-xxs font-medium">
              {maskedNumber}
            </span>
          );
        },
        enableSorting: true,
      }),
      columnHelper.display({
        id: "ifsc",
        header: "IFSC",
        cell: ({ row }) => (
          <span className="text-table-cell text-xxs font-medium">
            {row.original.ifscCode ||
              row.original.ifsc_code ||
              row.original.ifsc ||
              "-"}
          </span>
        ),
        enableSorting: true,
      }),

      columnHelper.display({
        id: "branchName",
        header: "Branch Name",
        cell: ({ row }) => (
          <span className="text-table-cell text-xxs font-medium">
            {row.original.branchName || "-"}
          </span>
        ),
        enableSorting: true,
      }),

      columnHelper.accessor("pdStatus", {
        header: "Penny drop verification",
        cell: info => {
          const pdStatus = info.getValue();
          const verified = pdStatus === "VERIFIED" ? true : false;
          return (
            <VerificationStatus
              labelVerified="Valid"
              labelDenied="Denied"
              verified={verified}
            />
          );
        },
        enableSorting: true,
      }),

      columnHelper.accessor("upiVerified", {
        header: "UPI  ID Verification",
        cell: info => {
          const verified = info.getValue();
          return (
            <VerificationStatus
              labelVerified="Valid"
              labelDenied="Invalid"
              verified={verified}
            />
          );
        },
        enableSorting: true,
      }),

      columnHelper.display({
        id: "status",
        header: "Status",
        cell: ({ row }) => {
          const isActive = row.original.isActive;

          return (
            <NeumorphicButton
              variant={isActive ? "success" : "error"}
              size={isActive ? "success" : "error"}
              className="min-h-0 px-4 py-1"
            >
              {isActive ? "Active" : "Inactive"}
            </NeumorphicButton>
          );
        },
        enableSorting: true,
      }),
      columnHelper.display({
        id: "isPrimary",
        header: "Primary",
        cell: ({ row }) => (
          <span
            className={`text-table-cell text-xxs font-medium ${
              row.original.isPrimary ? "text-green-600" : "text-gray-500"
            }`}
          >
            {row.original.isPrimary ? "Yes" : "No"}
          </span>
        ),
        enableSorting: true,
      }),
    ];
  }, [getAccountTypeName]);

  const table = useReactTable({
    data: bankAccounts,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });
  return (
    <Grid className="mt-1 px-2">
      <Flex justify="between" align="center" className="mb-2">
        <HeaderWrapper>
          <TitleHeader title="Bank Accounts" />
        </HeaderWrapper>
      </Flex>

      <Grid.Item>
        <CommonTable table={table} size="default" className="bg-card" />
      </Grid.Item>
      {(typesLoading || statusesLoading) && (
        <div className="flex justify-center py-4">
          <div className="text-xs text-gray-500">
            Loading account details...
          </div>
        </div>
      )}
    </Grid>
  );
};
