import * as yup from "yup";

export const SectoralPerformanceSchema = yup.object({
  sectorName: yup
    .string()
    .required("Sectoral Performance Type is required")
    .max(50, "Maximum 50 characters allowed"),
});
