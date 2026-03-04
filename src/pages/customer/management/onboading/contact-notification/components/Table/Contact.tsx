import React, { useCallback, useMemo, useEffect, useState } from "react";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { CommonTable } from "@/components/ui/data-table";
import { Button, Flex, HeaderWrapper, TitleHeader } from "@/components/ui";

import {
  useGetContactsQuery,
  useGetContactTypesDetailedQuery,
} from "@/global/service/end-points/customer/contact";
import { logger } from "@/global/service";
import type {
  ContactCaptureResponse,
  ContactFormData,
  ContactTableProps,
} from "@/types/customer/contact.types";
import { useDisableState } from "@/hooks/useDisableState";
import { Pencil } from "lucide-react";

const columnHelper = createColumnHelper<ContactCaptureResponse>();

const maskContactDetails = (
  contactDetails: string,
  showLast: number = 4
): string => {
  if (!contactDetails) return "";

  const detailStr = String(contactDetails);

  if (detailStr.includes("@")) {
    const [localPart, domain] = detailStr.split("@");
    const maskedLocal =
      localPart.length > 2
        ? localPart.substring(0, 2) +
          "x".repeat(Math.max(localPart.length - 2, 4))
        : "xxxx";
    return `${maskedLocal}@${domain}`;
  }

  if (detailStr.length <= showLast) {
    return detailStr;
  }

  const visiblePart = detailStr.slice(-showLast);
  const maskedLength = detailStr.length - showLast;
  const maskedPart = "x".repeat(maskedLength);

  return maskedPart + visiblePart;
};

export const ContactTable: React.FC<ContactTableProps> = ({
  customerIdentity,
  onEditContact,
  isView = false,
  readOnly = false,
  handleSetConfirmationModalData,
  confirmationModalData,
}) => {
  const { handleUpdateState, handleResetState } = useDisableState({
    isView,
  });
  const [showFullDetails, setShowFullDetails] = React.useState<Set<string>>(
    new Set()
  );
  const {
    data: contactsData = [],
    isLoading,
    error,
    isError,
    isFetching,
  } = useGetContactsQuery(customerIdentity ?? "", {
    refetchOnMountOrArgChange: true,
  });
  useEffect(() => {
    if (contactsData.length === 0) {
      handleUpdateState(
        "Incomplete Step",
        "Please complete the current step before continuing."
      );
    } else {
      handleResetState();
    }
  }, [contactsData]);
  useEffect(() => {
    if (error) {
      logger.error(error, { toast: true });
    }
  }, [error]);

  const {
    data: contactTypesData,
    isLoading: isContactTypesLoading,
    isError: isContactTypesError,
  } = useGetContactTypesDetailedQuery();

  const getNoDataText = (isLoading: boolean, error: unknown) => {
    if (isLoading && customerIdentity) return "Loading contacts...";
    if (error && customerIdentity) return "Failed to load contacts";
    if (!customerIdentity)
      return "Customer identity is required to view contacts.";
    if (contactsData.length === 0) return "No contacts added yet";
    return "No contacts found.";
  };

  const contactTypeMap = useMemo(() => {
    const map = new Map<string, string>();
    contactTypesData?.forEach(type => {
      map.set(type.identity, type.contactType);
    });
    return map;
  }, [contactTypesData]);

  const toggleShowDetails = useCallback((contactId: string) => {
    setShowFullDetails(prev => {
      const newSet = new Set(prev);
      if (newSet.has(contactId)) {
        newSet.delete(contactId);
      } else {
        newSet.add(contactId);
      }
      return newSet;
    });
  }, []);
  const [editData, setEditData] = useState<ContactFormData | null>(null);
  useEffect(() => {
    if (
      !confirmationModalData?.doAction ||
      confirmationModalData?.feature !== "EDIT"
    ) {
      return;
    }
    if (editData) onEditContact?.(editData);
  }, [confirmationModalData]);
  const columns = useMemo(
    () => [
      columnHelper.accessor(row => contactTypeMap.get(row.contactType), {
        id: "contactType",
        header: "Contact Type",
        cell: info => <span className="font-medium">{info.getValue()}</span>,
      }),
      columnHelper.accessor("contactDetails", {
        header: "Contact Details",
        cell: info => {
          const contactId = info.row.original.contactId;
          const isShowing = showFullDetails.has(contactId);
          const displayValue = isShowing
            ? info.getValue()
            : maskContactDetails(info.getValue());

          return (
            <Flex align="center" justify="start" gap={3}>
              <span className=" font-mono">{displayValue}</span>
            </Flex>
          );
        },
      }),

      columnHelper.accessor("isActive", {
        header: "Status",
        cell: info => <span>{info.getValue() ? "Active" : "InActive"}</span>,
      }),
      columnHelper.accessor("isPrimary", {
        id: "isPrimary",
        header: "Is Primary",
        cell: info => <span>{info.getValue() ? "Yes" : "No"}</span>,
      }),
      columnHelper.accessor("isOptOutPromotionalNotification", {
        header: () => "Subscribe/Unsubscribed promotional notification",
        cell: info => <span>{info.getValue() ? "Yes" : "No"}</span>,
      }),
      ...(readOnly
        ? []
        : [
            columnHelper.display({
              id: "actions",
              header: "Actions",
              cell: info => (
                <Button
                  variant="ghost"
                  size="xs"
                  className="h-6 w-6 p-0 text-cyan-400 hover:bg-cyan-400/70"
                  onClick={() => {
                    setEditData(info.row.original);
                    handleSetConfirmationModalData?.({
                      cancelText: "CANCEL",
                      confirmText: "EDIT",
                      feature: "EDIT",
                      description:
                        "Are you sure you want to edit this record? Any unsaved changes may be lost.",
                      title: "Edit Confirmation",
                      show: true,
                      doAction: null,
                    });
                  }}
                  title="Edit Contact"
                >
                  <Pencil className="w-3" />
                </Button>
              ),
            }),
          ]),
    ],
    [contactTypeMap, showFullDetails, toggleShowDetails]
  );

  const table = useReactTable({
    data: contactsData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isError && !isLoading) {
    return null;
  }

  if (isContactTypesError && !isContactTypesLoading) {
    return null;
  }

  return (
    <>
      {readOnly && (
        <Flex justify="between" align="center" className="mt-5 lg:mt-8">
          <HeaderWrapper>
            <TitleHeader title="Contact and Notification Preference" />
          </HeaderWrapper>
        </Flex>
      )}
      <CommonTable
        table={table}
        size="default"
        noDataText={getNoDataText(isLoading || isFetching, error)}
      />
    </>
  );
};
