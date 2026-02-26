export const isValidUUID = (uuid: string): boolean => {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

export const validateFormConfig = (
  formConfig: Record<string, unknown>,
  uuidFields: string[]
): void => {
  for (const field of uuidFields) {
    const value = formConfig[field];
    if (typeof value === "string" && !isValidUUID(value)) {
      throw new Error(`Invalid UUID format for field: ${field}`);
    }
  }
};

export const generateAadharVault = (): string => {
  const randomNum = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");
  return `vault-${randomNum}`;
};

export const getGenderFromSalutation = (
  salutationIdentity: string,
  genderOptions: Array<{ value: string; label: string }>,
  salutationOptions: Array<{ value: string; label: string }>
): string => {
  const salutationObj = salutationOptions.find(
    option => option.value === salutationIdentity
  );
  if (!salutationObj) return "";

  const salutationToGenderMap: Record<string, string> = {
    MR: "MALE",
    MRS: "FEMALE",
    MISS: "FEMALE",
    MX: "TRANSGENDER",
  };

  const expectedGender = salutationToGenderMap[salutationObj.label];
  if (!expectedGender) return "";
  const matchingGender = genderOptions.find(
    option => option.label === expectedGender
  );

  return matchingGender?.value || "";
};
export const getSalutationFromGender = (
  genderIdentity: string,
  salutationOptions: Array<{ value: string; label: string }>,
  genderOptions: Array<{ value: string; label: string }>
): string => {
  const genderObj = genderOptions.find(
    option => option.value === genderIdentity
  );
  if (!genderObj) return "";

  const genderToSalutationMap: Record<string, string> = {
    MALE: "MR",
    FEMALE: "MISS",
    TRANSGENDER: "MX",
  };

  const expectedSalutation = genderToSalutationMap[genderObj.label];

  if (!expectedSalutation) return "";

  const matchingSalutations = salutationOptions.find(
    option => option.label === expectedSalutation
  );

  return matchingSalutations?.value || "";
};

export const getDisabledFieldClassName = (isDisabled: boolean): string => {
  return isDisabled ? "text-muted-foreground bg-muted/50" : "";
};

export const isMarriedStatus = (
  maritalStatus: string,
  maritalStatusOptions: Array<{ value: string; label: string }>
): boolean => {
  if (!maritalStatus) return false;
  const selectedStatus = maritalStatusOptions.find(
    option => option.value === maritalStatus
  );
  return selectedStatus?.label?.toLowerCase().includes("married") || false;
};

export const formatDocumentNumber = (
  value: string,
  documentType: string
): string => {
  const cleanValue = value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();

  switch (documentType) {
    case "AADHAAR":
      return cleanValue.replace(/(\d{4})(?=\d)/g, "$1-").substring(0, 14);
    case "PAN":
      return cleanValue.substring(0, 10);
    case "PASSPORT":
      return cleanValue.substring(0, 8);
    case "DL":
      return cleanValue.substring(0, 16);
    case "VOTER_ID":
      return cleanValue.substring(0, 10);
    default:
      return cleanValue;
  }
};

export const toUpperSafe = (value: unknown) =>
  typeof value === "string" ? value.toUpperCase() : value;
