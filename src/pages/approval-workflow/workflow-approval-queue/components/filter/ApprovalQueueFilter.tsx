import { Form, Input, Select } from "@/components";
import NeumorphicButton from "@/components/ui/neumorphic-button/neumorphic-button";
import { Filter } from "lucide-react";
import { type FC } from "react";
import { Controller } from "react-hook-form";
import type { ApprovalQueueFilterProps } from "@/types/approval-workflow/approval-queue.types";
import { useApprovalQueueFilter } from "../../hooks/useApprovalQueueFilter";

const ApprovalQueueFilter: FC<ApprovalQueueFilterProps> = ({
  handleSetFilters,
}) => {
  const {
    control,
    register,
    handleSubmit,
    onSubmit,
    branchOptionsWithAll,
    moduleOptionsWithAll,
    workflowOptionsWithAll,
    statusOptionsWithAll,
  } = useApprovalQueueFilter({ handleSetFilters });
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-7 rounded-lg bg-gray-50 p-4 ">
        <Form.Row className="flex flex-wrap justify-between md:flex-nowrap">
          <Form.Row>
            <Form.Col lg={2} md={6} span={12}>
              <Form.Field label="Branch Code-Name">
                <Controller
                  name="branchIdentity"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      placeholder="All"
                      size="form"
                      variant="form"
                      fullWidth={true}
                      itemVariant="form"
                      options={branchOptionsWithAll}
                    />
                  )}
                />
              </Form.Field>
            </Form.Col>
            <Form.Col lg={2} md={6} span={12}>
              <Form.Field label="Module">
                <Controller
                  name="moduleIdentity"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      placeholder="All"
                      size="form"
                      variant="form"
                      fullWidth={true}
                      itemVariant="form"
                      options={moduleOptionsWithAll}
                    />
                  )}
                />
              </Form.Field>
            </Form.Col>
            <Form.Col lg={2} md={6} span={12}>
              <Form.Field label="Reference No">
                <Input
                  {...register("referenceNo")}
                  placeholder="Enter Reference No"
                  size="form"
                  variant="form"
                />
              </Form.Field>
            </Form.Col>
            <Form.Col lg={2} md={6} span={12}>
              <Form.Field label="Workflow">
                <Controller
                  name="workflowIdentity"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      placeholder="All"
                      size="form"
                      variant="form"
                      fullWidth={true}
                      itemVariant="form"
                      options={workflowOptionsWithAll}
                    />
                  )}
                />
              </Form.Field>
            </Form.Col>
            <Form.Col lg={2} md={6} span={12}>
              <Form.Field label="Status">
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      placeholder="All"
                      size="form"
                      variant="form"
                      fullWidth={true}
                      itemVariant="form"
                      options={statusOptionsWithAll}
                    />
                  )}
                />
              </Form.Field>
            </Form.Col>
          </Form.Row>
          <Form.Col lg={2} md={6} span={12}>
            <div className="flex gap-2 pt-5">
              <NeumorphicButton type="submit" variant="default" size="default">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </NeumorphicButton>
            </div>
          </Form.Col>
        </Form.Row>
      </div>
    </form>
  );
};

export default ApprovalQueueFilter;
