import type { FieldProps } from "@/components/filterDataView/DynamicSearchForm";
import type { ConfigOption } from "@/types";
import type {
  ImportDetailsSearchForm,
  UserLeaveStatusFormData,
  UserLeaveStatusImportHistorySearchForm,
} from "@/types/approval-workflow/user-leave-status.types";

export const userLeaveStatusDefaultValues: UserLeaveStatusFormData = {
  branchIdentity: "",
  branchCode: "",
  delegateUserCode: "",
  userCode: "",
  identity: "",
  leaveFrom: "",
  leaveTo: "",
  status: "",
  statusIdentity: "",
  userIdentity: "",
  delegateUserIdentity: "",
  remarks: "",
};
export const leaveStatusFilterDefaultValue = {
  userCode: "",
  delegateUserCode: "",
};

export const leaveTemplateDownloadPath =
  "CommonCsv/user/leaveStatusCsv/bulkImportLeave/leave_status.xlsx";

export const leaveStatusHistoryInputFields = (
  userOptions: Array<{ value: string; label: string }>
): FieldProps<ImportDetailsSearchForm>[] => [
  {
    name: "batchId",
    label: "Batch ID",
    placeholder: "Enter Batch ID",
    type: "text",
    fieldType: "input",
    colSpan: { lg: 2, md: 6, span: 12 },
  },
  {
    name: "updatedBy",
    label: "Uploaded By",
    placeholder: "Select User",
    fieldType: "select",
    options: userOptions,
    colSpan: { lg: 2, md: 6, span: 12 },
  },
];

export const userLeaveStatusSearchFields = (
  userOptions: ConfigOption[]
): FieldProps<UserLeaveStatusImportHistorySearchForm>[] => [
  {
    name: "uploadedBy",
    label: "Uploaded By",
    placeholder: "Select User",
    fieldType: "select",
    options: [{ value: "all", label: "All" }, ...userOptions],
    colSpan: { lg: 2, md: 6, span: 12 },
  },
  {
    name: "createdDate",
    label: "Uploaded Date",
    placeholder: "Select Date",
    fieldType: "date",
    colSpan: { lg: 2, md: 6, span: 12 },
  },
];
