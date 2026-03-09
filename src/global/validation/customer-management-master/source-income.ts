import * as yup from "yup";

export const sourceOfIncomeSchema = yup.object({
  name: yup
    .string()
    .required("Source of Income Name is required")
    .matches(
      /^[A-Za-z]/,
      "First character must be an alphabet"
    )
    .matches(
      /^[A-Za-z_\/ ]+$/,
      "Only alphabets, underscore (_), forward slash (/) and space are allowed"
    ),

  code: yup
    .string()
    .required("Source of Income Code is required")
     .matches(
      /^[A-Za-z_\/ ]+$/,
      "Only alphabets, underscore (_), forward slash (/) and space are allowed"
    )
     .matches(
      /^[A-Za-z]/,
      "First character must be an alphabet"
    )

});