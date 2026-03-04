import React, { useMemo, useState, useCallback } from "react";
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
} from "@/components";
import { useGetKycDocumentsQuery } from "@/global/service/end-points/master/firm-master";
import { useGetDocumentTypesUsageForFirmQuery } from "@/global/service/end-points/master/master";
import { CabinViewModal } from "../Modal/CabinViewModal";

interface Document {
  identity: string;
  idType: string;
  idNumber: string;
  maskedId?: string;
  isVerified: boolean;
  isActive: boolean;
  kycUploads: Array<{
    identity: string;
    fileName: string;
    filePath: string;
    uploadDate: string;
    uploadStatus: string;
  }>;
}

interface KYCDocumentsTableProps {
  customerId?: string;
  refreshTrigger?: number;
}

const columnHelper = createColumnHelper<Document>();

export default function KYCDocumentsTable({
  customerId,
  refreshTrigger,
}: KYCDocumentsTableProps) {
  const {
    data: documents = [],
    isLoading,
    refetch,
  } = useGetKycDocumentsQuery(customerId || "", { skip: !customerId });
  const { data: documentTypes = [] } = useGetDocumentTypesUsageForFirmQuery();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(
    null
  );
  const [currentDocumentIndex, setCurrentDocumentIndex] = useState(0);

  // Refetch when refreshTrigger changes
  React.useEffect(() => {
    if (refreshTrigger && customerId) {
      refetch();
    }
  }, [refreshTrigger, refetch, customerId]);

  const handleViewDocument = useCallback(
    (document: Document) => {
      const index = documents.findIndex(
        (doc: Document) => doc.identity === document.identity
      );
      setCurrentDocumentIndex(index);
      setSelectedDocument(document);
      setIsModalOpen(true);
    },
    [documents]
  );

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDocument(null);
  };

  const handlePreviousDocument = () => {
    if (currentDocumentIndex > 0) {
      const newIndex = currentDocumentIndex - 1;
      setCurrentDocumentIndex(newIndex);
      setSelectedDocument(documents[newIndex]);
    }
  };

  const handleNextDocument = () => {
    if (currentDocumentIndex < documents.length - 1) {
      const newIndex = currentDocumentIndex + 1;
      setCurrentDocumentIndex(newIndex);
      setSelectedDocument(documents[newIndex]);
    }
  };

  // Convert documents to photo format for the modal
  const documentList = documents.map(doc => {
    const docType = documentTypes.find(type => type.identity === doc.idType);

    return {
      identity: doc.identity,
      documentPath: doc.kycUploads?.[0]?.filePath || "",
      fileName: doc.kycUploads?.[0]?.fileName || "",
      photoCaption: docType?.displayName || doc.idType,
    };
  });

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: "slNo",
        header: "SI No",
        cell: ({ row }) => (
          <span className="text-foreground text-xxs font-medium">
            {row.index + 1}
          </span>
        ),
      }),
      columnHelper.accessor("idType", {
        header: "Document Type",
        cell: info => {
          const docType = documentTypes.find(
            type => type.identity === info.getValue()
          );

          return (
            <span className="text-foreground text-xxs font-medium">
              {docType?.displayName || info.getValue()}
            </span>
          );
        },

        enableSorting: true,
      }),
      columnHelper.accessor("idNumber", {
        header: "ID Number",
        cell: info => (
          <span className="text-foreground text-xxs font-medium">
            {info.row.original.maskedId || info.getValue()}
          </span>
        ),
        enableSorting: true,
      }),
      columnHelper.display({
        id: "fileName",
        header: "File Name",
        cell: ({ row }) => {
          const uploads = row.original.kycUploads;
          const fileName = uploads?.[0]?.fileName || "-";
          return (
            <span className="text-foreground text-xxs font-medium">
              {fileName}
            </span>
          );
        },
      }),
      columnHelper.accessor("isVerified", {
        header: "Verified",
        cell: info => {
          const verified = info.getValue();
          return (
            <span
              className={`text-xxs rounded-full px-2 py-1 font-medium ${
                verified
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {verified ? "Verified" : "Pending"}
            </span>
          );
        },
        enableSorting: true,
      }),
      columnHelper.display({
        id: "document",
        header: "Document",
        cell: ({ row }) => {
          return (
            <span
              className="text-primary text-xxs cursor-pointer hover:underline"
              onClick={() => handleViewDocument(row.original)}
            >
              View
            </span>
          );
        },
      }),
      columnHelper.display({
        id: "uploadDate",
        header: "Upload Date",
        cell: ({ row }) => {
          const uploads = row.original.kycUploads;
          const uploadDate = uploads?.[0]?.uploadDate;
          return (
            <span className="text-foreground text-xxs font-medium">
              {uploadDate
                ? new Date(uploadDate).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "2-digit",
                  })
                : "-"}
            </span>
          );
        },
      }),
      columnHelper.accessor("isActive", {
        header: "Status",
        cell: info => (
          <span
            className={`text-xxs font-medium ${
              info.getValue() ? "text-green-600" : "text-red-600"
            }`}
          >
            {info.getValue() ? "Active" : "Inactive"}
          </span>
        ),
        enableSorting: true,
      }),
    ],
    [documentTypes, handleViewDocument]
  );

  const table = useReactTable({
    data: documents,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <Grid className="mt-1 px-2">
      <Flex justify="between" align="center" className="mb-2">
        <HeaderWrapper>
          <TitleHeader title="Uploaded Documents" />
        </HeaderWrapper>
      </Flex>

      <CommonTable
        table={table}
        size="default"
        noDataText={
          isLoading
            ? "Loading KYC documents..."
            : "No KYC documents uploaded yet. Upload your first KYC document using the form above."
        }
      />

      <CabinViewModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        selectedPhoto={
          selectedDocument
            ? {
                identity: selectedDocument.identity,
                documentPath: selectedDocument.kycUploads?.[0]?.filePath || "",
                fileName: selectedDocument.kycUploads?.[0]?.fileName || "",
                photoCaption:
                  documentTypes.find(
                    type => type.identity === selectedDocument.idType
                  )?.displayName || selectedDocument.idType,
              }
            : null
        }
        photoList={documentList}
        currentPhotoIndex={currentDocumentIndex}
        onPreviousPhoto={handlePreviousDocument}
        onNextPhoto={handleNextDocument}
      />
    </Grid>
  );
}
