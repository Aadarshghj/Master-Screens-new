import React, { useState, useMemo } from "react";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useForm, Controller } from "react-hook-form";
import { PlusCircle } from "lucide-react";
import { Button, Label, Select, Grid } from "@/components/ui";
import { CommonTable, HeaderWrapper, TitleHeader, Flex } from "@/components";
import { CapturePhotoModal } from "../Modal/CapturePhotoModal";
import { CabinViewModal } from "../Modal/CabinViewModal";
import {
  useGetFirmPhotoListQuery,
  useUploadFirmPhotoMetaMutation,
  type FirmPhotoUploadRequest,
} from "@/global/service/end-points/Firm/firm-photo";
import { useDMSFileUpload } from "@/hooks/useDMSFileUpload";
import { logger } from "@/global/service";
import { useAppSelector } from "@/hooks/store";

const photoCaptions = [
  { value: "FRONT_VIEW", label: "Front View" },
  { value: "SIDE_VIEW", label: "Side View" },
  { value: "INTERIOR", label: "Interior" },
  { value: "CAPTURED_PICTURE", label: "Captured Picture" },
  { value: "OTHERS", label: "Others" },
];

interface PhotoFormData {
  photoCaption: string;
  firmPhoto: File | null;
}

interface PhotoItem {
  identity: string;
  customerIdentity: string;
  photoCaption: string;
  documentPath: string;
  file?: File;
}

interface FirmPhotoUploadProps {
  customerId: string;
  readonly?: boolean;
}

export default function FirmPhotoUpload({
  customerId,
  readonly = false,
}: FirmPhotoUploadProps) {
  const [selectedFileName, setSelectedFileName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoItem | null>(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  // API hooks
  const {
    data: firmPhotosData,
    refetch,
    isLoading,
  } = useGetFirmPhotoListQuery(customerId);

  const firmStatus = useAppSelector(state => state.firmOnboarding.firmStatus);

  const [uploadFirmPhotoMeta] = useUploadFirmPhotoMetaMutation();

  const { uploadFile } = useDMSFileUpload({
    module: "FIRM",
    referenceId: customerId,
    documentCategory: "PHOTO",
    documentType: "FIRM_PHOTO",
    onSuccess: () => {},
  });

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<PhotoFormData>({
    defaultValues: {
      photoCaption: "",
      firmPhoto: null,
    },
  });

  const photoList = useMemo(
    () => firmPhotosData?.content || [],
    [firmPhotosData?.content]
  );

  const columnHelper = useMemo(() => createColumnHelper<PhotoItem>(), []);

  const handleViewPhoto = React.useCallback(
    (photo: PhotoItem) => {
      const index = photoList.findIndex(
        (p: PhotoItem) => p.identity === photo.identity
      );

      setCurrentPhotoIndex(index);
      setSelectedPhoto(photo);
      setIsModalOpen(true);
    },
    [photoList]
  );

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: "slNo",
        header: "Sl No",
        cell: info => (
          <span className="text-xxs font-medium">{info.row.index + 1}</span>
        ),
      }),
      columnHelper.accessor("photoCaption", {
        header: "Photo Caption",
        cell: info => (
          <span className="text-xxs">{info.getValue() || "N/A"}</span>
        ),
        enableSorting: true,
      }),
      columnHelper.display({
        id: "action",
        header: "Action",
        cell: info => (
          <button
            onClick={() => handleViewPhoto(info.row.original)}
            className="text-xxs cursor-pointer font-medium text-blue-600 hover:text-blue-800"
          >
            View
          </button>
        ),
      }),
    ],
    [columnHelper, handleViewPhoto]
  );

  const table = useReactTable({
    data: photoList,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) {
    return <div className="p-4">Loading photos...</div>;
  }

  const openCameraModal = () => {
    setIsCameraModalOpen(true);
  };

  const closeCameraModal = () => {
    setIsCameraModalOpen(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB");
        return;
      }
      setValue("firmPhoto", file);
      setSelectedFileName(file.name);
    }
  };

  const onSubmit = async (data: PhotoFormData) => {
    if (!data.firmPhoto) {
      alert("Please select a photo to upload");
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload file using DMS hook first
      const fileData = await uploadFile(data.firmPhoto);

      if (!fileData) {
        throw new Error("File upload failed");
      }

      // Create metadata payload as array matching backend expectation
      const metadataPayload: FirmPhotoUploadRequest[] = [
        {
          photoRefId: `FIRM_PHOTO_${String(Math.floor(Math.random() * 900) + 100).padStart(3, "0")}`,
          photoCaption: data.photoCaption || "Front view of firm",
          documentPath: fileData.filePath || "/photos/firm/default.jpg",
          createdBy: 101,
        },
      ];

      await uploadFirmPhotoMeta({
        customerId,
        data: metadataPayload,
      }).unwrap();

      logger.info("Photo uploaded and saved successfully!", { toast: true });
      reset();
      setSelectedFileName("");
      refetch();
    } catch (error) {
      const errorMessage =
        error &&
        typeof error === "object" &&
        "data" in error &&
        error.data &&
        typeof error.data === "object" &&
        "message" in error.data &&
        typeof error.data.message === "string"
          ? error.data.message
          : "Failed to upload photo";
      logger.error(errorMessage, { toast: true });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPhoto(null);
  };

  const handlePreviousPhoto = () => {
    if (currentPhotoIndex > 0) {
      const newIndex = currentPhotoIndex - 1;
      setCurrentPhotoIndex(newIndex);
      setSelectedPhoto(photoList[newIndex]);
    }
  };

  const handleNextPhoto = () => {
    if (currentPhotoIndex < photoList.length - 1) {
      const newIndex = currentPhotoIndex + 1;
      setCurrentPhotoIndex(newIndex);
      setSelectedPhoto(photoList[newIndex]);
    }
  };

  const isPendingApproval = firmStatus === "PENDING_APPROVAL";

  return (
    <div className="w-full">
      <Grid className="grid grid-cols-1 gap-6 p-4 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <h2 className="mb-4 text-lg font-semibold">Capture Photo</h2>
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-lg bg-blue-50">
              <Button
                type="button"
                onClick={openCameraModal}
                variant="default"
                size="lg"
                disabled={isPendingApproval}
                className="bg-indigo-500 hover:bg-indigo-600"
              >
                Capture Photo
              </Button>
            </div>
          </div>
        </div>

        <div className="border p-4 lg:col-span-2">
          <h2 className="mb-4 text-lg font-semibold">Upload Firm Photo</h2>

          <div className="space-y-4">
            <div className="rounded-lg  bg-white p-4 ">
              <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Photo Caption <span className="text-red-500">*</span>
                  </Label>
                  <Controller
                    name="photoCaption"
                    control={control}
                    rules={{ required: "Photo Caption is required" }}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        options={photoCaptions}
                        placeholder="Others"
                        disabled={isSubmitting || isPendingApproval}
                        size="form"
                        variant="form"
                        fullWidth
                      />
                    )}
                  />
                  {errors.photoCaption && (
                    <p className="text-xs text-red-600">
                      {errors.photoCaption.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Firm Photo</Label>
                  <div className="space-y-2">
                    <Button
                      type="button"
                      variant="default"
                      onClick={() =>
                        document.getElementById("photo-file-input")?.click()
                      }
                      disabled={isSubmitting || isPendingApproval}
                      className="w-full"
                    >
                      Upload Photo
                    </Button>
                    <input
                      id="photo-file-input"
                      type="file"
                      accept=".jpg,.jpeg,.png"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <p className="text-center text-xs text-gray-500">
                      {selectedFileName || "No file chosen"}
                    </p>
                  </div>
                </div>

                <div className="w-32 space-y-2">
                  <div className="h-4"></div>
                  <Button
                    type="button"
                    onClick={handleSubmit(onSubmit)}
                    variant="default"
                    disabled={isSubmitting || isPendingApproval}
                    className="w-full bg-indigo-500 text-white hover:bg-indigo-600"
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Photo
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <Flex justify="between" align="center" className="mb-2">
              <HeaderWrapper>
                <TitleHeader title="Firm Photo List" />
              </HeaderWrapper>
            </Flex>
            <CommonTable
              table={table}
              size="default"
              noDataText={
                photoList.length === 0
                  ? "No photos uploaded yet. Add your first photo using the form above."
                  : "No photos found."
              }
              className="bg-card shadow"
            />
          </div>
        </div>
      </Grid>

      {readonly && (
        <div className="mt-6">
          <Flex justify="between" align="center" className="mb-2">
            <HeaderWrapper>
              <TitleHeader title="Firm Photo List" />
            </HeaderWrapper>
          </Flex>
          <CommonTable
            table={table}
            size="default"
            noDataText={
              photoList.length === 0
                ? "No photos uploaded yet. Add your first photo using the form above."
                : "No photos found."
            }
            className="bg-card shadow"
          />
        </div>
      )}
      <CapturePhotoModal
        isOpen={isCameraModalOpen}
        onClose={closeCameraModal}
        customerId={customerId}
        onPhotoCapture={file => {
          setValue("firmPhoto", file);
          setSelectedFileName(file.name);
        }}
        onPhotoSaved={() => {
          refetch();
        }}
      />

      <CabinViewModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        selectedPhoto={selectedPhoto}
        photoList={photoList}
        currentPhotoIndex={currentPhotoIndex}
        onPreviousPhoto={handlePreviousPhoto}
        onNextPhoto={handleNextPhoto}
      />
    </div>
  );
}
