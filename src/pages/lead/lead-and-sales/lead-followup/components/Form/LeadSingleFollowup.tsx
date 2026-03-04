import React, { useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Form } from "@/components/ui/form";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Flex } from "@/components/ui/flex";
import { Textarea } from "@/components/ui/textarea";
import { RefreshCw, Save } from "lucide-react";
import {
  useGetFollowupTypeQuery,
  useGetLeadStageQuery,
  useGetProductsQuery,
} from "@/global/service/end-points/master/lead-master";
import { useUpdateLeadFollowupMutation } from "@/global/service/end-points/lead/lead-followup";
import { logger } from "@/global/service";
import { DatePicker, HeaderWrapper, TitleHeader } from "@/components";
import type { LeadFollowupDetailsFormData } from "@/types/lead/lead-followup.types";
import { singleLeadFollowupDefaultValues } from "../../constants/form.constants";
import { singleLeadFollowupValidationSchema } from "@/global/validation/lead/leadFollowup-schema";

interface LeadFollowupDetailsFormProps {
  leadId: string;
  onSuccess?: () => void;
}

export const LeadSingleFollowup: React.FC<LeadFollowupDetailsFormProps> = ({
  leadId,
  onSuccess,
}) => {
  const { data: productOptions = [], isLoading: isLoadingProducts } =
    useGetProductsQuery();
  const { data: leadStageOptions = [], isLoading: isLoadingLeadStage } =
    useGetLeadStageQuery();
  const { data: followUpTypeOptions = [], isLoading: isLoadingFollowUpType } =
    useGetFollowupTypeQuery();

  const [updateFollowup, { isLoading: isUpdating }] =
    useUpdateLeadFollowupMutation();

  const {
    control,
    handleSubmit,
    trigger,
    reset,
    watch,
    formState: { errors },
  } = useForm<LeadFollowupDetailsFormData>({
    resolver: yupResolver(singleLeadFollowupValidationSchema),
    defaultValues: singleLeadFollowupDefaultValues,
  });

  const watchFollowUpDate = watch("followUpDate");

  const onSubmit = useCallback(
    async (data: LeadFollowupDetailsFormData) => {
      try {
        const payload = {
          leadStageIdentity: data.leadStage,
          followUpTypeIdentity: data.followUpType,
          followUpDate: data.followUpDate,
          nextFollowUpDate: data.nextFollowUpDate,
          followUpNotes: data.followUpNotes,
        };

        await updateFollowup({
          leadIdentity: leadId,
          payload,
        }).unwrap();

        logger.info("Follow-up details updated successfully", { toast: true });

        if (onSuccess) {
          onSuccess();
        }
      } catch (error) {
        if (typeof error === "object" && error !== null) {
          const apiError = error as {
            data?: { message?: string; error?: string };
          };
          const errorMessage =
            apiError.data?.message ||
            apiError.data?.error ||
            "Failed to update follow-up details";
          logger.error(errorMessage, { toast: true });
        } else {
          logger.error("An unexpected error occurred", { toast: true });
        }
      }
    },
    [leadId, updateFollowup, onSuccess]
  );

  const handleReset = useCallback(() => {
    reset(singleLeadFollowupDefaultValues);
  }, [reset]);

  return (
    <div className="rounded-lg bg-blue-50 p-6">
      <Flex justify="between" align="center" className="mb-6 w-full">
        <HeaderWrapper>
          <TitleHeader title=" Lead Follow-up Details" />
        </HeaderWrapper>
      </Flex>

      <Form onSubmit={handleSubmit(onSubmit)}>
        <Form.Row>
          <Form.Col lg={2} md={6} span={12}>
            <Form.Field
              label="Follow-up Date"
              required
              error={errors.followUpDate}
            >
              <Controller
                name="followUpDate"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    value={field.value}
                    min={new Date().toISOString().split("T")[0]}
                    max={new Date().toISOString().split("T")[0]}
                    onChange={() => field.onChange}
                    disabled
                    onBlur={() => field.onBlur()}
                    placeholder="dd/mm/yyyy"
                    allowManualEntry={true}
                    size="form"
                    variant="form"
                    disableFutureDates={false}
                  />
                )}
              />
            </Form.Field>
          </Form.Col>

          <Form.Col lg={2} md={6} span={12}>
            <Form.Field
              label="Next Follow-up Date"
              required
              error={errors.nextFollowUpDate}
            >
              <Controller
                name="nextFollowUpDate"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    value={field.value}
                    onChange={(value: string) => {
                      field.onChange(value);
                      trigger?.("nextFollowUpDate");
                    }}
                    onBlur={() => field.onBlur()}
                    placeholder="dd/mm/yyyy"
                    allowManualEntry={true}
                    size="form"
                    variant="form"
                    min={watchFollowUpDate || undefined}
                    disabled={isUpdating}
                    disableFutureDates={false}
                  />
                )}
              />
            </Form.Field>
          </Form.Col>

          <Form.Col lg={4} md={6} span={12}>
            <Form.Field
              label="Product/Service"
              required
              error={errors.productService}
            >
              <Controller
                name="productService"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    placeholder="Select Product/Service"
                    size="form"
                    variant="form"
                    fullWidth={true}
                    itemVariant="form"
                    options={productOptions}
                    loading={isLoadingProducts}
                    disabled={isUpdating || isLoadingProducts}
                  />
                )}
              />
            </Form.Field>
          </Form.Col>
          <Form.Col lg={2} md={6} span={12}>
            <Form.Field label="Lead Stage" required error={errors.leadStage}>
              <Controller
                name="leadStage"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    placeholder="Select Lead Stage"
                    size="form"
                    variant="form"
                    fullWidth={true}
                    itemVariant="form"
                    options={leadStageOptions}
                    loading={isLoadingLeadStage}
                    disabled={isUpdating || isLoadingLeadStage}
                  />
                )}
              />
            </Form.Field>
          </Form.Col>
          <Form.Col lg={2} md={6} span={12}>
            <Form.Field
              label="Follow-up Type"
              required
              error={errors.followUpType}
            >
              <Controller
                name="followUpType"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    placeholder="Select Follow-up Type"
                    size="form"
                    variant="form"
                    fullWidth={true}
                    itemVariant="form"
                    options={followUpTypeOptions}
                    loading={isLoadingFollowUpType}
                    disabled={isUpdating || isLoadingFollowUpType}
                  />
                )}
              />
            </Form.Field>
          </Form.Col>
        </Form.Row>

        <Form.Row className="mt-4">
          <Form.Col lg={4} md={6} span={12}>
            <Form.Field
              label="Follow-up Notes"
              required
              error={errors.followUpNotes}
            >
              <Controller
                name="followUpNotes"
                control={control}
                render={({ field }) => (
                  <Textarea
                    {...field}
                    placeholder="Enter follow-up notes"
                    size="form"
                    variant="form"
                    rows={3}
                    disabled={isUpdating}
                  />
                )}
              />
            </Form.Field>
          </Form.Col>
        </Form.Row>

        <Form.Row className="mt-6">
          <Form.Col span={12}>
            <Flex justify="end" gap={2}>
              <Button
                type="button"
                variant="outline"
                size="compactPrimary"
                onClick={handleReset}
                disabled={isUpdating}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Reset
              </Button>
              <Button
                type="submit"
                variant="resetPrimary"
                size="compactWhite"
                disabled={isUpdating}
              >
                <Save className="mr-2 h-4 w-4" />
                {isUpdating ? "Updating..." : "Update Follow-up Details"}
              </Button>
            </Flex>
          </Form.Col>
        </Form.Row>
      </Form>
    </div>
  );
};
