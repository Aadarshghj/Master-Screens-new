import * as yup from "yup";

export const contactValidationSchema = yup.object().shape({
  contactType: yup.string().required("Contact type is required"),
  contactTypeId: yup.string().required("Contact type ID is required"),
  contactDetails: yup
    .string()
    .required("Contact details are required")
    .test("contact-message", function (value) {
      const { contactType } = this.parent;

      if (!value || !contactType) return true;

      switch (contactType.toLowerCase()) {
        case "email":
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            return this.createError({
              message:
                "Please enter a valid email address (e.g., user@example.com)",
            });
          }
          break;
        case "mobile":
          if (!/^[6-9]\d{9}$/.test(value)) {
            return this.createError({
              message:
                "Please enter a valid 10-digit Mobile number starting with 6-9 (e.g., 9876543210)",
            });
          }
          break;
        case "whatsapp":
          if (!/^[6-9]\d{9}$/.test(value)) {
            return this.createError({
              message:
                "Please enter a valid 10-digit WhatsApp number starting with 6-9 (e.g., 9876543210)",
            });
          }
          break;
        case "landline":
          if (!/^[0-9]{10,15}$/.test(value)) {
            return this.createError({
              message:
                "Please enter a valid landline number (10-15 digits, e.g., 02212345678)",
            });
          }
          break;
      }

      return true;
    }),
  isPrimary: yup.boolean(),
  isActive: yup.boolean(),
  isOptOutPromotionalNotification: yup.boolean(),
  isVerified: yup.boolean(),
});
