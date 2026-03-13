import * as yup from "yup";

export const OrnamentNameSchema = yup.object({
    ornamentCode: yup
        .string()
        .required("Ornament Code is required")
        .matches(/^[A-Z_]+$/, "Admin Unit Type Code must contain only alphabets [A-Z] & underscores (_)."),


    ornamentName: yup
        .string()
        .required("Ornament Name is required")
        .matches(/^[A-Z ]+$/, "Admin Unit Type Code must contain only alphabets [A-Z] & spaces."),

    ornamentTypeIdentity: yup.string(),

    description: yup
        .string()
        .required("Description is required"),

    isActive: yup.boolean(),
    identity: yup.string(),
});
