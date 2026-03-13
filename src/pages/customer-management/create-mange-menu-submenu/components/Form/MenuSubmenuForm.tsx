import React, { useMemo, useEffect } from "react";
import { RotateCcw, Save, X } from "lucide-react";
import {
  type Control,
  type FieldErrors,
  type UseFormRegister,
  type UseFormSetValue,
  Controller,
  useWatch,
} from "react-hook-form";
import { useLocation } from "react-router-dom";

import { Flex, Input, Label, Switch, Select } from "@/components/ui";
import { FormContainer } from "@/components/ui/form-container";
import { Form } from "@/components";
import NeumorphicButton from "@/components/ui/neumorphic-button/neumorphic-button";

import type {
  menuSubmenu,
  ParentMenu,
} from "@/types/customer-management/create-manage-menus-submenu.type";

interface MenuSubmenuProps {
  control: Control<menuSubmenu>;
  errors: FieldErrors<menuSubmenu>;
  register: UseFormRegister<menuSubmenu>;
  setValue: UseFormSetValue<menuSubmenu>;
  isSubmitting: boolean;
  onSubmit: (e?: React.BaseSyntheticEvent) => void;
  onCancel: () => void;
  onReset: () => void;
  isEdit: boolean;
  parentMenus: ParentMenu[];
  isLoading: boolean;
}

export const MenuSubmenuForm: React.FC<MenuSubmenuProps> = ({
  control,
  errors,
  register,
  setValue,
  isSubmitting,
  onSubmit,
  onCancel,
  onReset,
  isEdit,
  parentMenus,
  isLoading,
}) => {
  const location = useLocation();

  const state = location.state as { parentPath?: string } | null;
  const parentPathFromState = state?.parentPath || "";

  const isUrlEnabled = useWatch({ control, name: "isUrl" });

  const parentMenuOptions = useMemo(() => {
    return parentMenus.map((menu) => ({
      label: menu.menuName,
      value: menu.identity,
    }));
  }, [parentMenus]);

  useEffect(() => {
    if (!parentPathFromState) return;
    if (parentMenuOptions.length === 0) return;

    const matchedOption = parentMenuOptions.find(
      (option) => option.label.trim() === parentPathFromState.trim()
    );

    if (matchedOption) {
      setValue("parentMenu", matchedOption.value, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  }, [parentMenuOptions, parentPathFromState, setValue]);

  return (
    <FormContainer className="px-0">
      <Form onSubmit={onSubmit}>
        <div className="mt-2">
          <Form.Row>

            <Form.Col lg={4} md={6} span={12}>
              <Form.Field label="Menu Name" required error={errors.menuName}>
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
              <Form.Field label="Menu Code" required error={errors.menuCode}>
                <Input
                  {...register("menuCode")}
                  placeholder="Page, Report, Action, External URL"
                  size="form"
                  variant="form"
                  className="uppercase"
                />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={4} md={6} span={12}>
              <Form.Field label="Menu Description" required error={errors.description}>
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
              <Form.Field label="Parent Menu" error={errors.parentMenu}>
                <Controller
                  name="parentMenu"
                  control={control}
                  render={({ field }) => (
                    <Select
                    
                      value={field.value ?? ""}
                      onValueChange={field.onChange}
                      options={parentMenuOptions}
                      placeholder={isLoading ? "Loading..." : "Select Parent Menu"}
                      size="form"
                      variant="form"
                      fullWidth
                      itemVariant="form"
                      disabled={isLoading || !!parentPathFromState}
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
                    name="isUrl"
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

            {isUrlEnabled && (
              <Form.Col lg={3} md={6} span={12}>
                <Form.Field label="Page URL" required error={errors.pageUrl}>
                  <Input
                    {...register("pageUrl")}
                    placeholder="Enter URL"
                    size="form"
                    variant="form"
                    className="uppercase"
                  />
                </Form.Field>
              </Form.Col>
            )}

            <Form.Col lg={1} md={6} span={12}>
              <Flex direction="col" gap={2} style={{ marginTop: "20px" }}>
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
              <X className="h-3 w-3" /> Cancel
            </NeumorphicButton>

            <NeumorphicButton
              type="button"
              variant="secondary"
              size="secondary"
              onClick={onReset}
              disabled={isSubmitting}
            >
              <RotateCcw className="h-3 w-3" /> Reset
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