import * as yup from "yup"

export const supplierInformationValidation = yup.object({
  supplierName: yup.string().required(),
  tradeName: yup.string().required(),
  supplierRiskCategory: yup.string().required(),
  panNumber: yup.string().required(),
  gstRegistrationType: yup.string().required(),
  gstin: yup.string(),
  msmeRegistrationNo: yup.string(),
  msmeType: yup.string(),
  cinOrLlpin: yup.string(),
  incorporationDate: yup.string(),
  contactPersonName: yup.string().required(),
  designation: yup.string().required(),
  isActive: yup.boolean(),

  contact: yup.object({
    contactType: yup.string().required(),
    contactValue: yup.string().required(),
    isActive: yup.boolean(),
    isPrimary: yup.boolean()
  }),

  assetGroup: yup.object({
    assetGroup: yup.string().required(),
    isActive: yup.boolean()
  }),

  address: yup.object({
    addressLine1: yup.string().required(),
    addressLine2: yup.string(),
    pincode: yup.string().required(),
    city: yup.string().required(),
    state: yup.string().required(),
    country: yup.string().required()
  }),

  bank: yup.object({
    bankName: yup.string().required(),
    branchName: yup.string().required(),
    accountHolderName: yup.string().required(),
    accountNumber: yup.string().required(),
    confirmAccountNumber: yup.string().required(),
    ifscCode: yup.string().required(),
    pennyDropVerification: yup.boolean(),
    defaultGstRate: yup.string(),
    isTds: yup.boolean(),
    tdsSection: yup.string(),
    tdsRate: yup.string(),
    isReverseChange: yup.boolean()
  })
})