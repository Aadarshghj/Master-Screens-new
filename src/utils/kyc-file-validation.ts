export interface KYCFileValidationResult {
  isValid: boolean;
  errors: string[];
}

export const KYC_FILE_CONSTANTS = {
  MAX_SIZE: 2 * 1024 * 1024, // 2MB
  ALLOWED_TYPES: ["image/jpeg", "image/jpg", "image/png", "application/pdf"],
  ALLOWED_EXTENSIONS: ["jpg", "jpeg", "png", "pdf"],
} as const;

export const validateKYCFile = (file: File | null): KYCFileValidationResult => {
  const errors: string[] = [];

  if (!file) {
    errors.push("Document file is required");
    return { isValid: false, errors };
  }

  // Check file size
  if (file.size > KYC_FILE_CONSTANTS.MAX_SIZE) {
    const fileSizeMB = Math.round((file.size / (1024 * 1024)) * 100) / 100;
    const maxSizeMB = Math.round(KYC_FILE_CONSTANTS.MAX_SIZE / (1024 * 1024));
    errors.push(
      `File size must be less than ${maxSizeMB}MB (current: ${fileSizeMB}MB)`
    );
  }

  // Check file type
  if (
    !KYC_FILE_CONSTANTS.ALLOWED_TYPES.includes(
      file.type as (typeof KYC_FILE_CONSTANTS.ALLOWED_TYPES)[number]
    )
  ) {
    errors.push("Accepted format JPG,PNG,JPEG,PDF Max size: 2MB");
  }

  // Check file extension
  const fileExtension = file.name.split(".").pop()?.toLowerCase();
  if (
    fileExtension &&
    !KYC_FILE_CONSTANTS.ALLOWED_EXTENSIONS.includes(
      fileExtension as (typeof KYC_FILE_CONSTANTS.ALLOWED_EXTENSIONS)[number]
    )
  ) {
    errors.push("Accepted format JPG,PNG,JPEG,PDF Max size: 2MB");
  }

  // Check if file is empty
  if (file.size === 0) {
    errors.push("File is empty. Please select a valid file.");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Gets human-readable file size
 * @param bytes - File size in bytes
 * @returns Formatted file size string
 */
export const getFileSizeString = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

/**
 * Checks if file size is within KYC limits
 * @param file - The file to check
 * @returns True if file size is within limits
 */
export const isFileSizeValid = (file: File): boolean => {
  return file.size <= KYC_FILE_CONSTANTS.MAX_SIZE;
};

/**
 * Checks if file type is supported for KYC
 * @param file - The file to check
 * @returns True if file type is supported
 */
export const isFileTypeValid = (file: File): boolean => {
  return KYC_FILE_CONSTANTS.ALLOWED_TYPES.includes(
    file.type as (typeof KYC_FILE_CONSTANTS.ALLOWED_TYPES)[number]
  );
};

/**
 * Gets validation error message for file
 * @param file - The file to validate
 * @returns Error message or null if valid
 */
export const getKYCFileValidationError = (file: File | null): string | null => {
  const result = validateKYCFile(file);
  return result.isValid ? null : result.errors[0];
};
