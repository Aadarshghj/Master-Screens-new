import * as yup from "yup";

export const OrnamentNameSchema = yup.object({
    ornamentCode: yup.string().required("Ornament Code is required"),
    ornamentName: yup.string().required("Ornament Name is required"),
    ornamentType: yup.string().required("Ornament Type is required"),
    description: yup.string().required("Description is required"),
    isActive: yup.boolean()
});
