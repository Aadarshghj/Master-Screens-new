type StorageType = "local" | "session";

function getStorage(type: StorageType): Storage {
  return type === "local" ? localStorage : sessionStorage;
}

export function setItemInStorage<T>({
  key,
  type = "local",
  value,
}: {
  key: string;
  value: T;
  type?: StorageType;
}): void {
  try {
    const storage = getStorage(type);
    storage.setItem(key, JSON.stringify(value));
  } catch {
    // Silently ignore storage errors
  }
}

export function getItemFromStorage<T>({
  key,
  type = "local",
}: {
  key: string;
  type?: StorageType;
}): T | null {
  try {
    const storage = getStorage(type);
    const raw = storage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    // Return null if parsing fails
    return null;
  }
}

export function removeItemFromStorage({
  key,
  type = "local",
}: {
  key: string;
  type?: StorageType;
}): void {
  try {
    const storage = getStorage(type);
    storage.removeItem(key);
  } catch {
    // Silently ignore storage errors
  }
}

export function clearStorage(type: StorageType = "local"): void {
  try {
    const storage = getStorage(type);
    storage.clear();
  } catch {
    // Silently ignore storage errors
  }
}

// KYC-specific utility functions
export interface KYCData {
  documentType: string;
  idNumber: string;
  maskedAadhaar?: string;
  vaultId?: string; // Vault ID from external API
  aadhaarName?: string;
  submittedAt: string;
  customerId: string;
  status: string;
  verified: boolean;
}

export function getPanData(): KYCData | null {
  return getItemFromStorage<KYCData>({ key: "panSubmitted", type: "session" });
}

export function getAadhaarData(): KYCData | null {
  return getItemFromStorage<KYCData>({
    key: "aadhaarSubmitted",
    type: "session",
  });
}

export function setPanData(data: KYCData): void {
  setItemInStorage({ key: "panSubmitted", value: data, type: "session" });
}

export function setAadhaarData(data: KYCData): void {
  setItemInStorage({ key: "aadhaarSubmitted", value: data, type: "session" });
}

export function clearKYCData(): void {
  removeItemFromStorage({ key: "panSubmitted", type: "session" });
  removeItemFromStorage({ key: "aadhaarSubmitted", type: "session" });
}

// Customer Code utility functions
export function getCustomerCode(): string | null {
  return getItemFromStorage<string>({ key: "customerCode", type: "local" });
}

export function setCustomerCode(customerCode: string): void {
  setItemInStorage({ key: "customerCode", value: customerCode, type: "local" });
}

export function clearCustomerCode(): void {
  removeItemFromStorage({ key: "customerCode", type: "local" });
}

// Customer Basic Info utility functions
export interface CustomerBasicInfo {
  identity: string;
  customerCode: string;
  status: string;
  firstName: string;
  middleName: string;
  lastName: string;
  fullName: string;
  aadharName: string;
  dob: string;
  gender: string;
  maritalStatus: string;
  taxCategory: string;
  salutation: string;
  branchId: string;
  crmReferenceId: string;
  occupation: string;
  employer: string;
  annualIncome: number;
  customerListTypeId: string | null;
  isBusiness: boolean;
  isFirm: boolean;
  guardianCustomerId: string | null;
  spouseName: string;
  fatherName: string;
  motherName: string;
  isMinor: boolean;
  customerStatus: string;
  visualScore: number | null;
  mobileNumber: string;
  aadharVaultId: string;
  otpVerified: boolean;
}

// Generate full name from first, middle, and last names
export function generateFullName(
  firstName: string,
  middleName: string,
  lastName: string
): string {
  const nameParts = [firstName, middleName, lastName].filter(
    part => part && part.trim() !== ""
  );
  return nameParts.join(" ").trim();
}

export function getCustomerBasicInfo(): CustomerBasicInfo | null {
  return getItemFromStorage<CustomerBasicInfo>({
    key: "customerBasicInfo",
    type: "session",
  });
}

export function setCustomerBasicInfo(data: CustomerBasicInfo): void {
  setItemInStorage({ key: "customerBasicInfo", value: data, type: "session" });
}

export function clearCustomerBasicInfo(): void {
  removeItemFromStorage({ key: "customerBasicInfo", type: "session" });
}
