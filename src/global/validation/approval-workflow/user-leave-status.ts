import * as yup from "yup";

export const userLeaveStatusValidationSchema = yup.object().shape({
  branchIdentity: yup.string().required("branchIdentity ID is required"),
  userIdentity: yup.string().required("userIdentity is required"),
  leaveFrom: yup
    .string()
    .nullable()
    .transform((value, originalValue) => {
      return originalValue === "" ? null : value;
    })
    .required("Leave from is required")
    .test(
      "not-past-date",
      "Leave from date cannot be in the past",
      function (value) {
        if (!value) return true;
        const inputDate = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return inputDate >= today;
      }
    ),
  leaveTo: yup
    .string()
    .nullable()
    .transform((value, originalValue) => {
      return originalValue === "" ? null : value;
    })
    .required("Leave to is required")
    .test(
      "not-past-date",
      "Leave to date cannot be in the past",
      function (value) {
        if (!value) return true;
        const inputDate = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return inputDate >= today;
      }
    )
    .test(
      "after-leave-from",
      "Leave to must be same as or after Leave From date",
      function (value) {
        if (!value) return true;
        const { leaveFrom } = this.parent;
        if (!leaveFrom) return true;
        const leaveFromDate = new Date(leaveFrom);
        const leaveToDate = new Date(value);
        return leaveToDate >= leaveFromDate;
      }
    ),
  statusIdentity: yup.string().required("status is required"),
  remarks: yup.string().default(""),
  delegateUserIdentity: yup.string().default(""),
});

export type UserLeaveStatusalidationSchema = yup.InferType<
  typeof userLeaveStatusValidationSchema
>;
