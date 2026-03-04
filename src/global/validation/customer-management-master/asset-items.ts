import * as yup from "yup";

export const AssetItemSchema = yup.object({
  assetItemCode: yup.string().required("Asset Item Code is required"),

  assetItemName: yup.string().required("Asset Item Name is required"),

  assetType: yup.string().required("Asset Type is required"),

  assetGroup: yup.string().required("Asset Group is required"),

  assetCategory: yup.string().required("Asset Category is required"),

  depreciationRate: yup
    .string()
    .required("Depreciation Rate is required")
    .test(
      "is-number",
      "Depreciation Rate must be a number",
      value => !value || !isNaN(Number(value))
    )
    .test("range", "Rate must be between 0 and 100", value => {
      const num = Number(value);
      return num >= 0 && num <= 100;
    }),

  depreciationMethod: yup.string().nullable(),

  unitOfMeasurement: yup.string().required("Unit of Measurement is required"),

  assetDescription: yup.string().nullable(),

  tangible: yup.boolean(),

  active: yup.boolean(),
});
