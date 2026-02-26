import React from "react";
import { RotateCcw, Save, X} from "lucide-react";
import { 
  Controller,
  type Control,
  type FieldErrors, 
  type UseFormRegister,
} from "react-hook-form";
import { FormContainer} from "../../../../../components/ui/form-container";
import { Flex, Input, Label, Switch } from "../../../../../components/ui";
import { Form, Textarea } from "../../../../../components";
import NeumorphicButton from "../../../../../components/ui/neumorphic-button/neumorphic-button";
import { BranchType } from '../../../../../types/customer-management/branch-type';

interface BranchTypeProps {
  control: Control<BranchType>;
  errors: FieldErrors<BranchType>;
  register: UseFormRegister<BranchType>;
  isSubmitting: boolean;
  isEdit: boolean;
  onSubmit: () => React.FormEventHandler<HTMLFormElement>;
  onCancel: () => void;
  onReset: () => void;
}

export const BranchTypeForm: React.FC<BranchTypeProps> =({
  control,
  errors,
  register,
  isSubmitting,
  isEdit,
  onSubmit,
  onCancel,
  onReset,
}) => {

  return (
    <FormContainer className="px-0">
    <Form onSubmit={onSubmit}>
        <div className="mt-2">
          <Form.Row>
            <Form.Col lg={3} md={6} span={12}>
              <Form.Field
                label="Branch Type Code"
                required
                error={errors.branchTypeCode}
              >
                  <Input
                  {...register("branchTypeCode")}
                  placeholder="Enter Branch Type Code"
                  size="form"
                  variant="form"
                  className="uppercase placeholder:text-gray-400"
                />
              </Form.Field>
            </Form.Col>
            <Form.Col lg={3} md={6} span={12}>
              <Form.Field
                label="Branch Type Name"
                required
                error={errors.branchTypeName}
              >
                  <Input
                  {...register("branchTypeName")}
                  placeholder="Enter Branch Type Name"
                  size="form"
                  variant="form"
                  className="uppercase placeholder:text-gray-400"
              />
              </Form.Field>
            </Form.Col>
             <Form.Col lg={4} md={4} span={12}>
                          <Form.Field label="Description"
                          error={errors.branchTypeDesc}>
                            <Textarea
                              {...register("branchTypeDesc")}
                              placeholder="Enter Description"
                              size="form"
                              variant="form"
                              className="uppercase placeholder:text-gray-400"
                              rows={3}
                            />
                          </Form.Field>
                        </Form.Col>
            </Form.Row>
            <Form.Row>
              <Form.Col lg={2} md={6} span={12}>
              <Flex direction="col" gap={1} >
                <Flex align="center" gap={2}>
                  <Controller
                    control={control}
                    name="isActive"
                    render={({ field }) => (
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={!isEdit}
                      />
                    )}
                  />
                  <Label>Active Status</Label>
                </Flex>
              </Flex>
            </Form.Col>
            </Form.Row>
             <Flex.ActionGroup className="mt-2 justify-end gap-4">
            <NeumorphicButton
              type="button"
              variant="grey"
              size="default"
              onClick={onCancel}
            >
              <X className="h-3 w-3" />
              Cancel
            </NeumorphicButton>

            <NeumorphicButton
              type="button"
              variant="secondary"
              size="secondary"
              onClick={onReset}
            >
              <RotateCcw className="h-3 w-3" />
              Reset
            </NeumorphicButton>

            <NeumorphicButton
              type="submit"
              variant="default"
              size="default"
              disabled={isSubmitting}
            > 
              <Save className="h-3 w-3" />
              {isSubmitting ?
              "Saving..." 
              : isEdit 
              ? "Update Branch Type"
              : "Save Branch Type" }
            </NeumorphicButton>
          </Flex.ActionGroup>
        </div>
      </Form>
    </FormContainer>
  );
};
