import React, { useCallback, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Modal } from "@/components/ui/modal/modal";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { RotateCcw, Save } from "lucide-react";
import { leadAssignmentValidationSchema } from "@/global/validation/lead/leadAssignment-schema";
import { logger } from "@/global/service";
import {
  useUpdateLeadAssignmentMutation,
  useGetAssignmentHistoryQuery,
  useGetStaffQuery,
} from "@/global/service/end-points/lead/lead-assignment";
import { ModalLeadAssignmentTable } from "../Table/ModalLeadAssignment";
import { DatePicker } from "@/components";

interface LeadAssignmentFormData {
  assignTo: string;
  assignmentDate: string;
}

interface LeadAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  leadData?: {
    leadIdentity: string;
    leadCode: string;
    fullName: string;
    currentAssignment?: string;
    leadDate?: string;
  };
  assignedByIdentity: string;
  onSuccess?: () => void;
}

export const LeadAssignmentModal: React.FC<LeadAssignmentModalProps> = ({
  isOpen,
  onClose,
  leadData,
  assignedByIdentity,
  onSuccess,
}) => {
  const [updateLeadAssignment, { isLoading: isUpdating }] =
    useUpdateLeadAssignmentMutation();

  const { data: staffMembers = [], isLoading: isLoadingStaff } =
    useGetStaffQuery();

  const {
    data: assignmentHistory,
    isLoading: isLoadingHistory,
    refetch: refetchHistory,
    isFetching: isHistoryFetching,
  } = useGetAssignmentHistoryQuery(leadData?.leadIdentity || "", {
    skip: !leadData?.leadIdentity || !isOpen,
  });

  const {
    handleSubmit,
    control,
    reset,
    trigger,
    formState: { errors },
  } = useForm<LeadAssignmentFormData>({
    resolver: yupResolver(leadAssignmentValidationSchema),
    // defaultValues: {
    //   assignTo: "",
    //   assignmentDate: new Date().toISOString().split("T")[0],
    // },
    defaultValues: {
      assignTo: leadData?.currentAssignment || "",
      assignmentDate:
        leadData?.leadDate || new Date().toISOString().split("T")[0],
      // assignmentDate: new Date().toISOString().split("T")[0],
    },
  });

  const handleReset = useCallback(() => {
    reset({
      assignTo: "",
      assignmentDate: new Date().toISOString().split("T")[0],
    });
  }, [reset]);

  const onSubmit = useCallback(
    async (data: LeadAssignmentFormData) => {
      if (!leadData?.leadIdentity) {
        logger.error("Lead identity is missing");
        return;
      }

      try {
        await updateLeadAssignment({
          leadIdentity: leadData.leadIdentity,
          payload: {
            assignToUserIdentity: data.assignTo,
            assignmentDate: data.assignmentDate,
            assignedByIdentity: assignedByIdentity,
          },
          assignedByIdentity: assignedByIdentity,
        }).unwrap();

        logger.info("Lead Assignment updated successfully", { toast: true });

        await refetchHistory();
        handleReset();

        if (onSuccess) {
          onSuccess();
        }
      } catch (error: unknown) {
        let errorMessage = "Failed to update lead assignment";

        if (typeof error === "object" && error !== null) {
          const err = error as { data?: { message?: string } };
          if (err.data?.message) {
            errorMessage = err.data.message;
          }
        }

        logger.error("Error updating lead assignment:", { toast: true });
        logger.error(errorMessage, { toast: true });
      }
    },
    [
      leadData,
      assignedByIdentity,
      updateLeadAssignment,
      refetchHistory,
      handleReset,
      onSuccess,
    ]
  );

  const isLoading = isUpdating || isLoadingStaff;

  const safeAssignmentHistory = useMemo(() => {
    if (!assignmentHistory || !Array.isArray(assignmentHistory)) {
      return [];
    }
    return assignmentHistory;
  }, [assignmentHistory]);

  return (
    <Modal
      isOpen={isOpen}
      close={onClose}
      title="Lead Assignment"
      width="3xl"
      className="max-h-[90vh] w-full !max-w-[90vw]"
    >
      <div className="space-y-6">
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Row>
            <Form.Col lg={3} md={4} span={12}>
              <Form.Field label="Lead Code" required>
                <Input
                  value={leadData?.leadCode || ""}
                  readOnly
                  size="form"
                  variant="form"
                  disabled
                />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={3} md={4} span={12}>
              <Form.Field label="Assign To" required error={errors.assignTo}>
                <Controller
                  name="assignTo"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      placeholder="Select Staff"
                      size="form"
                      variant="form"
                      fullWidth
                      itemVariant="form"
                      options={staffMembers}
                      disabled={isLoading}
                    />
                  )}
                />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={3} md={4} span={12}>
              <Form.Field
                label="Assignment Date"
                required
                error={errors.assignmentDate}
              >
                <Controller
                  name="assignmentDate"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      value={field.value}
                      onChange={(value: string) => {
                        field.onChange(value);
                        trigger?.("assignmentDate");
                      }}
                      onBlur={() => field.onBlur()}
                      placeholder="dd/mm/yyyy"
                      allowManualEntry={true}
                      size="form"
                      variant="form"
                      disabled={isLoading}
                      max={new Date().toISOString().split("T")[0]}
                      min={new Date().toISOString().split("T")[0]}
                      disableFutureDates={false}
                    />
                  )}
                />
              </Form.Field>
            </Form.Col>
          </Form.Row>

          <div className="mt-6 flex justify-end gap-2">
            <Button
              type="button"
              variant="resetCompact"
              size="compactWhite"
              onClick={handleReset}
              disabled={isLoading}
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="compact"
              disabled={isLoading}
            >
              <Save className="mr-2 h-4 w-4" />
              {isUpdating ? "Saving..." : "Save"}
            </Button>
          </div>
        </Form>

        <div className=" pt-4">
          {isLoadingHistory || isHistoryFetching ? (
            <div className="py-8 text-center">
              <p className="text-muted-foreground">
                Loading assignment history...
              </p>
            </div>
          ) : (
            <ModalLeadAssignmentTable
              assignmentHistory={safeAssignmentHistory}
            />
          )}
        </div>
      </div>
    </Modal>
  );
};
