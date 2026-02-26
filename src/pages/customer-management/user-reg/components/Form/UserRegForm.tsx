import React from "react";
import { RotateCcw, Save, X } from "lucide-react";
import { Controller, type Control, type FieldErrors, type UseFormRegister, } from "react-hook-form";
import { FormContainer } from "@/components/ui/form-container";
import { Flex, Form, Input, Label, Switch, Select } from "@/components";
import type { UserRegType, Option } from "@/types/customer-management/user-reg";
import NeumorphicButton from "@/components/ui/neumorphic-button/neumorphic-button";
import type { UseFormHandleSubmit, UseFormSetError } from "react-hook-form";
import { useLazySearchUserRegQuery } from "@/global/service/end-points/customer-management/user-reg";


interface UserRegProps {
  control: Control<UserRegType>;
  errors: FieldErrors<UserRegType>;
  register: UseFormRegister<UserRegType>;
  isSubmitting: boolean;
  handleSubmit: UseFormHandleSubmit<UserRegType>;
  onSubmit: (data: UserRegType) => void;
  onCancel: () => void;
  onReset: () => void;
  userTypeOptions: Option[];
  isEditMode: boolean;
  editingUser?: UserRegType | null;
  setError: UseFormSetError<UserRegType>
}


export const UserRegForm: React.FC<UserRegProps> = ({
  control,
  errors,
  register,
  isSubmitting,
  handleSubmit,
  onSubmit,
  onCancel,
  onReset,
  userTypeOptions,
  isEditMode,
  editingUser,
  setError

}) => {
  const [triggerSearchUser] = useLazySearchUserRegQuery();
  return (
    <FormContainer className="px-0">
      <Form onSubmit={handleSubmit(onSubmit)}>
        <div className="mt-2">
          <Form.Row>
            <Form.Col lg={3} md={6} span={12}>
              <Form.Field
                label="User Code" required error={errors.userCode}
              >
                <Input
                  {...register("userCode", {

                    onChange: e => {
                      let value = e.target.value
                        .replace(/[^A-Za-z0-9.@ ]/g, "")
                        .toUpperCase();
                      if (value.startsWith(" ")) {
                        value = value.trimStart();
                      }

                      e.target.value = value;
                    },

                  })}
                  placeholder="Enter User Code"
                  size="form"
                  variant="form"
                  className="uppercase"
                  readOnly={!!editingUser}
                />
              </Form.Field>
            </Form.Col>
            <Form.Col lg={3} md={6} span={12}>
              <Form.Field
                label="User Name"
                required
                error={errors.userName}
              >
                <Input
                  {...register("userName", {
                    onChange: (e) => {
                      let value = e.target.value
                        .replace(/[^A-Za-z0-9.@ ]/g, "");

                      if (value.startsWith(" ")) {
                        value = value.trimStart();
                      }

                      e.target.value = value;
                    },

                    onBlur: async (e) => {
                      const value = e.target.value;
                      if (!value) return;
                      if (editingUser?.userName === value) return;
                      try {
                        const res = await triggerSearchUser(value).unwrap();
                        if (res?.content?.length > 0) {
                          setError("userName", {
                            type: "manual",
                            message: "Username already exists",

                          });
                        }
                      } catch (error) {
                        console.error(error);
                      }
                    },
                  })}
                  placeholder="Enter User Name"
                  size="form"
                  variant="form"
                  readOnly={!!editingUser}

                />


              </Form.Field>
            </Form.Col>

            <Form.Col lg={3} md={6} span={12}>
              <Form.Field
                label="Full Name"
                required
                error={errors.fullName}
              >
                <Input
                  {...register("fullName", {
                    
                      onChange: e => {
                      let value = e.target.value
                        .replace(/[^A-Za-z. ]/g, "")
                        .toUpperCase();
                      if (value.startsWith(" ")) {
                        value = value.trimStart();
                      }

                      e.target.value = value;
                    },
                  })}
                  placeholder="Enter Full Name"
                  size="form"
                  variant="form"
                  className="uppercase"
                />
              </Form.Field>
            </Form.Col>
            <Form.Col lg={3} md={6} span={12}>
              <Form.Field label="Email" required error={errors.email}>
                <Input
                  {...register("email", {
                    
                      onChange: e => {
                      let value = e.target.value
                      if (value.startsWith(" ")) {
                        value = value.trimStart();
                      }

                      e.target.value = value;
                    },
                  })}
                  placeholder="Enter Email"
                  size="form"
                  variant="form"
                />
              </Form.Field>
            </Form.Col>



            <Form.Col lg={3} md={6} span={12}>
              <Form.Field
                label="Contact Number"
                required
                error={errors.phoneNumber}
              >
                <Input
                  {...register("phoneNumber")}
                  placeholder="Enter Contact Number"
                  size="form"
                  variant="form"
                  maxLength={10}
                  onInput={(e) => {
                    let value = e.currentTarget.value;
                    value = value.replace(/\D/g, "");
                    if (value.length === 1 && /^[0-5]/.test(value)) {
                      value = "";
                    }
                    e.currentTarget.value = value;
                  }}
                />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={3} md={6} span={12}>
              <Form.Field label="User Type" required error={errors.userType}>


                <Controller
                  name="userType"
                  control={control}
                  //  defaultValue=""
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      options={userTypeOptions}
                      placeholder="Select User Type"
                      size="form"
                      variant="form"
                      fullWidth
                      itemVariant="form"
                    />
                  )}
                />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={2} md={6} span={12}>
              <Flex direction="col" gap={1} style={{ paddingTop: 22, paddingLeft: 20 }}>
                <Flex align="center" gap={2}>
                  <Controller
                    control={control}
                    name="isActive"
                    render={({ field }) => (
                      <Switch
                        checked={!!field.value}
                        onCheckedChange={field.onChange}
                        disabled={!isEditMode}
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
              {isSubmitting ? "Saving..." : "Save User"}
            </NeumorphicButton>
          </Flex.ActionGroup>
        </div>
      </Form>
    </FormContainer>
  );
};
