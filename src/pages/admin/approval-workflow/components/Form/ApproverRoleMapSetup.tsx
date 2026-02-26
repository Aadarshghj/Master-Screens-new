import React from "react";
import { PlusCircle, RotateCcw, Save, X } from "lucide-react";
import {
  type Control,
  type FieldErrors,
  type UseFormRegister,
  Controller,
} from "react-hook-form";

import { FormContainer } from "@/components/ui/form-container";
import { Flex, Input, Label, Switch, InputWithSearch } from "@/components/ui";
import { Button, Form, TitleHeader } from "@/components";
import type { ApproverRoleMappingForm } from "@/types/admin/approverrolemap";

interface ApproverRoleMappingSetupProps {
  control: Control<ApproverRoleMappingForm>;
  errors: FieldErrors<ApproverRoleMappingForm>;
  register: UseFormRegister<ApproverRoleMappingForm>;
  isSubmitting: boolean;
  onSubmit: () => void;
  onCancel: () => void;
  onReset: () => void;
  onSearchRole?: () => void;
  onSearchUser?: () => void;
  onSearchBranch?: () => void;
  onSearchRegion?: () => void;
  onSearchCluster?: () => void;
  onSearchStatus?: () => void;
}

export const ApproverRoleMappingSetup: React.FC<
  ApproverRoleMappingSetupProps
> = ({
  control,
  errors,
  register,
  isSubmitting,
  onSubmit,
  onCancel,
  onReset,
  onSearchRole,
  onSearchUser,
  onSearchBranch,
  onSearchRegion,
  onSearchCluster,
  onSearchStatus,
}) => {
  return (
    <FormContainer className="px-0">
      <Form onSubmit={onSubmit}>
        <div className="mt-8">
          <div className="flex items-center justify-between">
            <TitleHeader title="Approver Role Mapping" />
            <Button
              type="submit"
              size="sm"
              variant="default"
              className="border-b border-gray-300 shadow-[0_3px_4px_-3px_rgba(0,0,0,0.25)]"
            >
              <PlusCircle className="mr-1 h-3 w-3" />
              Add Approver Role Mapping
            </Button>
          </div>

          <div className="mt-6">
            <Form.Row>
              <Form.Col lg={3} md={6} span={12}>
                <Form.Field label="Role Code" required error={errors.roleCode}>
                  <InputWithSearch
                    {...register("roleCode")}
                    placeholder="eg: AM,RM,ZM,HO"
                    size="form"
                    variant="form"
                    onSearch={onSearchRole}
                  />
                </Form.Field>
              </Form.Col>

              <Form.Col lg={3} md={6} span={12}>
                <Form.Field label="User Code" required error={errors.userCode}>
                  <InputWithSearch
                    {...register("userCode")}
                    placeholder="eg: John doe"
                    size="form"
                    variant="form"
                    onSearch={onSearchUser}
                  />
                </Form.Field>
              </Form.Col>

              <Form.Col lg={2} md={6} span={12}>
                <Form.Field label="Branch Code" error={errors.branchCode}>
                  <InputWithSearch
                    {...register("branchCode")}
                    placeholder="eg: BR001"
                    size="form"
                    variant="form"
                    onSearch={onSearchBranch}
                  />
                </Form.Field>
              </Form.Col>

              <Form.Col lg={2} md={6} span={12}>
                <Form.Field label="Region Code" error={errors.regionCode}>
                  <InputWithSearch
                    {...register("regionCode")}
                    placeholder="eg: 10"
                    size="form"
                    variant="form"
                    onSearch={onSearchRegion}
                  />
                </Form.Field>
              </Form.Col>

              <Form.Col lg={2} md={6} span={12}>
                <Form.Field label="Cluster Code" error={errors.clusterCode}>
                  <InputWithSearch
                    {...register("clusterCode")}
                    placeholder="eg: 5"
                    size="form"
                    variant="form"
                    onSearch={onSearchCluster}
                  />
                </Form.Field>
              </Form.Col>

              <Form.Col lg={3} md={6} span={12}>
                <Form.Field label="State Code" error={errors.stateCode}>
                  <InputWithSearch
                    {...register("stateCode")}
                    placeholder="eg: 27"
                    size="form"
                    variant="form"
                    onSearch={onSearchStatus}
                  />
                </Form.Field>
              </Form.Col>

              <Form.Col lg={2} md={6} span={12}>
                <Form.Field label="Effective From" error={errors.effectiveFrom}>
                  <Input
                    {...register("effectiveFrom")}
                    type="date"
                    size="form"
                    variant="form"
                  />
                </Form.Field>
              </Form.Col>

              <Form.Col lg={2} md={6} span={12}>
                <Form.Field label="Effective To" error={errors.effectiveTo}>
                  <Input
                    {...register("effectiveTo")}
                    type="date"
                    size="form"
                    variant="form"
                  />
                </Form.Field>
              </Form.Col>

              <Form.Col lg={2} md={6} span={12}>
                <Flex direction="col" gap={1} style={{ paddingTop: 22 }}>
                  <Flex align="center" gap={2}>
                    <Controller
                      name="isActive"
                      control={control}
                      render={({ field }) => (
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={isSubmitting}
                        />
                      )}
                    />
                    <Label>Active</Label>
                  </Flex>
                </Flex>
              </Form.Col>
            </Form.Row>

            <Flex.ActionGroup className="mt-14 justify-end gap-4">
              <Button
                type="button"
                variant="footer"
                onClick={onCancel}
                disabled={isSubmitting}
                className="border-b border-gray-300 shadow-[0_3px_4px_-3px_rgba(0,0,0,0.25)]"
              >
                <X className="h-3 w-3" />
                Cancel
              </Button>

              <Button
                type="button"
                variant="reset"
                onClick={onReset}
                disabled={isSubmitting}
                className="border-b border-gray-300 shadow-[0_3px_4px_-3px_rgba(0,0,0,0.25)]"
              >
                <RotateCcw className="h-3 w-3" />
                Reset
              </Button>

              <Button
                type="submit"
                variant="default"
                disabled={isSubmitting}
                className="border-b border-gray-300 shadow-[0_3px_4px_-3px_rgba(0,0,0,0.25)]"
              >
                <Save className="h-3 w-3" />
                {isSubmitting ? "Saving..." : "Save Approver Role Mapping"}
              </Button>
            </Flex.ActionGroup>
          </div>
        </div>
      </Form>
    </FormContainer>
  );
};
