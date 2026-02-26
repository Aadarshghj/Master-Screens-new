import { mimeTypes } from "@/const/common-codes.const";

export const getMimeTypeFromFileName = (
  fileName: string,
  fallback?: string
): string => {
  const extension = fileName.split(".").pop()?.toLowerCase();

  if (extension && mimeTypes[extension]) {
    return mimeTypes[extension];
  }

  return fallback ?? "application/octet-stream";
};

export const getImageFormatFromFileName = (fileName: string): string => {
  const extension = fileName.split(".").pop()?.toLowerCase();

  if (extension) {
    return extension;
  }

  return "pdf";
};
