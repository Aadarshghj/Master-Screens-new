export interface UserLeaveStatusFormData {
  branchCode?: string;
  userCode?: string;
  delegateUserCode?: string;
  branchIdentity: string;
  userIdentity: string;
  leaveFrom: string;
  leaveTo: string;
  status?: string;
  remarks: string;
  delegateUserIdentity: string;
  identity?: string;
  statusIdentity: string;
}
export interface userLeaveStatusPostResponse {
  identity: string;
  branchIdentity: string;
  userIdentity: string;
  leaveFrom: string;
  leaveTo: string;
  statusIdentity: string;
  delegateUserIdentity: string | null;
  remarks: string;
}
export interface UserLeaveStatusData {
  identity: string;
  userIdentity: string;
  userCode: string;
  delegateUserIdentity: string;
  delegateUserCode: string;
  branchIdentity: string;
  leaveFrom: string;
  leaveTo: string;
  status: string;
  statusIdentity: string;
  remarks: string;
  branchCode: string;
}

export interface UserLeaveStatusResponse {
  content: UserLeaveStatusData[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      unsorted: boolean;
      sorted: boolean;
    };
    offset: number;
    unpaged: boolean;
    paged: boolean;
  };
  last: boolean;
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    unsorted: boolean;
    sorted: boolean;
  };
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}

export interface UserLeaveStatusSearchFormData {
  userCode?: string;
  delegateUserCode?: string;
}

export interface BranchData {
  content: [
    {
      branchId: number;
      tenantId: number;
      branchCode: string;
      branchName: string;
      branchShortName: string;
      branchTypeId: number;
      statusId: number;
      parentBranchId: string | null;
      adminUnitType: string;
      parentAdminCode: string;
      locationCode: string;
      openingDate: string;
      closingDate: string | null;
      dateOfShift: string | null;
      categoryId: number;
      sizeId: number;
      numExtensionCounters: number;
      isMainBranchInLocation: boolean;
      linkServiceMainBranchId: string | null;
      isSplitPremises: boolean;
      numSplitPremises: number;
      localClearingMember: boolean;
      nationalClearingMember: boolean;
      highValueClearingMember: boolean;
      numOfficersAvailable: number;
      micrCode: number;
      ifscCode: string;
      swiftBicCode: string;
      bsrCode: string;
      clearingBasedOnMicr: boolean;
      cashMgmtBranch: boolean;
      rtgsDepEnabled: boolean;
      authDealForex: boolean;
      authForeignCurrencyDeposit: boolean;
      ddIssueAllowed: boolean;
      ttIssueAllowed: boolean;
      baseCurrencyCode: string;
      authDealerCode: string;
      tbaMainKey: string;
      regDirectoryCode: string;
      dedicatedIssueOperations: string;
      doorNumber: string;
      addressLine1: string;
      addressLine2: string;
      landmark: string;
      placeName: string;
      postOfficeId: number;
      cityId: number;
      districtId: number;
      stateId: number;
      countryId: number;
      pincodeId: number;
      pincode: string | number | null;
      latitude: number;
      longitude: number;
      timezone: string | null;
      identity: string | null;
      stateDto: string | null;
      branchTypeDto: string | null;
      statusDto: string | null;
      postOfficesDto: string | null;
      countryDto: string | null;
      citiesDto: string | null;
      districtDto: string | null;
    },
  ];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      unsorted: boolean;
      sorted: boolean;
    };
    offset: number;
    unpaged: boolean;
    paged: boolean;
  };
  last: boolean;
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    unsorted: boolean;
    sorted: boolean;
  };
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}

export interface UserDetailsResponse {
  content: [
    {
      identity: string;
      userId: number;
      userCode: string;
      userName: string;
    },
  ];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      unsorted: boolean;
      sorted: boolean;
    };
    offset: number;
    unpaged: boolean;
    paged: boolean;
  };
  last: boolean;
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    unsorted: boolean;
    sorted: boolean;
  };
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}
export interface StatusData {
  status: string;
  statusCode: string;
  identity: string;
  isActive: boolean;
}

export interface BatchItem {
  batchIdentity: string;
  batchName: string;
  fileName: string;
  status: string;
  totalRecords: number;
  processedRecords: number;
  erroredRecords: number;
  uploadedBy: string;
  createdAt: string;
  completedAt: string;
  detailedMessage: string;
}

export interface ImportHistoryLeaveStatusBatchResponse {
  content: BatchItem[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: Array<{
      direction: string;
      property: string;
      ignoreCase: boolean;
      nullHandling: string;
      ascending: boolean;
      descending: boolean;
    }>;
    offset: number;
    unpaged: boolean;
    paged: boolean;
  };
  last: boolean;
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  sort: Array<{
    direction: string;
    property: string;
    ignoreCase: boolean;
    nullHandling: string;
    ascending: boolean;
    descending: boolean;
  }>;
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}

export interface ImportHistoryLeaveStatusSearchParams {
  uploadedBy?: string;
  createdDate?: string;
  page?: number;
  size?: number;
}

export interface ImportHistoryDataLeaveStatus {
  batchIdentity: string;
  batchName: string;
  fileName: string;
  status: string;
  totalRecords: number;
  processedRecords: number;
  erroredRecords: number;
  uploadedBy: string;
  uploadedByName?: string;
  createdAt: string;
  completedAt: string;
  detailedMessage: string;
  uploadedDate?: string;
  uploadedTime?: string;
  completedDate?: string;
  completedTime?: string;
  [key: string]: unknown;
}

export interface ImportDetailsData {
  rowNumber: number;
  fullName: string;
  mobileNumber: string;
  leadSource: string;
  email: string;
  createdAt: string;
  errorMessage?: string;
  errorId?: number;
  siNo?: number;
  leadSourceName?: string;
  [key: string]: unknown;
}
export interface userdDetails {
  userName: string;
  identity: string;
}

export interface ImportDetailsSearchForm {
  batchId: string;
  updatedBy: string;
}

export interface UserLeaveStatusImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  batchIdentity: string;
  batchId: string;
  uploadedBy: string;
  type: "success" | "error";
  userOptions: Array<{ value: string; label: string }>;
}
export interface UserLeaveStatusImportHistorySearchForm {
  uploadedBy: string;
  createdDate: string;
}

export interface UserLeaveStatusImportHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}
export interface UserLeaveStatusModalProps<T = unknown> {
  isOpen: boolean;
  onClose: () => void;
  onImportSuccess?: (fileData: T) => void;
  handleRefetchData: () => void;
}

export interface UserLeaveStatusFilterProps {
  handleSetUserCode: (code: string) => void;
  handleSetDelegateUserCode: (code: string) => void;
  handlePageChange: (newPage: number) => void;
}

export interface UserLeaveStatusTableProps {
  page: number;
  size: number;
  handlePageChange: (newPage: number) => void;
  data: UserLeaveStatusResponse | undefined;
  isLoading: boolean;
  handleDelete: (identity: string) => void;
  onEdit: (stage: UserLeaveStatusFormData) => void;
}
