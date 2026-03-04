import * as yup from "yup";

export const OccupationSchema = yup.object({
  occupationType: yup.string().required("Occupation Type is required"),
});
