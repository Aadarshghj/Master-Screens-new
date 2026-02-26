import React, { useEffect, useMemo, useState } from "react";
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
  ConfirmationModal,
  Button,
} from "@/components";
import type { PhotoDocumentsTableProps, PhotoTableData } from "@/types";
import { StatusBadge } from "@/components";
import {
  logger,
  useDeletePhotoMutation,
  useGetCustomerPhotoQuery,
} from "@/global/service";
import { useViewDocument } from "@/hooks/useViewDocument";
import PhotoAndDocumentGallery from "../../../../../../../components/ui/photo-gallery/PhotoGalleryModal";
import { useDisableState } from "@/hooks/useDisableState";
import { Eye, Trash2 } from "lucide-react";

const columnHelper = createColumnHelper<PhotoTableData>();

export const PhotoDocumentsTable: React.FC<PhotoDocumentsTableProps> = ({
  customerIdentity,
  isView = false,
  readOnly = false,
}) => {
  const { handleUpdateState, handleResetState } = useDisableState({
    isView,
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [photoId, setPhotoId] = useState("");
  const [deletePhoto] = useDeletePhotoMutation();
  const handleCancelDelete = () => {
    setShowDeleteModal(false);
  };

  const {
    data: customerPhotoData,
    isLoading,
    error,
    refetch,
  } = useGetCustomerPhotoQuery(customerIdentity || "", {
    skip: !customerIdentity,
  });
  const customerPhotos = customerPhotoData?.photo;
  useEffect(() => {
    if (customerPhotos?.length === 0) {
      handleUpdateState(
        "Incomplete Step",
        "Please complete the current step before continuing."
      );
    } else {
      handleResetState();
    }
  }, [customerPhotoData]);
  const handleConfirmDelete = async () => {
    try {
      await deletePhoto({
        customerId: customerIdentity!,
        photoIdentity: photoId,
      }).unwrap();
      logger.info("KYC deleted successfully", {
        toast: true,
        pushLog: false,
      });
      await refetch();
    } catch (error) {
      logger.error(error, { toast: true, pushLog: false });
    } finally {
      setPhotoId("");
      setShowDeleteModal(false);
    }
  };
  const { viewDocument, isViewing, imageUrl } = useViewDocument();

  const getNoDataText = (isLoading: boolean, error: unknown) => {
    if (isLoading && customerIdentity) return "Loading photos...";
    if (error && customerIdentity) return "Failed to load photos";
    if (!customerIdentity)
      return "Customer identity is required to view photos.";
    if (photoTableData.length === 0) return "No photos captured yet";
    return "No photos found.";
  };

  const formatCaptureTime = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${day}-${month}-${year}   ${hours}:${minutes}`;
  };

  const photoTableData: PhotoTableData[] = useMemo(() => {
    const response = customerPhotoData as {
      photo?: PhotoTableData[];
      customerCode?: string;
    };
    if (!response?.photo || !Array.isArray(response.photo)) {
      return [];
    }

    return response.photo.map((photo: PhotoTableData) => {
      return {
        ...photo,
        customerCode: response.customerCode || "",
      };
    });
  }, [customerPhotoData]);
  const [photoGalleryOpen, setphotoGalleryOpen] = useState(false);
  const columns = useMemo(
    () => [
      columnHelper.accessor("firstname", {
        header: "Customer",
        cell: info => {
          const firstname = info.getValue();
          const customerCode = info.row.original.customerCode;
          return (
            <>
              {firstname}({customerCode})
            </>
          );
        },
      }),
      columnHelper.accessor("locationDescription", {
        header: "Location",
        cell: info => info.getValue(),
      }),

      columnHelper.accessor("captureTime", {
        header: "Capture Time",
        cell: info => formatCaptureTime(info.getValue()),
      }),
      columnHelper.accessor("status", {
        header: "Status",
        cell: info => {
          const status = info.getValue();
          const rowData = info.row.original;
          const accuracy = rowData.accuracy;

          if (typeof accuracy === "number") {
            if (accuracy === -1) {
              return (
                <StatusBadge status="Pending" type="verification" size="sm" />
              );
            }

            if (accuracy >= 70) {
              return <span className="text-xs font-medium">Live</span>;
            } else if (accuracy >= 50) {
              return <span className="text-xs font-medium">Review</span>;
            } else {
              return <span className="text-xs font-medium">Not Live</span>;
            }
          }

          if (typeof accuracy === "string" && accuracy === "-") {
            return (
              <StatusBadge status="Pending" type="verification" size="sm" />
            );
          }

          return (
            <StatusBadge
              status={status === "VERIFIED" ? "Verified" : "Pending"}
              type="verification"
              size="sm"
            />
          );
        },
      }),
      columnHelper.display({
        id: "actions",
        header: "Action",
        cell: ({ row }) => {
          const photoData = row.original;
          const filePath = photoData.filePath;
          const handleViewPhoto = () => {
            if (filePath) {
              viewDocument(filePath);
              setphotoGalleryOpen(true);
            }
          };
          const handleDeletePhoto = (photoId: string) => {
            setPhotoId(photoId ?? "");
            setShowDeleteModal(true);
          };

          return (
            <Flex align="center" gap={2}>
              <Button
                variant="ghost"
                size="xs"
                className="h-6 w-6 p-0 text-cyan-400 hover:bg-cyan-400/70"
                title="View Photo"
                onClick={handleViewPhoto}
              >
                <Eye className="w-3" />
              </Button>
              {!readOnly && (
                <Button
                  variant="ghost"
                  size="xs"
                  className="text-status-error hover:bg-status-error/70 h-6 w-6 p-0"
                  title="Delete Photo"
                  onClick={() =>
                    handleDeletePhoto(row?.original?.photoId.toString() ?? "")
                  }
                >
                  <Trash2 className="w-3" />
                </Button>
              )}
            </Flex>
          );
        },
      }),
    ],
    [viewDocument, isViewing]
  );

  const table = useReactTable({
    data: photoTableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <article className="mt-1 px-2">
      <ConfirmationModal
        isOpen={showDeleteModal}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        title="Delete"
        message={
          "Are you Sure you want to delete this Photo? This action cannot be undone."
        }
        confirmText="Delete"
        cancelText="Cancel"
        type="error"
        size="compact"
      />
      <PhotoAndDocumentGallery
        title="Live Photo"
        imageUrl={imageUrl}
        isOpen={photoGalleryOpen && imageUrl !== null}
        onClose={() => setphotoGalleryOpen(false)}
      />
      <Grid>
        <Flex justify="between" align="center">
          <HeaderWrapper>
            <TitleHeader title="Uploaded Photos" />
          </HeaderWrapper>
        </Flex>

        <Grid.Item>
          <CommonTable
            table={table}
            size="default"
            noDataText={getNoDataText(isLoading, error)}
          />
        </Grid.Item>
      </Grid>
    </article>
  );
};
