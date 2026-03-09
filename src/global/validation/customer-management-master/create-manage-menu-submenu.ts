import * as yup from "yup";

export const MenuSubmenuSchema = yup.object({
    menuName: yup
        .string().trim()
        .required()
        // .matches(/^[A-Z0-9_]+$/, "Only uppercase letters, numbers and _ allowed")
        .max(20, "Maximum 20 characters allowed"),

    menucode: yup
        .string().trim()
        .required()
        .matches(/^[0-9]+$/, "Only numbers are allowed")
        .max(50, "Maximum 50 characters allowed"),
        
    description: yup
        .string().max(200, "Maximum 200 characters allowed").required(),

    menuOrder: yup.string().required() .matches(/^[0-9]+$/, "Only numbers are allowed"),

    parentMenu: yup.string().required(),

    isActive: yup.boolean().required(),

    pageurl: yup.string().required(),

    url: yup.boolean().required(),
    menuIdentity:yup.string().required()

}).required()