// Recovery Priority Types - Base type with all attributes
export interface RecoveryPriorityData {
  identity: string;
  id: string;
  loanScheme: string;
  component: string;
  dueType: string;
  priority: number | null;
  description: string;
  isActive: boolean;
  active: boolean;
  status: boolean;
  schemeIdentity?: string;
  schemeName?: string;
}

// Derived types using Pick utility
export type RecoveryPriorityFormData = Pick<RecoveryPriorityData, "loanScheme">;

export type RecoveryComponent = Pick<
  RecoveryPriorityData,
  "id" | "component" | "priority" | "description" | "isActive"
> & {
  priority: number; // Override to make non-nullable for UI
  dueTypeId?: string; // Add UUID field for API calls
};

export type RecoveryPriorityItem = Pick<
  RecoveryPriorityData,
  "dueType" | "priority" | "description" | "active"
>;

export type RecoveryPriorityResponse = Pick<
  RecoveryPriorityData,
  "identity" | "dueType" | "priority" | "description" | "status"
>;

// API Request/Response types
export interface RecoveryPriorityPayload {
  recoveryPriorities: RecoveryPriorityItem[];
}

export interface RecoveryPriorityApiResponse {
  schemeIdentity: string;
  schemeName: string;
  recoveryPriorities: RecoveryPriorityResponse[];
}

// Non-derived types (external interfaces)
export interface RecoveryPriorityProps {
  onComplete?: () => void;
  onSave?: () => void;
  onUnsavedChanges?: (hasChanges: boolean) => void;
}
