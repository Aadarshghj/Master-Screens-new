import * as yup from "yup";

export const singleLeadFollowupValidationSchema = yup.object().shape({
  followUpDate: yup.string().required("Follow-up date is required"),
  nextFollowUpDate: yup
    .string()
    .required("Next follow-up date is required")
    .test(
      "is-greater",
      "Next follow-up date must be after follow-up date",
      function (value) {
        const { followUpDate } = this.parent;
        if (!followUpDate || !value) return true;
        return new Date(value) > new Date(followUpDate);
      }
    ),
  productService: yup.string().required("Product/Service is required"),
  leadStage: yup.string().required("Lead stage is required"),
  followUpType: yup.string().required("Follow-up type is required"),
  followUpNotes: yup.string().required("Follow-up notes are required"),
});
