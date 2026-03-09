import React from "react";
import { RotateCcw, Save, X } from "lucide-react";
import {
  type Control,
  type FieldErrors,
  type UseFormRegister,
} from "react-hook-form";
import { Controller, useWatch } from "react-hook-form";
import { Flex, Input, Label, Switch, Select } from "@/components/ui";
import { FormContainer } from "@/components/ui/form-container";
import { Form } from "@/components";
import NeumorphicButton from "@/components/ui/neumorphic-button/neumorphic-button";
import type { menuSubmenu } from "@/types/customer-management/create-manage-menus-submenu.type";
import { PARENT_MENU_OPTIONS } from "@/mocks/customer-management-master/create-manage-menu-submenu";

interface MenuSubmenuProps {
  control: Control<menuSubmenu>;
  errors: FieldErrors<menuSubmenu>;
  register: UseFormRegister<menuSubmenu>;
  isSubmitting: boolean;
  onSubmit: () => void;
  onCancel: () => void;
  onReset: () => void;
  isEdit: boolean
}

export const MenuSubmenuForm: React.FC<MenuSubmenuProps> = ({
  control,
  errors,
  register,
  isSubmitting,
  onSubmit,
  onCancel,
  onReset,
  isEdit
}) => {

  const isUrlEnabled = useWatch({
    control, name: "url"
  })
  return (
    <FormContainer className="px-0 " >
      <Form onSubmit={onSubmit}>
        <div className="mt-2">
          <Form.Row>

            <Form.Col lg={4} md={6} span={12}>
              <Form.Field label="Menu Name" required error={errors.menuName} >
                <Input
                  {...register("menuName")}
                  placeholder="Enter Menu Name"
                  size="form"
                  variant="form"
                  className="uppercase"
                />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={4} md={6} span={12}>
              <Form.Field label="Menu Code" required error={errors.menucode} >
                <Input
                  {...register("menucode")}
                  placeholder="Page, Report, Action, External URL"
                  size="form"
                  variant="form"
                  className="uppercase"
                />
              </Form.Field>
            </Form.Col>


            <Form.Col lg={4} md={6} span={12}>
              <Form.Field label="Menu Description" required error={errors.description} >
                <Input
                  {...register("description")}
                  placeholder="Enter Description"
                  size="form"
                  variant="form"
                  className="uppercase"
                />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={4} md={6} span={12}>
              <Form.Field label="Menu Order" required error={errors.menuOrder}>
                <Input
                  {...register("menuOrder")}
                  placeholder="eg:1"
                  size="form"
                  variant="form"
                  className="uppercase"
                />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={4} md={6} span={12} className="pr-6">
              <Form.Field label="Parent Menu" required error={errors?.parentMenu}>
                <Controller
                  name="parentMenu"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      options={PARENT_MENU_OPTIONS}
                      placeholder="Select "
                      size="form"
                      variant="form"
                      fullWidth
                      itemVariant="form"
                    />
                  )}
                />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={1} md={6} span={12}>
              <Flex direction="col" gap={2} style={{ marginTop: "20px" }}>
                <Flex align="center" gap={2}>
                  <Controller
                    control={control}
                    name="url"
                    render={({ field }) => (
                      <Switch
                        checked={!!field.value}
                        onCheckedChange={field.onChange}
                      />
                    )}
                  />
                  <Label>URL</Label>
                </Flex>
              </Flex>
            </Form.Col>

            {
              isUrlEnabled && (
                <Form.Col lg={3} md={6} span={12}>
                  <Form.Field label="Page URL" required error={errors.pageurl}>
                    <Input
                      {...register("pageurl")}
                      placeholder="Enter URL"
                      size="form"
                      variant="form"
                      className="uppercase "
                    />
                  </Form.Field>
                </Form.Col>
              )
            }

            <Form.Col lg={1} md={6} span={12}>
              <Flex direction="col" gap={2} style={{ marginTop: '20px' }} >
                <Flex align="center" gap={2}>
                  <Controller
                    control={control}
                    name="isActive"
                    render={({ field }) => (
                      <Switch
                        checked={!!field.value}
                        onCheckedChange={field.onChange}
                        disabled={!isEdit}
                      />
                    )}
                  />
                  <Label>Active</Label>
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
              disabled={isSubmitting}
            >
              <X className="h-3 w-3" />
              Cancel
            </NeumorphicButton>

            <NeumorphicButton
              type="button"
              variant="secondary"
              size="secondary"
              onClick={onReset}
              disabled={isSubmitting}
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
              {isSubmitting
                ? isEdit
                  ? "Updating..."
                  : "Saving..."
                : isEdit
                  ? "Update Menu"
                  : "Save Menu"}
            </NeumorphicButton>

          </Flex.ActionGroup>
        </div>
      </Form>
    </FormContainer>

  );
};





