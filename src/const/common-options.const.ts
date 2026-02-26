// Common dropdown options used across the application
export interface OptionType {
  value: string;
  label: string;
}

//  Yes/No options for boolean selections
export const yesOrNoOPtions: OptionType[] = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
] as const;

export const trueOrFalse: OptionType[] = [
  { value: "true", label: "Active" },
  { value: "false", label: "Inactive" },
] as const;

export const trueFalse: OptionType[] = [
  { value: "true", label: "Yes" },
  { value: "false", label: "No" },
] as const;
