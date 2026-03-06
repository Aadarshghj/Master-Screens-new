import React from "react";
import {  Filter } from "lucide-react";
import {
  Controller,
  type UseFormRegister,
  type Control,
  type FieldErrors,
} from "react-hook-form";

import { FormContainer } from "@/components/ui/form-container";
import { Input, Select } from "@/components/ui";
import { Form } from "@/components";

import NeumorphicButton from "@/components/ui/neumorphic-button/neumorphic-button";

import type { SupplierMasterType } from "@/types/asset-management-system/supplier-management/supplier-list";

import { STATUS_DROPDOWN } from "@/mocks/asset-management-system/supplier-management/supplier-list-mock";

interface SupplierListProps {
  register: UseFormRegister<SupplierMasterType>;
  control: Control<SupplierMasterType>;
  errors: FieldErrors<SupplierMasterType>;
  isSubmitting: boolean;
  onSubmit: () => void;
  onCancel: () => void;
  onReset: () => void;
}

export const SupplierListForm: React.FC<SupplierListProps> = ({
  register,
  control,
  errors,
  onSubmit,
}) => {
  return (
    <FormContainer className="px-0">
      <Form onSubmit={onSubmit}>
        <div className="mt-2">
          <Form.Row className="flex w-full flex-nowrap items-start gap-3 overflow-x-auto">
            {/* Supplier Name */}
            <div className="min-w-[130px] flex-[1.5]">
              <Form.Field label="Supplier Name" error={errors.supplierName}>
                <Input
                  {...register("supplierName")}
                  placeholder="Enter Supplier Name"
                  size="form"
                  variant="form"
                  className="w-full rounded"
                />
              </Form.Field>
            </div>

            {/* Trade Name */}
            <div className="min-w-[130px] flex-[1.5]">
              <Form.Field label="Trade Name" error={errors.tradeName}>
                <Input
                  {...register("tradeName")}
                  placeholder="Enter Trade Name"
                  size="form"
                  variant="form"
                  className="w-full rounded"
                />
              </Form.Field>
            </div>

            {/* PAN */}
            <div className="min-w-[110px] flex-1">
              <Form.Field label="PAN Number" error={errors.panNumber}>
                <Input
                  {...register("panNumber")}
                  placeholder="Enter Pan"
                  size="form"
                  variant="form"
                  className="w-full rounded"
                />
              </Form.Field>
            </div>

            {/* GSTIN */}
            <div className="min-w-[110px] flex-1">
              <Form.Field label="GSTIN" error={errors.gstin}>
                <Input
                  {...register("gstin")}
                  placeholder="Enter GSTIN"
                  size="form"
                  variant="form"
                  className="w-full rounded"
                />
              </Form.Field>
            </div>

            {/* MSME */}
            <div className="min-w-[110px] flex-1">
              <Form.Field label="MSME No" error={errors.msmeNo}>
                <Input
                  {...register("msmeNo")}
                  placeholder="Enter MSME No"
                  size="form"
                  variant="form"
                  className="w-full rounded"
                />
              </Form.Field>
            </div>

            {/* Status */}
            <div className="min-w-[100px] flex-1">
              <Form.Field label="Status" error={errors.status}>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      options={STATUS_DROPDOWN}
                      placeholder="All"
                      size="form"
                      variant="form"
                      fullWidth
                      itemVariant="form"
                      className="w-full rounded"
                    />
                  )}
                />
              </Form.Field>
            </div>

            <div className="min-w-[100px] ">
              <Form.Field label="&nbsp;">
                <NeumorphicButton
                  variant="default"
                  type="submit"
                  className="flex  w-full items-center justify-center gap-2 rounded-full"
                >
                  <Filter className="h-4 w-4" />
                  Filter
                </NeumorphicButton>
              </Form.Field>
            </div>
          </Form.Row>
        </div>
      </Form>
    </FormContainer>
  );
};
