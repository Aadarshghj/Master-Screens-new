import * as yup from "yup";
import type { UserRegType } from "@/types/customer-management/user-reg";

export const userRegSchema: yup.ObjectSchema<UserRegType> =
yup.object({
  id: yup.string().optional(),
  userCode: yup
  .string()  
  .required("User code is required")
  .matches(/^[A-Za-z0-9 ]+$/,"Special characters are not allowed"),

  userName: yup
  .string()
  .max(20,"Username must be at most 20 characters")
    .required("Username is required")
    .matches(/^[A-Za-z0-9.@ ]+$/,"Special characters are not allowed"),

    email: yup
    .string()
    .email("Invalid email")
    .required("Email is required"),

    phoneNumber: yup.string().required("Contact number is required"),

    userType: yup
    .string()
    .transform((value, originalValue) =>originalValue === "" ? undefined : value)
    .required("User type is required"),

    fullName: yup
    .string()
    .required("Full name is required")
    .max(20,"Username must be at most 20 characters")
    .matches(/^[A-Za-z. ]+$/,"Special characters and numbers are not allowed"),
    isActive: yup
      .boolean()
      .required(),
  });