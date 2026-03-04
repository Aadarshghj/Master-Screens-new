import { logger } from "@/global/service";

export interface FileValidationConfig {
  MAX_SIZE: number;
  VALID_TYPES: readonly string[];
}

export const FILE_CONSTANTS: FileValidationConfig = {
  MAX_SIZE: 50 * 1024 * 1024, // 50MB
  VALID_TYPES: [
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/tiff",
    "image/tif",
    "application/pdf",
  ],
};

export const validateFile = (file: File): boolean => {
  const fileType = file.type as (typeof FILE_CONSTANTS.VALID_TYPES)[number];

  if (!FILE_CONSTANTS.VALID_TYPES.includes(fileType)) {
    throw new Error(`Unsupported file format: ${file.type}`);
  }

  if (file.size > FILE_CONSTANTS.MAX_SIZE) {
    const fileSizeMB = Math.round(file.size / (1024 * 1024));
    const maxSizeMB = Math.round(FILE_CONSTANTS.MAX_SIZE / (1024 * 1024));
    throw new Error(
      `File too large: ${fileSizeMB}MB. Maximum allowed: ${maxSizeMB}MB`
    );
  }

  if (file.size === 0) {
    throw new Error("File is empty. Please select a valid file.");
  }

  return true;
};

export const convertFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        const base64String = reader.result.split(",")[1];
        if (base64String) {
          resolve(base64String);
        } else {
          reject(new Error("Failed to extract base64 content"));
        }
      } else {
        reject(new Error("Failed to read file as string"));
      }
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
};

export const getFileExtension = (mimeType: string): string => {
  const extensionMap: Record<string, string> = {
    "application/pdf": "pdf",
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/tiff": "tiff",
    "image/tif": "tif",
  };
  return extensionMap[mimeType] || "bin";
};

export const downloadBase64AsFile = (
  base64: string,
  filename: string,
  mimeType: string
): void => {
  try {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    logger.error(error);
    throw error;
  }
};

export const base64ToFile = (
  base64String: string,
  filename: string = "photo.jpg",
  mimeType: string = "image/jpeg"
): File => {
  try {
    // Remove data URL prefix if present (e.g., "data:image/jpeg;base64,")
    const base64Data = base64String.includes(",")
      ? base64String.split(",")[1]
      : base64String;

    // Convert base64 to binary
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    return new File([byteArray], filename, { type: mimeType });
  } catch (error) {
    logger.error(error, { toast: true });
    throw new Error("Failed to convert base64 to file");
  }
};
