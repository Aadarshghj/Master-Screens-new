import React, { useRef, useState, useEffect } from "react";
import { Camera, User, X, Save } from "lucide-react";
import { Button } from "@/components";
import { logger } from "@/global/service";
import { useDMSFileUpload } from "@/hooks/useDMSFileUpload";
import {
  useUploadFirmPhotoMetaMutation,
  type FirmPhotoUploadRequest,
} from "@/global/service/end-points/Firm/firm-photo";

interface CapturePhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPhotoCapture: (file: File) => void;
  customerId: string;
  onPhotoSaved?: () => void;
}

export const CapturePhotoModal: React.FC<CapturePhotoModalProps> = ({
  isOpen,
  onClose,

  customerId,
  onPhotoSaved,
}) => {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { uploadFile } = useDMSFileUpload({
    module: "FIRM",
    referenceId: customerId,
    documentCategory: "PHOTO",
    documentType: "FIRM_PHOTO",
  });

  const [uploadFirmPhoto] = useUploadFirmPhotoMetaMutation();

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsStreaming(true);
      }
    } catch {
      logger.error("Unable to access camera. Please check permissions.", {
        toast: true,
      });
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = canvas.toDataURL("image/png");
        setCapturedImage(imageData);
      }
    }
  };

  const savePhoto = async () => {
    if (!capturedImage) return;

    setIsSaving(true);
    try {
      // Convert captured image to file
      const response = await fetch(capturedImage);
      const blob = await response.blob();
      const file = new File([blob], `captured-${Date.now()}.png`, {
        type: "image/png",
      });

      // Upload through DMS
      const fileData = await uploadFile(file);

      if (fileData) {
        // Save using RTK Query mutation (same as upload form)
        const metadataPayload: FirmPhotoUploadRequest[] = [
          {
            photoRefId: `FIRM_PHOTO_${String(Math.floor(Math.random() * 900) + 100).padStart(3, "0")}`,
            photoCaption: "Captured Picture",
            documentPath: fileData.filePath ?? "/photos/firm/captured.jpg",
            createdBy: 101,
          },
        ];

        await uploadFirmPhoto({
          customerId,
          data: metadataPayload,
        }).unwrap();

        logger.info("Photo captured and saved successfully!", { toast: true });
        onPhotoSaved?.();
        handleClose();
      }
    } catch {
      logger.error("Failed to save captured photo", { toast: true });
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    if (isStreaming && videoRef.current) {
      const stream = videoRef.current.srcObject as MediaStream;
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    }
    setIsStreaming(false);
    setCapturedImage(null);
    onClose();
  };

  const handleCaptureClick = () => {
    if (!isStreaming) {
      startCamera();
    } else {
      capturePhoto();
    }
  };

  // Auto-start camera when modal opens
  useEffect(() => {
    if (isOpen && !isStreaming) {
      startCamera();
    }
  }, [isOpen, isStreaming]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="relative max-h-[200dvh] w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-gray-400 transition-colors hover:bg-white hover:text-gray-600"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Body */}
        <div className="px-4 py-4">
          <div className="flex w-full flex-col items-center">
            {/* Header */}
            <div className="mb-3">
              <span className="inline-flex items-center rounded-full border border-teal-300 bg-teal-50 px-3 py-1 text-xs font-medium text-teal-700">
                Firm Photo
              </span>
            </div>
            <h1 className="mb-2 text-2xl font-bold text-gray-900">
              Capture Photo
            </h1>
            <p className="mb-4 text-sm text-gray-500">
              Capture And Save Firm Live Photo
            </p>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {/* Live Photo Section */}
              <div className="rounded-3xl border border-yellow-400 bg-gradient-to-br from-yellow-50/30 to-orange-50/20 p-4">
                <h3 className="mb-4 text-left text-lg font-bold text-gray-900">
                  Live Photo
                </h3>
                <div className="relative mb-4 flex aspect-[4/3] h-36 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-yellow-50 to-orange-50">
                  {!isStreaming && (
                    <div className="flex flex-col items-center justify-center text-yellow-400">
                      <div className="flex h-20 w-20 items-center justify-center rounded-2xl border-2 border-yellow-400">
                        <Camera className="h-10 w-10" />
                      </div>
                      <p className="mt-2 text-xs text-yellow-600">
                        Starting camera...
                      </p>
                    </div>
                  )}

                  <video
                    ref={videoRef}
                    className={`absolute inset-0 h-full w-full rounded-2xl object-cover ${isStreaming ? "block" : "hidden"}`}
                    autoPlay
                    playsInline
                    muted
                  />

                  <canvas ref={canvasRef} className="hidden" />
                </div>

                <div className="flex justify-center">
                  <Button
                    type="button"
                    onClick={handleCaptureClick}
                    className="rounded-full bg-gradient-to-r from-indigo-700 to-indigo-800 px-8 py-2.5 text-sm font-semibold text-white shadow-lg transition-all hover:from-indigo-800 hover:to-indigo-900"
                  >
                    <Camera className="mr-2 h-4 w-4" />
                    CAPTURE
                  </Button>
                </div>
              </div>

              {/* Preview Section */}
              <div className="rounded-3xl border border-blue-400 bg-gradient-to-br from-blue-50/30 to-indigo-50/20 p-4">
                <h3 className="mb-4 text-left text-lg font-bold text-gray-900">
                  Preview
                </h3>
                <div className="relative mb-4 flex aspect-[4/3] h-36 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100">
                  {!capturedImage && (
                    <div className="flex flex-col items-center justify-center text-blue-400">
                      <div className="flex h-20 w-20 items-center justify-center rounded-2xl border-2 border-blue-400">
                        <User className="h-10 w-10" />
                      </div>
                    </div>
                  )}

                  {capturedImage && (
                    <img
                      src={capturedImage}
                      alt="Preview"
                      className="absolute inset-0 h-full w-full rounded-2xl object-cover"
                    />
                  )}
                </div>

                <div className="flex justify-center">
                  <Button
                    type="button"
                    onClick={savePhoto}
                    disabled={!capturedImage || isSaving}
                    className="rounded-full bg-gradient-to-r from-indigo-700 to-indigo-800 px-8 py-2.5 text-sm font-semibold text-white shadow-lg transition-all hover:from-indigo-800 hover:to-indigo-900 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:from-indigo-700 disabled:hover:to-indigo-800"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    {isSaving ? "SAVING..." : "SAVE PHOTO"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
