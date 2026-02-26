import React from "react";
import { Modal } from "@/components/ui/modal";
import { ChevronLeft, ChevronRight, Camera } from "lucide-react";
import { useGetDMSFileUrlQuery } from "@/api/customer/files/files.api";

interface PhotoItem {
  identity: string;
  documentPath: string;
  fileName?: string;
  photoCaption?: string;
}

interface CabinViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPhoto: PhotoItem | null;
  photoList: PhotoItem[];
  currentPhotoIndex: number;
  onPreviousPhoto: () => void;
  onNextPhoto: () => void;
}

const DMSImageViewer: React.FC<{
  filePath: string;
  fileName?: string;
}> = ({ filePath, fileName }) => {
  const { data, isLoading, error } = useGetDMSFileUrlQuery(
    { filePath, accessType: "READ" },
    { skip: !filePath }
  );

  const getFileType = (): "image" | "pdf" | "unknown" => {
    const name = fileName || filePath;
    if (!name) return "unknown";
    const extension = name.split(".").pop()?.toLowerCase() || "";
    if (extension === "pdf") return "pdf";
    if (
      ["jpg", "jpeg", "png", "gif", "webp", "bmp", "tiff", "tif"].includes(
        extension
      )
    ) {
      return "image";
    }
    return "unknown";
  };

  const fileType = getFileType();

  if (isLoading) {
    return (
      <div className="flex h-64 flex-col items-center justify-center text-indigo-300">
        <p className="text-sm text-gray-500">Loading document...</p>
      </div>
    );
  }

  if (error || !data?.preSignedUrl) {
    return (
      <div className="flex h-64 flex-col items-center justify-center text-indigo-300">
        <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-2xl border-4 border-indigo-200">
          <Camera className="h-12 w-12" />
        </div>
        <p className="mt-2 text-sm text-gray-500">Document not available</p>
      </div>
    );
  }

  if (fileType === "pdf") {
    return (
      <iframe
        src={data.preSignedUrl}
        className="h-[80vh] w-full rounded-lg"
        title="Document Viewer"
      />
    );
  }

  if (fileType === "image") {
    return (
      <img
        src={data.preSignedUrl}
        alt="Document"
        className="h-auto max-h-[70vh] w-full rounded-lg object-contain shadow-lg"
      />
    );
  }

  return (
    <iframe
      src={data.preSignedUrl}
      className="h-[80vh] w-full rounded-lg"
      title="Document Viewer"
    />
  );
};

export const CabinViewModal: React.FC<CabinViewModalProps> = ({
  isOpen,
  onClose,
  selectedPhoto,
  photoList,
  currentPhotoIndex,
  onPreviousPhoto,
  onNextPhoto,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      close={onClose}
      title="Cabin View"
      zIndex="modal"
      className="min-h-[500px] w-full max-w-[80vw]"
    >
      <div className="relative flex min-h-[400px] w-full items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-50">
        {photoList.length > 1 && currentPhotoIndex > 0 && (
          <button
            onClick={onPreviousPhoto}
            className="absolute left-4 z-10 rounded-full bg-white/80 p-2 shadow-md transition-all hover:scale-110 hover:bg-white"
          >
            <ChevronLeft className="h-6 w-6 text-indigo-600" />
          </button>
        )}

        <div className="flex w-full flex-col items-center justify-center px-16 py-12">
          {selectedPhoto?.documentPath ? (
            <div className="relative w-full max-w-6xl">
              <DMSImageViewer
                filePath={selectedPhoto.documentPath}
                fileName={selectedPhoto.fileName}
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-indigo-300">
              <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-2xl border-4 border-indigo-200">
                <Camera className="h-12 w-12" />
              </div>
              <p className="mt-2 text-sm text-gray-500">
                No document available
              </p>
            </div>
          )}
        </div>

        {photoList.length > 1 && currentPhotoIndex < photoList.length - 1 && (
          <button
            onClick={onNextPhoto}
            className="absolute right-4 z-10 rounded-full bg-white/80 p-2 shadow-md transition-all hover:scale-110 hover:bg-white"
          >
            <ChevronRight className="h-6 w-6 text-indigo-600" />
          </button>
        )}
      </div>
    </Modal>
  );
};
