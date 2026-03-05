import React from "react";
import { RefreshCcw, Save, CircleX } from "lucide-react";
import {
  Controller,
  type UseFormRegister,
  type Control,
  type FieldErrors,
} from "react-hook-form";

import { FormContainer } from "@/components/ui/form-container";
import { Flex, Input, Select } from "@/components/ui";
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
  isSubmitting,
  onSubmit,
  onCancel,
  onReset,
}) => {
  return (
    <FormContainer className="px-0">
      <Form onSubmit={onSubmit}>
        <div className="mt-2">
          <Form.Row>
            {/* Supplier Name */}
            <Form.Col lg={3} md={6} span={12}>
              <Form.Field label="Supplier Name" required error={errors.supplierName}>
                <Input
                  {...register("supplierName")}
                  placeholder="Enter Supplier Name"
                  size="form"
                  variant="form"
                />
              </Form.Field>
            </Form.Col>

            {/* Trade Name */}
            <Form.Col lg={3} md={6} span={12}>
              <Form.Field label="Trade Name" required error={errors.tradeName}>
                <Input
                  {...register("tradeName")}
                  placeholder="Enter Trade Name"
                  size="form"
                  variant="form"
                />
              </Form.Field>
            </Form.Col>

            {/* PAN Number */}
            <Form.Col lg={2} md={6} span={12}>
              <Form.Field label="PAN Number" required error={errors.panNumber}>
                <Input
                  {...register("panNumber")}
                  placeholder="Enter PAN Number"
                  size="form"
                  variant="form"
                />
              </Form.Field>
            </Form.Col>

            {/* GSTIN */}
            <Form.Col lg={2} md={6} span={12}>
              <Form.Field label="GSTIN" required error={errors.gstin}>
                <Input
                  {...register("gstin")}
                  placeholder="Enter GSTIN"
                  size="form"
                  variant="form"
                />
              </Form.Field>
            </Form.Col>

            {/* MSME Number */}
            <Form.Col lg={2} md={6} span={12}>
              <Form.Field label="MSME No" error={errors.msmeNo}>
                <Input
                  {...register("msmeNo")}
                  placeholder="Enter MSME No"
                  size="form"
                  variant="form"
                />
              </Form.Field>
            </Form.Col>

            {/* Status Dropdown */}
            <Form.Col lg={2} md={6} span={12}>
              <Form.Field label="Status" required error={errors.status}>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      options={STATUS_DROPDOWN}
                      placeholder="Select Status"
                      size="form"
                      variant="form"
                      fullWidth
                      itemVariant="form"
                    />
                  )}
                />
              </Form.Field>
            </Form.Col>
          </Form.Row>

          {/* Buttons */}
          <Flex.ActionGroup className="mt-2 justify-end gap-4">
            <NeumorphicButton
              type="button"
              variant="grey"
              size="default"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              <CircleX className="h-3 w-3" />
              Cancel
            </NeumorphicButton>

            <NeumorphicButton
              type="button"
              variant="secondary"
              size="secondary"
              onClick={onReset}
              disabled={isSubmitting}
            >
              <RefreshCcw className="h-3 w-3" />
              Reset
            </NeumorphicButton>

            <NeumorphicButton
              type="submit"
              variant="default"
              size="default"
              disabled={isSubmitting}
            >
              <Save className="h-3 w-3" />
              {isSubmitting ? "Saving..." : "Save Supplier"}
            </NeumorphicButton>
          </Flex.ActionGroup>
        </div>
      </Form>
    </FormContainer>
  );
};