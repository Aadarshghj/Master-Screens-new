import React, { useMemo, useEffect, useState, useCallback } from "react";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
} from "@tanstack/react-table";
import {
  CommonTable,
  HeaderWrapper,
  TitleHeader,
  Flex,
  Grid,
  Button,
  ConfirmationModal,
} from "@/components";
import type { UploadedDocument } from "@/types";
import type { DocumentsTableProps } from "@/types/customer/kyc.types";
import { format } from "date-fns";
import {
  logger,
  useDeleteKycMutation,
  useGetKycQuery,
  useGetKycTypesQuery,
} from "@/global/service";
import { setCustomerCode } from "@/utils/storage.utils";
import { useFileViewer } from "@/hooks/useFileViewer";
import { Eye, ShieldCheck, ShieldX, Trash2 } from "lucide-react";
import PhotoAndDocumentGallery from "@/components/ui/photo-gallery/PhotoGalleryModal";
import { useDisableState } from "@/hooks/useDisableState";
import { documentCode } from "@/const/common-codes.const";
import { useAppDispatch, useAppSelector } from "@/hooks/store";
import { setPandDetailSubmit } from "@/global/reducers/customer/pan-card-status.reducer";
import { setViewPandDetailSubmit } from "@/global/reducers/customer/pan-card-status.reducer-view";
import NeumorphicButton from "@/components/ui/neumorphic-button/neumorphic-button";

interface KycUpload {
  identity: string;
  documentReference: string;
  fileName: string;
  fileType: string;
  filePath: string;
  uploadStatus: string;
  version: number;
  uploadDate: string;
}

interface KycTableDocument extends Partial<UploadedDocument> {
  idType?: string;
  isVerified?: boolean;
  isActive?: boolean;
  idNumber?: string;
  validFrom?: string;
  validTo?: string;
  maskedId?: string;
  identity?: string;
  kycUploads?: KycUpload[];
  placeOfIssue?: string;
  issuingAuthority?: string;
}

const columnHelper = createColumnHelper<KycTableDocument>();

export const DocumentsTable: React.FC<DocumentsTableProps> = ({
  customerIdentity: identity,
  isView = false,
  readOnly = false,
}) => {
  const customerIdentityView = useAppSelector(
    state => state.customerIdentityView?.identity
  );
  const customerIdentityEdit = useAppSelector(
    state => state.customerIdentity?.identity
  );
  const customerIdentity = isView
    ? (identity ?? customerIdentityView)
    : (identity ?? customerIdentityEdit);
  const { handleUpdateState, handleResetState } = useDisableState({
    isView,
  });
  const [photoGalleryOpen, setPhotoGalleryOpen] = useState(false);
  const [deletingKycId, setDeletingKycId] = useState<string | null>(null);
  const [kycToDelete, setKycToDelete] = useState<{
    id: string;
  } | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteKyc] = useDeleteKycMutation();
  const customerId = customerIdentity;
  const viewCustomerId = identity ?? customerIdentityView;
  const editCustomerId = identity ?? customerIdentityEdit;

  const {
    data: kycDataEdit,
    isLoading: isLoadingEdit,
    error: errorEdit,
    refetch: refetchEdit,
  } = useGetKycQuery(editCustomerId || "", {
    skip: !editCustomerId || isView,
  });
  const {
    data: kycDataView,
    isLoading: isLoadingView,
    error: errorView,
    refetch: refetchView,
  } = useGetKycQuery(viewCustomerId || "", {
    skip: !viewCustomerId || !isView,
  });
  const kycDocuments = isView ? kycDataView : kycDataEdit;
  const isLoading = isView ? isLoadingView : isLoadingEdit;
  const error = isView ? errorView : errorEdit;
  const refetch = isView ? refetchView : refetchEdit;
  const hasPanCard =
    kycDocuments?.kycDocuments?.some(
      item => item?.documentCode === documentCode.panCard
    ) ?? false;
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (isView) {
      dispatch(setViewPandDetailSubmit({ isPanDetailsSubmit: hasPanCard }));
    } else {
      dispatch(setPandDetailSubmit({ isPanDetailsSubmit: hasPanCard }));
    }
  }, [hasPanCard, isView]);

  useEffect(() => {
    if (kycDocuments?.kycDocuments?.length === 0) {
      handleUpdateState(
        "Incomplete Step",
        "Please complete the current step before continuing."
      );
      sessionStorage.removeItem("completedSteps");
      sessionStorage.removeItem("aadhaarSubmitted");
      sessionStorage.removeItem("customerBasicInfo");
      sessionStorage.removeItem("customerIdentity");
      localStorage.removeItem("customerCode");
    } else {
      handleResetState();
    }
  }, [kycDocuments]);

  const { data: kycDocData } = useGetKycTypesQuery({
    context: "CUSTOMER_ONBOARDING",
  });
  const kycTypes = kycDocData?.documentTypes ?? [];
  const { viewDocument, isViewing, documentUrl } = useFileViewer();

  const uploadedDocuments = useMemo(() => {
    if (!kycDocuments) return [];
    const documents =
      (kycDocuments as { kycDocuments?: unknown[] })?.kycDocuments || [];
    return documents;
  }, [kycDocuments]);

  const customerCode = useMemo(() => {
    if (!kycDocuments) return undefined;
    return (kycDocuments as { customerCode?: string })?.customerCode;
  }, [kycDocuments]);

  const getDocumentTypeLabel = useMemo(() => {
    return (idType: string) => {
      const kycType = kycTypes.find(type => type.identity === idType);
      return (kycType as { displayName?: string })?.displayName || idType;
    };
  }, [kycTypes]);
  const maskDocumentNumber = useMemo(() => {
    return (idNumber: string) => {
      if (!idNumber) return idNumber;

      // For all document types, show only last 4 digits and mask the rest
      if (idNumber.length > 4) {
        const maskedLength = idNumber.length - 4;
        const maskString = "X".repeat(maskedLength);
        return `${maskString}${idNumber.slice(-4)}`;
      }

      return idNumber;
    };
  }, []);

  const getNoDataText = (isLoading: boolean, error: unknown) => {
    if (isLoading && customerIdentity) return "Loading documents...";
    if (error && customerIdentity) return "Failed to load documents";
    if (!customerIdentity)
      return "Customer identity is required to view uploaded documents.";
    if (uploadedDocuments.length === 0)
      return "No documents uploaded yet. Use the form above to add your first KYC document.";
    return "No documents found.";
  };

  const getLoadingState = (isLoading: boolean): boolean => {
    return Boolean(customerIdentity && isLoading);
  };

  const getErrorState = (error: unknown): boolean => {
    return Boolean(customerIdentity && error);
  };

  const handleDeleteKyc = useCallback((kycId: string | undefined) => {
    if (!kycId) return;
    setKycToDelete({ id: kycId });
    setShowDeleteModal(true);
  }, []);

  const confirmDeleteKyc = useCallback(async () => {
    if (!kycToDelete) return;

    try {
      setDeletingKycId(kycToDelete.id);

      await deleteKyc({
        customerId: customerId!,
        kycId: kycToDelete.id,
      }).unwrap();

      logger.info("KYC deleted successfully", {
        toast: true,
        pushLog: false,
      });
      await refetch();
    } catch (error) {
      logger.error(error, { toast: true, pushLog: false });
    } finally {
      setDeletingKycId(null);
      setShowDeleteModal(false);
      setKycToDelete(null);
    }
  }, [kycToDelete, deleteKyc, customerId, refetch]);

  const cancelDeleteKyc = useCallback(() => {
    setShowDeleteModal(false);
    setKycToDelete(null);
  }, []);

  useEffect(() => {
    if (customerCode && !isView) {
      setCustomerCode(customerCode);
    }
  }, [customerCode]);

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: "customer",
        header: "Customer Code",
        cell: () => customerCode || "-",
        enableSorting: true,
      }),
      columnHelper.accessor("idType", {
        header: "Document Type",
        cell: info => getDocumentTypeLabel(info.getValue() || ""),
        enableSorting: true,
      }),

      columnHelper.accessor("idNumber", {
        header: "ID Number",
        cell: info => {
          const row = info.row.original;
          const idNumber = info.getValue() || "";
          const maskedNumber = maskDocumentNumber(idNumber);

          // Prefer maskedId from data, else fallback to generated one
          const displayValue = row.maskedId || maskedNumber || "-";

          return <span className="uppercase">{displayValue}</span>;
        },
        enableSorting: true,
      }),

      columnHelper.accessor("validFrom", {
        header: "Valid From",
        cell: info => {
          const date = info.getValue();
          return date ? format(new Date(date), "dd/MM/yyyy") : "-";
        },
        enableSorting: true,
      }),
      columnHelper.accessor("validTo", {
        header: "Valid To",
        cell: info => {
          const date = info.getValue();
          return date ? format(new Date(date), "dd/MM/yyyy") : "-";
        },
        enableSorting: true,
      }),
      columnHelper.accessor("isVerified", {
        header: "Verified",
        cell: info => {
          const verified = info.getValue();
          return (
            <span className={verified ? "text-success" : ""}>
              {verified ? (
                <Flex align="center" gap={1}>
                  <ShieldCheck className="w-4" />
                  <p>Verified</p>
                </Flex>
              ) : (
                <Flex align="center" gap={1}>
                  <ShieldX className="text-status-error w-4" />
                  <p>Not Verified</p>
                </Flex>
              )}
            </span>
          );
        },
        enableSorting: true,
      }),
      columnHelper.accessor("isActive", {
        header: "Status",
        cell: info => {
          const status = info.getValue();
          return (
            <NeumorphicButton
              variant={status ? "success" : "error"}
              size={status ? "success" : "error"}
              className="min-h-0 px-4 py-1"
            >
              {status ? "Active" : "Inactive"}
            </NeumorphicButton>
          );
        },
        enableSorting: true,
      }),
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const kyc = row.original;
          const isDeleting = deletingKycId === kyc.idNumber;
          const kycUploads = row.original.kycUploads || [];
          const documentType = getDocumentTypeLabel(row.original.idType || "");

          const relevantUpload =
            kycUploads.find(upload => {
              const fileName = upload.fileName.toLowerCase();
              const filePath = upload.filePath.toLowerCase();
              const docType = documentType.toLowerCase();

              return (
                fileName.includes(docType) ||
                filePath.includes(docType) ||
                (docType === "pan" && fileName.includes("pan")) ||
                (docType === "aadhaar" &&
                  (fileName.includes("aadhaar") || fileName.includes("aadhar")))
              );
            }) || kycUploads[kycUploads.length - 1]; // Fallback to latest upload

          const handleViewDocument = () => {
            if (relevantUpload?.filePath) {
              viewDocument(relevantUpload.filePath);
              setPhotoGalleryOpen(true);
              logger.info(`Viewing document: ${relevantUpload.fileName}`);
            }
          };
          return (
            <Flex align="center">
              <Button
                variant="ghost"
                size="xs"
                className="h-6 w-6 p-0 text-cyan-400 hover:bg-cyan-400/70"
                title="View document"
                onClick={handleViewDocument}
              >
                <Eye className="w-3" />
              </Button>
              {!readOnly && (
                <Button
                  variant="ghost"
                  size="xs"
                  className="text-status-error hover:bg-status-error/70 h-6 w-6 p-0"
                  title="Delete document"
                  onClick={() => handleDeleteKyc(kyc.identity)}
                  disabled={isDeleting}
                >
                  <Trash2 className="w-3" />
                </Button>
              )}
            </Flex>
          );
        },
      }),
    ],
    [
      customerCode,
      getDocumentTypeLabel,
      maskDocumentNumber,
      viewDocument,
      isViewing,
      deletingKycId,
      readOnly,
      handleDeleteKyc,
    ]
  );

  const table = useReactTable({
    data: (uploadedDocuments as KycTableDocument[]) || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <Grid className="mt-1">
      <Flex justify="between" align="center" className="mt-5 lg:mt-8">
        <HeaderWrapper>
          <TitleHeader
            title={readOnly ? "KYC Documents" : "Uploaded Documents"}
          />
        </HeaderWrapper>
      </Flex>

      <CommonTable
        table={table}
        size="default"
        noDataText={getNoDataText(
          getLoadingState(Boolean(isLoading)),
          getErrorState(Boolean(error))
        )}
      />
      <ConfirmationModal
        isOpen={showDeleteModal}
        onConfirm={confirmDeleteKyc}
        onCancel={cancelDeleteKyc}
        title="Delete"
        message={
          "Are you Sure you want to delete this KYC? This action cannot be undone."
        }
        confirmText={
          deletingKycId === kycToDelete?.id ? "Deleting..." : "Delete"
        }
        cancelText="Cancel"
        type="error"
        size="compact"
      />

      {/* File Viewer Modal */}
      <PhotoAndDocumentGallery
        title="KYC Document Viewer"
        fileType="DOC"
        imageUrl={documentUrl}
        isOpen={photoGalleryOpen && documentUrl !== null}
        onClose={() => setPhotoGalleryOpen(false)}
      />
    </Grid>
  );
};
