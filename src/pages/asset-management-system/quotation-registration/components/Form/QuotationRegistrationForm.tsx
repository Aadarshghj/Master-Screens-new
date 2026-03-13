import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { FormContainer } from "@/components/ui/form-container";
import { Input, InputWithSearch, DatePicker, Form, TitleHeader, Flex, Grid, Textarea } from "@/components";
import type { QuotReqDetails, SupplierDetails, UploadQuot } from "@/types/asset-management/quotation-registration-type";
import { QuotationDetailsDataTable } from "../Table/QuotationDetailsTable";
import { Plus, RefreshCw, Save, Trash2, Upload } from "lucide-react";
import { OtherChargesTable } from "../Table/OtherCharges";
import NeumorphicButton from "@/components/ui/neumorphic-button/neumorphic-button";
import { CHARGE_MOCK_DATA } from "@/mocks/asset-management/quotation-registration";

interface QuotRegWithSupplierModalProps {
  isOpen: boolean;
  onClose: () => void;
  onToggleDisable?: () => void;
  isSubmitting: boolean;
}

export function QuotRegWithSupplierModal({ isOpen, onClose, isSubmitting, onToggleDisable = () => {} }: QuotRegWithSupplierModalProps) {
  const handleClose = () => {
    onToggleDisable();
    onClose();
  };

  const { register, handleSubmit, control, formState: { errors } } = useForm<{
    quotReq: QuotReqDetails;
    supplier: SupplierDetails;
    upload: UploadQuot;
  }>({
    defaultValues: {
      quotReq: {},
      supplier: {},
      upload: {
        uploadQuot: null
      }
    },
  });

  const [description, setDescription] = useState("");

  const onSubmit = (data: { quotReq: QuotReqDetails; supplier: SupplierDetails; upload: UploadQuot }) => {
    console.log("Form Submitted:", data);
    handleClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white w-[90vw] max-w-6xl p-6 rounded shadow-lg overflow-auto max-h-[95vh] relative">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          onClick={handleClose}
        >
          ✕
        </button>
        <TitleHeader
          title="Quotation Details"
          className="py-4 font-xxl"
        />
        <FormContainer>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <div className="border rounded-lg p-5 bg-blue-50">
            <h2 className="mb-4 text-base font-medium ">Quotation Request Details</h2>

            <Form.Row className="mt-4 gap-6 ">
              <Form.Col span={3}>
                <Form.Field label="Quotation Request Date" required error={errors?.quotReq?.quotReqDate}>
                  <Controller
                    name="quotReq.quotReqDate"
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
                      />
                    )}
                  />
                </Form.Field>
              </Form.Col>

              <Form.Col span={3}>
                <Form.Field label="Quotation Request ID" required error={errors?.quotReq?.quotReqId}>
                  <Input
                    {...register("quotReq.quotReqId")}
                    placeholder="Enter Quotation Request ID"
                    size="form"
                    variant="form"
                    className="uppercase"
                  />
                </Form.Field>
              </Form.Col>

              <Form.Col span={3}>
                <Form.Field label="Requested By" required error={errors?.quotReq?.reqBy}>
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
                <Form.Field label="Description" required error={errors?.quotReq?.description}>
                  <Input
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="Enter Description"
                    size="form"
                    variant="form"
                    required
                  />
                </Form.Field>
              </Form.Col>
            </Form.Row>
            </div>

            <div className="border rounded-lg p-5 mt-10">
            <h2 className="mb-4 text-base font-medium">Supplier Details</h2>
            <Form.Row className="mt-4 gap-6">
              <Form.Col span={3}>
                <Form.Field label="Supplier Name" required error={errors?.supplier?.supplierName}>
                  <InputWithSearch
                    placeholder="Select Supplier Name"
                    size="form"
                    variant="form"
                    required
                  />
                </Form.Field>
              </Form.Col>

              <Form.Col span={3}>
                <Form.Field label="Quotation Number" required error={errors?.supplier?.quotationNumber}>
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
                <Form.Field label="Quotation Date" required error={errors?.supplier?.quotationDate}>
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
                <Form.Field label="Quotation Amount" required error={errors?.supplier?.quotationAmount}>
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
                <h2 className="mb-4 text-base font-medium">Quotation Details</h2>
                  <QuotationDetailsDataTable />
            </div> 
            </div>
                    
            <div className="mt-0 ">
            <Grid className="border rounded-lg p-5 mt-6">
              <Form.Row className="gap-12 items-start">
                <Form.Col lg={7}>
                  <div className="flex items-center gap-2 mb-2">
                    <h2 className="text-sm font-semibold">Other Charges</h2>
                      <button
                        type="button"
                        className="w-6 h-6 flex items-center justify-center rounded-md bg-blue-700 text-white"
                      >
                        <Plus size={15} />
                      </button>
                  </div>
                    <OtherChargesTable data={CHARGE_MOCK_DATA} />
                </Form.Col>

                <Form.Col lg={5}>
                  <Form.Field required error={errors?.upload?.uploadQuot}>
                    <label className="text-sm font-semibold mb-3" >Upload Quotation<span className="text-red-500">*</span></label>
                    <Controller
                      control={control}
                      name="upload.uploadQuot"
                      rules={{ required: "Please upload a quotation file" }}
                      render={({ field }) => (
                        <div className="w-full">
                          <div className="border-3 border-dashed border-gray-300 rounded-lg p-6 h-40 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-blue-50 transition">
                            <Input
                              type="file"
                              className="hidden"
                              id="uploadQuot"
                              onChange={(e) => field.onChange(e.target.files?.[0] || null)}
                            />
                              <label htmlFor="uploadQuot" className="flex flex-col items-center gap-2 cursor-pointer">
                                <div className="w-10 h-10 flex items-center justify-center bg-blue-700 text-white rounded-md">
                                  <Upload/>
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
                          <div className="mt-3 flex items-center justify-between bg-primary text-white px-3 py-2 rounded-md text-sm">
                            <span>{field.value.name}</span>
                            <button
                              type="button"
                              onClick={() => field.onChange(null)}
                              className="flex items-center justify-center w-6 h-6 rounded-full bg-white text-indigo-500"
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
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-xs font-semibold">Terms & Conditions / Remarks</h3>
                  <button
                    type="button"
                    className="w-6 h-6 flex items-center justify-center rounded-md bg-blue-700 text-white"
                  >
                    <Plus size={15} />
                  </button>
                </div>
                <Textarea
                  placeholder="Enter Terms & Conditions"
                  size="form"
                  variant="form"
                  rows={4}
                />
              </Form.Col>
                              
              <Form.Col lg={3}>
                <div className="border rounded-lg p-3 mt-8 bg-blue-100 h-full flex flex-col gap-2">
                  <h3 className="text-xs font-semibold">Total Quotation Amount</h3>
                  <Input
                    placeholder="//Auto Calculated"
                    disabled
                    required
                  />
                </div>
              </Form.Col>
            </Form.Row>
          </Grid>

            </div>
          </Form>
          </FormContainer>

          <div className="flex gap-2 justify-end mt-6">
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
              {isSubmitting ? "Saving..." : "Save Quotation Details" }
            </NeumorphicButton>
          </Flex.ActionGroup>
          </div>
        </div>
      </div>
  );
}