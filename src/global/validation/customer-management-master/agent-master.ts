import * as yup from "yup";

export const agentMasterSchema = yup.object({
  agentName: yup.string().required("Agent Name is required"),
  agentCode: yup.string().required("Agent Code is required"),
});
