import * as yup from "yup";

export const MenuSubmenuSchema = yup.object({
    menuName: yup
        .string().trim()
        .required()       
        .max(20, "Maximum 20 characters allowed")
        .test("role-validation", "Invalid Role Name", function (value) {
    if (!value) return true;

    if (value.startsWith(" ")) {
      return this.createError({
        message: "First character cannot be a space",
      });
    }

    const invalidChar = /[^a-zA-Z0-9_/ ]/.test(value);

    if (invalidChar) {
      return this.createError({
        message: "Only letters, numbers and '/' are allowed",
      });
    }

    const hasLetter = /[a-zA-Z]/.test(value);

    if (!hasLetter) {
      return this.createError({
        message: "Role name cannot contain only numbers",
      });
    }

    return true;
  }),

    menuCode: yup
        .string().trim()
        .required()
        
        .max(50, "Maximum 50 characters allowed")
        .test("role-validation", "Invalid Role Name", function (value) {
    if (!value) return true;

    if (value.startsWith(" ")) {
      return this.createError({
        message: "First character cannot be a space",
      });
    }

    const invalidChar = /[^a-zA-Z0-9_/ ]/.test(value);

    if (invalidChar) {
      return this.createError({
        message: "Only letters, numbers and '/' are allowed",
      });
    }

    const hasLetter = /[a-zA-Z]/.test(value);

    if (!hasLetter) {
      return this.createError({
        message: "Role name cannot contain only numbers",
      });
    }

    return true;
  }),
        
    description: yup
        .string().max(200, "Maximum 200 characters allowed").required()
         .test("desc-validation", "Invalid description", function (value) {
    if (!value) return true;

    const hasLetter = /[a-zA-Z]/.test(value);
    if (!hasLetter) {
      return this.createError({
        message: "Description must contain at least one letter",
      });
    }
    return true;
  }),

    menuOrder: yup.string().required() .matches(/^[0-9]+$/, "Only numbers are allowed"),

    parent: yup.string().required(),

    isActive: yup.boolean().required(),

    pageUrl: yup.string().required(),

    isUrl: yup.boolean().required(),
    identity:yup.string().required()

}).required()