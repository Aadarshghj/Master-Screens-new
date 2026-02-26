import { Modal, Flex } from "@/components";
import { useState, type FC } from "react";
import PhotoGalleryMenu from "./PhotoGalleryMenu";

interface PhotoGalleryProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  imageUrl: string | null;
  fileType?: "DOC" | "IMG";
}

const PhotoAndDocumentGallery: FC<PhotoGalleryProps> = ({
  isOpen,
  onClose,
  imageUrl,
  fileType = "IMG",
  title,
}) => {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.25, 0.5));
  const handleRotate = () => setRotation(prev => (prev + 90) % 360);

  const handleReset = () => {
    setZoom(1);
    setRotation(0);
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      close={handleClose}
      width="3xl"
      isClosable
      compact
      maxHeight="90vh"
      className="mx-4 w-full"
      title={title}
      titleVariant="default"
      padding="p-4"
      header
      emptyScreen
    >
      <div className="h-full min-h-[80vh] w-full rounded-lg bg-[var(--blue-100)] p-5">
        <Flex
          justify="center"
          align="center"
          className="relative min-h-[75vh] w-full bg-white"
        >
          {fileType === "IMG" && (
            <PhotoGalleryMenu
              onRotate={handleRotate}
              onZoomIn={handleZoomIn}
              onZoomOut={handleZoomOut}
              zoom={zoom}
            />
          )}
          {fileType === "DOC" ? (
            <iframe
              src={imageUrl ?? ""}
              className="h-[80vh] w-full rounded-lg"
              title="Document Viewer"
            />
          ) : (
            <img
              src={imageUrl ?? ""}
              alt="gallery"
              style={{
                transform: `scale(${zoom}) rotate(${rotation}deg)`,
                transition: "transform 0.3s ease",
                maxWidth: "100%",
                maxHeight: "100%",
                objectFit: "contain",
              }}
            />
          )}
        </Flex>
      </div>
    </Modal>
  );
};

export default PhotoAndDocumentGallery;
