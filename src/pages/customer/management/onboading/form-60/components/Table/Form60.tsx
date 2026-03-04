import React, { useMemo, useState } from "react";
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
} from "@/components";
import { format } from "date-fns";
import { useAppSelector } from "@/hooks/store";
import { useViewDocument } from "@/hooks/useViewDocument";
import type {
  Form60Document,
  Form60TableProps,
} from "@/types/customer/form60.types";
import PhotoAndDocumentGallery from "@/components/ui/photo-gallery/PhotoGalleryModal";
import { Eye } from "lucide-react";

const columnHelper = createColumnHelper<Form60Document>();

export const Form60Table: React.FC<Form60TableProps> = ({
  customerIdentity: propCustomerIdentity,
  form60Data,
  customerDetails,
  readOnly = false,
}) => {
  const storeCustomerIdentity = useAppSelector(
    state => state.customerIdentity.identity
  );
  const [photoGalleryOpen, setphotoGalleryOpen] = useState(false);
  const customerIdentity = storeCustomerIdentity || propCustomerIdentity;

  const { viewDocument, isViewing, imageUrl } = useViewDocument();

  const getNoDataText = () => {
    if (!customerIdentity)
      return "Customer identity is required to view Form60 documents.";
    if (!form60Data)
      return "No Form60 document found. Create your first Form60 document using the form above.";
    return "No Form60 documents found.";
  };

  const form60Documents = useMemo(() => {
    if (!form60Data) {
      return [];
    }

    const customerName =
      customerDetails?.firstName || customerDetails?.displayName || "Customer";

    const documentData = {
      id: (form60Data as { identity?: string })?.identity || "form60-1",
      documentName: `Form60_${customerName}`,
      documentType: "Form 60",
      createdOn: form60Data.submissionDate || new Date().toISOString(),
      customerId: customerIdentity || "",
      form60Id: (form60Data as { identity?: string })?.identity || "",
      status: "Active",
      isActive: true,
      filePath: form60Data.filePath || "",
    };

    return [documentData];
  }, [form60Data, customerDetails, customerIdentity]);

  const columns = useMemo(
    () => [
      columnHelper.accessor("documentName", {
        header: "Document Name",
        cell: info => info.getValue(),
        enableSorting: true,
      }),
      columnHelper.accessor("documentType", {
        header: "Document Type",
        cell: info => info.getValue(),
        enableSorting: true,
      }),
      columnHelper.accessor("createdOn", {
        header: "Created on",
        cell: info => {
          const date = info.getValue();
          return date ? format(new Date(date), "dd-MM-yyyy HH:mm") : "-";
        },
        enableSorting: true,
      }),
      columnHelper.display({
        id: "document",
        header: "Document",
        cell: ({ row }) => {
          const form60Data = row.original;
          const filePath = form60Data?.filePath;

          const handleViewDocument = () => {
            if (filePath) {
              viewDocument(filePath);
              setphotoGalleryOpen(true);
            }
          };

          return (
            <Button
              variant="ghost"
              size="xs"
              className="h-6 w-6 p-0 text-cyan-400 hover:bg-cyan-400/70"
              title="View document"
              onClick={handleViewDocument}
              disabled={isViewing || !form60Data?.filePath}
            >
              <Eye className="w-3" />
            </Button>
          );
        },
      }),
    ],
    [viewDocument, isViewing]
  );

  const table = useReactTable({
    data: form60Documents,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  if (!customerIdentity) {
    return (
      <Grid className="mt-2">
        <Flex justify="between" align="center" className="mb-2">
          <HeaderWrapper>
            <TitleHeader
              title={readOnly ? "Form60 History" : "Uploaded Document"}
            />
          </HeaderWrapper>
        </Flex>
        <div className="flex flex-col items-center justify-center p-1">
          <div className="text-muted-foreground text-center text-xs">
            Customer identity is required to view Form60 documents.
          </div>
        </div>
      </Grid>
    );
  }

  return (
    <Grid className="mt-1 px-2">
      <PhotoAndDocumentGallery
        title="Form60"
        fileType="DOC"
        imageUrl={imageUrl}
        isOpen={photoGalleryOpen && imageUrl !== null}
        onClose={() => setphotoGalleryOpen(false)}
      />
      <Flex justify="between" align="center" className="mb-2">
        <HeaderWrapper>
          <TitleHeader
            title={readOnly ? "Form60 History" : "Uploaded Document"}
          />
        </HeaderWrapper>
      </Flex>

      <CommonTable table={table} size="default" noDataText={getNoDataText()} />
    </Grid>
  );
};
