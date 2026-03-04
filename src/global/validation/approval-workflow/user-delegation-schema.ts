// validation/user-delegation-schema.ts

import * as yup from "yup";

export const userDelegationValidationSchema = yup.object().shape({
  fromUser: yup
    .string()
    .required("From user is required")
    .test("not-empty", "From user is required", value => value !== ""),

  toUser: yup
    .string()
    .required("To user is required")
    .test("not-empty", "To user is required", value => value !== "")
    .test(
      "not-same-as-from",
      "To user cannot be the same as from user",
      function (value) {
        return value !== this.parent.fromUser;
      }
    ),

  startDate: yup
    .string()
    .required("Start date is required")
    .test("not-empty", "Start date is required", value => value !== ""),

  endDate: yup
    .string()
    .required("End date is required")
    .test("not-empty", "End date is required", value => value !== "")
    .test(
      "end-after-start",
      "End date must be after start date",
      function (value) {
        const { startDate } = this.parent;
        if (!value || !startDate) return true;
        return new Date(value) >= new Date(startDate);
      }
    ),

  module: yup.string().optional().nullable(),

  reason: yup
    .string()
    .required("Reason is required")
    .min(10, "Reason must be at least 10 characters")
    .max(500, "Reason must not exceed 500 characters")
    .trim(),

  active: yup.boolean().default(true),
});

export type UserDelegationValidationSchema = yup.InferType<
  typeof userDelegationValidationSchema
>;
