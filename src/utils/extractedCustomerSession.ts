const KEY = "extracted_customer_data";

export const saveExtractedCustomer = (data: unknown) => {
  sessionStorage.setItem(KEY, JSON.stringify(data));
};

export const getExtractedCustomer = () => {
  const raw = sessionStorage.getItem(KEY);
  return raw ? JSON.parse(raw) : null;
};

export const clearExtractedCustomer = () => {
  sessionStorage.removeItem(KEY);
};

export const normalizeId = (value: string) =>
  value.replace(/\s|-/g, "").toUpperCase();

export const doesIdMatch = (
  enteredId: string,
  extractedId?: string
): boolean => {
  if (!extractedId) return true;

  return normalizeId(enteredId) === normalizeId(extractedId);
};
