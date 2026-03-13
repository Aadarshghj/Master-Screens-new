import * as yup from "yup";

export const MenuSubmenuSchema = yup.object({
    menuName: yup
        .string().trim()
        .required()
        .max(50, "Maximum 50 characters allowed"),

    menuCode: yup
        .string().trim()
        .required()
        .max(20, "Maximum 20 characters allowed"),
        
    description: yup
        .string().max(150, "Maximum 150 characters allowed").required(),

    menuOrder: yup.string().required() .matches(/^[0-9]+$/, "Only numbers are allowed"),

    parent: yup.string(),

    isActive: yup.boolean().required(),

   pageUrl: yup
  .string()
  .when("isUrl", {
    is: true,
    then: schema =>
      schema
        .required("Page URL is required")
        .max(150, "Maximum 150 characters allowed")
        .matches(/^\S+$/, "URL cannot contain spaces")
        .matches(
          /^(https?:\/\/)?[a-zA-Z0-9\-._~:/?#[\]@!$&'()*+,;=%]+$/,
          "Invalid URL Format"
        )
        .test(
          "not-only-numbers",
          "URL cannot contain only Numbers",
          value => !/^\d+$/.test(value ?? "")
        )
        .test(
          "not-only-special",
          "URL must contain at least one letter or number",
          value => /[a-zA-Z0-9]/.test(value ?? "")
        )
        .test(
          "no-double-slash",
          "URL cannot contain double slashes",
          value => !/\/\/+/.test(value ?? "")
        )
        .test(
          "no-trailing-slash",
          "URL should not end with /",
          value => !value?.endsWith("/")
        ),
    otherwise: schema => schema.notRequired()
  }),

    isUrl: yup.boolean().required(),
identity:yup.string()
    

})