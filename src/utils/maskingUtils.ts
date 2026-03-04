// utils/maskingUtils.ts
export const maskDocumentNumber = (value: string): string => {
  if (!value) return "";

  // Universal masking - mask everything regardless of document type or format
  return maskUniversal(value);
};

const maskUniversal = (value: string): string => {
  if (value.length === 0) return "";

  // Mask all characters except spaces and special formatting characters
  let masked = "";

  for (let i = 0; i < value.length; i++) {
    const char = value[i];
    // Keep spaces and common formatting characters, mask everything else
    if (char === " " || char === "-" || char === "/") {
      masked += char;
    } else {
      masked += "X";
    }
  }

  return masked;
};

// You can switch between different masking strategies by changing which function is used
// export const maskDocumentNumber = (value: string, documentType: string): string => {
//   if (!value) return '';
//   return maskAlternative(value);  // Use alternative masking
// };

// Utility to get the actual unmasked value for form submission
export const getUnmaskedValue = (maskedValue: string): string => {
  // This function is not needed anymore since we store original values separately
  // But keeping it for backward compatibility
  return maskedValue;
};

// Removed all validation logic as per requirement
// No format validation or restrictions
