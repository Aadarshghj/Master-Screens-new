import React, { useState, useEffect } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { MapPin, Clock, User, Camera, Target } from "lucide-react";

interface PhotoDetailsTooltipProps {
  photoData: {
    firstname: string;
    photoId: number;
    photoRefId: number;
    capturedBy: number;
    latitude: number;
    longitude: number;
    captureTime: string;
    status: string;
    accuracy: number;
    captureDevice: string;
    locationDescription: string;
    filePath: string;
  };
  children: React.ReactNode;
}

export const PhotoDetailsTooltip: React.FC<PhotoDetailsTooltipProps> = ({
  photoData,
  children,
}) => {
  const [enhancedLocationDescription, setEnhancedLocationDescription] =
    useState<string>(photoData.locationDescription);

  useEffect(() => {
    // Location enhancement disabled - use coordinates as fallback
    if (
      photoData.locationDescription === "Current Location" ||
      photoData.locationDescription === "Default Location" ||
      photoData.locationDescription.includes("Location:")
    ) {
      const fallbackDescription = `Location: ${photoData.latitude.toFixed(4)}, ${photoData.longitude.toFixed(4)}`;
      setEnhancedLocationDescription(fallbackDescription);
    }
  }, [photoData.latitude, photoData.longitude, photoData.locationDescription]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 70) return "text-green-600";
    if (accuracy >= 50) return "text-yellow-600";
    return "text-red-600";
  };

  const getAccuracyStatus = (accuracy: number) => {
    if (accuracy >= 70) return "Live";
    if (accuracy >= 50) return "Under Review";
    return "Not Live";
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent
        side="left"
        className="max-w-sm border border-gray-200 bg-white p-3 text-xs shadow-lg"
        sideOffset={8}
      >
        <div className="space-y-2">
          {/* Header */}
          <div className="border-b border-gray-200 pb-1">
            <h3 className="text-xs font-semibold text-gray-900">
              Photo Details
            </h3>
            <p className="text-xs text-gray-500">ID: {photoData.photoId}</p>
          </div>

          {/* Customer Info */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <User className="h-2.5 w-2.5 text-gray-500" />
              <span className="text-xs font-medium text-gray-700">
                Customer:
              </span>
              <span className="text-xs text-gray-900">
                {photoData.firstname}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <User className="h-2.5 w-2.5 text-gray-500" />
              <span className="text-xs font-medium text-gray-700">
                Captured By:
              </span>
              <span className="text-xs text-gray-900">
                {photoData.capturedBy}
              </span>
            </div>
          </div>

          {/* Location Info */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <MapPin className="h-2.5 w-2.5 text-gray-500" />
              <span className="text-xs font-medium text-gray-700">
                Location:
              </span>
              <span className="text-xs text-gray-900">
                {enhancedLocationDescription}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Target className="h-2.5 w-2.5 text-gray-500" />
              <span className="text-xs font-medium text-gray-700">
                Coordinates:
              </span>
              <span className="font-mono text-xs text-gray-900">
                {photoData.latitude.toFixed(6)},{" "}
                {photoData.longitude.toFixed(6)}
              </span>
            </div>
          </div>

          {/* Capture Info */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Clock className="h-2.5 w-2.5 text-gray-500" />
              <span className="text-xs font-medium text-gray-700">
                Capture Time:
              </span>
              <span className="text-xs text-gray-900">
                {formatDate(photoData.captureTime)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Camera className="h-2.5 w-2.5 text-gray-500" />
              <span className="text-xs font-medium text-gray-700">Device:</span>
              <span className="text-xs text-gray-900">
                {photoData.captureDevice}
              </span>
            </div>
          </div>

          {/* Accuracy & Status */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Target className="h-2.5 w-2.5 text-gray-500" />
              <span className="text-xs font-medium text-gray-700">
                Accuracy:
              </span>
              <span
                className={`font-mono text-xs ${getAccuracyColor(photoData.accuracy)}`}
              >
                {photoData.accuracy.toFixed(1)}%
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-gray-700">Status:</span>
              <span
                className={`text-xs font-medium ${getAccuracyColor(photoData.accuracy)}`}
              >
                {getAccuracyStatus(photoData.accuracy)}
              </span>
            </div>
          </div>
        </div>
      </TooltipContent>
    </Tooltip>
  );
};
