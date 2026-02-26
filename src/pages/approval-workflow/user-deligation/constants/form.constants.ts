// constants/user-delegation.constants.ts

import type {
  UserDelegationFormData,
  UserDelegationSearchParams,
} from "@/types/approval-workflow/user-delegation.types";

export const userDelegationDefaultValues: UserDelegationFormData = {
  fromUser: "",
  toUser: "",
  startDate: "",
  endDate: "",
  module: "",
  reason: "",
  active: true,
};

export const userDelegationFilterDefaultValues: UserDelegationSearchParams = {
  fromUser: "",
  toUser: "",
  page: 0,
  size: 10,
};
