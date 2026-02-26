import React, { useMemo, useState, useCallback, useEffect } from "react";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  CommonTable,
  HeaderWrapper,
  TitleHeader,
  Flex,
  Grid,
  Button,
} from "@/components/ui";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";
import {
  useGetNomineesQuery,
  useDeleteNomineeMutation,
  useGetNomineeRelationshipsQuery,
} from "@/global/service";
import { logger } from "@/global/service";
import type { NomineeData, NomineeTableProps } from "@/types";
import { useDisableState } from "@/hooks/useDisableState";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { useFileViewer } from "@/hooks/useFileViewer";
import PhotoAndDocumentGallery from "@/components/ui/photo-gallery/PhotoGalleryModal";

const columnHelper = createColumnHelper<NomineeData>();

export const NomineeTable: React.FC<NomineeTableProps> = ({
  readOnly = false,
  onEditNominee,
  customerIdentity,
  isView = false,
  pendingForApproval = false,
  handleSetConfirmationModalData,
  confirmationModalData,
}) => {
  const { handleUpdateState, handleResetState } = useDisableState({
    isView,
  });
  const [deletingNomineeId, setDeletingNomineeId] = useState<string | null>(
    null
  );
  const [photoGalleryOpen, setphotoGalleryOpen] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [nomineeToDelete, setNomineeToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const customerId = customerIdentity;

  const {
    data: nominees = [],
    isLoading,
    error,
  } = useGetNomineesQuery(customerId!);

  const { data: relationships = [], isLoading: isLoadingRelationships } =
    useGetNomineeRelationshipsQuery();

  const [deleteNominee] = useDeleteNomineeMutation();

  const getNoDataText = (isLoading: boolean, error: unknown) => {
    if (isLoading && customerId) return "Loading nominees...";
    if (error && customerId) return "Failed to load nominees";
    if (!customerId) return "Customer identity is required to view nominees.";
    if (nominees.length === 0) return "No nominees added yet";
    return "No nominees found.";
  };

  const getRelationshipName = useCallback(
    (relationshipId: string): string => {
      if (isLoadingRelationships) {
        return "Loading...";
      }

      const relationship = relationships.find(
        rel => rel.identity === relationshipId
      );

      return relationship?.relationship || "Unknown";
    },
    [relationships, isLoadingRelationships]
  );

  const handleDeleteNominee = useCallback(
    (nomineeId: string, nomineeName: string) => {
      setNomineeToDelete({ id: nomineeId, name: nomineeName });
      setShowDeleteModal(true);
    },
    []
  );

  const confirmDeleteNominee = useCallback(async () => {
    if (!nomineeToDelete) return;

    try {
      setDeletingNomineeId(nomineeToDelete.id);

      await deleteNominee({
        customerId: customerId!,
        nomineeId: nomineeToDelete.id,
        updatedBy: "1001",
      }).unwrap();

      logger.info("Nominee deleted successfully", {
        toast: true,
        pushLog: false,
      });
    } catch (error) {
      logger.error(error, { toast: true, pushLog: false });
    } finally {
      setDeletingNomineeId(null);
      setShowDeleteModal(false);
      setNomineeToDelete(null);
    }
  }, [nomineeToDelete, deleteNominee, customerId]);

  const cancelDeleteNominee = useCallback(() => {
    setShowDeleteModal(false);
    setNomineeToDelete(null);
  }, []);

  const handleEditNominee = useCallback(
    (nominee: NomineeData) => {
      logger.info("Edit nominee", { toast: false, pushLog: false });
      if (onEditNominee) {
        onEditNominee(nominee);
      }
    },
    [onEditNominee]
  );
  const { viewDocument, documentUrl } = useFileViewer();
  const handleViewDocument = useCallback(
    (document: NomineeData) => {
      viewDocument(document.filePath);
      setphotoGalleryOpen(true);
    },
    [nominees]
  );
  const [editData, setEditData] = useState<NomineeData | null>(null);
  useEffect(() => {
    if (
      !confirmationModalData?.doAction ||
      confirmationModalData?.feature !== "EDIT"
    ) {
      return;
    }
    if (editData) handleEditNominee(editData);
  }, [confirmationModalData]);
  const columns = useMemo(() => {
    const baseColumns = [
      columnHelper.accessor("fullName", {
        header: "Nominee Name",
        cell: info => (
          <span className="text-foreground font-medium">{info.getValue()}</span>
        ),
      }),
      columnHelper.accessor("relationship", {
        header: "Relationship",
        cell: info => (
          <span className="text-foreground">
            {getRelationshipName(info.getValue())}
          </span>
        ),
      }),
      columnHelper.accessor("contactNumber", {
        header: "Contact Number",
        cell: info => (
          <span className="text-foreground font-mono">{info.getValue()}</span>
        ),
      }),
      columnHelper.accessor("percentageShare", {
        header: "Share %",
        cell: info => (
          <span className="text-foreground">{info.getValue()}%</span>
        ),
      }),
      columnHelper.accessor("isMinor", {
        header: "Minor",
        cell: info => (
          <span className="text-foreground">
            {info.getValue() ? "Yes" : "No"}
          </span>
        ),
      }),
      columnHelper.accessor("dob", {
        header: "Date of Birth",
        cell: info => (
          <span className="text-foreground">
            {new Date(info.getValue()).toLocaleDateString()}
          </span>
        ),
      }),
    ];
    const actionColumn = columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const nominee = row.original;
        const isDeleting = deletingNomineeId === nominee.nomineeIdentity;

        return (
          <>
            {!readOnly && (
              <Flex align="center" gap={2}>
                <Button
                  variant="ghost"
                  size="xs"
                  className="h-6 w-6 p-0 text-cyan-400 hover:bg-cyan-400/70"
                  onClick={() => {
                    setEditData(nominee);
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
                  disabled={isDeleting}
                  title="Edit Details"
                >
                  <Pencil className="w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="xs"
                  className="text-status-error hover:bg-status-error/70 h-6 w-6 p-0"
                  title="Delete Nominee"
                  onClick={() =>
                    handleDeleteNominee(
                      nominee.nomineeIdentity,
                      nominee.fullName
                    )
                  }
                >
                  <Trash2 className="w-3" />
                </Button>
              </Flex>
            )}

            {readOnly && (
              <Flex align="center" gap={2}>
                <Button
                  variant="ghost"
                  size="xs"
                  className="h-6 w-6 p-0 text-cyan-400 hover:bg-cyan-400/70"
                  onClick={() => handleViewDocument(nominee)}
                  title="View Details"
                >
                  <Eye className="w-3" />
                </Button>
              </Flex>
            )}
          </>
        );
      },
    });

    return pendingForApproval ? baseColumns : [...baseColumns, actionColumn];
  }, [
    getRelationshipName,
    handleEditNominee,
    handleDeleteNominee,
    handleViewDocument,
    deletingNomineeId,
    readOnly,
    pendingForApproval,
  ]);

  const table = useReactTable({
    data: nominees,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const totalPercentage = nominees.reduce((sum, nominee) => {
    return sum + nominee.percentageShare;
  }, 0);

  useEffect(() => {
    if (totalPercentage === 100) {
      handleResetState();
    } else {
      handleUpdateState(
        "Incomplete Step",
        `Total nominee share percentage must be 100%. Current total: ${totalPercentage}%`
      );
    }
  }, [totalPercentage]);
  const handleCloseGallery = () => {
    viewDocument("");
    setphotoGalleryOpen(false);
  };
  return (
    <Grid className="mt-1 px-2">
      <PhotoAndDocumentGallery
        title="Nominee"
        fileType="DOC"
        imageUrl={documentUrl}
        isOpen={photoGalleryOpen && documentUrl !== null}
        onClose={handleCloseGallery}
      />
      <Flex justify="between" align="center" className="mb-1">
        <HeaderWrapper>
          <TitleHeader title="Nominee List" />
        </HeaderWrapper>
      </Flex>

      <Grid>
        <CommonTable
          table={table}
          size="default"
          noDataText={getNoDataText(isLoading, error)}
          className="bg-card"
        />
      </Grid>

      <ConfirmationModal
        isOpen={showDeleteModal}
        onConfirm={confirmDeleteNominee}
        onCancel={cancelDeleteNominee}
        title="Delete"
        message={`Are you Sure you want to delete nominee "${nomineeToDelete?.name}"? This action cannot be undone.`}
        confirmText={
          deletingNomineeId === nomineeToDelete?.id ? "Deleting..." : "Delete"
        }
        cancelText="Cancel"
        type="error"
        size="compact"
      />
    </Grid>
  );
};
