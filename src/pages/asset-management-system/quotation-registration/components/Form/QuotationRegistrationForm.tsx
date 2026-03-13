import { useEffect, useState } from "react";
import {
  useForm,
  Controller,
  // type Resolver
} from "react-hook-form";
import { FormContainer } from "@/components/ui/form-container";
import {
  Input,
  InputWithSearch,
  DatePicker,
  Form,
  TitleHeader,
  Flex,
  Grid,
  Textarea,
} from "@/components";
import type {
  Terms,
  QuotationReqData,
  QuotReqDetails,
  SupplierDetails,
  UploadQuot,
} from "@/types/asset-management-system/quotation-registration-type";
import { QuotationDetailsDataTable } from "../Table/QuotationDetailsTable";
import {
  Minus,
  Plus,
  RefreshCw,
  Save,
  Trash2,
  Upload,
  XCircle,
} from "lucide-react";
import { OtherChargesTable } from "../Table/OtherCharges";
import NeumorphicButton from "@/components/ui/neumorphic-button/neumorphic-button";
import { CHARGE_MOCK_DATA } from "@/mocks/asset-management-system/quotation-registration";
import { yupResolver } from "@hookform/resolvers/yup"
import { quotationRegistrationSchema } from "@/global/validation/asset-management-system/quotation-registration"

interface QuotRegWithSupplierModalProps {
  isOpen: boolean;
  onClose: () => void;
  quotation?: QuotationReqData | null;
  onToggleDisable?: () => void;
  isSubmitting: boolean;
}

export function QuotRegWithSupplierModal({
  isOpen,
  onClose,
  quotation,
  isSubmitting,
  onToggleDisable = () => {},
}: QuotRegWithSupplierModalProps) {
  const handleClose = () => {
    onToggleDisable();
    onClose();
  };

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm<{
    quotReq: QuotReqDetails;
    supplier: SupplierDetails;
    upload: UploadQuot;
    terms: Terms;
  }>({
    defaultValues: {
      quotReq: {},
      supplier: {},
      upload: {
        uploadQuot: null,
      },
      terms: {}
    },
    resolver: yupResolver(quotationRegistrationSchema) as any
  }); 

  useEffect(() => {
  if (isOpen) {
    reset();
    setIsFetched(false);
  }
}, [isOpen]);

  
  const [showTermForm, setShowTermForm] = useState(true);
  const [showChargeForm, setShowChargeForm] = useState(true);
  const [isFetched, setIsFetched] = useState(false);

  const onSubmit = (data: {
    quotReq: QuotReqDetails;
    supplier: SupplierDetails;
    upload: UploadQuot;
  }) => {
    console.log("Form Submitted:", data);
    handleClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="relative max-h-[95vh] w-[90vw] max-w-6xl overflow-auto rounded bg-white p-6 shadow-lg">
        <button
          className="absolute top-4 right-4 text-red-500 hover:text-red-700"
          onClick={handleClose}
        >
          <XCircle />
        </button>
        <TitleHeader title="Quotation Details" className="font-xl py-4" />
        <FormContainer>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <div className="rounded-lg border bg-blue-50 p-5">
              <h2 className="mb-4 text-base font-medium ">
                Quotation Request Details
              </h2>

              <Form.Row className="mt-4 gap-6 ">
                <Form.Col span={3}>
                  <Form.Field
                    label="Quotation Request Date"
                    required
                    error={errors?.quotReq?.quotReqDate}
                  >
                    <Controller
                      name="quotReq.quotReqDate"
                      control={control}
                      render={({ field }) => (
                        <DatePicker
                          value={field.value || undefined}
                          // onChange={field.onChange}
                           onChange={(date)=> {field.onChange(date);
                            if (quotation && date && !isFetched) {
                              setValue("quotReq.quotReqId", quotation.quotReqId);
                              setValue("quotReq.reqBy", "System");
                              setValue("quotReq.description", quotation.quotReqDesc);
                              setIsFetched(true);
                            }
                          }} 
                          onBlur={field.onBlur}
                          placeholder="dd/mm/yyyy"
                          allowManualEntry
                          size="form"
                          variant="form"
                        />
                      )}
                    />
                  </Form.Field>
                </Form.Col>

                <Form.Col span={3}>
                  <Form.Field
                    label="Quotation Request ID"
                    required
                    error={errors?.quotReq?.quotReqId}
                  >
                    <Input
                      {...register("quotReq.quotReqId")}
                      placeholder="Enter Quotation Request ID"
                      size="form"
                      variant="form"
                      disabled
                      className="uppercase"
                    />
                  </Form.Field>
                </Form.Col>

                <Form.Col span={3}>
                  <Form.Field
                    label="Requested By"
                    required
                    error={errors?.quotReq?.reqBy}
                  >
                    <Input
                      {...register("quotReq.reqBy")}
                      placeholder="Enter Requested By"
                      size="form"
                      variant="form"
                      disabled
                    />
                  </Form.Field>
                </Form.Col>

                <Form.Col span={3}>
                  <Form.Field
                    label="Description"
                    required
                    error={errors?.quotReq?.description}
                  >
                    <Input
                      {...register("quotReq.description")}
                      placeholder="Enter Description"
                      size="form"
                      variant="form"
                      disabled
                      required
                    />
                  </Form.Field>
                </Form.Col>
              </Form.Row>
            </div>

            <div className="mt-10 rounded-lg border p-5">
              <h2 className="mb-4 text-base font-medium">Supplier Details</h2>
              <Form.Row className="mt-4 gap-6">
                <Form.Col span={3}>
                  <Form.Field
                    label="Supplier Name"
                    required
                    error={errors?.supplier?.supplierName}
                  >
                    <InputWithSearch
                      placeholder="Search and select Supplier"
                      size="form"
                      variant="form"
                      required
                    />
                  </Form.Field>
                </Form.Col>

                <Form.Col span={3}>
                  <Form.Field
                    label="Quotation Number"
                    required
                    error={errors?.supplier?.quotationNumber}
                  >
                    <Input
                      {...register("supplier.quotationNumber")}
                      placeholder="Enter Quotation Number"
                      size="form"
                      variant="form"
                      className="uppercase"
                    />
                  </Form.Field>
                </Form.Col>

                <Form.Col span={3}>
                  <Form.Field
                    label="Quotation Date"
                    required
                    error={errors?.supplier?.quotationDate}
                  >
                    <Controller
                      name="supplier.quotationDate"
                      control={control}
                      render={({ field }) => (
                        <DatePicker
                          value={field.value || undefined}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          placeholder="dd/mm/yyyy"
                          allowManualEntry
                          size="form"
                          variant="form"
                          disableFutureDates={false}
                        />
                      )}
                    />
                  </Form.Field>
                </Form.Col>

                <Form.Col span={3}>
                  <Form.Field
                    label="Quotation Amount"
                    required
                    error={errors?.supplier?.quotationAmount}
                  >
                    <Input
                      {...register("supplier.quotationAmount")}
                      placeholder="Enter Quotation Amount"
                      size="form"
                      variant="form"
                    />
                  </Form.Field>
                </Form.Col>
              </Form.Row>

              <div className="mt-8">
                <h2 className="mb-4 text-base font-medium">
                  Quotation Details
                </h2>
                <QuotationDetailsDataTable />
              </div>
            </div>

            <div className="mt-0 ">
              <Grid className="mt-6 rounded-lg border p-5">
                <Form.Row className="items-start gap-12">
                  <Form.Col lg={7}>
                    <div className="mt-0 mb-2 flex items-center gap-2 ">
                      <h2 className="text-sm font-semibold">Other Charges</h2>
                      <button
                        type="button"
                        onClick={() => setShowChargeForm(prev => !prev)}
                        className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-700 text-white"
                      >
                        {showChargeForm ? (
                          <Minus size={15} />
                        ) : (
                          <Plus size={15} />
                        )}
                      </button>
                    </div>
                    {showChargeForm && (
                      <div className="max-h-41 overflow-y-auto rounded-md border">
                        <OtherChargesTable data={CHARGE_MOCK_DATA} />
                      </div>
                    )}
                  </Form.Col>

                  <Form.Col lg={5}>
                    <Form.Field required error={errors?.upload?.uploadQuot}>
                      <label className="mt-0 mb-3 text-sm font-semibold">
                        Upload Quotation<span className="text-red-500">*</span>
                      </label>
                      <Controller
                        control={control}
                        name="upload.uploadQuot"
                        rules={{ required: "Please upload a quotation file" }}
                        render={({ field }) => (
                          <div className="w-full">
                            <div className="flex h-40 cursor-pointer flex-col items-center justify-center rounded-lg border-3 border-dashed border-gray-300 p-6 text-center transition hover:bg-blue-50">
                              <Input
                                type="file"
                                className="hidden"
                                id="uploadQuot"
                                onChange={e =>
                                  field.onChange(e.target.files?.[0] || null)
                                }
                              />
                              <label
                                htmlFor="uploadQuot"
                                className="flex cursor-pointer flex-col items-center gap-2"
                              >
                                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-blue-700 text-white">
                                  <Upload />
                                </div>

                                <p className="text-sm text-gray-600">
                                  Drag and drop files or{" "}
                                  <span className="text-primary ">browse</span>
                                </p>

                                <p className="text-xs text-gray-400">
                                  PDF, DOC · Max 2MB
                                </p>
                              </label>
                            </div>

                            {field.value && (
                              <div className="bg-primary mt-3 flex items-center justify-between rounded-md px-3 py-2 text-sm text-white">
                                <span>{field.value.name}</span>
                                <button
                                  type="button"
                                  onClick={() => field.onChange(null)}
                                  className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-indigo-500"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      />
                    </Form.Field>
                  </Form.Col>
                </Form.Row>

                <Form.Row className="gap-6">
                  <Form.Col lg={4}>
                    <div className="mb-2 flex items-center gap-2">
                      <h3 className="text-xs font-semibold">
                        Terms & Conditions / Remarks
                      </h3>
                      <button
                        type="button"
                        onClick={() => setShowTermForm(prev => !prev)}
                        className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-700 text-white"
                      >
                        {showTermForm ? (
                          <Minus size={15} />
                        ) : (
                          <Plus size={15} />
                        )}
                      </button>
                    </div>

                    {showTermForm && (
                      <Textarea
                        placeholder="Enter Terms & Conditions"
                        size="form"
                        variant="form"
                        rows={4}
                      />
                    )}
                  </Form.Col>

                  <Form.Col lg={3}>
                    <div className="mt-8 flex h-full flex-col gap-2 rounded-lg border bg-blue-100 p-3">
                      <Form.Field error={errors?.terms?.totQuot}>
                      <h3 className="text-xs font-semibold">
                        Total Quotation Amount{" "}
                        <span className="text-red-500">*</span>
                      </h3>
                      <Input
                        {...register("terms.totQuot")}
                        placeholder="//Auto Calculated"
                        disabled
                        required
                      />
                      </Form.Field>
                    </div>
                  </Form.Col>
                </Form.Row>
              </Grid>
            </div>
          

        <div className="mt-6 flex justify-end gap-2">
          <Flex.ActionGroup className="mt-2 justify-end gap-4">
            <NeumorphicButton
              type="button"
              variant="secondary"
              size="secondary"
              // onClick={onReset}
              // disabled={isSubmitting}
            >
              <RefreshCw width={12} />
              Reset
            </NeumorphicButton>

            <NeumorphicButton
              type="submit"
              variant="default"
              size="default"
              // disabled={isSubmitting}
            >
              <Save className="h-3 w-3" />
              {!isSubmitting ? "Saving..." : "Save Quotation Details"}
            </NeumorphicButton>
          </Flex.ActionGroup>
        </div>
        </Form>
        </FormContainer>
      </div>
    </div>
  );
}
